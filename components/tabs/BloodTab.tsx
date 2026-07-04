'use client';
import { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db, useAuth } from '@/lib/firebase';
import { isAvailable } from '@/lib/utils';
import { Search, Lock, AlertTriangle, Filter } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';

export default function BloodTab() {
  const user = useAuth();
  const [donors, setDonors] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedDonorId, setExpandedDonorId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDonors() {
      try {
        const q = query(collection(db, 'donors'));
        const querySnapshot = await getDocs(q);
        setDonors(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching donors:", err);
      }
    }
    fetchDonors();
  }, []);

  useEffect(() => {
    if (!user) {
        const timer = setTimeout(() => {
            setProfile(null);
        }, 0);
        return () => clearTimeout(timer);
    }
    const docRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    });
    return unsubscribe;
  }, [user]);

  // Completion logic (5 fields: name, bloodGroup, location, phone, lastDonation)
  const calculateCompletion = () => {
    if (!profile) return 0;
    const fields = ['name', 'bloodGroup', 'location', 'phone', 'lastDonation'];
    const filled = fields.filter(f => profile[f] && profile[f] !== '').length;
    return (filled / fields.length) * 100;
  };

  const completion = calculateCompletion();
  const canViewContact = !!user;

  const filtered = donors.filter(d => 
    (search === '' || (d.name?.toLowerCase() || '').includes(search.toLowerCase()) || (d.location?.toLowerCase() || '').includes(search.toLowerCase())) &&
    (filter === '' || d.group === filter || (filter === 'available' && isAvailable(d.lastDonateDate)) || (filter === 'non-available' && !isAvailable(d.lastDonateDate)))
  );

  return (
    <div className="p-4 space-y-4 paper-texture min-h-screen">      
      {!canViewContact && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 items-center">
            <AlertTriangle className="text-amber-600 w-8 h-8" />
            <div>
                <p className="text-sm font-bold text-amber-900">{user ? "Complete your profile" : "Log in to view contact info"}</p>
                <p className="text-xs text-amber-700">
                    {user ? `Your profile is ${completion.toFixed(0)}% complete. Please complete 80% to view contact info.` 
                          : "You are currently viewing a restricted list. Log in to see contact details."}
                </p>
            </div>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex gap-2 items-center">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input className="w-full p-2 pl-10 border rounded-lg text-sm" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`p-2.5 border rounded-lg ${showFilters ? 'bg-gray-100' : ''}`}>
                <Filter className="w-4 h-4" />
            </button>
        </div>
        {showFilters && (
            <div className="flex gap-2 flex-wrap bg-gray-50 p-2 rounded-lg">
                <button onClick={() => setFilter(prev => prev === 'available' ? '' : 'available')} className={`px-3 py-1 rounded-lg text-[10px] font-bold ${filter === 'available' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>Available</button>
                <button onClick={() => setFilter(prev => prev === 'non-available' ? '' : 'non-available')} className={`px-3 py-1 rounded-lg text-[10px] font-bold ${filter === 'non-available' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>Non-Available</button>
                <select className="p-1 border rounded-lg text-[10px]" value={filter === 'available' || filter === 'non-available' ? '' : filter} onChange={e => setFilter(e.target.value)}>
                    <option value="">All Blood Groups</option>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>
        )}
      </div>

       <div className="space-y-1">
        {filtered.map(donor => (
           <div key={donor.id} className="p-2 bg-white/30 backdrop-blur-md border rounded-xl">
             <div className="flex justify-between items-center">
                 <div>
                    <p className="font-bold text-xs">{donor.name}</p>
                    <p className="text-[10px] text-gray-500">{donor.location}</p>
                 </div>
                 <div className='flex items-center gap-2'>
                    <span className="font-bold text-red-600 border px-2 py-0.5 rounded-lg bg-red-50/50 text-[10px]">{donor.group}</span>
                    <button onClick={() => setExpandedDonorId(expandedDonorId === donor.id ? null : donor.id)} className="text-[10px] bg-gray-100/50 px-3 py-1 rounded-lg">View</button>
                 </div>
             </div>
             {expandedDonorId === donor.id && (
                <div className="mt-2 pt-2 border-t text-[10px] space-y-1">
                    <p className={`font-bold ${isAvailable(donor.lastDonateDate) ? 'text-green-600' : 'text-red-600'}`}>
                        {isAvailable(donor.lastDonateDate) ? 'Available' : 'Non-Available'}
                    </p>
                    {canViewContact && (
                        <div className="flex gap-2">
                            <a href={`tel:${donor.phone}`} className="bg-blue-600/80 text-white px-3 py-1 rounded-lg">Call</a>
                            <a href={`sms:${donor.phone}`} className="bg-green-600/80 text-white px-3 py-1 rounded-lg">Message</a>
                        </div>
                    )}
                    {!canViewContact && (
                        <p className="text-gray-400 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Contact hidden
                        </p>
                    )}
                </div>
             )}
           </div>
        ))}
      </div>
    </div>
  );
}
