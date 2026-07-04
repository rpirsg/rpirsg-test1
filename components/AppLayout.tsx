'use client';
import { useState, useEffect } from 'react';
import { Home, Droplet, User, Menu, Bell, Info } from 'lucide-react';
import Header from './Header';
import HomeTab from './tabs/HomeTab';
import BloodTab from './tabs/BloodTab';
import ProfileTab from './tabs/ProfileTab';
import TabMenu from './tabs/TabMenu';
import TabNotification from './tabs/TabNotification';
import TabAbout from './tabs/TabAbout';
import { useAuth, auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useKeyboardVisibility } from '@/hooks/useKeyboardVisibility';

const tabs = [
  { name: 'Home', icon: Home, component: HomeTab },
  { name: 'Blood', icon: Droplet, component: BloodTab },
  { name: 'Menu', icon: Menu, component: TabMenu },
  { name: 'About', icon: Info, component: TabAbout },
  { name: 'Profile', icon: User, component: ProfileTab },
];

export default function AppLayout() {
  const user = useAuth();
  const [isAdmin, setIsAdmin] = useState(() => {
    return typeof window !== 'undefined' && localStorage.getItem('adminCodeAuthorized') === 'true';
  });
  const [activeTab, setActiveTab] = useState(() => {
    const isCodeAuthorized = typeof window !== 'undefined' && localStorage.getItem('adminCodeAuthorized') === 'true';
    return isCodeAuthorized ? 4 : 0;
  });
  const isKeyboardOpen = useKeyboardVisibility();
  const ActiveComponent = tabs[activeTab].component;

  useEffect(() => {
    const handleAdminStatus = (e: any) => {
      if (e.detail?.isAdmin) {
        setIsAdmin(true);
        setActiveTab(4);
      } else {
        setIsAdmin(false);
        setActiveTab(0);
      }
    };

    window.addEventListener('admin-status', handleAdminStatus);

    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      if (usr) {
        try {
          const adminRef = doc(db, 'admins', usr.uid);
          const adminSnap = await getDoc(adminRef);
          if (adminSnap.exists() && adminSnap.data().role === 'admin') {
            setIsAdmin(true);
            setActiveTab(4); // Force navigation to the profile tab (which contains the admin dashboard)
          } else {
            // Check if they are authorized via code
            const isAuthorized = localStorage.getItem('adminCodeAuthorized') === 'true';
            setIsAdmin(isAuthorized);
            if (isAuthorized) {
              setActiveTab(4);
            }
          }
        } catch (err) {
          // If a standard user gets a permission error checking the admins collection,
          // we treat them as standard user status gracefully without printing scary logs.
          console.log("Account checked: Standard user status verified.");
          const isAuthorized = localStorage.getItem('adminCodeAuthorized') === 'true';
          setIsAdmin(isAuthorized);
          if (isAuthorized) {
            setActiveTab(4);
          }
        }
      } else {
        const isAuthorized = localStorage.getItem('adminCodeAuthorized') === 'true';
        setIsAdmin(isAuthorized);
        if (isAuthorized) {
          setActiveTab(4);
        } else {
          setActiveTab(0); // Reset to Home tab when visitor/member signs out
        }
      }
    });

    return () => {
      unsubscribe();
      window.removeEventListener('admin-status', handleAdminStatus);
    };
  }, []);

  // Block Developer Tools / Inspect Element / Context Menu
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      alert("নিরাপত্তাজনিত কারণে এই প্ল্যাটফর্মে রাইট-ক্লিক ও ডেভেলপার টুলস নিষ্ক্রিয় করা হয়েছে!\nInspect Element and right-click have been disabled for security reasons.");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        alert("ডেভেলপার টুলস (F12) নিষ্ক্রিয় করা হয়েছে।");
        return false;
      }
      // Ctrl+Shift+I (Inspect)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
        e.preventDefault();
        alert("ডেভেলপার উপাদান পরিদর্শন (Inspect Element) নিষ্ক্রিয় করা হয়েছে।");
        return false;
      }
      // Ctrl+Shift+C (Inspect elements selector)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
        e.preventDefault();
        alert("উপাদান নির্বাচক (Element Selector) নিষ্ক্রিয় করা হয়েছে।");
        return false;
      }
      // Ctrl+Shift+J (Console tools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
        e.preventDefault();
        alert("ডেভেলপার কনসোল নিষ্ক্রিয় করা হয়েছে।");
        return false;
      }
      // Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
        e.preventDefault();
        alert("ওয়েবসাইটের সোর্স কোড দেখা নিষ্ক্রিয় করা হয়েছে।");
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Show a loading state or nothing while checking the initial user state
  if (user === undefined) {
    return <div className="flex bg-[#FAF7F2] h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen relative select-none">
      {/* Fixed Geometric Blueprint Background Artifact Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.11]">
        {/* Radar Circular Grid Watermark Center-left */}
        <svg className="absolute top-1/4 -left-20 w-80 h-80 text-red-950" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
          <circle cx="50" cy="50" r="45" strokeDasharray="3,3" />
          <circle cx="50" cy="50" r="35" />
          <circle cx="50" cy="50" r="25" strokeDasharray="1,2" />
          <circle cx="50" cy="50" r="15" />
          <line x1="50" y1="5" x2="50" y2="95" />
          <line x1="5" y1="50" x2="95" y2="50" />
          <text x="52" y="12" className="text-[3px] font-mono fill-current font-extrabold">{"N 24° 22'"}</text>
          <text x="75" y="48" className="text-[3px] font-mono fill-current font-extrabold">{"E 88° 36'"}</text>
        </svg>

        {/* Vintage Scouting Compass Rose Graphic Bottom-right */}
        <svg className="absolute bottom-1/4 -right-16 w-72 h-72 text-red-950" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="0.4">
          <circle cx="60" cy="60" r="50" />
          <circle cx="60" cy="60" r="52" strokeWidth="0.2" strokeDasharray="2,2" />
          <path d="M60 10 L60 110 M10 60 L110 60 M25 25 L95 95 M25 95 L95 25" />
          <polygon points="60,60 60,20 63,40" fill="currentColor" opacity="0.3" />
          <polygon points="60,60 60,100 57,80" fill="currentColor" opacity="0.3" />
          <polygon points="60,60 20,60 40,63" fill="currentColor" opacity="0.3" />
          <polygon points="60,60 100,60 80,57" fill="currentColor" opacity="0.3" />
          <text x="58" y="16" className="text-[5px] font-serif font-black fill-current text-red-900">N</text>
          <text x="96" y="62" className="text-[5px] font-serif font-black fill-current">E</text>
          <text x="58" y="108" className="text-[5px] font-serif font-black fill-current">S</text>
          <text x="14" y="62" className="text-[5px] font-serif font-black fill-current">W</text>
        </svg>

        {/* Fine topographical curved styling lines */}
        <svg className="absolute top-10 right-4 w-60 h-48 text-emerald-900/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.3">
          <path d="M 0,20 C 30,20 40,50 100,30" />
          <path d="M 0,40 C 40,30 50,70 100,50" />
          <path d="M 0,60 C 20,50 60,90 100,70" />
          <path d="M 0,80 C 50,75 70,95 100,90" />
        </svg>
      </div>

      {/* Tactile Folding Crease Paper effect to create a realistic textured paper map/document layout */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden mix-blend-overlay opacity-30">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Main Diagonal Crease Top-Left to Bottom-Right */}
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="0" y1="1px" x2="100%" y2="calc(100% + 1px)" stroke="#1a140d" strokeWidth="1" opacity="0.15" />
          
          {/* Horizonal fold crease at 35% height */}
          <line x1="0" y1="35%" x2="100%" y2="35%" stroke="#ffffff" strokeWidth="2.5" />
          <line x1="0" y1="calc(35% + 1px)" x2="100%" y2="calc(35% + 1px)" stroke="#1a140d" strokeWidth="1.2" opacity="0.2" />

          {/* Vertical fold crease at 68% width */}
          <line x1="68%" y1="0" x2="68%" y2="100%" stroke="#ffffff" strokeWidth="2" />
          <line x1="calc(68% + 1px)" y1="0" x2="calc(68% + 1px)" y2="100%" stroke="#1a140d" strokeWidth="1" opacity="0.18" />

          {/* Curved dog-ear soft corner shade at the upper right side */}
          <path d="M 92%,0 L 100%,8% L 100%,0 Z" fill="#ffffff" opacity="0.35" />
          <path d="M 92%,0 L 92%,8% C 92%,8% 95%,8% 100%,8% Z" fill="#2d2215" opacity="0.08" />
        </svg>
      </div>

      {/* Blurred glow elements / ambient depth-of-field vector background filters */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.22]">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="vector-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4.5" />
            </filter>
            <filter id="soft-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="15" />
            </filter>
          </defs>

          {/* Colorful blurred background node indicators */}
          <circle cx="20%" cy="15%" r="35" fill="#C1121F" filter="url(#soft-glow)" opacity="0.25" />
          <circle cx="85%" cy="30%" r="45" fill="#047857" filter="url(#soft-glow)" opacity="0.2" />
          <circle cx="35%" cy="75%" r="55" fill="#0f766e" filter="url(#soft-glow)" opacity="0.15" />
          <circle cx="70%" cy="85%" r="40" fill="#d97706" filter="url(#soft-glow)" opacity="0.22" />

          {/* Blurred wave guidelines mapping depth */}
          <path d="M -50,200 Q 120,400 350,150 T 800,350" fill="none" stroke="#C1121F" strokeWidth="6" filter="url(#vector-blur)" opacity="0.3" />
          <path d="M 50,500 C 250,550 450,400 750,600" fill="none" stroke="#047857" strokeWidth="4" filter="url(#vector-blur)" opacity="0.25" />
        </svg>
      </div>

      {/* Dynamic Colorful Textured Vector Accents (Random Lines, Normal Curves, Deep Curves) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.32]">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          {/* Deep Curve 1 (Crimson Scout Red) */}
          <path d="M 15,110 C 95,220 115,-30 255,180" stroke="#C1121F" strokeWidth="1" strokeDasharray="4,2" fill="none" opacity="0.8" />
          
          {/* Normal Curve 2 (Teal Action) */}
          <path d="M 45,280 Q 145,150 295,340" stroke="#0f766e" strokeWidth="0.8" fill="none" opacity="0.75" />
          
          {/* Deep Curve 3 (Emerald Green) */}
          <path d="M 195,90 Q 245,250 325,110" stroke="#047857" strokeWidth="1.1" fill="none" opacity="0.7" />
          
          {/* Normal Curve 4 (Scout Amber Gold) */}
          <path d="M 35,460 C 105,410 155,510 305,430" stroke="#d97706" strokeWidth="0.9" strokeDasharray="1,3" fill="none" opacity="0.8" />

          {/* Additional curved landscape contour lines for mapping depth */}
          <path d="M 0,380 C 120,290 220,490 400,320" stroke="#78350f" strokeWidth="0.55" fill="none" opacity="0.6" />
          <path d="M 0,150 Q 180,90 310,250 T 600,100" stroke="#059669" strokeWidth="0.65" fill="none" opacity="0.55" strokeDasharray="5,3" />

          {/* Intersecting technical grids */}
          <line x1="12" y1="290" x2="195" y2="290" stroke="#0f766e" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.5" />
          <line x1="88" y1="180" x2="88" y2="350" stroke="#0f766e" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.5" />

          {/* Random Small Colorful Straight Lines & Dynamic Compass Pointers */}
          <line x1="25" y1="130" x2="85" y2="135" stroke="#C1121F" strokeWidth="1.1" opacity="0.85" />
          <line x1="65" y1="120" x2="70" y2="145" stroke="#C1121F" strokeWidth="0.9" opacity="0.8" />

          {/* Teal straight directional guide and small crosshairs */}
          <line x1="265" y1="420" x2="315" y2="400" stroke="#0d9488" strokeWidth="1" opacity="0.8" strokeDasharray="1,2" />
          <line x1="295" y1="390" x2="300" y2="430" stroke="#0c4a6e" strokeWidth="0.7" opacity="0.75" />

          {/* Gold star alignment locks */}
          <path d="M 135,160 L 145,160 M 140,155 L 140,165" stroke="#b45309" strokeWidth="0.9" opacity="0.8" />
          <path d="M 85,370 L 95,370 M 90,365 L 90,375" stroke="#047857" strokeWidth="0.9" opacity="0.75" />
          <path d="M 245,290 L 255,290 M 250,285 L 250,295" stroke="#C1121F" strokeWidth="0.9" opacity="0.8" />

          {/* Deep and wavy bend curve paths */}
          <path d="M 25,595 Q 50,555 90,605 T 160,575" stroke="#0284c7" strokeWidth="1" fill="none" opacity="0.8" />
          <path d="M 215,535 Q 275,635 335,545" stroke="#b45309" strokeWidth="1" fill="none" opacity="0.75" />
          <path d="M 75,745 C 115,805 195,705 245,785" stroke="#cf8a12" strokeWidth="0.8" strokeDasharray="3,3" fill="none" opacity="0.85" />
          <path d="M 145,865 Q 235,905 315,845" stroke="#a21caf" strokeWidth="0.9" fill="none" opacity="0.7" />

          {/* Fine random straight ticks scattered */}
          <line x1="155" y1="225" x2="185" y2="230" stroke="#475569" strokeWidth="0.6" opacity="0.8" />
          <line x1="235" y1="695" x2="260" y2="715" stroke="#10b981" strokeWidth="0.8" opacity="0.8" />
          <line x1="55" y1="655" x2="85" y2="645" stroke="#ef4444" strokeWidth="0.9" opacity="0.75" />
          <line x1="185" y1="785" x2="215" y2="775" stroke="#047857" strokeWidth="1.1" opacity="0.7" />
          <line x1="285" y1="195" x2="310" y2="225" stroke="#c1121f" strokeWidth="0.8" opacity="0.85" />
        </svg>
      </div>

      {!isAdmin && <Header />}
      
      {/* Content wrapper with fixed non-scroll background setting context */}
      <main className={`flex-1 overflow-y-auto relative z-10 ${isAdmin ? 'pb-0' : 'pb-20'}`}>
        <ActiveComponent />
      </main>
      
      {!isAdmin && (
        <nav className={`fixed bottom-0 w-full bg-white/30 backdrop-blur-md border-t border-gray-200/50 flex justify-around p-2 z-50 shadow-lg transition-transform duration-200 ${isKeyboardOpen ? 'translate-y-full' : 'translate-y-0'}`}>
          {tabs.map((tab, idx) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(idx)}
              className={`flex flex-col items-center ${activeTab === idx ? 'text-[#C1121F]' : 'text-gray-500'}`}
            >
              <tab.icon className="w-6 h-6" />
              <span className="text-[10px]">{tab.name}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
