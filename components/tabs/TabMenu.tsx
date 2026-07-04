'use client';

import { useState, useEffect } from 'react';
import { db, useAuth } from '@/lib/firebase';
import { collection, query, onSnapshot, addDoc, updateDoc, doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { Droplet, MapPin, Phone, CheckCircle, Plus, Search, Filter } from 'lucide-react';

export default function TabMenu() {
  const user = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({ bloodGroup: 'O+', urgency: 'medium', location: '', description: '', contactNumber: '' });

  useEffect(() => {
    const q = query(collection(db, 'bloodRequests'));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(data);
    });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const reqRef = await addDoc(collection(db, 'bloodRequests'), {
      ...formData,
      creatorId: user.uid,
      status: 'active',
      createdAt: serverTimestamp()
    });
    await setDoc(doc(db, 'bloodRequests', reqRef.id, 'private', 'info'), {
      contactNumber: formData.contactNumber
    });
    setFormData({ bloodGroup: 'O+', urgency: 'medium', location: '', description: '', contactNumber: '' });
    setShowCreate(false);
  };

  const handleBook = async (requestId: string) => {
    if (!user) return;
    await updateDoc(doc(db, 'bloodRequests', requestId), {
      status: 'booked',
      bookedBy: user.uid
    });
  };

  const [privateInfo, setPrivateInfo] = useState<Record<string, string>>({});

  const viewContact = async (requestId: string) => {
    const docRef = doc(db, 'bloodRequests', requestId, 'private', 'info');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setPrivateInfo({...privateInfo, [requestId]: docSnap.data().contactNumber});
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodGroup, setFilterBloodGroup] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.description.toLowerCase().includes(searchTerm.toLowerCase()) || req.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlood = filterBloodGroup === '' || req.bloodGroup === filterBloodGroup;
    const matchesLocation = filterLocation === '' || req.location.toLowerCase().includes(filterLocation.toLowerCase());
    return matchesSearch && matchesBlood && matchesLocation;
  });

  return (
    <div className="p-4 paper-texture min-h-screen space-y-4">
      <h2 className="text-xl font-bold">Blood Requests Feed</h2>
      
      <div className="bg-white/50 p-4 rounded-2xl border border-gray-100">
        <button 
          onClick={() => setShowCreate(!showCreate)}
          className="w-full flex items-center justify-between text-sm font-bold text-gray-700"
        >
          Create New Request
          <Plus className={`w-5 h-5 transition-transform ${showCreate ? 'rotate-45' : ''}`}/>
        </button>
        {showCreate && (
          <form onSubmit={handleCreate} className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input className="p-2 border rounded text-xs" placeholder="Blood Group (e.g. O+)" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} required/>
              <select className="p-2 border rounded text-xs" value={formData.urgency} onChange={e => setFormData({...formData, urgency: e.target.value})}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <input className="w-full p-2 border rounded text-xs" placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required/>
            <textarea className="w-full p-2 border rounded text-xs h-16" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required/>
            <input className="w-full p-2 border rounded text-xs" placeholder="Contact Number" value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} required/>
            <button type="submit" className="w-full bg-emerald-600 text-white rounded-lg py-2 font-bold text-xs">Post Request</button>
          </form>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex gap-2 items-center">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input className="w-full p-2 pl-10 border rounded-lg text-sm" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`p-2.5 border rounded-lg ${showFilters ? 'bg-gray-100' : ''}`}>
                <Filter className="w-4 h-4" />
            </button>
        </div>
        {showFilters && (
            <div className="flex gap-2 flex-wrap bg-gray-50 p-2 rounded-lg">
                <input 
                    className="p-2 border rounded text-xs w-full" 
                    placeholder="Filter by Blood Group (e.g. O+)" 
                    value={filterBloodGroup} 
                    onChange={(e) => setFilterBloodGroup(e.target.value)}
                />
                <input 
                    className="p-2 border rounded text-xs w-full" 
                    placeholder="Filter by Location..." 
                    value={filterLocation} 
                    onChange={(e) => setFilterLocation(e.target.value)}
                />
            </div>
        )}
      </div>

      <div className="space-y-1">
        {filteredRequests.map(req => (
          <div key={req.id} className="p-2 bg-white/30 backdrop-blur-md border rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-red-700 bg-red-100/50 px-2 py-0.5 rounded text-[10px]">{req.bloodGroup}</span>
                <p className="font-bold text-xs">{req.description.substring(0, 30)}{req.description.length > 30 ? '...' : ''}</p>
              </div>
              <div className='flex items-center gap-2'>
                  <button onClick={() => setExpandedRequestId(expandedRequestId === req.id ? null : req.id)} className="text-[10px] bg-gray-100/50 px-3 py-1 rounded-lg">View</button>
              </div>
            </div>
            {expandedRequestId === req.id && (
              <div className="mt-2 pt-2 border-t text-[10px] space-y-1">
                <p className="text-gray-700">{req.description}</p>
                <p className="flex items-center gap-1 text-gray-500"><MapPin className="w-3 h-3"/> {req.location}</p>
                <div className="flex gap-2 pt-1">
                    {req.status === 'active' && user?.uid !== req.creatorId && (
                        <button onClick={() => handleBook(req.id)} className="bg-blue-600/80 text-white px-3 py-1 rounded-lg">Book</button>
                    )}
                    {req.status === 'booked' && (req.creatorId === user?.uid || req.bookedBy === user?.uid) && (
                        <button onClick={() => viewContact(req.id)} className="bg-emerald-600/80 text-white px-3 py-1 rounded-lg">
                        {privateInfo[req.id] ? `Contact: ${privateInfo[req.id]}` : 'View Contact'}
                        </button>
                    )}
                    {privateInfo[req.id] && (
                        <a href={`tel:${privateInfo[req.id]}`} className="bg-blue-600/80 text-white px-3 py-1 rounded-lg">Call</a>
                    )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
