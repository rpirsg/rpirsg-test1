'use client';
import { useState, useEffect } from 'react';
import { 
  MoreVertical, 
  ShieldCheck, 
  User, 
  Lock, 
  Settings, 
  LogOut, 
  CheckCircle, 
  X, 
  Info,
  Users,
  Bell,
  HeartHandshake,
  Key,
  RefreshCw,
  Compass,
  Flame,
  Activity,
  Award,
  Milestone,
  Heart
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  signOut
} from 'firebase/auth';
import { doc, onSnapshot, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  
  // Guard background/read snapshots from throwing uncaught runtime exceptions.
  // Writes and security-sensitive updates will still throw so that errors are reported cleanly.
  if (operationType !== OperationType.GET) {
    throw new Error(JSON.stringify(errInfo));
  }
}

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  ShieldCheck,
  Compass,
  Flame,
  Activity,
  Award,
  Milestone,
  Heart
};

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [modalType, setModalType] = useState<'login' | 'admin' | null>(null);
  
  // Auth Form State
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Core Branding and Configuration States
  const [logoType, setLogoType] = useState<'icon' | 'image'>('icon');
  const [logoIcon, setLogoIcon] = useState<string>('ShieldCheck');
  const [logoUrl, setLogoUrl] = useState<string>('');

  // Admin Custom State
  const [adminNotice, setAdminNotice] = useState('scout drill on Saturday at 10:00 AM');
  const [newNotice, setNewNotice] = useState('');
  const [crewStatus, setCrewStatus] = useState<'active' | 'suspended'>('active');

  // Real-time synchronization of brand config adjustments
  useEffect(() => {
    const unsubConfig = onSnapshot(doc(db, 'settings', 'global_config'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.logoType) setLogoType(data.logoType);
        if (data.logoIcon) setLogoIcon(data.logoIcon);
        if (data.logoUrl !== undefined) setLogoUrl(data.logoUrl);
        if (data.adminNotice) setAdminNotice(data.adminNotice);
        if (data.crewStatus) setCrewStatus(data.crewStatus);
      }
    }, (error) => {
      console.warn("Global settings loading bypassed (unconfigured Firestore context):", error);
      handleFirestoreError(error, OperationType.GET, 'settings/global_config');
    });

    return () => {
      unsubConfig();
    };
  }, []);

  const handleSaveSettings = async (updates: any) => {
    if (!auth.currentUser) {
      console.log("Local-only settings change (unauthenticated context)");
      return;
    }
    try {
      await setDoc(doc(db, 'settings', 'global_config'), {
        logoType,
        logoIcon,
        logoUrl,
        adminNotice,
        crewStatus,
        ...updates
      }, { merge: true });
    } catch (err) {
      console.error("Error saving global credentials properties:", err);
      handleFirestoreError(err, OperationType.WRITE, 'settings/global_config');
    }
  };

  useEffect(() => {
    return onAuthStateChanged(auth, (usr) => {
      setUser(usr);
    });
  }, []);

  const handleDropdownToggle = () => setDropdownOpen(prev => !prev);

  const handleLogout = async () => {
    await signOut(auth);
    setDropdownOpen(false);
  };

  return (
    <>
      <header className="relative flex items-center justify-between p-3 border-b border-gray-200/50 shadow-sm bg-white/30 backdrop-blur-md z-40">
        {/* Left: Logo + RPIRSG */}
        <div className="flex items-center gap-2">
          {logoType === 'image' && logoUrl ? (
            <div className="w-6 h-6 rounded overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-150 flex-shrink-0">
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://img.icons8.com/color/48/scout-badge.png';
                }}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded flex items-center justify-center text-white flex-shrink-0 animate-fade-in">
              <img src="https://lh3.googleusercontent.com/d/1WP_72SJr9g1o2hGYB4TL-b7DHi6F7Ud9=s800" alt="Image" />
            </div>
          )}
          <span className="font-bold text-lg text-[#C1121F] tracking-wide">RPIRSG</span>
        </div>

        {/* Right Area */}
        <div className="relative flex items-center gap-2">
          {user && (
            <span className="text-[9px] text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
              Online
            </span>
          )}
          <button 
            onClick={handleDropdownToggle}
            className="p-1 px-2 rounded hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>

          {/* Elegant Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-8 w-44 bg-white/30 backdrop-blur-md border border-gray-100/50 shadow-xl rounded-lg py-1 z-50 text-[10px]">
              {user ? (
                <>
                  <div className="px-3 py-1.5 border-b border-gray-100 bg-gray-50">
                    <p className="text-gray-400 text-[8px] uppercase font-bold">Logged In</p>
                    <p className="text-gray-700 truncate font-semibold">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => {
                        setDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-indigo-700 hover:bg-indigo-50 flex items-center gap-2 border-b border-gray-100 font-bold"
                  >
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    <span>My Dashboard & Profile</span>
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-600" />
                    <span>Disconnect App</span>
                  </button>
                </>
              ) : (
                <div className="px-3 py-2 text-gray-500 text-center">
                  <p>Please go to the Profile tab to sign in.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

    </>
  );
}
