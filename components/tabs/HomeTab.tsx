'use client';
import { useState, useEffect } from 'react';
import * as motion from 'motion/react-client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { 
  Users, 
  Award, 
  Camera, 
  PhoneCall, 
  Mail, 
  Compass, 
  Heart, 
  Sparkles, 
  CheckCircle, 
  X, 
  Bell, 
  ShieldCheck, 
  Activity, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  Target,
  Eye,
  Calendar,
  Layers
} from 'lucide-react';

const carouselImages = [
  {
    src: "https://picsum.photos/seed/scout_camp_moot/1200/500",
    title: "বার্ষিক স্কাউট ও হাইকিং ক্যাম্প",
    tag: "ক্যাম্পিং ও অ্যাডভেঞ্চার"
  },
  {
    src: "https://picsum.photos/seed/scout_training_camp/1200/500",
    title: "নেতৃত্ব ও দক্ষতা উন্নয়নমূলক ক্রু মিটিং",
    tag: "প্রশিক্ষণ ও নেতৃত্ব"
  },
  {
    src: "https://picsum.photos/seed/scout_tree_camp/1200/500",
    title: "ক্যাম্পাস প্রাঙ্গণে স্কাউট বৃক্ষরোপণ কর্মসূচি",
    tag: "পরিবেশ ও সবুজায়ন"
  }
];

const GALLERY_PHOTOS = [
  {
    id: 1,
    title: 'বার্ষিক রোভার মুট ও হাইকিং অভিযান',
    category: 'camping',
    image: 'https://picsum.photos/seed/rpirsg_moot/1024/768',
    description: 'রাজশাহী জেলা ও আঞ্চলিক রোভার মুটে আরপিআই রোভার দলের গৌরবময় অভিযান ও সেরা দল হিসেবে প্রতিনিধিত্ব।'
  },
  {
    id: 2,
    title: 'সমাজসেবা ও জনসচেতনতামূলক কার্যক্রম',
    category: 'service',
    image: 'https://picsum.photos/seed/rpirsg_social/1024/768',
    description: 'ডেঙ্গু প্রতিরোধ ও ট্রাফিক কন্ট্রোলে আরপিআই স্কাউট গ্রুপের রোভারদের জনসচেতনতামূলক ভূমিকা।'
  },
  {
    id: 3,
    title: 'দুর্যোগে ত্রাণ বিতরণ ও কম্বল সাহায্য',
    category: 'service',
    image: 'https://picsum.photos/seed/rpirsg_service/1024/768',
    description: 'শীতার্ত ও বন্যাদুর্গত ছিন্নমূল দরিদ্র মানুষের মাঝে শীতবস্ত্র ও খাদ্য সামগ্রী বিতরণ সেশন।'
  },
  {
    id: 4,
    title: 'নেতৃত্ব ও দক্ষতা উন্নয়নমূলক ক্রু মিটিং',
    category: 'training',
    image: 'https://picsum.photos/seed/rpirsg_training/1024/768',
    description: 'রোভারদের নিয়মতান্ত্রিক ড্রিল সেশন, গতিবিধি ও নেতৃত্বের প্রশিক্ষণমূলক ক্রু মিটিং।'
  },
  {
    id: 5,
    title: 'তাঁবু কলা ও পাইওনিয়ারিং ক্যাম্পিং',
    category: 'camping',
    image: 'https://picsum.photos/seed/rpirsg_camp/1024/768',
    description: 'স্কাউটিং নিয়মে নিজেদের স্বাবলম্বী করতে শেখা তাঁবু সাজানো ও ল্যাশিং প্র্যাকটিস।'
  },
  {
    id: 6,
    title: 'গ্রীন ক্যাম্পাস গড়তে বৃক্ষরোপণ অভিযান',
    category: 'service',
    image: 'https://picsum.photos/seed/rpirsg_plantation/1024/768',
    description: 'পরিবেশের ভারসাম্য রক্ষায় রাজশাহী পলিটেকনিক ক্যাম্পাস প্রাঙ্গণে স্কাউট বৃক্ষরোপণ কর্মসূচি।'
  }
];

export default function HomeTab() {
  const [index, setIndex] = useState(0);
  const [adminNotice, setAdminNotice] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'camping' | 'service' | 'training'>('all');
  const [selectedImg, setSelectedImg] = useState<any | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);


  // Load real-time Global Notice from Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global_config'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.adminNotice) {
          setAdminNotice(data.adminNotice);
        }
      }
    }, (error) => {
      console.warn("Global Notice loading bypassed (unconfigured Firestore):", error);
    });
    return () => unsub();
  }, []);

  // Carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="paper-texture min-h-screen pb-24 font-sans relative">
      {/* Background Subtle Grid Accent for Paper Texture feel */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(230,222,201,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(230,222,201,0.15)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-60"></div>

      {/* Hero Banner Carousel Section */}
      <div className="relative h-44 sm:h-52 w-full overflow-hidden shadow-md mt-1 border-b border-[#E6DEC9]">
        <motion.div 
          className="flex h-full" 
          animate={{ x: `-${index * 100}%` }} 
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {carouselImages.map((img, i) => (
            <div key={i} className="w-full h-full relative flex-shrink-0">
              <img 
                src={img.src} 
                className="w-full h-full object-cover" 
                alt={img.title} 
                referrerPolicy="no-referrer" 
              />
              {/* Dark Overlay for Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              {/* Overlay Content */}
              <div className="absolute bottom-3 left-4 right-4 text-left text-white space-y-0.5">
                <span className="inline-block bg-[#C1121F] text-white text-[7.5px] uppercase font-bold px-2 py-0.5 rounded tracking-widest border border-red-500">
                  {img.tag}
                </span>
                <h2 className="text-[11.5px] sm:text-xs font-black text-white leading-tight filter drop-shadow-md">
                  {img.title}
                </h2>
                <p className="text-[8px] text-gray-200 font-medium">রাজশাহী পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপ</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Carousel Prev/Next Buttons */}
        <button 
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/65 text-white p-1 rounded-full cursor-pointer transition-colors"
          title="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/65 text-white p-1 rounded-full cursor-pointer transition-colors"
          title="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Indicator dots */}
        <div className="absolute bottom-2 right-4 flex gap-1 z-10">
          {carouselImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${index === i ? 'bg-[#C1121F] w-3' : 'bg-white/60'}`}
              title={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="relative p-4 sm:p-5 space-y-8 max-w-xl mx-auto z-10">

        {/* Featured Educational & Historical Articles Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-1.5 border-b pb-2 border-[#E6DEC9]">
            <Compass className="w-4 h-4 text-[#C1121F] animate-spin-slow" />
            <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-wide">আমাদের ইতিহাস ও সেবামূলক আর্টিকেল সমূহ</h3>
          </div>

          {/* Article 1: History */}
          <article className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E6DEC9] space-y-3.5 shadow-xs transition-all hover:shadow-md relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#E6DEC9]/10 rounded-full"></div>
            <div className="flex items-center gap-2">
              <span className="text-[7.5px] font-black text-white bg-[#C1121F] px-2 py-0.5 rounded uppercase tracking-wider">
                ঐতিহাসিক প্রবন্ধ
              </span>
              <span className="text-[7.5px] font-bold text-gray-500 font-mono">
                প্রকাশকাল: জুন ২০২৬
              </span>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-[12px] sm:text-xs font-black text-gray-950 leading-tight">
                আরপিআই রোভার স্কাউট গ্রুপের ঐতিহাসিক পদযাত্রা ও নেতৃত্ব বিকাশের এক গৌরবময় ঐতিহ্য
              </h4>
              <p className="text-[7.5px] font-bold text-gray-400 font-mono">
                রচনায়: রাজশাহী পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপ সম্পাদনা পরিষদ
              </p>
            </div>

            <p className="text-[9.5px] text-gray-700 leading-relaxed text-justify">
              রাজশাহী পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপ কেবল একটি ঐতিহ্যবাহী সংগঠনই নয়, বরং উত্তরবঙ্গের কারিগরি শিক্ষার্থীদের মাঝে মানবিক মূল্যবোধ ও আত্মনির্ভরশীল চরিত্রের বিকাশ ঘটানোর একটি অন্যতম সেরা বিদ্যাপীঠ। প্রতিষ্ঠার পর থেকেই এই গ্রুপটি স্কাউট আন্দোলনের মূলমন্ত্র &ldquo;সেবা&rdquo; কে বুকে ধারণ করে এগিয়ে চলেছে। 
            </p>

            <p className="text-[9.5px] text-gray-750 leading-relaxed text-justify">
              পলিটেকনিকের তরুণ শিক্ষার্থীদের সুপ্ত প্রতিভা বিকাশ, নিয়মতান্ত্রিক প্রশিক্ষণ, ক্যাম্পিং ও হাইকিংয়ের মাধ্যমে তাদেরকে প্রতিকূল পরিবেশ মোকাবিলা করার শিক্ষা দেওয়া হয়। এখান থেকে দীক্ষিত বহু রোভার আজ জাতীয় ও আন্তর্জাতিক পর্যায়ে আরপিআই তথা দেশের নাম উজ্জ্বল করছেন। অভিজ্ঞ রোভার স্কাউট লিডারদের প্রত্যক্ষ তত্ত্বাবধানে এই দলের প্রতিটি সদস্য স্বাবলম্বী ও দেশপ্রেমিক রূপকার হিসেবে গড়ে উঠছে।
            </p>

            <div className="bg-[#FAF7F2] p-2.5 rounded-lg border border-dashed border-[#E6DEC9] text-[8.5px] text-gray-600 leading-relaxed">
              &ldquo;আমরা প্রতিজ্ঞাবদ্ধ এমন একটি সবুজ ও নিরাপদ সমাজ গড়তে, যেখানে প্রতিটি কারিগরি শিক্ষার্থী পেশাগত দক্ষতার পাশাপাশি তাদের মানবিক সেবামূলক সত্তাকে জাগ্রত রাখতে পারে।&rdquo;
            </div>
          </article>

          {/* Article 2: Disaster Relief Campaigns */}
          <article className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E6DEC9] space-y-3.5 shadow-xs transition-all hover:shadow-md relative overflow-hidden">
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#E6DEC9]/10 rounded-full"></div>
            <div className="flex items-center gap-2">
              <span className="text-[7.5px] font-black text-white bg-emerald-700 px-2 py-0.5 rounded uppercase tracking-wider">
                দুর্যোগ মোকাবিলা
              </span>
              <span className="text-[7.5px] font-bold text-gray-500 font-mono">
                সেবামূলক রিভিউ
              </span>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-[12px] sm:text-xs font-black text-gray-950 leading-tight">
                মনুষ্যত্বের মিলন মেলা: আরপিআই স্কাউট গ্রুপের দুর্যোগ মোকাবিলা ও ত্রাণ বিতরণ কর্মসূচি
              </h4>
              <p className="text-[7.5px] font-bold text-gray-400 font-mono">
                রচনায়: মানবিক সমাজসেবা টিম ও আরপিআই স্কাউট ক্রু
              </p>
            </div>

            <p className="text-[9.5px] text-gray-700 leading-relaxed text-justify">
              দেশের যেকোনো প্রাকৃতিক দুর্যোগ, বন্যা বা শৈত্যপ্রবাহে সমাজের অসহায় মানুষের পাশে দাঁড়াতে রাজশাহী পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপ সর্বদা অগ্রণী ভূমিকা পালন করে। রোভাররা নিজেদের উদ্যোগে ও সর্বস্তরের মানুষের সহায়তায় ত্রাণ সংগ্রহ করে দুর্গত এলাকায় ছুটে যান।
            </p>

            <p className="text-[9.5px] text-gray-750 leading-relaxed text-justify">
              স্কাউট সদস্যরা শুধু পড়াশোনাই করছেন না, বরং শীতার্ত ছিন্নমূল মানুষের জন্য শীতবস্ত্র ও খাদ্য সামগ্রী বিতরণ কার্যক্রমে সক্রিয়ভাবে অংশগ্রহণ করেন। সম্পূর্ণ স্বেচ্ছাশ্রমের ভিত্তিতে পরিচালিত এই মানবিক উদ্যোগ শত শত পরিবারের মুখে হাসি ফুটিয়েছে। এই নিস্বার্থ সমাজসেবা ক্যাম্পাসের অন্যতম গর্বের প্রতীক হিসেবে পরিচিতি পেয়েছে।
            </p>
          </article>
        </section>

        {/* Our Mission & Our Vision - Centered, Beautiful, Interactive Modern Presentation Layout */}
        <section id="mission-vision-section" className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E6DEC9] space-y-6 shadow-sm relative overflow-hidden text-center max-w-xl mx-auto">
          {/* Decorative absolute element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#E6DEC9]/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Icon and Section Header */}
          <div className="space-y-1.5 relative z-10">
            <div className="inline-flex items-center justify-center p-2.5 bg-red-50 border border-red-100 text-[#C1121F] rounded-full mx-auto shadow-sm">
              <Compass className="w-5 h-5 animate-spin-slow text-[#C1121F]" />
            </div>
            <div>
              <span className="text-[8.5px] font-black text-[#C1121F] uppercase tracking-widest bg-red-50/70 border border-red-200/50 px-2.5 py-0.5 rounded-full inline-block">
                MISSION, VISION & CORE VALUES
              </span>
              <h3 className="text-xs font-black text-gray-900 mt-1">
                আমাদের লক্ষ্য, রূপকল্প ও মানবিক উদ্দেশ্যসমূহ
              </h3>
              <div className="w-12 h-0.5 bg-[#C1121F] mx-auto mt-2 rounded"></div>
            </div>
          </div>

          {/* Grid for Mission & Vision side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 pt-2 text-center">
            {/* Centered Mission Block */}
            <div className="bg-white p-4.5 rounded-xl border border-[#E6DEC9] space-y-3 shadow-2xs flex flex-col items-center justify-between">
              <div className="space-y-2">
                <div className="inline-flex p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                  <Target className="w-4 h-4" />
                </div>
                <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                  MISSION • আমাদের লক্ষ্য
                </h4>
                <p className="text-[11px] font-extrabold text-gray-950 leading-snug">
                  সুনাগরিক ও যোগ্য মানবিক সমাজ বিনির্মাণ
                </p>
                <p className="text-[9.5px] text-gray-650 leading-relaxed text-center px-1">
                  &ldquo;স্কাউট আন্দোলনের মহান আদর্শ, সুশৃঙ্খল প্রশিক্ষণ ও সেবামূলক কর্মসূচির মাধ্যমে প্রতিটি কারিগরি শিক্ষার্থীকে দক্ষ, দেশপ্রেমিক ও সহানুভূতিশীল মানবিক নাগরিক হিসেবে গড়ে তোলা।&rdquo;
                </p>
              </div>
              <div className="w-full h-[1px] bg-dashed bg-gray-200 my-2"></div>
              <p className="text-[8px] font-serif tracking-tight text-gray-400 italic">
                Developing character and volunteer leadership.
              </p>
            </div>

            {/* Centered Vision Block */}
            <div className="bg-white p-4.5 rounded-xl border border-[#E6DEC9] space-y-3 shadow-2xs flex flex-col items-center justify-between">
              <div className="space-y-2">
                <div className="inline-flex p-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
                  <Eye className="w-4 h-4" />
                </div>
                <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-wider">
                  VISION • আমাদের রূপকল্প
                </h4>
                <p className="text-[11px] font-extrabold text-gray-950 leading-snug">
                  সেবা ও নেতৃত্বে উত্তরবঙ্গের শ্রেষ্ঠ যুবশক্তি
                </p>
                <p className="text-[9.5px] text-gray-650 leading-relaxed text-center px-1">
                  &ldquo;ক্যাম্পাসে সামাজিক মূল্যবোধের প্রসার, নিয়মিত ক্যাম্পিং, জরুরি সাড়াদান ও সমাজসেবামূলক প্রতিষ্ঠান হিসেবে উত্তরবঙ্গের অন্যতম শ্রেষ্ঠ ও সুশৃঙ্খল ছাত্র সংগঠন হিসেবে সুপ্রতিষ্ঠিত থাকা।&rdquo;
                </p>
              </div>
              <div className="w-full h-[1px] bg-dashed bg-gray-200 my-2"></div>
              <p className="text-[8px] font-serif tracking-tight text-gray-400 italic">
                Pioneering selfless community & clinical rescue.
              </p>
            </div>
          </div>

          {/* Centered Core Humanitarian Values Ticker */}
          <div className="space-y-2.5 pt-1 relative z-10">
            <span className="text-[7.5px] font-bold text-gray-400 uppercase tracking-widest block">
              — আমাদের ৪টি মূল স্তম্ভ ও মানবিক আদর্শ —
            </span>
            <div className="flex flex-wrap justify-center gap-1.5">
              <span className="text-[8.5px] font-extrabold text-[#C1121F] bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg">
                ❤️ আর্তমানবতার সেবা
              </span>
              <span className="text-[8.5px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-150 px-2.5 py-1 rounded-lg">
                🌲 পরিবেশ সচেতনতা
              </span>
              <span className="text-[8.5px] font-extrabold text-amber-800 bg-amber-50 border border-amber-150 px-2.5 py-1 rounded-lg">
                ⚡ নেতৃত্ব ও নিয়মানুবর্তিতা
              </span>
              <span className="text-[8.5px] font-extrabold text-blue-805 bg-blue-50 border border-blue-150 px-2.5 py-1 rounded-lg">
                ✊ চারিত্রিক সততা
              </span>
            </div>
          </div>

          {/* Centered Footer Summary Highlight */}
          <div className="bg-[#FAF7F2] p-3 rounded-xl border border-dashed border-[#E6DEC9] text-[9px] text-gray-600 leading-relaxed max-w-sm mx-auto relative z-10">
            &ldquo;রাজশাহী পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপ বিগত বহু বছর ধরে মেধা, মনন ও ত্যাগের সমন্বয়ে সমাজসেবার কাজ চালিয়ে আসছে। আমাদের প্রধান ব্রত হলো মানুষের যেকোনো চরম দুর্যোগে ও জীবনরক্ষায় নিঃস্বার্থভাবে সাড়া প্রদান করা।&rdquo;
          </div>
        </section>

        {/* Rover Scout Leaders (RSL) */}
        <article className="bg-[#FAF7F2] p-5 rounded-xl shadow-md border border-[#E6DEC9] space-y-4 transition-all hover:shadow-lg">
          <div className="flex items-center justify-between border-b pb-3 border-[#E6DEC9]">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-100 text-amber-700">
                <Users className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[8px] font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                  ROVER SCOUT LEADERS (RSL)
                </span>
                <h3 className="text-xs font-bold text-gray-900 mt-0.5">
                  আমাদের শ্রদ্ধাভাজন রোভার স্কাউট লিডারবৃন্দ
                </h3>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Leader 1 */}
            <div className="bg-white p-3.5 rounded-xl border border-[#E6DEC9] flex flex-col sm:flex-row gap-3 items-center sm:items-start text-center sm:text-left shadow-xs">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-amber-50/50 border border-[#E6DEC9] flex-shrink-0 relative shadow-inner">
                <img 
                  src="https://picsum.photos/seed/rsl_leader_mos/300/300"
                  alt="মো: মেস্তাফিজুর রহমান"
                  className="w-full h-full object-cover grayscale-[10%]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-xs font-extrabold text-gray-900">মো: মেস্তাফিজুর রহমান</h4>
                  <span className="text-[8px] font-bold text-amber-800 bg-amber-50 border border-amber-150 px-2 py-0.5 rounded-full inline-block self-center sm:self-auto">
                    রোভার স্কাউট লিডার (RSL)
                  </span>
                </div>
                <p className="text-[8.5px] text-gray-400 font-semibold font-mono">Woodbadge Holder • Assistant Professor, RPI</p>
                <p className="text-[9.5px] text-gray-650 leading-normal italic text-justify">
                  &ldquo;স্কাউটিং হলো একটি আনন্দময় খেলার মতো পরিচ্ছন্ন পাঠশালা যেখানে তরুণরা আনন্দের ছলে মানবসেবার পরম শিক্ষা গ্রহণ করে থাকে। আমাদের প্রতিটি ছাত্র সুশিক্ষিত হোক এটাই আমাদের মহৎ অঙ্গীকার।&rdquo;
                </p>
                <div className="flex justify-center sm:justify-start gap-4 pt-1.5 text-[8.5px] text-gray-500 font-mono">
                  <span className="flex items-center gap-1 active:text-[#C1121F] cursor-pointer">
                    <PhoneCall className="w-3 h-3 text-emerald-600" /> +৮৮০১৭১২-০০০০০
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#C1121F]" /> rsl.mostafiz@rpirsg.org
                  </span>
                </div>
              </div>
            </div>

            {/* Leader 2 */}
            <div className="bg-white p-3.5 rounded-xl border border-[#E6DEC9] flex flex-col sm:flex-row gap-3 items-center sm:items-start text-center sm:text-left shadow-xs">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-amber-50/50 border border-[#E6DEC9] flex-shrink-0 relative shadow-inner">
                <img 
                  src="https://picsum.photos/seed/rsl_leader_fau/300/300"
                  alt="মোছা: ফাতেমা বিনতে রশীদ"
                  className="w-full h-full object-cover grayscale-[10%]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-xs font-extrabold text-gray-900">মোছা: ফাতেমা বিনতে রশীদ</h4>
                  <span className="text-[8px] font-bold text-pink-700 bg-pink-50 border border-pink-150 px-2 py-0.5 rounded-full inline-block self-center sm:self-auto">
                    সহকারী রোভার স্কাউট লিডার (ARSL)
                  </span>
                </div>
                <p className="text-[8.5px] text-gray-400 font-semibold font-mono">Woodbadge Holder • Lecturer, RPI</p>
                <p className="text-[9.5px] text-gray-650 leading-normal italic text-justify">
                  &ldquo;মেয়েরা স্কাউটিং আন্দোলনে সংযুক্তির মধ্য দিয়ে আরপিআই রোভার স্কাউট গ্রুপ ক্যাম্পাসে ও পুরো রাজশাহী অঞ্চলে যোগ্য, সাহসী ও সৃজনশীল নেত্রী তৈরির এক মহৎ বিপ্লব সৃষ্টি করেছে।&rdquo;
                </p>
                <div className="flex justify-center sm:justify-start gap-4 pt-1.5 text-[8.5px] text-gray-500 font-mono">
                  <span className="flex items-center gap-1 active:text-[#C1121F] cursor-pointer">
                    <PhoneCall className="w-3 h-3 text-emerald-600" /> +৮৮০১৭১৩-০০০০০
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#C1121F]" /> arsl.fatema@rpirsg.org
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Senior Rover Mates (SRM Council - 6 Profiles) */}
        <article className="bg-[#FAF7F2] p-5 rounded-xl shadow-md border border-[#E6DEC9] space-y-4 transition-all hover:shadow-lg">
          <div className="flex items-center justify-between border-b pb-3 border-[#E6DEC9]">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-100 text-[#C1121F]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[8px] font-bold text-[#C1121F] uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded border border-red-155">
                  SENIOR ROVER MATES (SRM COUNCIL)
                </span>
                <h3 className="text-xs font-bold text-gray-900 mt-0.5">
                  আমাদের গৌরবময় ৬ জন সিনিয়র রোভার মেট (SRM)
                </h3>
              </div>
            </div>
            <span className="text-[8px] font-extrabold text-[#C1121F] border border-red-200 px-2 py-0.5 rounded bg-red-50/50">৬টি সক্রিয় ইউনিট</span>
          </div>

          <p className="text-[10px] text-gray-650 leading-relaxed text-justify">
            নিচের ৬ জন সুপ্রশিক্ষিত সিনিয়ার রোভার মেট সুশৃঙ্খলভাবে রাজশাহী পলিটেকনিক রোভার স্কাউট গ্রুপের প্রতিটি কন্টিনজেন্ট, নিয়মিত ক্রু মিটিং এবং ক্যাম্পিং কার্যক্রম স্বমহিমায় নেতৃত্ব দিয়ে সচল রাখছেন:
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {/* SRM 1 */}
            <div className="bg-white p-3 rounded-xl border border-[#E6DEC9] text-center space-y-2 shadow-xs transition-all hover:shadow-sm">
              <div className="w-12 h-12 rounded-full overflow-hidden mx-auto bg-gray-50 border border-[#E6DEC9] shadow-inner">
                <img 
                  src="https://picsum.photos/seed/srm_sabbir/200/200" 
                  alt="মোঃ সাব্বির রহমান"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="text-[10.5px] font-extrabold text-gray-900 leading-tight">মোঃ সাব্বির রহমান</h4>
                <p className="text-[8px] text-amber-700 font-bold uppercase tracking-wider mt-0.5">যুগ্ম সিনিয়র রোভার মেট</p>
                <p className="text-[7.5px] text-gray-400 font-mono">ইউনিট ক • সেশন: ২০২২-২৩</p>
              </div>
              <p className="text-[8.5px] text-gray-500 italic leading-tight">
                &ldquo;সেবার সুমহান ব্রত নিয়ে কাজ করে যাচ্ছি আরপিআই রোভার দলে।&rdquo;
              </p>
              <div className="pt-1.5 border-t border-[#E6DEC9] text-[8px] text-gray-400 font-mono flex items-center justify-center gap-1.5">
                <span className="text-emerald-700 font-bold">Senior Rover</span>
                <span>•</span>
                <span>PRS Candidate</span>
              </div>
            </div>

            {/* SRM 2 */}
            <div className="bg-white p-3 rounded-xl border border-[#E6DEC9] text-center space-y-2 shadow-xs transition-all hover:shadow-sm">
              <div className="w-12 h-12 rounded-full overflow-hidden mx-auto bg-gray-50 border border-[#E6DEC9] shadow-inner">
                <img 
                  src="https://picsum.photos/seed/srm_fatema/200/200" 
                  alt="মোছাঃ ফাতেমা খাতুন"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="text-[10.5px] font-extrabold text-gray-900 leading-tight">মোছাঃ ফাতেমা খাতুন</h4>
                <p className="text-[8px] text-pink-700 font-bold uppercase tracking-wider mt-0.5">গার্ল-ইন-রোভার মেট</p>
                <p className="text-[7.5px] text-gray-400 font-mono">ইউনিট খ (গার্লস) • ২০২২-২৩</p>
              </div>
              <p className="text-[8.5px] text-gray-500 italic leading-tight">
                &ldquo;মেয়েরা সেবা ও নেতৃত্বে এগিয়ে খেলবে অগ্রগণ্য গৌরবময় ভূমিকা।&rdquo;
              </p>
              <div className="pt-1.5 border-t border-[#E6DEC9] text-[8px] text-gray-400 font-mono flex items-center justify-center gap-1.5">
                <span className="text-emerald-700 font-bold">Crew Leader</span>
                <span>•</span>
                <span>Elite Ranger</span>
              </div>
            </div>

            {/* SRM 3 */}
            <div className="bg-white p-3 rounded-xl border border-[#E6DEC9] text-center space-y-2 shadow-xs transition-all hover:shadow-sm">
              <div className="w-12 h-12 rounded-full overflow-hidden mx-auto bg-gray-50 border border-[#E6DEC9] shadow-inner">
                <img 
                  src="https://picsum.photos/seed/srm_rakibul/200/200" 
                  alt="মোঃ রাকিবুল হাসান"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="text-[10.5px] font-extrabold text-gray-900 leading-tight">মোঃ রাকিবুল হাসান</h4>
                <p className="text-[8px] text-[#C1121F] font-bold uppercase tracking-wider mt-0.5">সিনিয়র রোভার মেট</p>
                <p className="text-[7.5px] text-gray-400 font-mono">ইউনিট গ • সেশন: ২০২৩-২৪</p>
              </div>
              <p className="text-[8.5px] text-gray-500 italic leading-tight">
                &ldquo;সুশৃঙ্খল স্কাউট আন্দোলনই আমাদের আদর্শ সোনার নাগরিক উপহার দেয়।&rdquo;
              </p>
              <div className="pt-1.5 border-t border-[#E6DEC9] text-[8px] text-gray-400 font-mono flex items-center justify-center gap-1.5">
                <span className="text-emerald-700 font-bold">Unit Scouter</span>
                <span>•</span>
                <span>Star Scout</span>
              </div>
            </div>

            {/* SRM 4 */}
            <div className="bg-white p-3 rounded-xl border border-[#E6DEC9] text-center space-y-2 shadow-xs transition-all hover:shadow-sm">
              <div className="w-12 h-12 rounded-full overflow-hidden mx-auto bg-gray-50 border border-[#E6DEC9] shadow-inner">
                <img 
                  src="https://picsum.photos/seed/srm_ashikur/200/200" 
                  alt="মোঃ আশিকুর রহমান"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="text-[10.5px] font-extrabold text-gray-900 leading-tight">মোঃ আশিকুর রহমান</h4>
                <p className="text-[8px] text-amber-700 font-bold uppercase tracking-wider mt-0.5">সিনিয়র রোভার মেট</p>
                <p className="text-[7.5px] text-gray-400 font-mono">ইউনিট ঘ • সেশন: ২০২২-২৩</p>
              </div>
              <p className="text-[8.5px] text-gray-500 italic leading-tight">
                &ldquo;অসহায় শীতার্ত মানুষের সমাজ সেবা ও জনসচেতনতা সৃষ্টিই আমাদের মূল গৌরব।&rdquo;
              </p>
              <div className="pt-1.5 border-t border-[#E6DEC9] text-[8px] text-gray-400 font-mono flex items-center justify-center gap-1.5">
                <span className="text-emerald-700 font-bold">Trainer</span>
                <span>•</span>
                <span>Quartermaster</span>
              </div>
            </div>

            {/* SRM 5 */}
            <div className="bg-white p-3 rounded-xl border border-[#E6DEC9] text-center space-y-2 shadow-xs transition-all hover:shadow-sm">
              <div className="w-12 h-12 rounded-full overflow-hidden mx-auto bg-gray-50 border border-[#E6DEC9] shadow-inner">
                <img 
                  src="https://picsum.photos/seed/srm_tanjila/200/200" 
                  alt="তানজিলা আক্তার"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="text-[10.5px] font-extrabold text-gray-900 leading-tight">তানজিলা আক্তার</h4>
                <p className="text-[8px] text-pink-700 font-bold uppercase tracking-wider mt-0.5">সহকারী গার্ল-ইন-রোভার মেট</p>
                <p className="text-[7.5px] text-gray-400 font-mono">ইউনিট ঙ (গার্লস) • সেশন: ২৩-২৪</p>
              </div>
              <p className="text-[8.5px] text-gray-500 italic leading-tight">
                &ldquo;পীড়িত ও দুর্গত মানুষের সেবায় সদা উৎসর্গীকৃত আরপিআই রোভার।&rdquo;
              </p>
              <div className="pt-1.5 border-t border-[#E6DEC9] text-[8px] text-gray-400 font-mono flex items-center justify-center gap-1.5">
                <span className="text-emerald-700 font-bold">Rover Mate</span>
                <span>•</span>
                <span>Ranger Star</span>
              </div>
            </div>

            {/* SRM 6 */}
            <div className="bg-white p-3 rounded-xl border border-[#E6DEC9] text-center space-y-2 shadow-xs transition-all hover:shadow-sm">
              <div className="w-12 h-12 rounded-full overflow-hidden mx-auto bg-gray-50 border border-[#E6DEC9] shadow-inner">
                <img 
                  src="https://picsum.photos/seed/srm_ariful/200/200" 
                  alt="মোঃ আরিফুল ইসলাম"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="text-[10.5px] font-extrabold text-gray-900 leading-tight">মোঃ আরিফুল ইসলাম</h4>
                <p className="text-[8px] text-[#C1121F] font-bold uppercase tracking-wider mt-0.5">সিনিয়র রোভার মেট</p>
                <p className="text-[7.5px] text-gray-400 font-mono">ইউনিট চ • সেশন: ২০২৩-২৪</p>
              </div>
              <p className="text-[8.5px] text-gray-500 italic leading-tight">
                &ldquo;স্কাউটিং এর নিয়মতান্ত্রিক অনুশীলনেই হোক রোভার শক্তির জয়।&rdquo;
              </p>
              <div className="pt-1.5 border-t border-[#E6DEC9] text-[8px] text-gray-400 font-mono flex items-center justify-center gap-1.5">
                <span className="text-emerald-700 font-bold">Event Lead</span>
                <span>•</span>
                <span>Scribe Leader</span>
              </div>
            </div>
          </div>
        </article>

        {/* Interactive Photo Gallery Section */}
        <article className="bg-[#FAF7F2] p-5 rounded-xl shadow-md border border-[#E6DEC9] space-y-4 transition-all hover:shadow-lg">
          <div className="flex items-center justify-between border-b pb-3 border-[#E6DEC9]">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-100 text-teal-700">
                <Camera className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[8px] font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                  PHOTO GALLERY • ছবি গ্যালারি ও মুহূর্ত
                </span>
                <h3 className="text-xs font-bold text-gray-900 mt-0.5">
                  সেবামূলক ও ক্যাম্পিং কার্যক্রমের বাস্তব ডায়েরি
                </h3>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-650 leading-relaxed text-justify">
            নিচে আমাদের রাজশাহী পলিটেকনিক প্রাঙ্গণে ও দেশের বিভিন্ন প্রান্তে আরপিআই রোভার স্কাউট দলের গৌরবময় ও অনুপ্রেরণামূলক কিছু নির্বাচিত মুহূর্তের ছবি যুক্ত করা হলো। পছন্দমতো ক্যাটাগরি বেছে নিয়ে ছবিগুলো বড় করে দেখতে পারেন:
          </p>

          {/* Gallery Category Filter HUD */}
          <div className="flex flex-wrap gap-1 bg-[#F3ECE0]/60 p-1.5 rounded-xl border border-[#E6DEC9]">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 min-w-[70px] text-center px-1.5 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                activeFilter === 'all' 
                  ? 'bg-[#C1121F] text-white shadow-xs' 
                  : 'text-gray-650 hover:bg-[#FAF7F2]'
              }`}
            >
              সকল ছবি
            </button>
            <button
              onClick={() => setActiveFilter('camping')}
              className={`flex-1 min-w-[70px] text-center px-1.5 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                activeFilter === 'camping' 
                  ? 'bg-[#C1121F] text-white shadow-xs' 
                  : 'text-gray-650 hover:bg-[#FAF7F2]'
              }`}
            >
              ক্যাম্প ও মুট
            </button>
            <button
              onClick={() => setActiveFilter('service')}
              className={`flex-1 min-w-[70px] text-center px-1.5 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                activeFilter === 'service' 
                  ? 'bg-[#C1121F] text-white shadow-xs' 
                  : 'text-gray-650 hover:bg-[#FAF7F2]'
              }`}
            >
              সমাজসেবা
            </button>
            <button
              onClick={() => setActiveFilter('training')}
              className={`flex-1 min-w-[70px] text-center px-1.5 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${
                activeFilter === 'training' 
                  ? 'bg-[#C1121F] text-white shadow-xs' 
                  : 'text-gray-650 hover:bg-[#FAF7F2]'
              }`}
            >
              প্রশিক্ষণ
            </button>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {GALLERY_PHOTOS
              .filter(item => activeFilter === 'all' || item.category === activeFilter)
              .map(photo => (
                <div 
                  key={photo.id}
                  onClick={() => { setSelectedImg(photo); setZoomLevel(1); }}
                  className="group bg-white rounded-xl border border-[#E6DEC9] overflow-hidden shadow-xs cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="h-28 overflow-hidden bg-gray-100 relative">
                    <img 
                      src={photo.image}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 bg-[#FAF7F2] border border-[#E6DEC9] rounded-md px-1.5 py-0.5 text-[7px] text-gray-700 font-extrabold uppercase">
                      {photo.category === 'camping' ? 'ক্যাম্প' : photo.category === 'service' ? 'সমাজсеবা' : 'প্রশিক্ষণ'}
                    </div>
                  </div>
                  <div className="p-2.5 space-y-1">
                    <h4 className="text-[10px] font-extrabold text-[#C1121F] line-clamp-1 leading-tight group-hover:underline">
                      {photo.title}
                    </h4>
                    <p className="text-[8px] text-gray-500 line-clamp-2 leading-relaxed">
                      {photo.description}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </article>

        {/* Dynamic Photo Zoom View overlay with Lightbox navigation and Scale-controlling dock */}
        {selectedImg && (() => {
          const filteredPhotos = GALLERY_PHOTOS.filter(
            item => activeFilter === 'all' || item.category === activeFilter
          );
          const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedImg.id);

          const handleNext = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (filteredPhotos.length > 0) {
              const nextIndex = (currentIndex + 1) % filteredPhotos.length;
              setSelectedImg(filteredPhotos[nextIndex]);
              setZoomLevel(1);
            }
          };

          const handlePrev = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (filteredPhotos.length > 0) {
              const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
              setSelectedImg(filteredPhotos[prevIndex]);
              setZoomLevel(1);
            }
          };

          const handleZoomIn = (e: React.MouseEvent) => {
            e.stopPropagation();
            setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
          };

          const handleZoomOut = (e: React.MouseEvent) => {
            e.stopPropagation();
            setZoomLevel(prev => Math.max(prev - 0.25, 1));
          };

          return (
            <div 
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 transition-all select-none"
              onClick={() => { setSelectedImg(null); setZoomLevel(1); }}
            >
              {/* Header Info */}
              <div className="w-full max-w-sm flex items-center justify-between text-white mb-2 relative px-1">
                <div>
                  <span className="text-[7.5px] font-black text-amber-400 bg-amber-950/80 border border-amber-900 px-1.5 py-0.5 rounded uppercase tracking-wider">
                    {selectedImg.category === 'camping' ? 'ক্যাম্প' : selectedImg.category === 'service' ? 'সমাজসেবা' : 'প্রশিক্ষণ'}
                  </span>
                  <span className="text-[7px] text-gray-400 font-mono ml-2 font-bold uppercase">
                    ছবি: {currentIndex + 1} / {filteredPhotos.length}
                  </span>
                </div>
                <button 
                  onClick={() => { setSelectedImg(null); setZoomLevel(1); }}
                  className="bg-white/10 hover:bg-white/20 text-white p-1 rounded-full cursor-pointer transition-colors"
                  title="Close Modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Image Stage Wrap with Navigation and Zoom Controls */}
              <div 
                className="relative bg-[#0c0a09] w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-white/5 flex items-center justify-center"
                style={{ height: '280px' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Scroll/Scale Container */}
                <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
                  <motion.img 
                    key={selectedImg.id}
                    src={selectedImg.image} 
                    alt={selectedImg.title} 
                    referrerPolicy="no-referrer"
                    className="object-contain max-h-full max-w-full transition-transform duration-200"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                </div>

                {/* Left Navigation Arrow */}
                <button 
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white rounded-full p-1.5 cursor-pointer border border-white/10 transition-colors z-20"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Right Navigation Arrow */}
                <button 
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white rounded-full p-1.5 cursor-pointer border border-white/10 transition-colors z-20"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Zoom Controller Floating Dock */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 flex items-center gap-2.5 shadow-md z-20">
                  <button 
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 1}
                    className={`text-white text-[10px] font-black cursor-pointer hover:text-amber-400 min-w-[20px] transition-colors ${zoomLevel <= 1 ? 'opacity-30 pointer-events-none' : ''}`}
                    title="Zoom Out"
                  >
                    A-
                  </button>
                  <span className="text-[8px] text-white font-mono font-bold leading-none min-w-[32px] text-center">
                    {(zoomLevel * 100).toFixed(0)}%
                  </span>
                  <button 
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 2.5}
                    className={`text-white text-[10px] font-black cursor-pointer hover:text-amber-400 min-w-[20px] transition-colors ${zoomLevel >= 2.5 ? 'opacity-30 pointer-events-none' : ''}`}
                    title="Zoom In"
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* Caption and Information Panel below stage */}
              <div 
                className="bg-[#FAF7F2] max-w-sm w-full rounded-2xl p-4 mt-3 border border-[#E6DEC9] space-y-1 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <h4 className="text-[11px] font-black text-gray-950 font-sans tracking-wide leading-tight mt-0.5">
                  {selectedImg.title}
                </h4>
                <p className="text-[9.5px] text-gray-600 leading-relaxed text-justify">
                  {selectedImg.description}
                </p>
                <div className="flex justify-between items-center text-[7.5px] text-gray-400 pt-1 border-t border-gray-150 font-mono mt-2">
                  <span>আরপিআই রোভার ডাটাবেজ</span>
                  <span className="text-[#C1121F] font-bold">নিরাপদ লাইটবক্স ভিউয়ার</span>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Scouting Values & Laws (স্কাউট প্রতিজ্ঞা, বিধি ও আইন) - Added specifically to enrich the Homepage */}
        <section className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E6DEC9] space-y-3 shadow-sm transition-all">
          <div className="flex items-center gap-2.5 border-b pb-3 border-[#E6DEC9]">
            <div className="p-2 bg-amber-50 border border-amber-100 text-amber-700 rounded-lg">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[8px] font-extrabold text-amber-700 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                SCOUT VALUE AND LAWS
              </span>
              <h3 className="text-xs font-bold text-gray-900 mt-1">
                স্কাউটিং প্রতিজ্ঞা ও ৭টি শাশ্বত আইন
              </h3>
            </div>
          </div>

          <div className="text-gray-800 text-[10px] leading-relaxed space-y-2 text-justify">
            <p className="italic font-medium text-amber-900 bg-[#F3ECE0]/50 p-2.5 rounded-lg border border-dashed border-[#E6DEC9]">
              প্রতিজ্ঞা: &ldquo;আমি আমার আত্মমর্যাদার উপর নির্ভর করে প্রতিজ্ঞা করছি যে, আমি নিজের প্রতি ও দেশের প্রতি কর্তব্য পালন করব, সর্বদা অপরকে সাহায্য করব এবং স্কাউট আইন মেনে চলব।&rdquo;
            </p>
            <div className="grid grid-cols-2 gap-2 text-[8px] sm:text-[9.5px] pt-1 text-gray-700 font-medium">
              <div className="bg-white p-2 border border-gray-150 rounded-lg flex items-center gap-1.5 shadow-sm">
                <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>১. স্কাউট আত্মমর্যাদায় বিশ্বাসী</span>
              </div>
              <div className="bg-white p-2 border border-gray-150 rounded-lg flex items-center gap-1.5 shadow-sm">
                <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>২. স্কাউট সবার বন্ধু ও দলগত</span>
              </div>
              <div className="bg-white p-2 border border-gray-150 rounded-lg flex items-center gap-1.5 shadow-sm">
                <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>৩. স্কাউট বিনয়ী ও অনুগত</span>
              </div>
              <div className="bg-white p-2 border border-gray-150 rounded-lg flex items-center gap-1.5 shadow-sm">
                <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>৪. স্কাউট জীবের প্রতি দয়ালু</span>
              </div>
              <div className="bg-white p-2 border border-gray-150 rounded-lg flex items-center gap-1.5 shadow-sm">
                <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>৫. স্কাউট সদাপ্রফুল্ল</span>
              </div>
              <div className="bg-white p-2 border border-gray-150 rounded-lg flex items-center gap-1.5 shadow-sm">
                <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>৬. স্কাউট মিতব্যয়ী</span>
              </div>
              <div className="bg-white p-2 border border-gray-150 rounded-lg col-span-2 flex items-center gap-1.5 shadow-sm">
                <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>৭. স্কাউট চিন্তা, কথা ও কাজে নির্মল ও পরিচ্ছন্ন</span>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events & Camps */}
        <section className="bg-white p-5 rounded-xl border border-blue-100 space-y-4 shadow-sm relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center gap-2.5 border-b pb-3 border-blue-50 relative z-10">
            <div className="p-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg">
              <Calendar className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[8px] font-extrabold text-blue-700 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                UPCOMING EVENTS
              </span>
              <h3 className="text-xs font-bold text-gray-900 mt-1">
                আসন্ন ইভেন্ট ও ক্যাম্পিং ক্যালেন্ডার
              </h3>
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            <div className="bg-blue-50/40 p-3 rounded-xl border border-blue-100/50 flex gap-3 hover:bg-blue-50/80 transition-colors">
              <div className="bg-blue-600 text-white p-2 rounded-lg text-center min-w-[50px] shadow-sm flex-shrink-0 flex flex-col justify-center">
                <span className="text-[8px] uppercase tracking-wider font-bold">JUL</span>
                <span className="text-xl font-black -mt-1">15</span>
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-gray-900 leading-tight">বিভাগীয় রোভার মুট ও লিডার গ্যাদারিং</h4>
                <p className="text-[9px] text-gray-500 mt-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-blue-500"></span> রাজশাহী পলিটেকনিক ক্যাম্পাস
                </p>
              </div>
            </div>

            <div className="bg-emerald-50/40 p-3 rounded-xl border border-emerald-100/50 flex gap-3 hover:bg-emerald-50/80 transition-colors">
              <div className="bg-emerald-600 text-white p-2 rounded-lg text-center min-w-[50px] shadow-sm flex-shrink-0 flex flex-col justify-center">
                <span className="text-[8px] uppercase tracking-wider font-bold">AUG</span>
                <span className="text-xl font-black -mt-1">05</span>
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-gray-900 leading-tight">গ্রীন ক্যাম্পাস গড়তে বৃক্ষরোপণ অভিযান</h4>
                <p className="text-[9px] text-gray-500 mt-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-emerald-600"></span> আরপিআই ক্যাম্পাস প্রাঙ্গণ
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Notice Board */}
        <section className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E6DEC9] space-y-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2.5 border-b pb-3 border-[#E6DEC9] relative z-10">
            <div className="p-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[8px] font-extrabold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                NOTICE BOARD
              </span>
              <h3 className="text-xs font-bold text-gray-900 mt-1">
                নোটিশ বোর্ড ও সাধারণ বার্তা
              </h3>
            </div>
            <span className="ml-auto text-[8px] font-bold bg-[#C1121F] text-white px-2 py-0.5 rounded animate-pulse">LIVE</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-gray-150 shadow-xs">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-emerald-600">
                <Layers className="w-4 h-4" />
              </div>
              <div className="space-y-1 relative">
                <h4 className="text-[10px] font-bold text-gray-900 text-justify">
                  {adminNotice || "সকল রোভার ও গার্ল ইন রোভারদের অবগতির জন্য জানানো যাচ্ছে যে, আগামী সপ্তাহের ক্রু মিটিং যথাসময়ে অনুষ্ঠিত হবে। নির্ধারিত ড্রেসকোড ও স্কাউট স্কার্ফ পরিধান বাধ্যতামূলক।"}
                </h4>
                <p className="text-[8px] text-gray-400 font-mono mt-1 pt-1 border-t border-gray-100 inline-block">
                  প্রকাশক: আরপিআই স্কাউট গ্রুপ প্রশাসন
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Contact Helplines */}
        <section className="bg-gray-900 rounded-xl p-5 shadow-lg border border-gray-800 text-white relative overflow-hidden">
          {/* Subtle bg glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center justify-center p-2.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-black tracking-wide text-white">জরুরী যোগাযোগ ও হেল্পলাইন</h3>
              <p className="text-[9px] text-gray-400 mt-1 max-w-[250px] mx-auto leading-relaxed">
                রাজশাহী পলিটেকনিক রোভার স্কাউটে যোগদান ও যেকোনো জরুরী তথ্যের জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন।
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <a href="tel:+8801700000000" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 p-2.5 rounded-lg transition-colors cursor-pointer w-full sm:w-auto px-6">
                <span className="text-lg font-black tracking-widest text-emerald-400 drop-shadow-md">০১৭০০-০০০০০০</span>
              </a>
              <a href="tel:+8801800000000" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 p-2.5 rounded-lg transition-colors cursor-pointer w-full sm:w-auto px-6">
                <span className="text-lg font-black tracking-widest text-emerald-400 drop-shadow-md">০১৮০০-০০০০০০</span>
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
