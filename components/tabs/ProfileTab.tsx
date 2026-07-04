'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  User, Lock, ArrowRight, ShieldCheck, Mail, Eye, EyeOff, 
  UserCheck, Bell, FileText, Settings, BarChart, Users, 
  Image as ImageIcon, Target, AlertCircle, LogOut, CheckCircle2,
  Phone, Calendar, ChevronLeft, ChevronRight, Plus, Search, 
  Filter, Trash2, Edit3, MoreVertical, Download, Upload, Clock, 
  Grid, List, Info, Globe, RefreshCw, Sliders, Tag, ChevronDown, 
  Check, X, Maximize, Minimize, Sparkles, Database, Share2, 
  Menu, BookOpen, Heart, Activity, FileCheck, FileSpreadsheet, Archive, CalendarDays, ExternalLink, HelpCircle, MapPin
} from 'lucide-react';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '@/lib/firebase';
import { isAvailable } from '@/lib/utils';
import firebaseConfig from '../../firebase-applet-config.json';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, addDoc, deleteDoc, query } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';

type Route = '/login' | '/admin/login' | '/dashboard' | '/admin/dashboard';

export default function ProfileTab() {
  const [currentRoute, setCurrentRoute] = useState<Route>('/login');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      setUser(usr);
      if (usr) {
        try {
          const adminRef = doc(db, 'admins', usr.uid);
          const adminSnap = await getDoc(adminRef);
          
          if (adminSnap.exists() && adminSnap.data().role === 'admin') {
            setIsAdmin(true);
            setUserData(adminSnap.data());
            setCurrentRoute('/admin/dashboard');
          } else {
            setIsAdmin(false);
            const userRef = doc(db, 'users', usr.uid);
            let userSnap = null;
            try {
              userSnap = await getDoc(userRef);
            } catch (readErr) {
              handleFirestoreError(readErr, OperationType.GET, `users/${usr.uid}`);
            }

            if (userSnap && userSnap.exists()) {
              setUserData(userSnap.data());
            } else {
              // Self-heal: create standard profile document if missing
              const defaultProfile = {
                uid: usr.uid,
                fullName: usr.displayName || 'Rover Scout Member',
                email: usr.email || '',
                phone: usr.phoneNumber || '',
                status: 'Active Member',
                createdAt: new Date().toISOString(),
                bloodGroup: 'Pending',
                technology: 'Pending',
                semester: 'Pending',
                rollNo: 'Pending',
                session: 'Pending',
                rank: 'Rover Scout',
                organizationRole: 'Rover Scout Member'
              };
              try {
                await setDoc(userRef, defaultProfile);
                setUserData(defaultProfile);
              } catch (writeErr) {
                handleFirestoreError(writeErr, OperationType.WRITE, `users/${usr.uid}`);
              }
            }
            setCurrentRoute('/dashboard');
          }
        } catch (err) {
          // Fallback for standard users who don't have permission/documents in the admins collection
          setIsAdmin(false);
          try {
            const userRef = doc(db, 'users', usr.uid);
            let userSnap = null;
            try {
              userSnap = await getDoc(userRef);
            } catch (readErr) {
              handleFirestoreError(readErr, OperationType.GET, `users/${usr.uid}`);
            }

            if (userSnap && userSnap.exists()) {
              setUserData(userSnap.data());
            } else {
              // Self-heal: create standard profile document if missing
              const defaultProfile = {
                uid: usr.uid,
                fullName: usr.displayName || 'Rover Scout Member',
                email: usr.email || '',
                phone: usr.phoneNumber || '',
                status: 'Active Member',
                createdAt: new Date().toISOString(),
                bloodGroup: 'Pending',
                technology: 'Pending',
                semester: 'Pending',
                rollNo: 'Pending',
                session: 'Pending',
                rank: 'Rover Scout',
                organizationRole: 'Rover Scout Member'
              };
              try {
                await setDoc(userRef, defaultProfile);
                setUserData(defaultProfile);
              } catch (writeErr) {
                handleFirestoreError(writeErr, OperationType.WRITE, `users/${usr.uid}`);
              }
            }
          } catch (userErr) {
            console.log("Error loading user profile:", userErr);
          }
          setCurrentRoute('/dashboard');
        }
      } else {
        setUserData(null);
        const isCodeAuthorized = localStorage.getItem('adminCodeAuthorized') === 'true';
        if (isCodeAuthorized) {
          setIsAdmin(true);
          setCurrentRoute('/admin/dashboard');
        } else {
          setIsAdmin(false);
          setCurrentRoute('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleNavigate = (route: Route) => {
    if (route === '/admin/dashboard') {
      setIsAdmin(true);
      localStorage.setItem('adminCodeAuthorized', 'true');
      window.dispatchEvent(new CustomEvent('admin-status', { detail: { isAdmin: true } }));
    }
    setCurrentRoute(route);
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('adminCodeAuthorized');
    setIsAdmin(false);
    setCurrentRoute('/login');
    window.dispatchEvent(new CustomEvent('admin-status', { detail: { isAdmin: false } }));
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className={`text-gray-900 font-sans flex flex-col justify-center items-center w-full relative ${currentRoute === '/admin/dashboard' ? 'min-h-screen bg-transparent' : 'min-h-screen pb-24 bg-transparent'}`}>
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border backdrop-blur-md max-w-sm w-[90%] ${
              toast.type === 'success' 
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/20' 
                : 'bg-rose-600 text-white border-rose-500 shadow-rose-600/20'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-bold tracking-wide flex-1">{toast.message}</span>
            <button onClick={() => setToast(null)} className="hover:opacity-85 transition p-1 rounded-full hover:bg-white/10">
              <X className="w-4.5 h-4.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {currentRoute === '/login' && <UserAuth onNavigate={handleNavigate} showToast={showToast} />}
      {currentRoute === '/admin/login' && <AdminLogin onNavigate={handleNavigate} />}
      {currentRoute === '/dashboard' && <UserDashboard userData={userData} setUserData={setUserData} showToast={showToast} />}
      {currentRoute === '/admin/dashboard' && <AdminDashboard userData={userData} onLogout={handleLogout} showToast={showToast} />}
    </div>
  );
}

function UserAuth({ onNavigate, showToast }: { onNavigate: (route: Route) => void, showToast: (msg: string, type: 'success' | 'error') => void }) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [view, setView] = useState<'auth' | 'terms' | 'privacy'>('auth');
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [currentDomain, setCurrentDomain] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        setCurrentDomain(window.location.hostname);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    setGoogleError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      showToast('Google login successful! Welcome to the Rover Scout family.', 'success');
    } catch (err: any) {
      console.error("Google login error:", err);
      let errorMsg = '';
      if (err.code === 'auth/popup-closed-by-user') {
        errorMsg = 'Google Sign-In was closed before completion.';
        showToast(errorMsg, 'error');
      } else if (err.code === 'auth/operation-not-allowed' || err.message?.includes('auth/operation-not-allowed')) {
        errorMsg = 'Google Sign-In is disabled in the Firebase Console.';
        setGoogleError(errorMsg);
        showToast(errorMsg, 'error');
      } else if (err.code === 'auth/unauthorized-domain' || err.message?.includes('auth/unauthorized-domain')) {
        errorMsg = 'This domain is not authorized for Google Sign-In in your Firebase configuration.';
        setGoogleError(errorMsg);
        showToast(errorMsg, 'error');
      } else {
        errorMsg = err.message || 'Google Sign-In failed.';
        showToast(errorMsg, 'error');
      }
    }
  };
  
  if (view === 'terms') {
    return (
      <div className="w-full max-w-md p-6">
        <div className="backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden p-8 border border-gray-100 bg-white">
          <button onClick={() => setView("auth")} className="float-right text-gray-400 hover:text-gray-950 font-bold transition">✕</button>
          <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">Terms of Service</h2>
          <div className="max-h-[350px] overflow-y-auto pr-2 space-y-4 text-xs text-gray-600 leading-relaxed font-sans">
            <p>
              By accessing or using the Rajshahi Polytechnic Institute Rover Scout
              Group website, you agree to comply with the following terms and
              conditions. These rules help maintain a safe, respectful, and
              professional environment for all members and visitors.
            </p>
        
            <ul className="space-y-3 list-disc pl-5">
              <li>
                You must provide accurate and truthful information during registration
                and profile updates.
              </li>
              <li>
                You are responsible for maintaining the confidentiality of your account
                credentials and password.
              </li>
              <li>
                Do not share your account with another person or allow unauthorized
                access.
              </li>
              <li>
                Users must not upload or distribute false, offensive, abusive,
                defamatory, or illegal content through the platform.
              </li>
              <li>
                Any attempt to hack, exploit, damage, or interfere with the website,
                database, or services is strictly prohibited.
              </li>
              <li>
                All photographs, documents, logos, graphics, and website content remain
                the property of Rajshahi Polytechnic Institute Rover Scout Group unless
                otherwise stated.
              </li>
              <li>
                Unauthorized copying, redistribution, modification, or commercial use
                of website content is prohibited without prior written permission.
              </li>
              <li>
                Members are expected to follow the principles, values, and code of
                conduct of the Rover Scout Movement while using this platform.
              </li>
            </ul>
          </div>
          <button 
            onClick={() => setView("auth")} 
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition text-xs shadow-md"
          >
            I Understand & Go Back
          </button>
        </div>
      </div>
    );
  }

  if (view === 'privacy') {
    return (
      <div className="w-full max-w-md p-6">
        <div className="backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden p-8 border border-gray-100 bg-white">
          <button onClick={() => setView("auth")} className="float-right text-gray-400 hover:text-gray-950 font-bold transition">✕</button>
          <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">Privacy Policy</h2>
          <div className="max-h-[350px] overflow-y-auto pr-2 space-y-4 text-xs text-gray-600 leading-relaxed font-sans">
            <p>
              Rajshahi Polytechnic Institute Rover Scout Group is committed to
              protecting your privacy. This Privacy Policy explains how we collect,
              use, and safeguard your personal information when you use our website
              and services.
            </p>

            <p>
              We may collect information such as your name, email address, phone
              number, membership details, profile photo, and other information that
              you voluntarily provide through registration forms, contact forms, or
              administrative activities.
            </p>

            <p>
              Your information is used solely for organizational purposes, including
              membership management, event registration, communication,
              announcements, and improving our services. We do not sell, rent, or
              share your personal information with third parties for commercial
              purposes.
            </p>

            <p>
              Images uploaded to the website, including event photographs and
              activity galleries, may be publicly visible to showcase the activities
              and achievements of the organization.
            </p>
          </div>
          <button 
            onClick={() => setView("auth")} 
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition text-xs shadow-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-4">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="pt-8 pb-5 px-8 text-center bg-transparent">
          <div className="w-14 h-14 bg-green-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-green-100">
            <UserCheck className="w-7 h-7" />
          </div>
          <p className="text-green-600 font-bold text-[10px] uppercase tracking-widest mb-0.5">Rajshahi Polytechnic Institute</p>
          <h2 className="text-base font-black text-gray-900 tracking-tight uppercase">Rover Scout Group</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <button 
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'login' ? 'text-green-600 border-b-2 border-green-600 bg-white font-black' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button 
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'register' ? 'text-green-600 border-b-2 border-green-600 bg-white font-black' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {/* Forms */}
        <div className="p-6">
          {googleError && (
            <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-xl text-xs font-medium flex flex-col gap-2 border border-red-100">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span className="flex-1">{googleError}</span>
              </div>
              {(googleError.includes('unauthorized-domain') || googleError.includes('authorized') || googleError.includes('domain')) && (
                <div className="mt-2 pt-2 border-t border-red-100 text-[11px] text-red-700 space-y-1 bg-white/40 p-2.5 rounded-lg font-normal">
                  <p className="font-bold uppercase text-[9px] text-red-800 tracking-wider">How to authorize this domain in Firebase Console:</p>
                  <ol className="list-decimal pl-4 space-y-1 mt-1">
                    <li>Go to your <a href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings`} target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-red-900">Firebase Authentication Settings</a></li>
                    <li>Click on the <strong>Authorized domains</strong> section under Settings.</li>
                    <li>Click on <strong>Add domain</strong>.</li>
                    <li>Enter the following domain exactly:
                      <div className="my-1.5 p-1 px-2 bg-white/80 border border-red-200 rounded font-mono text-[10px] text-red-900 select-all break-all cursor-pointer flex justify-between items-center group" onClick={(e) => {
                        const text = e.currentTarget.innerText.trim();
                        navigator.clipboard.writeText(text);
                        showToast('Domain copied to clipboard!', 'success');
                      }} title="Click to copy">
                        {currentDomain || 'Loading...'}
                      </div>
                    </li>
                    {currentDomain && currentDomain.includes('ais-dev') && (
                      <li>(Optional but recommended) Also add your production domain for sharing:
                        <div className="my-1.5 p-1 px-2 bg-white/80 border border-red-200 rounded font-mono text-[10px] text-red-900 select-all break-all cursor-pointer flex justify-between items-center group" onClick={(e) => {
                          const text = e.currentTarget.innerText.trim();
                          navigator.clipboard.writeText(text);
                          showToast('Domain copied to clipboard!', 'success');
                        }} title="Click to copy">
                          {currentDomain.replace('ais-dev', 'ais-pre')}
                        </div>
                      </li>
                    )}
                    <li>Click <strong>Add</strong> to save the changes.</li>
                    <li>Refresh this page and try Google login again!</li>
                  </ol>
                </div>
              )}
              {googleError.includes('disabled') && (
                <div className="mt-2 pt-2 border-t border-red-100 text-[11px] text-red-700 space-y-1 bg-white/40 p-2.5 rounded-lg font-normal">
                  <p className="font-bold uppercase text-[9px] text-red-800 tracking-wider">How to enable Google Sign-In in Firebase Console:</p>
                  <ol className="list-decimal pl-4 space-y-1 mt-1">
                    <li>Go to your <a href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`} target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-red-900">Firebase Authentication Providers</a></li>
                    <li>Click on the <strong>Sign-in method</strong> tab.</li>
                    <li>Click <strong>Add new provider</strong> and select <strong>Google</strong>.</li>
                    <li>Toggle the <strong>Enable</strong> switch, enter a support email, and click <strong>Save</strong>.</li>
                    <li>Refresh this page and try again!</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {activeTab === 'login' ? (
            <LoginForm showToast={showToast} onGoogleSignIn={handleGoogleSignIn} />
          ) : (
            <RegisterForm showToast={showToast} onViewTerms={() => setView('terms')} onViewPrivacy={() => setView('privacy')} onGoogleSignIn={handleGoogleSignIn} />
          )}
        </div>

        {/* Footer Admin Link */}
        <div className="border-t border-gray-50/50 p-3 text-center bg-gray-50/20">
          <button 
            onClick={() => onNavigate('/admin/login')}
            className="text-[10px] text-gray-400 hover:text-green-600 uppercase tracking-widest font-bold transition-all"
          >
            Administrator Login &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ showToast, onGoogleSignIn }: { showToast: (msg: string, type: 'success' | 'error') => void, onGoogleSignIn: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Login successful! Welcome back.', 'success');
    } catch (err: any) {
      console.error("Login Error Details:", err);
      let errorMsg = 'Invalid email address or incorrect password.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMsg = 'Incorrect email or password. Please try again.';
      } else if (err.code === 'auth/invalid-credential') {
        errorMsg = 'Invalid login credentials. Check your email and password.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMsg = 'Too many failed login attempts. This account has been temporarily disabled. Please try again later.';
      } else if (err.code === 'auth/operation-not-allowed' || err.message?.includes('auth/operation-not-allowed')) {
        errorMsg = 'Email/Password login is currently disabled in the Firebase Console. Please enable it or sign in using Google.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-medium flex flex-col gap-2 border border-red-100">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            {(error.includes('disabled') || error.includes('operation-not-allowed')) && (
              <div className="mt-2 pt-2 border-t border-red-100 text-[11px] text-red-700 space-y-1 bg-white/40 p-2.5 rounded-lg font-normal">
                <p className="font-bold uppercase text-[9px] text-red-800 tracking-wider">How to fix this in Firebase Console:</p>
                <ol className="list-decimal pl-4 space-y-1 mt-1">
                  <li>Go to your <a href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`} target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-red-900">Firebase Authentication Console</a></li>
                  <li>Click on the <strong>Sign-in method</strong> tab.</li>
                  <li>Under <strong>Sign-in providers</strong>, click <strong>Add new provider</strong>.</li>
                  <li>Select <strong>Email/Password</strong>, check <strong>Enable</strong>, and click <strong>Save</strong>.</li>
                  <li>Refresh this page and try again!</li>
                </ol>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wide">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all font-medium text-gray-900"
              placeholder="example@gmail.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wide">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all font-medium text-gray-900"
              placeholder="Enter password"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] pt-1">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" className="rounded text-green-600 focus:ring-green-500 border-gray-200 w-3.5 h-3.5" />
            <span className="text-gray-500 font-medium select-none">Remember me</span>
          </label>
          <button type="button" onClick={() => showToast('Password recovery is managed by Rover Scout Leader.', 'error')} className="text-green-600 font-bold hover:underline">Forgot Password?</button>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 text-white font-bold py-2.5 rounded-xl hover:bg-green-700 active:scale-[0.98] transition-all mt-2 flex justify-center items-center shadow-md shadow-green-100 disabled:opacity-70 text-xs uppercase tracking-wider"
        >
          {loading ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div> : 'Sign In'}
        </button>
      </form>

      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <span className="relative px-3 bg-white text-[10px] text-gray-400 font-bold uppercase tracking-widest">or</span>
      </div>

      <button 
        type="button"
        onClick={onGoogleSignIn}
        className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-4 rounded-xl border border-gray-200 active:scale-[0.98] transition-all flex justify-center items-center gap-2.5 shadow-sm text-xs uppercase tracking-wider"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>
    </div>
  );
}

function RegisterForm({ onViewTerms, onViewPrivacy, showToast, onGoogleSignIn }: { onViewTerms: () => void, onViewPrivacy: () => void, showToast: (msg: string, type: 'success' | 'error') => void, onGoogleSignIn: () => void }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let s = 0;
    if (pass.length > 5) s += 1;
    if (pass.length > 7) s += 1;
    if (/[A-Z]/.test(pass)) s += 1;
    if (/[0-9]/.test(pass)) s += 1;
    return s;
  };

  const strength = getPasswordStrength(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError('You must accept the Terms & Conditions.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      // Create user profile in Firestore
      try {
        await setDoc(doc(db, 'users', userCred.user.uid), {
          uid: userCred.user.uid,
          fullName,
          email,
          phone,
          status: 'Active Member',
          createdAt: new Date().toISOString(),
          bloodGroup: 'Pending',
          technology: 'Pending',
          semester: 'Pending',
          rollNo: 'Pending',
          session: 'Pending',
          rank: 'Rover Scout',
          organizationRole: 'Rover Scout Member'
        });
      } catch (writeErr) {
        handleFirestoreError(writeErr, OperationType.CREATE, `users/${userCred.user.uid}`);
      }
      showToast('Registration successful! Welcome to the Rover Scout family.', 'success');
    } catch (err: any) {
      console.error("Registration Error Details:", err);
      let errorMsg = 'Failed to create account. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'This email address is already in use. Try signing in instead.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'Password is too weak. It must be at least 6 characters.';
      } else if (err.code === 'auth/operation-not-allowed' || err.message?.includes('auth/operation-not-allowed')) {
        errorMsg = 'Email/Password registration is currently disabled in the Firebase Console. Please enable it in the console or sign in using Google.';
      } else if (err.message && err.message.includes('permission-denied')) {
        errorMsg = 'Firestore write permission denied. Verify your security rules.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleRegister} className="space-y-3">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-medium flex flex-col gap-2 border border-red-100">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
            {(error.includes('disabled') || error.includes('operation-not-allowed')) && (
              <div className="mt-2 pt-2 border-t border-red-100 text-[11px] text-red-700 space-y-1 bg-white/40 p-2.5 rounded-lg font-normal">
                <p className="font-bold uppercase text-[9px] text-red-800 tracking-wider">How to fix this in Firebase Console:</p>
                <ol className="list-decimal pl-4 space-y-1 mt-1">
                  <li>Go to your <a href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`} target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-red-900">Firebase Authentication Console</a></li>
                  <li>Click on the <strong>Sign-in method</strong> tab.</li>
                  <li>Under <strong>Sign-in providers</strong>, click <strong>Add new provider</strong>.</li>
                  <li>Select <strong>Email/Password</strong>, check <strong>Enable</strong>, and click <strong>Save</strong>.</li>
                  <li>Refresh this page and try again!</li>
                </ol>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-0.5 uppercase tracking-wide">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all font-medium text-gray-900"
              placeholder="Md. Rahim Islam"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-0.5 uppercase tracking-wide">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all font-medium text-gray-900"
              placeholder="rahim@gmail.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-0.5 uppercase tracking-wide">Mobile Number</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="tel" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all font-medium text-gray-900"
              placeholder="01712345678"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-0.5 uppercase tracking-wide">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all font-medium text-gray-900"
              placeholder="Create password"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Strength Indicator */}
          {password.length > 0 && (
            <div className="mt-1 flex gap-1 h-1">
              <div className={`flex-1 rounded-full ${strength >= 1 ? 'bg-red-400' : 'bg-gray-200'}`}></div>
              <div className={`flex-1 rounded-full ${strength >= 2 ? 'bg-orange-400' : 'bg-gray-200'}`}></div>
              <div className={`flex-1 rounded-full ${strength >= 3 ? 'bg-yellow-400' : 'bg-gray-200'}`}></div>
              <div className={`flex-1 rounded-full ${strength >= 4 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 mb-0.5 uppercase tracking-wide">Confirm Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type={showPassword ? "text" : "password"} 
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-green-500 focus:bg-white outline-none transition-all font-medium text-gray-900"
              placeholder="Confirm password"
            />
          </div>
        </div>

        <div className="flex items-start gap-2 pt-1">
          <input 
            type="checkbox" 
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            className="rounded text-green-600 focus:ring-green-500 border-gray-200 mt-0.5 w-3.5 h-3.5" 
          />
          <span className="text-[10px] text-gray-400 leading-tight">
            I accept the <button type="button" onClick={onViewTerms} className="text-green-600 underline font-semibold">Terms of Service</button> & <button type="button" onClick={onViewPrivacy} className="text-green-600 underline font-semibold">Privacy Policy</button>
          </span>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gray-900 text-white font-bold py-2.5 rounded-xl hover:bg-black active:scale-[0.98] transition-all mt-2 flex justify-center items-center shadow-lg disabled:opacity-70 text-xs uppercase tracking-wider"
        >
          {loading ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div> : 'Register Account'}
        </button>
      </form>

      <div className="relative my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <span className="relative px-3 bg-white text-[10px] text-gray-400 font-bold uppercase tracking-widest">or</span>
      </div>

      <button 
        type="button"
        onClick={onGoogleSignIn}
        className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-4 rounded-xl border border-gray-200 active:scale-[0.98] transition-all flex justify-center items-center gap-2.5 shadow-sm text-xs uppercase tracking-wider"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>
    </div>
  );
}

function AdminLogin({ onNavigate }: { onNavigate: (route: Route) => void }) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const playErrorSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const adminCode = code.join('');
    
    if (adminCode === '515357') {
        onNavigate('/admin/dashboard');
    } else {
        setError('Invalid access code.');
        playErrorSound();
        setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <>
      {error && (
        <div className="fixed top-5 right-5 z-50 bg-red-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-pulse">
          <AlertCircle className="w-5 h-5" />
          <span className="font-bold">Invalid access</span>
        </div>
      )}
      <div className="w-full max-w-sm p-6 flex flex-col justify-center items-center">
        <div className="mb-6 w-full text-left">
          <button 
            onClick={() => onNavigate('/login')} 
            className="text-gray-500 text-sm flex items-center gap-1 hover:text-gray-800 transition-colors"
          >
            &larr; Back to Member Login
          </button>
        </div>
        
        <div className="backdrop-blur-xl bg-white/50 p-8 rounded-[2rem] shadow-2xl w-full border border-white/20">
          <div className="w-16 h-16 bg-gray-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight text-center">Admin Access</h2>
          <p className="text-gray-600 text-sm mb-8 text-center">Enter your 6-digit access code.</p>

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="flex justify-center gap-2">
              {code.map((char, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={char}
                  onChange={(e) => {
                    const newCode = [...code];
                    newCode[index] = e.target.value.toUpperCase();
                    setCode(newCode);
                    if (e.target.value && index < 5) {
                      const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement;
                      nextInput?.focus();
                    }
                  }}
                  id={`code-${index}`}
                  className="w-10 h-12 text-center text-xl font-bold bg-white border-2 border-black rounded-xl focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                />
              ))}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-2xl hover:bg-black transition-colors mt-6 flex justify-center items-center shadow-lg disabled:opacity-70"
            >
              {loading ? <div className="animate-spin w-5 h-5 border-2 rounded-full"></div> : 'Access Admin Panel'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

// --- Dashboard Components ---
function UserDashboard({ userData, setUserData, showToast }: { userData: any; setUserData: (data: any) => void; showToast: (msg: string, type: 'success' | 'error') => void }) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'scouting' | 'group'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Local form state for profile editing
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('Pending');
  const [technology, setTechnology] = useState('Pending');
  const [semester, setSemester] = useState('Pending');
  const [rollNo, setRollNo] = useState('');
  const [session, setSession] = useState('');
  const [saving, setSaving] = useState(false);

  const startEditing = () => {
    if (userData) {
      setPhone(userData.phone || '');
      setBloodGroup(userData.bloodGroup || 'Pending');
      setTechnology(userData.technology || 'Pending');
      setSemester(userData.semester || 'Pending');
      setRollNo(userData.rollNo || '');
      setSession(userData.session || '');
    }
    setIsEditing(true);
  };

  if (!userData) {
    return (
      <div className="p-12 text-center text-gray-500 flex flex-col justify-center items-center h-[350px]">
        <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mb-3"></div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Loading Rover Scout Profile...</p>
      </div>
    );
  }

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const userRef = doc(db, 'users', userData.uid);
      const updatedData = {
        ...userData,
        phone,
        bloodGroup,
        technology,
        semester,
        rollNo,
        session
      };
      await updateDoc(userRef, {
        phone,
        bloodGroup,
        technology,
        semester,
        rollNo,
        session
      });
      setUserData(updatedData);
      setIsEditing(false);
      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      showToast('Failed to update profile details.', 'error');
      handleFirestoreError(err, OperationType.UPDATE, `users/${userData.uid}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-xl p-4 space-y-6 mt-4">
      {/* Profile Main Header Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
        {/* Banner with RPI Rover design */}
        <div className="h-32 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
          <div className="absolute bottom-3 left-6 text-white font-mono text-[9px] uppercase tracking-widest opacity-75">
            Rajshahi Polytechnic Institute Rover Scout Group
          </div>
        </div>

        {/* Member Basic Info Row */}
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12 mb-4">
            <div className="w-24 h-24 rounded-2xl border-4 border-white bg-white shadow-xl overflow-hidden relative z-10">
              {userData.profilePhoto ? (
                <img src={userData.profilePhoto} alt={userData.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-green-700 bg-green-50">
                  <User className="w-10 h-10 stroke-[1.5]" />
                </div>
              )}
            </div>
            
            <div className="text-center sm:text-left flex-1">
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5 border border-green-100">
                <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                {userData.status || 'Active Member'}
              </span>
              <h2 className="text-xl font-black text-gray-950 tracking-tight leading-none mb-1">{userData.fullName || 'Rover Scout'}</h2>
              <p className="text-xs font-semibold text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                {userData.organizationRole || 'Rover Scout Member'} &bull; {userData.rank || 'Rover Scout'}
              </p>
            </div>
          </div>

          {/* Sub Tab Buttons */}
          <div className="flex border-b border-gray-100 pt-3">
            <button 
              onClick={() => { setActiveSubTab('profile'); setIsEditing(false); }}
              className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 text-center ${activeSubTab === 'profile' ? 'border-green-600 text-green-600 font-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              My Profile
            </button>
            <button 
              onClick={() => { setActiveSubTab('scouting'); setIsEditing(false); }}
              className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 text-center ${activeSubTab === 'scouting' ? 'border-green-600 text-green-600 font-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Scout Badges
            </button>
            <button 
              onClick={() => { setActiveSubTab('group'); setIsEditing(false); }}
              className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 text-center ${activeSubTab === 'group' ? 'border-green-600 text-green-600 font-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Group Info
            </button>
          </div>

          {/* Sub Tab Content */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              {activeSubTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  {!isEditing ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Academic & Contact details</h3>
                        <button 
                          onClick={startEditing}
                          className="text-xs font-bold text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100/80 px-3.5 py-1.5 rounded-xl transition"
                        >
                          Edit Profile Details
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                        <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Scout Member ID</p>
                          <p className="text-xs font-black text-gray-900 font-mono tracking-wide">{userData.uid?.substring(0,10).toUpperCase() || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Mobile Number</p>
                          <p className="text-xs font-bold text-gray-900">{userData.phone || 'Not set'}</p>
                        </div>
                        <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Blood Group</p>
                          <p className="text-xs font-black text-red-600 flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 fill-red-500 stroke-red-500" />
                            {userData.bloodGroup || 'Pending'}
                          </p>
                        </div>
                        <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Technology Department</p>
                          <p className="text-xs font-bold text-gray-900">{userData.technology || 'Pending'}</p>
                        </div>
                        <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Academic Semester</p>
                          <p className="text-xs font-bold text-gray-900">{userData.semester || 'Pending'}</p>
                        </div>
                        <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Roll Number</p>
                          <p className="text-xs font-bold text-gray-900 font-mono">{userData.rollNo || 'Pending'}</p>
                        </div>
                        <div className="sm:col-span-2 bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Academic Session</p>
                          <p className="text-xs font-bold text-gray-900 font-mono">{userData.session || 'Pending'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveChanges} className="space-y-4">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                        <h3 className="text-xs font-black text-gray-950 uppercase tracking-widest">Update Profile Details</h3>
                        <div className="flex gap-2">
                          <button 
                            type="button" 
                            onClick={() => setIsEditing(false)}
                            className="text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-100 px-3 py-1.5 rounded-xl transition"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            disabled={saving}
                            className="text-xs font-bold text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-xl transition disabled:opacity-70 flex items-center gap-1"
                          >
                            {saving ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Mobile Number</label>
                          <input 
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="01712345678"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Blood Group</label>
                          <select 
                            value={bloodGroup}
                            onChange={e => setBloodGroup(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-green-500 outline-none font-bold"
                          >
                            <option value="Pending">Pending</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Technology Department</label>
                          <select 
                            value={technology}
                            onChange={e => setTechnology(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-green-500 outline-none"
                          >
                            <option value="Pending">Select Technology</option>
                            <option value="Computer Technology">Computer Technology</option>
                            <option value="Civil Technology">Civil Technology</option>
                            <option value="Electrical Technology">Electrical Technology</option>
                            <option value="Mechanical Technology">Mechanical Technology</option>
                            <option value="Electronics Technology">Electronics Technology</option>
                            <option value="Power Technology">Power Technology</option>
                            <option value="Electro-Medical Technology">Electro-Medical Technology</option>
                            <option value="Mechatronics Technology">Mechatronics Technology</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Semester</label>
                          <select 
                            value={semester}
                            onChange={e => setSemester(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-green-500 outline-none"
                          >
                            <option value="Pending">Select Semester</option>
                            <option value="1st Semester">1st Semester</option>
                            <option value="2nd Semester">2nd Semester</option>
                            <option value="3rd Semester">3rd Semester</option>
                            <option value="4th Semester">4th Semester</option>
                            <option value="5th Semester">5th Semester</option>
                            <option value="6th Semester">6th Semester</option>
                            <option value="7th Semester">7th Semester</option>
                            <option value="8th Semester">8th Semester</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Roll Number</label>
                          <input 
                            type="text"
                            value={rollNo}
                            onChange={e => setRollNo(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-green-500 outline-none font-mono"
                            placeholder="e.g. 523145"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Academic Session</label>
                          <input 
                            type="text"
                            value={session}
                            onChange={e => setSession(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-green-500 outline-none font-mono"
                            placeholder="e.g. 2022-23"
                          />
                        </div>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}

              {activeSubTab === 'scouting' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">My Scouting Badges & Progress</h3>
                  
                  <div className="space-y-3.5">
                    {/* Badge 1 */}
                    <div className="p-4 rounded-2xl border border-gray-100 bg-green-50/20 flex gap-3.5 items-start">
                      <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm shrink-0">
                        1
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-xs font-black text-gray-900 uppercase">Rover Scout Squire Training</h4>
                          <span className="text-[9px] bg-green-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">Completed</span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-normal">Initial scout introduction, scouting values, law, history, promise, and organization entry guidelines completed successfully.</p>
                      </div>
                    </div>

                    {/* Badge 2 */}
                    <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex gap-3.5 items-start">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-sm shrink-0">
                        2
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-xs font-black text-gray-900 uppercase">Standard Rover Scout Badge</h4>
                          <span className="text-[9px] bg-yellow-500 text-white font-bold px-2 py-0.5 rounded-full uppercase">In Progress</span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-normal">Camp training, knots & lashings, first aid, pioneering, and civic community service projects are currently active and being tracked.</p>
                      </div>
                    </div>

                    {/* Badge 3 */}
                    <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/30 flex gap-3.5 items-start opacity-70">
                      <div className="w-10 h-10 rounded-full bg-red-50 text-red-700 flex items-center justify-center font-bold text-sm shrink-0">
                        3
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-xs font-black text-gray-900 uppercase">President&apos;s Rover Scout Award (PRSA)</h4>
                          <span className="text-[9px] bg-gray-300 text-gray-700 font-bold px-2 py-0.5 rounded-full uppercase">Locked</span>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-normal">The absolute highest award for a Rover Scout in Bangladesh. Requires completion of all advanced badges and service milestones.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSubTab === 'group' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Official Group Resources</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => showToast('Redirecting to Notice Board... Please check the Notices tab.', 'success')} 
                      className="p-4 rounded-2xl border border-gray-100 hover:border-green-200 bg-white hover:bg-green-50/10 transition-all text-left flex flex-col gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-gray-900 uppercase">Notice Board</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Stay updated with news</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => showToast('Redirecting to Documents Hub... Please check the Documents tab.', 'success')} 
                      className="p-4 rounded-2xl border border-gray-100 hover:border-green-200 bg-white hover:bg-green-50/10 transition-all text-left flex flex-col gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-gray-900 uppercase">Documents</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Official Scout files</p>
                      </div>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100/50">
                    <div className="flex gap-3">
                      <BookOpen className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">Rover Scout Law & Promise</h4>
                        <p className="text-[10px] text-gray-500 leading-normal mt-1">
                          &quot;A Scout&apos;s honour is to be trusted. A Scout is loyal to the country and their values. A Scout&apos;s duty is to be useful and to help others...&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Logout Action Button */}
      <button 
        onClick={() => {
          signOut(auth);
          showToast('Signed out successfully! Have a good day.', 'success');
        }} 
        className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-red-600 hover:text-white bg-white hover:bg-red-600 border border-red-100 rounded-2xl transition-all shadow-md hover:shadow-red-100"
      >
        <LogOut className="w-4 h-4" /> Sign Out from Account
      </button>
    </div>
  );
}

function AdminDashboard({ userData, onLogout, showToast }: { userData: any; onLogout: () => void; showToast: (msg: string, type: 'success' | 'error') => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'events' | 'gallery' | 'slider' | 'achievements' | 'notices' | 'documents' | 'activity' | 'analytics' | 'settings' | 'blood'>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [time, setTime] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Blood Donors Firestore State
  const [donors, setDonors] = useState<any[]>([]);
  const [loadingDonors, setLoadingDonors] = useState(false);
  const [donorSearch, setDonorSearch] = useState('');
  const [donorFilterGroup, setDonorFilterGroup] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchDonors = async () => {
    setLoadingDonors(true);
    try {
      const q = query(collection(db, 'donors'));
      const querySnapshot = await getDocs(q);
      setDonors(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching donors:", err);
    } finally {
      setLoadingDonors(false);
    }
  };

  const handleDeleteDonor = async (id: string) => {
    if (confirm('Are you sure you want to delete this donor?')) {
      try {
        await deleteDoc(doc(db, 'donors', id));
        setDonors(prev => prev.filter(d => d.id !== id));
        showToast('Donor deleted successfully from database.', 'success');
      } catch (err) {
        console.error("Error deleting donor:", err);
        showToast('Failed to delete donor. Please check permissions.', 'error');
      }
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDonors();
  }, []);

  // Core CRM Interactive State
  const [members, setMembers] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_members');
      if (saved) return JSON.parse(saved);
    }
    return [
      { id: 'M001', name: 'Md. Alamin Hossain', role: 'Rover Scout Leader', status: 'Active', group: 'A+', phone: '01712-345678', email: 'alamin@rpi.edu.bd', date: '2022-01-15' },
      { id: 'M002', name: 'Sabbir Rahman', role: 'Rover Mate', status: 'Active', group: 'AB+', phone: '01823-456789', email: 'sabbir@rpi.edu.bd', date: '2023-03-20' },
      { id: 'M003', name: 'Mst. Mim Akter', role: 'Rover Mate', status: 'Active', group: 'O+', phone: '01912-987654', email: 'mim@rpi.edu.bd', date: '2023-05-14' },
      { id: 'M004', name: 'Rashedul Islam', role: 'Rover Scout', status: 'Pending', group: 'B+', phone: '01511-123456', email: 'rashed@rpi.edu.bd', date: '2024-02-10' },
      { id: 'M005', name: 'Abu Bakar Siddik', role: 'Rover Scout', status: 'Active', group: 'O-', phone: '01314-234567', email: 'bakar@rpi.edu.bd', date: '2023-11-01' },
      { id: 'M006', name: 'Taskia Parvin', role: 'Rover Scout', status: 'Suspended', group: 'A-', phone: '01618-998877', email: 'taskia@rpi.edu.bd', date: '2023-08-18' }
    ];
  });

  const [events, setEvents] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_events');
      if (saved) return JSON.parse(saved);
    }
    return [
      { id: 'E001', title: 'Rover Scout Annual Camp 2026', date: '2026-08-12', category: 'Camping', location: 'Dhaka National Camp', status: 'Upcoming', description: 'Annual camping and training events for scouts.' },
      { id: 'E002', title: 'World Blood Donor Day Seminar', date: '2026-06-14', category: 'Health', location: 'RPI Auditorium', status: 'Completed', description: 'Seminar with free blood group testing.' },
      { id: 'E003', title: 'Scouting Orientation Program', date: '2026-07-20', category: 'Orientation', location: 'Scout Den', status: 'Upcoming', description: 'Welcome session for the new batch.' }
    ];
  });

  const [gallery, setGallery] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_gallery');
      if (saved) return JSON.parse(saved);
    }
    return [
      { id: 'G001', name: 'Annual Campfire Lighting', date: '2026-01-10', url: 'https://picsum.photos/seed/campfire/600/400', category: 'Camping' },
      { id: 'G002', name: 'Blood Request Drive Team', date: '2026-03-15', url: 'https://picsum.photos/seed/blood/600/400', category: 'Service' },
      { id: 'G003', name: 'RPI Rover Group Batch 25', date: '2026-05-22', url: 'https://picsum.photos/seed/batch/600/400', category: 'Meeting' }
    ];
  });

  const [slider, setSlider] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_slider');
      if (saved) return JSON.parse(saved);
    }
    return [
      { id: 'S001', name: 'Scouting for Service Banner', order: 1, active: true, url: 'https://picsum.photos/seed/service_banner/1200/500' },
      { id: 'S002', name: 'Join Rover Scout Group Today', order: 2, active: true, url: 'https://picsum.photos/seed/join_banner/1200/500' }
    ];
  });

  const [achievements, setAchievements] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_achievements');
      if (saved) return JSON.parse(saved);
    }
    return [
      { id: 'A001', name: 'President Scout Award Winners 2025', date: '2025-12-10', category: 'National Award', desc: 'Received by 5 of our leading Rover Scouts.' },
      { id: 'A002', name: 'Best Service Team in Rajshahi District', date: '2026-02-05', category: 'District Award', desc: 'Given for excellence in healthcare and blood donor support.' }
    ];
  });

  const [notices, setNotices] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_notices');
      if (saved) return JSON.parse(saved);
    }
    return [
      { id: 'N001', title: 'Rover Scout Enrollment Application Form', date: '2026-07-01', pinned: true, status: 'Published', content: 'Applications are now invited for the intake of 2026 Rover Scouts.' },
      { id: 'N002', title: 'Urgent: Blood Request for Rajshahi Medical College', date: '2026-07-03', pinned: false, status: 'Published', content: 'O+ blood needed at CCU ward. Contact Rover Mate.' }
    ];
  });

  const [documents, setDocuments] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin_documents');
      if (saved) return JSON.parse(saved);
    }
    return [
      { id: 'D001', title: 'Rover Scout Constitution 2026', type: 'PDF', category: 'By-laws', downloads: 142 },
      { id: 'D002', title: 'Blood Donation Camp Enrollment Guideline', type: 'DOCX', category: 'Campaign', downloads: 88 }
    ];
  });

  // Bulk actions on Members
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [memberFilterGroup, setMemberFilterGroup] = useState('');
  const [memberFilterStatus, setMemberFilterStatus] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [memberSort, setMemberSort] = useState('name');
  const [memberPage, setMemberPage] = useState(1);

  // Events Calendar state
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [eventView, setEventView] = useState<'list' | 'calendar'>('list');
  const [eventFilterStatus, setEventFilterStatus] = useState('All');

  // Update localStorage when state changes
  useEffect(() => { localStorage.setItem('admin_members', JSON.stringify(members)); }, [members]);
  useEffect(() => { localStorage.setItem('admin_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('admin_gallery', JSON.stringify(gallery)); }, [gallery]);
  useEffect(() => { localStorage.setItem('admin_slider', JSON.stringify(slider)); }, [slider]);
  useEffect(() => { localStorage.setItem('admin_achievements', JSON.stringify(achievements)); }, [achievements]);
  useEffect(() => { localStorage.setItem('admin_notices', JSON.stringify(notices)); }, [notices]);
  useEffect(() => { localStorage.setItem('admin_documents', JSON.stringify(documents)); }, [documents]);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute global search results on render
  const globalResults = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    const results: any[] = [];
    
    members.forEach(m => {
      if (m.name.toLowerCase().includes(query) || m.role.toLowerCase().includes(query)) {
        results.push({ type: 'Member', title: m.name, sub: m.role, tab: 'members' });
      }
    });
    events.forEach(e => {
      if (e.title.toLowerCase().includes(query) || e.location.toLowerCase().includes(query)) {
        results.push({ type: 'Event', title: e.title, sub: e.date, tab: 'events' });
      }
    });
    notices.forEach(n => {
      if (n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query)) {
        results.push({ type: 'Notice', title: n.title, sub: n.date, tab: 'notices' });
      }
    });
    documents.forEach(d => {
      if (d.title.toLowerCase().includes(query) || d.category.toLowerCase().includes(query)) {
        results.push({ type: 'Document', title: d.title, sub: d.type, tab: 'documents' });
      }
    });

    return results;
  }, [searchQuery, members, events, notices, documents]);

  // Handle CRUD forms
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    if (showAddModal === 'member') {
      if (editingItem) {
        setMembers(members.map(m => m.id === editingItem.id ? { ...m, name: data.get('name'), role: data.get('role'), group: data.get('group'), phone: data.get('phone'), email: data.get('email'), status: data.get('status') } : m));
      } else {
        const newMember = {
          id: `M00${members.length + 1}`,
          name: data.get('name'),
          role: data.get('role'),
          group: data.get('group'),
          phone: data.get('phone'),
          email: data.get('email'),
          status: 'Active',
          date: new Date().toISOString().split('T')[0]
        };
        setMembers([...members, newMember]);
      }
    } else if (showAddModal === 'event') {
      if (editingItem) {
        setEvents(events.map(ev => ev.id === editingItem.id ? { ...ev, title: data.get('title'), date: data.get('date'), category: data.get('category'), location: data.get('location'), description: data.get('description'), status: data.get('status') } : ev));
      } else {
        const newEvent = {
          id: `E00${events.length + 1}`,
          title: data.get('title'),
          date: data.get('date'),
          category: data.get('category'),
          location: data.get('location'),
          description: data.get('description'),
          status: 'Upcoming'
        };
        setEvents([...events, newEvent]);
      }
    } else if (showAddModal === 'gallery') {
      const newImg = {
        id: `G00${gallery.length + 1}`,
        name: data.get('name'),
        date: new Date().toISOString().split('T')[0],
        url: data.get('url') || `https://picsum.photos/seed/${data.get('name')}/600/400`,
        category: data.get('category') || 'Scouting'
      };
      setGallery([...gallery, newImg]);
    } else if (showAddModal === 'notice') {
      if (editingItem) {
        setNotices(notices.map(n => n.id === editingItem.id ? { ...n, title: data.get('title'), content: data.get('content'), pinned: data.get('pinned') === 'true' } : n));
      } else {
        const newNotice = {
          id: `N00${notices.length + 1}`,
          title: data.get('title'),
          content: data.get('content'),
          pinned: data.get('pinned') === 'true',
          status: 'Published',
          date: new Date().toISOString().split('T')[0]
        };
        setNotices([...notices, newNotice]);
      }
    } else if (showAddModal === 'achievement') {
      const newAch = {
        id: `A00${achievements.length + 1}`,
        name: data.get('name'),
        category: data.get('category'),
        desc: data.get('desc'),
        date: new Date().toISOString().split('T')[0]
      };
      setAchievements([...achievements, newAch]);
    } else if (showAddModal === 'slider') {
      const newSlide = {
        id: `S00${slider.length + 1}`,
        name: data.get('name'),
        order: slider.length + 1,
        active: true,
        url: data.get('url') || 'https://picsum.photos/seed/custom/1200/500'
      };
      setSlider([...slider, newSlide]);
    } else if (showAddModal === 'document') {
      const newDoc = {
        id: `D00${documents.length + 1}`,
        title: data.get('title'),
        type: data.get('type'),
        category: data.get('category'),
        downloads: 0
      };
      setDocuments([...documents, newDoc]);
    } else if (showAddModal === 'donor') {
      const donorData = {
        name: data.get('name') as string,
        group: data.get('group') as string,
        location: data.get('location') as string,
        phone: data.get('phone') as string,
        department: data.get('department') as string,
        semester: data.get('semester') as string,
        shift: data.get('shift') as string,
        note: data.get('note') as string,
        lastDonateDate: data.get('lastDonateDate') as string,
      };
      if (editingItem) {
        updateDoc(doc(db, 'donors', editingItem.id), donorData)
          .then(() => {
            setDonors(prev => prev.map(d => d.id === editingItem.id ? { ...d, ...donorData } : d));
            showToast('Donor profile updated successfully in database.', 'success');
          })
          .catch(err => {
            console.error("Error updating donor:", err);
            showToast('Failed to update donor profile in Firestore.', 'error');
          });
      } else {
        addDoc(collection(db, 'donors'), donorData)
          .then((docRef) => {
            setDonors(prev => [...prev, { id: docRef.id, ...donorData }]);
            showToast('New donor added successfully to database.', 'success');
          })
          .catch(err => {
            console.error("Error adding donor:", err);
            showToast('Failed to add donor to Firestore.', 'error');
          });
      }
    }

    setShowAddModal(null);
    setEditingItem(null);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  // CSV Exporter (realistic download simulation)
  const handleExportCSV = (type: string) => {
    let headers = '';
    let rows = '';
    if (type === 'members') {
      headers = 'ID,Name,Role,Status,Blood Group,Phone,Email,Join Date\n';
      members.forEach(m => {
        rows += `"${m.id}","${m.name}","${m.role}","${m.status}","${m.group}","${m.phone}","${m.email}","${m.date}"\n`;
      });
    }
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter and Search for Members
  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.phone.includes(memberSearch) || m.email.toLowerCase().includes(memberSearch.toLowerCase());
    const matchesGroup = memberFilterGroup === '' || m.group === memberFilterGroup;
    const matchesStatus = memberFilterStatus === '' || m.status === memberFilterStatus;
    return matchesSearch && matchesGroup && matchesStatus;
  }).sort((a, b) => {
    if (memberSort === 'name') return a.name.localeCompare(b.name);
    if (memberSort === 'date') return b.date.localeCompare(a.date);
    if (memberSort === 'role') return a.role.localeCompare(b.role);
    return 0;
  });

  const paginatedMembers = filteredMembers.slice((memberPage - 1) * 5, memberPage * 5);
  const totalMemberPages = Math.ceil(filteredMembers.length / 5);

  return (
    <div className="w-full min-h-screen bg-slate-900 text-slate-100 flex overflow-hidden font-sans relative select-text">
      {/* 1. Left Sidebar Component */}
      <aside className={`bg-slate-950 border-r border-slate-800 transition-all duration-300 z-50 flex flex-col justify-between ${sidebarCollapsed ? 'w-16' : 'w-64'} ${mobileSidebarOpen ? 'translate-x-0 fixed inset-y-0 left-0' : 'max-md:-translate-x-full max-md:fixed max-md:inset-y-0 max-md:left-0'}`}>
        <div>
          {/* Logo Brand Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-extrabold flex-shrink-0 shadow-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-tight text-white leading-tight">RPI Rover Scout</span>
                  <span className="text-[10px] text-slate-400 font-mono">Organization CMS</span>
                </div>
              )}
            </div>
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden md:block text-slate-400 hover:text-white transition-colors">
              <ChevronLeft className={`w-5 h-5 transform transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
            <button onClick={() => setMobileSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Stats shortcut in Sidebar */}
          {!sidebarCollapsed && (
            <div className="p-3 mx-3 my-4 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs text-slate-300 font-medium">Status: Live/Healthy</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono font-bold">V4.0</span>
            </div>
          )}

          {/* Sidebar Navigation Items */}
          <nav className="p-3 space-y-6">
            <div>
              {!sidebarCollapsed && <p className="text-[10px] font-bold text-slate-500 px-3 mb-2 uppercase tracking-widest">Main Workspace</p>}
              <div className="space-y-1">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart },
                  { id: 'members', label: 'Members Directory', icon: Users },
                  { id: 'events', label: 'Events & Calendar', icon: Calendar },
                  { id: 'blood', label: 'Blood Donors', icon: Heart },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id as any); setMobileSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${activeTab === item.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/10' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                    {activeTab === item.id && !sidebarCollapsed && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-ping"></div>}
                  </button>
                ))}
              </div>
            </div>

            <div>
              {!sidebarCollapsed && <p className="text-[10px] font-bold text-slate-500 px-3 mb-2 uppercase tracking-widest">Media & Content</p>}
              <div className="space-y-1">
                {[
                  { id: 'gallery', label: 'Photo Gallery', icon: ImageIcon },
                  { id: 'slider', label: 'Hero Slider', icon: Sliders },
                  { id: 'achievements', label: 'Achievements', icon: Sparkles },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id as any); setMobileSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/10' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                ))}
              </div>
            </div>

            <div>
              {!sidebarCollapsed && <p className="text-[10px] font-bold text-slate-500 px-3 mb-2 uppercase tracking-widest">Resources & logs</p>}
              <div className="space-y-1">
                {[
                  { id: 'notices', label: 'Notices Board', icon: Bell },
                  { id: 'documents', label: 'Documents & Files', icon: FileText },
                  { id: 'activity', label: 'Recent Activity', icon: Activity },
                  { id: 'analytics', label: 'Metrics & Charts', icon: FileSpreadsheet },
                  { id: 'settings', label: 'Portal Settings', icon: Settings },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id as any); setMobileSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/10' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>

        {/* Admin profile & logout fixed at bottom */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3 p-2 bg-slate-900 rounded-xl mb-3 border border-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-red-900/40 text-red-400 flex items-center justify-center font-bold text-xs border border-red-700/50">
              AD
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white truncate">{userData?.fullName || 'Rover Admin'}</span>
                <span className="text-[10px] text-slate-500 truncate">{userData?.email || 'admin@rpi.edu.bd'}</span>
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white font-bold rounded-xl transition-all duration-200 text-xs shadow-md border border-red-900/30 hover:border-red-600"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!sidebarCollapsed && <span>Sign Out Panel</span>}
          </button>
        </div>
      </aside>

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden bg-slate-900">
        {/* Top Sticky Header */}
        <header className="sticky top-0 bg-slate-950/85 backdrop-blur-md border-b border-slate-800 p-4 z-40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileSidebarOpen(true)} className="md:hidden text-slate-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span>RPI Rover Scout</span>
                <span>/</span>
                <span className="capitalize text-red-400 font-semibold">{activeTab}</span>
              </div>
              <h1 className="text-lg font-black text-white tracking-tight uppercase">Admin Management Panel</h1>
            </div>
          </div>

          {/* DateTime Display in top nav */}
          <div className="hidden lg:flex items-center gap-4 bg-slate-900/60 py-1.5 px-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
              <Clock className="w-3.5 h-3.5 text-red-500" />
              <span>{time || '10:24:00'}</span>
            </div>
            <div className="w-px h-3 bg-slate-800"></div>
            <span className="text-xs font-semibold text-slate-400">{dateStr || 'Jul 4, 2026'}</span>
          </div>

          {/* Navigation Controls bar */}
          <div className="flex items-center gap-2">
            {/* Global Search Input */}
            <div className="relative max-w-xs hidden sm:block">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search everything..."
                className="bg-slate-900/80 text-white text-xs pl-9 pr-4 py-2 rounded-xl outline-none border border-slate-800 focus:border-red-600 transition-colors w-48 focus:w-60"
              />
              {/* Global search dropdown */}
              {globalResults.length > 0 && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-2 max-h-60 overflow-y-auto">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest px-2 py-1 border-b border-slate-800 mb-1">Search Results ({globalResults.length})</p>
                  {globalResults.map((res, i) => (
                    <button
                      key={i}
                      onClick={() => { setActiveTab(res.tab); setSearchQuery(''); }}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-900 flex justify-between items-center transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-white truncate">{res.title}</p>
                        <p className="text-[10px] text-slate-400">{res.sub}</p>
                      </div>
                      <span className="text-[9px] bg-slate-800 text-red-400 px-1.5 py-0.5 rounded uppercase font-mono">{res.type}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => window.location.reload()} className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors" title="Refresh UI data">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={toggleFullscreen} className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors" title="Toggle Fullscreen">
              <Maximize className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-white text-xs select-none">
              A
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-3 rounded-xl text-xs transition duration-200 shadow-md ml-1"
              title="Logout from Admin Workspace"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Dashboard Main Workspace Component */}
        <main className="p-6 space-y-8 flex-1 max-w-7xl w-full mx-auto">
          {/* A. OVERVIEW MODULE */}
          {activeTab === 'overview' && (
            <>
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold tracking-widest text-red-500 uppercase">Administrator Workspace</span>
                    <span className="bg-red-950 text-red-400 px-2 py-0.5 rounded-full text-[9px] font-bold">Authorized Access</span>
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Welcome Back, Rover Leader!</h2>
                  <p className="text-xs text-slate-400">Manage your organization rosters, emergency blood donor drives, gallery updates, and scout notice boards from one workspace.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowAddModal('member')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-red-600/10 transition-transform hover:-translate-y-0.5">
                    <Plus className="w-4 h-4" /> Add Rover Scout
                  </button>
                  <button onClick={() => setShowAddModal('notice')} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition-transform hover:-translate-y-0.5">
                    <Bell className="w-4 h-4" /> Publish Notice
                  </button>
                </div>
              </div>

              {/* 12 Metric Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Total Members', count: members.length, desc: 'Registered scouts', pct: '+14%', trend: 'up', color: 'border-l-4 border-l-blue-500', icon: Users, iconColor: 'text-blue-500' },
                  { title: 'Active Members', count: members.filter(m => m.status === 'Active').length, desc: 'Ready for deployment', pct: '+8%', trend: 'up', color: 'border-l-4 border-l-emerald-500', icon: FileCheck, iconColor: 'text-emerald-500' },
                  { title: 'Total Events', count: events.length, desc: 'Scout activities logged', pct: '+2', trend: 'up', color: 'border-l-4 border-l-red-500', icon: Calendar, iconColor: 'text-red-500' },
                  { title: 'Upcoming Events', count: events.filter(e => e.status === 'Upcoming').length, desc: 'In next 30 days', pct: 'Active', trend: 'neutral', color: 'border-l-4 border-l-amber-500', icon: Clock, iconColor: 'text-amber-500' },
                  { title: 'Gallery Images', count: gallery.length, desc: 'Published on portal', pct: '+5', trend: 'up', color: 'border-l-4 border-l-pink-500', icon: ImageIcon, iconColor: 'text-pink-500' },
                  { title: 'Achievements', count: achievements.length, desc: 'Scouting laurels', pct: '+1', trend: 'up', color: 'border-l-4 border-l-indigo-500', icon: Sparkles, iconColor: 'text-indigo-500' },
                  { title: 'Notices Pinned', count: notices.filter(n => n.pinned).length, desc: 'Featured notices', pct: 'Pinned', trend: 'neutral', color: 'border-l-4 border-l-orange-500', icon: Bell, iconColor: 'text-orange-500' },
                  { title: 'Total Documents', count: documents.length, desc: 'Public downloads', pct: 'Shared', trend: 'neutral', color: 'border-l-4 border-l-cyan-500', icon: FileText, iconColor: 'text-cyan-500' },
                  { title: 'Total Visitors', count: 1840, desc: 'Portal pageviews', pct: '+22.4%', trend: 'up', color: 'border-l-4 border-l-violet-500', icon: Globe, iconColor: 'text-violet-500' },
                  { title: 'New Registrations', count: members.filter(m => m.status === 'Pending').length, desc: 'Pending application audit', pct: 'Urgent', trend: 'down', color: 'border-l-4 border-l-rose-500', icon: UserCheck, iconColor: 'text-rose-500' },
                  { title: 'Pending Requests', count: 3, desc: 'Emergency Blood queries', pct: 'Needs Match', trend: 'neutral', color: 'border-l-4 border-l-teal-500', icon: Heart, iconColor: 'text-teal-500' },
                  { title: 'Website Status', count: 'Online', desc: 'CMS node healthy', pct: '100%', trend: 'up', color: 'border-l-4 border-l-green-500', icon: Database, iconColor: 'text-green-500' },
                ].map((card, idx) => (
                  <div key={idx} className={`bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md ${card.color} hover:border-slate-700 transition-all group`}>
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{card.title}</p>
                      <card.icon className={`w-5 h-5 ${card.iconColor} group-hover:scale-110 transition-transform`} />
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-black text-white font-mono tracking-tight">{card.count}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${card.trend === 'up' ? 'bg-emerald-950 text-emerald-400' : card.trend === 'down' ? 'bg-rose-950 text-rose-400' : 'bg-slate-800 text-slate-400'}`}>
                        {card.pct}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">{card.desc}</p>
                  </div>
                ))}
              </div>

              {/* Bento Grid layout with Quick Actions, Analytics and Activity Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side: Quick Actions Widget */}
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <div>
                    <h3 className="font-extrabold text-white flex items-center gap-2 text-sm uppercase tracking-wide"><Sliders className="w-4 h-4 text-red-500" /> Admin Quick Actions</h3>
                    <p className="text-[11px] text-slate-500">Run immediate administrative deployments</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Add Member', icon: Users, action: () => setShowAddModal('member'), color: 'hover:bg-blue-950 hover:text-blue-400 hover:border-blue-800' },
                      { label: 'Add Event', icon: Calendar, action: () => setShowAddModal('event'), color: 'hover:bg-red-950 hover:text-red-400 hover:border-red-800' },
                      { label: 'Upload Gallery', icon: ImageIcon, action: () => setShowAddModal('gallery'), color: 'hover:bg-pink-950 hover:text-pink-400 hover:border-pink-800' },
                      { label: 'Add Notice', icon: Bell, action: () => setShowAddModal('notice'), color: 'hover:bg-orange-950 hover:text-orange-400 hover:border-orange-800' },
                      { label: 'Add Achievement', icon: Sparkles, action: () => setShowAddModal('achievement'), color: 'hover:bg-indigo-950 hover:text-indigo-400 hover:border-indigo-800' },
                      { label: 'Add Hero Slide', icon: Sliders, action: () => setShowAddModal('slider'), color: 'hover:bg-violet-950 hover:text-violet-400 hover:border-violet-800' },
                      { label: 'Manage Doc', icon: FileText, action: () => setShowAddModal('document'), color: 'hover:bg-cyan-950 hover:text-cyan-400 hover:border-cyan-800' },
                      { label: 'Export Data', icon: Download, action: () => handleExportCSV('members'), color: 'hover:bg-emerald-950 hover:text-emerald-400 hover:border-emerald-800' }
                    ].map((item, idx) => (
                      <button key={idx} onClick={item.action} className={`p-4 bg-slate-900 border border-slate-800/80 rounded-2xl flex flex-col items-center gap-2 text-center transition-all ${item.color}`}>
                        <item.icon className="w-5 h-5 text-slate-400" />
                        <span className="text-[10px] font-bold">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Center Panel: Interactive Custom SVG Chart Analytics */}
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-extrabold text-white flex items-center gap-2 text-sm uppercase tracking-wide"><BarChart className="w-4 h-4 text-red-500" /> Member Growth & Visits</h3>
                      <span className="text-[9px] bg-red-950 text-red-400 px-2 py-0.5 rounded font-mono">Real-time</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Monthly tracking metrics for Rover portal</p>
                  </div>
                  {/* Custom beautifully stylized vector chart SVG representation */}
                  <div className="w-full h-44 bg-slate-900 rounded-2xl border border-slate-800 relative flex items-end p-4">
                    <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 50" preserveAspectRatio="none">
                      {/* Grid guidelines */}
                      <line x1="0" y1="10" x2="100" y2="10" stroke="#1e293b" strokeWidth="0.5" />
                      <line x1="0" y1="25" x2="100" y2="25" stroke="#1e293b" strokeWidth="0.5" />
                      <line x1="0" y1="40" x2="100" y2="40" stroke="#1e293b" strokeWidth="0.5" />
                      {/* Line chart paths (Visits - green) */}
                      <path d="M 0,45 Q 20,35 40,15 T 80,25 T 100,5" fill="none" stroke="#10b981" strokeWidth="1.5" />
                      {/* Bar charts (Members - red) */}
                      <rect x="5" y="30" width="4" height="20" fill="#ef4444" opacity="0.4" rx="1" />
                      <rect x="25" y="25" width="4" height="25" fill="#ef4444" opacity="0.4" rx="1" />
                      <rect x="45" y="15" width="4" height="35" fill="#ef4444" opacity="0.4" rx="1" />
                      <rect x="65" y="20" width="4" height="30" fill="#ef4444" opacity="0.4" rx="1" />
                      <rect x="85" y="8" width="4" height="42" fill="#ef4444" opacity="0.4" rx="1" />
                    </svg>
                    <div className="w-full flex justify-between text-[8px] text-slate-500 font-mono relative z-10">
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                      <span>Jul</span>
                    </div>
                  </div>
                  <div className="flex justify-around text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded bg-red-500/40"></div>
                      <span>Scout Registrations</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded bg-emerald-500"></div>
                      <span>Portal Traffic</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Recent Activity Audit Logs */}
                <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <div>
                    <h3 className="font-extrabold text-white flex items-center gap-2 text-sm uppercase tracking-wide"><Activity className="w-4 h-4 text-red-500" /> Audit Trail</h3>
                    <p className="text-[11px] text-slate-500">Latest administrative changes logged</p>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {[
                      { icon: Users, text: 'New Rover Registration: Abu Bakar Siddik', time: '12 mins ago', type: 'Member' },
                      { icon: Bell, text: 'Notice published: Rover Scout Enrollment Form', time: '1 hour ago', type: 'Notice' },
                      { icon: ImageIcon, text: 'Gallery upload: RPI Rover Group Photo', time: '4 hours ago', type: 'Gallery' },
                      { icon: FileText, text: 'Document uploaded: Scout Constitution PDF', time: '1 day ago', type: 'Document' }
                    ].map((act, i) => (
                      <div key={i} className="flex gap-3 items-start p-2 bg-slate-900 rounded-xl border border-slate-800/60 hover:bg-slate-900/90 transition-colors">
                        <div className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <act.icon className="w-4 h-4 text-red-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-200 leading-snug truncate">{act.text}</p>
                          <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-mono mt-0.5">
                            <span>{act.time}</span>
                            <span>•</span>
                            <span className="text-red-500">{act.type}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* B. MEMBERS DIRECTORY MODULE */}
          {activeTab === 'members' && (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">Rover Scout Roster</h2>
                  <p className="text-xs text-slate-400">Manage all registered members, blood groups, status logs, and enrollment credentials.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleExportCSV('members')} className="bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-2 border border-slate-700">
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                  <button onClick={() => setShowAddModal('member')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-2 shadow-lg">
                    <Plus className="w-4 h-4" /> Add Rover Scout
                  </button>
                </div>
              </div>

              {/* Filtering & Search Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-850">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={e => setMemberSearch(e.target.value)}
                    placeholder="Search name, phone, email..."
                    className="w-full bg-slate-950 text-slate-200 text-xs pl-9 pr-3 py-2 rounded-xl outline-none border border-slate-800 focus:border-red-600"
                  />
                </div>
                <select value={memberFilterGroup} onChange={e => setMemberFilterGroup(e.target.value)} className="bg-slate-950 text-slate-200 text-xs p-2 rounded-xl outline-none border border-slate-800">
                  <option value="">All Blood Groups</option>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <select value={memberFilterStatus} onChange={e => setMemberFilterStatus(e.target.value)} className="bg-slate-950 text-slate-200 text-xs p-2 rounded-xl outline-none border border-slate-800">
                  <option value="">All Statuses</option>
                  {['Active', 'Pending', 'Suspended'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={memberSort} onChange={e => setMemberSort(e.target.value)} className="bg-slate-950 text-slate-200 text-xs p-2 rounded-xl outline-none border border-slate-800">
                  <option value="name">Sort by Name</option>
                  <option value="date">Sort by Join Date</option>
                  <option value="role">Sort by Designation</option>
                </select>
              </div>

              {/* Roster Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/80 text-slate-400 font-mono text-[10px] uppercase tracking-wider border-b border-slate-800">
                      <th className="p-4 w-12 text-center">ID</th>
                      <th className="p-4">Name & Designation</th>
                      <th className="p-4 text-center">Blood Group</th>
                      <th className="p-4">Contact Details</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {paginatedMembers.map(m => (
                      <tr key={m.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-4 text-center font-mono text-xs text-slate-400">{m.id}</td>
                        <td className="p-4">
                          <p className="font-bold text-white text-sm">{m.name}</p>
                          <p className="text-[10px] text-slate-400">{m.role}</p>
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-block px-2 py-1 bg-red-950 text-red-400 rounded-lg text-xs font-extrabold font-mono border border-red-900/50">
                            {m.group}
                          </span>
                        </td>
                        <td className="p-4 text-xs space-y-0.5">
                          <p className="text-slate-200 flex items-center gap-1.5 font-mono"><Phone className="w-3 h-3 text-slate-500" /> {m.phone}</p>
                          <p className="text-slate-400 flex items-center gap-1.5 font-mono"><Mail className="w-3 h-3 text-slate-500" /> {m.email}</p>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${m.status === 'Active' ? 'bg-emerald-950 text-emerald-400' : m.status === 'Pending' ? 'bg-amber-950 text-amber-400' : 'bg-rose-950 text-rose-400'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${m.status === 'Active' ? 'bg-emerald-500' : m.status === 'Pending' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`}></div>
                            {m.status}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => { setEditingItem(m); setShowAddModal('member'); }} className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => { if (confirm('Are you sure you want to delete this member?')) setMembers(members.filter(x => x.id !== m.id)); }} className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-600 hover:text-white text-red-400 transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginatedMembers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">No matching members found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              {totalMemberPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <span className="text-xs text-slate-400">Showing page {memberPage} of {totalMemberPages}</span>
                  <div className="flex gap-1.5">
                    <button disabled={memberPage === 1} onClick={() => setMemberPage(p => p - 1)} className="px-3 py-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none rounded-xl text-xs font-bold text-white border border-slate-800">Previous</button>
                    <button disabled={memberPage === totalMemberPages} onClick={() => setMemberPage(p => p + 1)} className="px-3 py-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none rounded-xl text-xs font-bold text-white border border-slate-800">Next</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* C. EVENTS MODULE */}
          {activeTab === 'events' && (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">Event Calendars & Logs</h2>
                  <p className="text-xs text-slate-400">Plan orientations, campings, service projects, and district level scout rallies.</p>
                </div>
                <div className="flex gap-2">
                  <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex">
                    <button onClick={() => setEventView('list')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${eventView === 'list' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>List</button>
                    <button onClick={() => setEventView('calendar')} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${eventView === 'calendar' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Calendar</button>
                  </div>
                  <button onClick={() => setShowAddModal('event')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-2 shadow-lg">
                    <Plus className="w-4 h-4" /> Add Event
                  </button>
                </div>
              </div>

              {eventView === 'list' ? (
                <div className="space-y-3">
                  {events.map(ev => (
                    <div key={ev.id} className="p-4 bg-slate-900 border border-slate-800/80 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-slate-750 transition-all">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] bg-slate-800 text-red-400 font-mono font-bold px-2 py-0.5 rounded uppercase">{ev.category}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ev.status === 'Upcoming' ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-850 text-slate-400'}`}>{ev.status}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{ev.title}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 font-mono mt-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {ev.location} | <Calendar className="w-3.5 h-3.5 text-slate-500" /> {ev.date}</p>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{ev.description}</p>
                      </div>
                      <div className="flex gap-2 self-end sm:self-center">
                        <button onClick={() => { setEditingItem(ev); setShowAddModal('event'); }} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
                        <button onClick={() => setEvents([...events, { ...ev, id: `E00${events.length + 1}`, title: ev.title + ' (Copy)' }])} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1">Duplicate</button>
                        <button onClick={() => setEvents(events.filter(x => x.id !== ev.id))} className="p-2 rounded-xl bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white transition-colors text-xs flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl">
                  {/* Styled month banner */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-extrabold text-white text-sm">July 2026</h3>
                    <div className="flex gap-1.5">
                      <button className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300"><ChevronLeft className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                  {/* Styled simplified calendar days mapping */}
                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono font-bold text-slate-500 mb-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => <div key={i} className="py-1">{day}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 31 }).map((_, i) => {
                      const dayNo = i + 1;
                      const hasEvent = events.some(e => e.date === `2026-07-${dayNo < 10 ? '0' + dayNo : dayNo}`);
                      return (
                        <div key={i} className={`p-3 rounded-xl border flex flex-col justify-between items-center h-16 ${hasEvent ? 'bg-red-950/20 border-red-800' : 'bg-slate-950 border-slate-850'}`}>
                          <span className="font-mono font-bold text-xs text-slate-300">{dayNo}</span>
                          {hasEvent && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* D. PHOTO GALLERY MODULE */}
          {activeTab === 'gallery' && (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">Photo Archives & Media</h2>
                  <p className="text-xs text-slate-400">Post and update historical scouting memories, campfires, and community services.</p>
                </div>
                <button onClick={() => setShowAddModal('gallery')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-2 shadow-lg">
                  <Upload className="w-4 h-4" /> Upload Photo
                </button>
              </div>

              {/* Drag and Drop Zone Area Mock */}
              <div className="border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center hover:border-red-600 transition-colors bg-slate-900/40 select-none">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-3 border border-slate-800">
                  <Upload className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-xs font-bold text-white">Drag and drop images here or <span className="text-red-500 underline cursor-pointer" onClick={() => setShowAddModal('gallery')}>browse</span></p>
                <p className="text-[10px] text-slate-500 mt-1">Supports PNG, JPG, GIF up to 5MB. Multi-upload enabled.</p>
              </div>

              {/* Masonry-style Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {gallery.map(img => (
                  <div key={img.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-md group relative">
                    <img src={img.url} alt={img.name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="p-4">
                      <p className="text-[10px] bg-slate-800 text-red-400 font-mono font-bold px-2 py-0.5 rounded inline-block mb-1">{img.category}</p>
                      <h4 className="text-xs font-bold text-white leading-tight truncate">{img.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">Uploaded on: {img.date}</p>
                      <button onClick={() => setGallery(gallery.filter(x => x.id !== img.id))} className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950/80 hover:bg-red-600 hover:text-white text-red-400 transition-colors shadow">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* E. HERO SLIDER */}
          {activeTab === 'slider' && (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">Homepage Hero Slides</h2>
                  <p className="text-xs text-slate-400">Design the sliders displayed on the front screen of the public portal.</p>
                </div>
                <button onClick={() => setShowAddModal('slider')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Slide
                </button>
              </div>

              <div className="space-y-4">
                {slider.map((slide, i) => (
                  <div key={slide.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
                    <img src={slide.url} alt={slide.name} className="w-full md:w-48 h-24 object-cover rounded-xl border border-slate-800" />
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="text-sm font-bold text-white">{slide.name}</h4>
                      <p className="text-xs text-slate-500 font-mono mt-1">Publish sequence: {slide.order}</p>
                      <div className="flex gap-2 mt-3 justify-center md:justify-start">
                        <button
                          onClick={() => setSlider(slider.map(s => s.id === slide.id ? { ...s, active: !s.active } : s))}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${slide.active ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-slate-950 text-slate-500 border-slate-850'}`}
                        >
                          {slide.active ? 'Active' : 'Disabled'}
                        </button>
                        <button
                          onClick={() => {
                            if (i > 0) {
                              const newSlider = [...slider];
                              // Swap orders
                              const temp = newSlider[i].order;
                              newSlider[i].order = newSlider[i-1].order;
                              newSlider[i-1].order = temp;
                              setSlider(newSlider.sort((a,b) => a.order - b.order));
                            }
                          }}
                          disabled={i === 0}
                          className="px-2 py-1 bg-slate-950 rounded border border-slate-800 disabled:opacity-50 text-xs text-slate-300"
                        >
                          Move Up
                        </button>
                        <button onClick={() => setSlider(slider.filter(x => x.id !== slide.id))} className="px-3 py-1.5 bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white text-xs font-bold rounded-xl border border-red-900/30 transition-colors">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* F. ACHIEVEMENTS */}
          {activeTab === 'achievements' && (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">Rover Achievements List</h2>
                  <p className="text-xs text-slate-400">Highlight district and national level scout rankings, awards, and certifications.</p>
                </div>
                <button onClick={() => setShowAddModal('achievement')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Achievement
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map(ach => (
                  <div key={ach.id} className="bg-slate-900 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-750 transition-colors relative">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] bg-red-950 text-red-400 font-mono font-bold px-2 py-0.5 rounded">{ach.category}</span>
                        <span className="text-[9px] text-slate-500 font-mono">{ach.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{ach.name}</h4>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{ach.desc}</p>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button onClick={() => setAchievements(achievements.filter(x => x.id !== ach.id))} className="text-xs text-red-400 hover:text-red-500">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* G. NOTICES PANEL */}
          {activeTab === 'notices' && (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">Public Notice Boards</h2>
                  <p className="text-xs text-slate-400">Post announcements, registrations guidelines, and urgent scouts convocations.</p>
                </div>
                <button onClick={() => setShowAddModal('notice')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Post Notice
                </button>
              </div>

              <div className="space-y-4">
                {notices.map(n => (
                  <div key={n.id} className="bg-slate-900 border border-slate-850 rounded-2xl p-5 hover:border-slate-750 transition-colors relative">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        {n.pinned && <span className="bg-red-950 text-red-400 border border-red-900/50 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">★ PINNED</span>}
                        <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => { setEditingItem(n); setShowAddModal('notice'); }} className="text-xs text-slate-300 hover:text-white">Edit</button>
                        <span className="text-slate-600">|</span>
                        <button onClick={() => setNotices(notices.filter(x => x.id !== n.id))} className="text-xs text-red-400 hover:text-red-500">Delete</button>
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-white">{n.title}</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* H. DOCUMENTS LIBRARY */}
          {activeTab === 'documents' && (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">Resources Library</h2>
                  <p className="text-xs text-slate-400">Upload forms, scout templates, training material PDFs, and circulars.</p>
                </div>
                <button onClick={() => setShowAddModal('document')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Upload Document
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map(doc => (
                  <div key={doc.id} className="p-4 bg-slate-900 border border-slate-850 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-red-500 font-mono font-bold text-xs border border-slate-800">
                        {doc.type}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{doc.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{doc.category} • {doc.downloads} downloads</p>
                      </div>
                    </div>
                    <button onClick={() => setDocuments(documents.filter(x => x.id !== doc.id))} className="text-slate-500 hover:text-red-400 p-1 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* I. AUDIT LOGS */}
          {activeTab === 'activity' && (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
              <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">System Audit logs & Activity</h2>
              <p className="text-xs text-slate-400">Trace logins, registrations edits, and resource additions.</p>
              <div className="space-y-2">
                {[
                  { desc: 'Admin code verified and session granted.', actor: 'System Node', ip: '103.114.172.54', time: 'Jul 4, 10:23' },
                  { desc: 'Scout roster exported in CSV spreadsheet.', actor: 'Leader Admin', ip: '103.114.172.54', time: 'Jul 4, 10:18' },
                  { desc: 'Added new member: Mst. Mim Akter (M003)', actor: 'Leader Admin', ip: '103.114.172.54', time: 'Jul 3, 14:22' }
                ].map((log, i) => (
                  <div key={i} className="p-3 bg-slate-900 border border-slate-850 rounded-xl flex items-center justify-between text-xs gap-3">
                    <div>
                      <p className="text-slate-200 font-semibold">{log.desc}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Executed by: {log.actor} ({log.ip})</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* J. METRICS & CHARTS */}
          {activeTab === 'analytics' && (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
              <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">CMS Analytics Center</h2>
              <p className="text-xs text-slate-400">Analyze page view demographics, monthly user joins, and blood requests.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-3">Donor Registrations</h4>
                  <div className="w-full h-40 flex items-end gap-3 px-4">
                    {[35, 55, 45, 80, 65, 95].map((val, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-red-600 rounded-t-lg transition-all duration-500" style={{ height: `${val}%` }}></div>
                        <span className="text-[9px] text-slate-500 font-mono">B{i+1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-3">Event Sign-Ups</h4>
                  <div className="w-full h-40 flex items-end gap-3 px-4">
                    {[50, 40, 70, 60, 85, 90].map((val, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-blue-600 rounded-t-lg transition-all duration-500" style={{ height: `${val}%` }}></div>
                        <span className="text-[9px] text-slate-500 font-mono">Camp {i+1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* K. PORTAL SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight uppercase">Scout Portal Settings</h2>
                <p className="text-xs text-slate-400">Modify layout themes, contact details, organization details, and homepage layouts.</p>
              </div>

              <form onSubmit={e => { e.preventDefault(); alert('Portal settings updated successfully.'); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Organization Name</label>
                    <input type="text" defaultValue="Rajshahi Polytechnic Institute Rover Scout Group" className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Phone</label>
                    <input type="text" defaultValue="01712-345678" className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  </div>
                  <div className="space-y-1.5 col-span-1 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address Location</label>
                    <input type="text" defaultValue="Rajshahi Polytechnic Campus, Rajshahi 6200" className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  </div>
                </div>
                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs">Save Portal Config</button>
              </form>
            </div>
          )}

          {/* L. BLOOD DONORS CONTROL */}
          {activeTab === 'blood' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight uppercase flex items-center gap-2">
                    <Heart className="w-6 h-6 text-red-500 fill-red-500/20 animate-pulse" />
                    Blood Donors Management
                  </h2>
                  <p className="text-xs text-slate-400">Add, edit, delete, and control voluntary blood donors displayed on the main Blood Page.</p>
                </div>
                <button
                  onClick={() => { setEditingItem(null); setShowAddModal('donor'); }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/15"
                >
                  <Plus className="w-4 h-4" /> Add Donor
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search donor..."
                      className="w-full p-2.5 pl-10 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-600"
                      value={donorSearch}
                      onChange={e => setDonorSearch(e.target.value)}
                    />
                  </div>
                  <button onClick={() => setShowFilters(!showFilters)} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white"><Filter className="w-4 h-4" /></button>
                </div>
                {showFilters && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => setDonorFilterGroup('available')} className={`px-4 py-2 rounded-xl text-xs font-bold ${donorFilterGroup === 'available' ? 'bg-green-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Available</button>
                    <button onClick={() => setDonorFilterGroup('non-available')} className={`px-4 py-2 rounded-xl text-xs font-bold ${donorFilterGroup === 'non-available' ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Non-Available</button>
                    <button onClick={() => setDonorFilterGroup('')} className={`px-4 py-2 rounded-xl text-xs font-bold ${donorFilterGroup === '' ? 'bg-slate-700 text-white' : 'bg-slate-900 text-slate-400'}`}>All</button>
                  </div>
                )}
              </div>

              {/* Donor Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                {loadingDonors ? (
                  <div className="p-12 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-red-500" />
                    <span>Loading blood donors database...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-850 bg-slate-900/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="p-4">Donor Name</th>
                          <th className="p-4">Blood Group</th>
                          <th className="p-4">Location</th>
                          <th className="p-4">Phone Number</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donors
                          .filter(d => 
                             (((d.name || '').toLowerCase().includes(donorSearch.toLowerCase()) || 
                              (d.location || '').toLowerCase().includes(donorSearch.toLowerCase()) ||
                              (d.phone || '').includes(donorSearch)) &&
                             (donorFilterGroup === '' || 
                              (donorFilterGroup === 'available' && isAvailable(d.lastDonateDate)) || 
                              (donorFilterGroup === 'non-available' && !isAvailable(d.lastDonateDate))))
                          )
                          .map(donor => (
                            <tr key={donor.id} className="border-b border-slate-850 hover:bg-slate-900/30 transition-colors">
                              <td className="p-4">
                                <div className="font-bold text-white text-xs">{donor.name}</div>
                                <div className="text-[10px] text-slate-500">{donor.department}, Sem:{donor.semester}</div>
                              </td>
                              <td className="p-4 text-center">
                                <span className="font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-lg text-[10px]">
                                  {donor.group}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                {isAvailable(donor.lastDonateDate) ? (
                                  <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-lg">Available</span>
                                ) : (
                                  <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-lg">Non-Available</span>
                                )}
                              </td>
                              <td className="p-4 text-xs text-slate-300">{donor.location}</td>
                              <td className="p-4 text-xs font-mono text-slate-300">{donor.phone}</td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => { setEditingItem(donor); setShowAddModal('donor'); }}
                                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                                    title="Edit Donor"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDonor(donor.id)}
                                    className="p-1.5 hover:bg-red-950/40 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                                    title="Delete Donor"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        {donors.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-500 text-xs">
                              No blood donors found in database. Add a new donor to get started!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. CRUD Add / Edit Modals */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[999]">
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl w-full max-w-md space-y-4 shadow-2xl relative">
            <button onClick={() => { setShowAddModal(null); setEditingItem(null); }} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-extrabold text-white text-base uppercase tracking-tight">
              {editingItem ? 'Edit Item' : 'Add New Entry'} - {showAddModal}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              {showAddModal === 'donor' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Donor Name</label>
                    <input type="text" name="name" required defaultValue={editingItem?.name || ''} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Blood Group</label>
                        <select name="group" required defaultValue={editingItem?.group || 'O+'} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600">
                          {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Last Donation Date</label>
                        <input type="date" name="lastDonateDate" required defaultValue={editingItem?.lastDonateDate || ''} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600" />
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Department</label>
                        <input type="text" name="department" defaultValue={editingItem?.department || ''} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Semester</label>
                        <input type="text" name="semester" defaultValue={editingItem?.semester || ''} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Shift</label>
                        <input type="text" name="shift" defaultValue={editingItem?.shift || ''} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Phone</label>
                        <input type="text" name="phone" required defaultValue={editingItem?.phone || ''} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Location / Address</label>
                    <input type="text" name="location" required defaultValue={editingItem?.location || ''} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Note</label>
                    <textarea name="note" defaultValue={editingItem?.note || ''} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-600 h-20" />
                  </div>
                </>
              )}

              {showAddModal === 'member' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Member Name</label>
                    <input type="text" name="name" required defaultValue={editingItem?.name || ''} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Designation</label>
                    <input type="text" name="role" required defaultValue={editingItem?.role || ''} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Blood Group</label>
                      <select name="group" required defaultValue={editingItem?.group || 'O+'} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Status</label>
                      <select name="status" required defaultValue={editingItem?.status || 'Active'} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
                        {['Active', 'Pending', 'Suspended'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Phone Number</label>
                    <input type="text" name="phone" required defaultValue={editingItem?.phone || ''} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Email Address</label>
                    <input type="email" name="email" required defaultValue={editingItem?.email || ''} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  </div>
                </>
              )}

              {showAddModal === 'event' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Event Title</label>
                    <input type="text" name="title" required defaultValue={editingItem?.title || ''} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Event Date</label>
                    <input type="date" name="date" required defaultValue={editingItem?.date || ''} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Category</label>
                    <input type="text" name="category" required defaultValue={editingItem?.category || 'Camping'} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Location</label>
                    <input type="text" name="location" required defaultValue={editingItem?.location || ''} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Description</label>
                    <textarea name="description" required defaultValue={editingItem?.description || ''} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white h-20" />
                  </div>
                </>
              )}

              {showAddModal === 'gallery' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Photo Name</label>
                    <input type="text" name="name" required className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Category</label>
                    <input type="text" name="category" placeholder="Scouting, Camping, Blood Service" className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Photo URL (Optional)</label>
                    <input type="url" name="url" placeholder="https://picsum.photos/..." className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  </div>
                </>
              )}

              {showAddModal === 'slider' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Slider Banner Title</label>
                    <input type="text" name="name" required className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Banner Image URL (Optional)</label>
                    <input type="url" name="url" placeholder="https://..." className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  </div>
                </>
              )}

              {showAddModal === 'achievement' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Achievement Award Name</label>
                    <input type="text" name="name" required className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Category</label>
                    <input type="text" name="category" required placeholder="District level, National level" className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Brief Description</label>
                    <textarea name="desc" required className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white h-20" />
                  </div>
                </>
              )}

              {showAddModal === 'notice' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Notice Title</label>
                    <input type="text" name="title" required defaultValue={editingItem?.title || ''} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Notice Content</label>
                    <textarea name="content" required defaultValue={editingItem?.content || ''} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white h-28" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Pin to Top?</label>
                    <select name="pinned" defaultValue={editingItem?.pinned ? 'true' : 'false'} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                </>
              )}

              {showAddModal === 'document' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Document Circular Title</label>
                    <input type="text" name="title" required className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Format</label>
                      <select name="type" required className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
                        <option value="PDF">PDF</option>
                        <option value="DOCX">DOCX</option>
                        <option value="XLSX">XLSX</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Category</label>
                      <input type="text" name="category" required placeholder="Constitution, Circular" className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                    </div>
                  </div>
                </>
              )}

              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-lg">
                Submit Deploy Form
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
