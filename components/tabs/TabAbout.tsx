'use client';
import { useState } from 'react';
import { 
  Compass, 
  Heart, 
  Flame, 
  CheckCircle,
  Copy,
  Check,
  Facebook,
  Linkedin,
  Youtube,
  MessageSquare,
  Send,
  Target,
  Eye,
  Activity
} from 'lucide-react';

export default function TabAbout() {
  const [copied, setCopied] = useState(false);

  const handleShareClick = async () => {
    const shareData = {
      title: 'Rajshahi Polytechnic Institute Rover Scout Group',
      text: 'মানবতা ও সার্বক্ষণিক সেবার ক্ষেত্রে সদা প্রস্তুত এক মহান তরুণের ব্রত ও বৈশ্বিক ঐক্য',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://rpirsg.org'
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const url = typeof window !== 'undefined' ? window.location.origin : 'https://rpirsg.org';
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="paper-texture min-h-screen pb-32 font-sans relative">
      {/* Background Subtle Grid Accent for Paper Texture feel */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(230,222,201,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(230,222,201,0.15)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-60"></div>

      {/* Premium Bangla Header Banner with Warm Craftsmanship */}
      <div className="relative bg-gradient-to-r from-[#C1121F] to-red-300 text-white p-6 text-center shadow-md">
        <h2 className="text-sm text-white font-bold tracking-wider uppercase">রাজশাহী পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপ সম্পর্কে জানুন</h2>
        <p className="text-[10px] text-white font-bold mt-1 max-w-md mx-auto">
          আমাদের গৌরবময় ইতিহাস, মানবিক উদ্দেশ্য এবং সামাজিক স্বেচ্ছাসেবামূলক কার্যক্রমসমূহের এক অনন্য আলেখ্য।
        </p>
      </div>

      <div className="relative p-4 space-y-6 max-w-xl mx-auto z-10">
        {/* Article 1: RPI Rover Scout Group (RPIRSG) */}
        <article className="bg-[#FAF7F2] p-5 rounded-xl shadow-md border border-[#E6DEC9] space-y-3.5 transition-all hover:shadow-lg">
          <div className="flex items-center gap-2.5 border-b pb-3 border-[#E6DEC9]">
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <span className="text-[8px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                সুশৃঙ্খল যুব সেবা ও সমাজ বিনির্মাণ
              </span>
              <h3 className="text-xs font-bold text-gray-900 mt-1">
                পলিটেকনিক রোভার স্কাউটিং আন্দোলন ও আমাদের আদর্শ
              </h3>
            </div>
          </div>
          
          <div className="text-gray-800 text-[10px] leading-relaxed space-y-3 text-justify">
            <p>
              রাজশাহী পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপ (যা ক্যাম্পাসে অত্যন্ত গর্ব ও সুনামের সাথে কার্যক্রম পরিচালনা করছে) একটি সম্পূর্ণ স্বাবলম্বী, সুশৃঙ্খল ও গতিশীল সেবামূলক যুব সংগঠন। বাংলাদেশ স্কাউটস, রোভার অঞ্চলের সরাসরি দিকনির্দেশনা ও রাজশাহী জেলা রোভারের নিখুঁত তত্ত্বাবধানে পরিচালিত এই রোভার স্কাউট দলটি পলিটেকনিকে অধ্যয়নরত তরুণ কারিগরি শিক্ষার্থীদের আদর্শ দেশপ্রেম, চরিত্র গঠন, নিয়মানুবর্তিতা এবং অসাধারণ নেতৃত্বের গুণাবলী অর্জনে অবিরত সহায়তা করে চলেছে।
            </p>
            <p>
              আমাদের রোভার স্কাউটদের মূল দীক্ষা ও স্লোগান হলো “সদা প্রস্তুত” এবং আমাদের জীবনের একমাত্র মহান ব্রত হলো নিঃস্বার্থ ও পবিত্র “সেবা”। প্রতি সপ্তাহে আমরা নিয়মিতভাবে ক্রু মিটিং আয়োজন করি, যেখানে স্কাউটদের শারীরিক ও মানসিক দক্ষতার প্রভূত উন্নতিসাধনের জন্য ড্রিল সেশন, দড়ির নানাবিধ গিঁট ও ল্যাশিং প্র্যাকটিস, কম্পাসের নিখুঁত ব্যবহার, ফার্স্ট এইড ও ব্যান্ডেজ থেরাপির প্রশিক্ষণ প্রদান করা হয়। এছাড়াও হাইকিং, ট্রেকিং ও অ্যাডভেঞ্চার ট্রেইলের অভিযান পরিচালনার মধ্য দিয়ে রোভাররা যেকোনো কঠিন পরিস্থিতিতে টিকে থাকার প্রাকৃতিক শিক্ষা লাভ করে থাকে।
            </p>
            <p>
              দেশ ও সমাজের যেকোনো ক্রান্তিলগ্নে রাজশাহী পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপের সদস্যরা সর্বদা প্রথম সারিতে ঢাল হয়ে দাঁড়ায়। যেকোনো তীব্র বন্যার প্রাদুর্ভাব, ঘুর্ণিঝড় ও জলোচ্ছ্বাসের মতো প্রাকৃতিক মহামারী, উত্তরাঞ্চলের কনকনে ও হাড় কাঁপানো তীব্র শীতে ছিন্নমূল সাধারণ মানুষের মাঝে কম্বল ও শীতবস্ত্র বিতরণের পাশাপাশি নিরাপদ খাবার পানি ও বিনামূল্যে জরুরি ঔষধ বিতরণে আমাদের দল ক্যাম্পাসে ও ক্যাম্পাসের বাইরে দিনরাত কাজ করে প্রশংসিত হয়েছে।
            </p>
            <p>
              কারিগরি শিক্ষার্থীদের মাঝে মানবিক মূল্যবোধ ও স্কাউট প্রতিজ্ঞার বাস্তবায়ন আমাদের মূল প্রাধান্য। স্কাউটিংয়ের মাধ্যমে এখানকার সাধারণ মেমেম্বাররা বিশ্ব দরবারে বাংলাদেশের স্কাউট আন্দোলনের ভাবমূর্তি উজ্জ্বল করতে বদ্ধপরিকর। এটি সাধারণ কোনো সমাবেশ নয়, বরং দেশ গড়ার প্রতিটি ঐতিহাসিক ক্ষণে আরপিআই রোভার স্কাউটদের সম্মিলিত পদক্ষেপ মানুষের দুঃখকষ্ট লাঘবে অত্যন্ত নির্ভরযোগ্য হাতিয়ার ও আশার অনন্য প্রতীক হিসেবে পরিচিতি লাভ করেছে।
            </p>
          </div>
        </article>

        {/* Article 2: Blood Donation */}
        <article className="bg-[#FAF7F2] p-5 rounded-xl shadow-md border border-[#E6DEC9] space-y-3.5 transition-all hover:shadow-lg">
          <div className="flex items-center gap-2.5 border-b pb-3 border-[#E6DEC9]">
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-100 text-[#C1121F]">
              <Heart className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[8px] font-bold text-[#C1121F] uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded border border-red-150">
                জীবন রক্ষাকারী নিঃস্বার্থ আন্দোলন
              </span>
              <h3 className="text-xs font-bold text-gray-900 mt-1">
                জরুরি রক্তদান কর্মসূচি ও মহৎ মানবসেবা নেটওয়ার্ক
              </h3>
            </div>
          </div>
          
          <div className="text-gray-800 text-[10px] leading-relaxed space-y-3 text-justify">
            <p>
              এক ব্যাগ তাজা লাল রক্ত একটি মুমূর্ষু মানুষের জীবন বাঁচাতে পারে এবং একটি গোটা পরিবারের মুখে আনন্দের সোনালী হাসি ফিরিয়ে দিতে পারে। রক্তদান কোনো বিচ্ছিন্ন সামাজিক কর্মসূচি নয়; এটি আমাদের সুগভীর নাগরিক দায়িত্ব এবং পরম মানবিক ইবাদত। রাজশাহী পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপ ক্যাম্পাসের ভেতর এবং পুরো রাজশাহী বিভাগে স্বেচ্ছায় রক্তদানের এই মহৎ আন্দোলনকে সুদৃঢ় কাঠামোর মধ্য দিয়ে পরিচালনা করে আসছে।
            </p>
            <p>
              উত্তরবঙ্গের সর্ববৃহৎ চিকিৎসা কেন্দ্র রাজশাহী মেডিকেল কলেজ হাসপাতাল (RMCH) এবং স্থানীয় ক্লিনিকসমূহে চিকিৎসাধীন শত শত মানুষের জন্য দিনরাত ২৪ ঘণ্টা রক্তের প্রচণ্ড চাহিদা সৃষ্টি হয়। বিশেষ করে প্রসূতি মায়ের সিজারিয়ান অপারেশন, তীব্র থ্যালাসেমিয়া আক্রান্ত ফুটফুটে শিশুদের প্রতি মাসের নিয়মিত রক্তের চাহিদা মেটানো এবং আকস্মিক সড়ক দুর্ঘটনার কঠিন মুহুর্তে রক্তের অভাব পূরণে আমাদের রোভার স্বেচ্ছাসেবকরা সবসময় জরুরি মোবাইল হটলাইনের মাধ্যমে সুসংগঠিত হয়ে ছুটে যায়।
            </p>
            <p>
              আমাদের এই আধুনিক ডিজিটাল প্ল্যাটফর্মের মাধ্যমে আমরা সম্পূর্ণ ফ্রিতে ও জনকল্যাণার্থে একটি স্বয়ংসম্পূর্ণ, সুচারু রক্তদাতার ডায়েরি বা লাইভ অনুসন্ধান ব্যবস্থা বজায় রেখেছি। যেখানে পলিটেকনিকের সাহসী শিক্ষার্থী এবং নির্ভরযোগ্য দাতা নাগরিকগণ তাদের রক্তের সক্রিয় গ্রুপ ও প্রত্যক্ষ যোগাযোগের সঠিক নম্বর প্রদান করে নিজেদের মহৎ সেবার তালিকায় অন্তর্ভুক্ত করছেন। বিরল বা নেগেটিভ গ্রুপের রক্তের সংকটে আমাদের নিবেদিত রোভাররা সরাসরি ডোনার ম্যানেজ করে হাসপাতালে স্থানান্তর কাজের সুন্দর সমন্বয় করে থাকে।
            </p>
            <p>
              নিয়মিত স্বেচ্ছায় রক্তদান আমাদের স্কাউটদের মাঝে পারস্পরিক একাত্মতা ও সহানুভূতি সৃষ্টি করে। প্রতি ৩ বা ৪ মাস পর পর যথাযথ নিয়মে রক্ত প্রদানের মধ্য দিয়ে স্কাউট ও সাধারণ শিক্ষার্থীরা নিজেদের যেমন রোগবালাইমুক্ত রাখতে পারছেন, ঠিক তেমনি একটি কুসংস্কারমুক্ত, সুস্বাস্থ্যবান ও দূরদর্শী ভ্রাতৃত্বপূর্ণ সুশীল সমাজ গড়ে তুলতে বিপ্লবের জন্ম দিচ্ছেন। আমাদের মূল মন্ত্রই হলো: নিজের রক্ত দিয়ে হাসুক অপর কোনো অমূল্য জীবন।
            </p>
          </div>
        </article>

        {/* Article 3: Scouting Values & Scout Laws (Elaborated) */}
        <article className="bg-[#FAF7F2] p-5 rounded-xl shadow-md border border-[#E6DEC9] space-y-3.5 transition-all hover:shadow-lg">
          <div className="flex items-center gap-2.5 border-b pb-3 border-[#E6DEC9]">
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-100 text-amber-700">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[8px] font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                স্কাউট প্রতিজ্ঞা, বিধি ও বৈশ্বিক মূল্যবোধ
              </span>
              <h3 className="text-xs font-bold text-gray-900 mt-1">
                স্কাউটিং এর মূল জীবনাচরণ ও ৭টি শাশ্বত আইন
              </h3>
            </div>
          </div>
          
          <div className="text-gray-800 text-[10px] leading-relaxed space-y-3 text-justify">
            <p>
              লর্ড রবার্ট স্টিফেনসন স্মিথ ব্যাডেন পাওয়েল ১৯০৭ সালে যে বৈশ্বিক আন্দোলনের শুভ সূচনা করেছিলেন, তা আজকে পৃথিবীর দিকে দিকে তরুণদের চরিত্র উন্নয়নের সর্বশ্রেষ্ঠ চালিকাশক্তি হিসেবে প্রতিষ্ঠিত হয়েছে। স্কাউটিং এর মূল শিক্ষা কেবল ক্লাসরুমের চার দেয়ালে সীমাবদ্ধ নয়, এটি মূলত দৈনন্দিন জীবনযাপনের উন্নত ও রুচিশীল প্রক্রিয়া। স্কাউটিং এর অপরিহার্য চালিকাশক্তি লুকিয়ে আছে আমাদের মহৎ প্রতিজ্ঞা এবং চিরন্তন ৭টি আইনের মাঝে যা রোভারদের সর্বদা সৎ ও খাঁটি মানুষ হিসেবে পথ চলতে পরিচালিত করে:
            </p>
            
            <ul className="grid grid-cols-1 gap-2 pt-2">
              <li className="flex items-start gap-2 bg-[#F3ECE0] p-2.5 rounded-lg border border-[#E6DEC9]">
                <CheckCircle className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-gray-900 block mb-0.5">১. স্কাউট আত্মমর্যাদায় বিশ্বাসী:</span> 
                  একজন রোভার স্কাউটের ব্যক্তিগত চারিত্রিক সততাই হলো তার সবচেয়ে বড় কাজের পরিচয়। নিজের কথা ও কাজের মধ্য দিয়ে সবার মাঝে সর্বজনীন বিশ্বাস বজায় রাখা প্রতিটি স্কাউটের অনড় প্রতিশ্রুতি।
                </div>
              </li>
              <li className="flex items-start gap-2 bg-[#F3ECE0] p-2.5 rounded-lg border border-[#E6DEC9]">
                <CheckCircle className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-gray-900 block mb-0.5">২. স্কাউট সবার বন্ধু এবং পরোপকারী:</span> 
                  জাতী, ধর্ম, বর্ণ নির্বিশেষে প্রতিটি মানুষের প্রতি অকৃত্রিম বন্ধুত্ব গড়ে তোলাই আমাদের লক্ষ্য। জগতের সব মানুষের বিপদে কোনো রূপ সংকীর্ণতা ছাড়াই সহযোগিতার বন্ধন সৃষ্টি করা স্কাউটিংয়ের অন্যতম মূল ভিত্তি।
                </div>
              </li>
              <li className="flex items-start gap-2 bg-[#F3ECE0] p-2.5 rounded-lg border border-[#E6DEC9]">
                <CheckCircle className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-gray-900 block mb-0.5">৩. স্কাউট বিনয়ী ও অনুগত:</span> 
                  বড়দের প্রতি বিনম্র আচরণ, শ্রদ্ধাবোধ এবং দেশের প্রচলিত আইন ও অনুশাসনের প্রতি পরম আনুগত্য প্রকাশ করা একজন পরিপক্ক ও দায়িত্বশীল আদর্শ স্কাউটের সার্বক্ষণিক সুবর্ণ গুণাবলি।
                </div>
              </li>
              <li className="flex items-start gap-2 bg-[#F3ECE0] p-2.5 rounded-lg border border-[#E6DEC9]">
                <CheckCircle className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-gray-900 block mb-0.5">৪. স্কাউট জীবের প্রতি দয়ালু:</span> 
                  পৃথিবীর প্রতিটি অবলা জীব ও প্রাকৃতিক সম্পদের প্রতি সহানুভূতি প্রদর্শন ও সুস্থ পরিবেশ রক্ষায় সক্রিয় অংশগ্রহণ করা স্কাউটের অপরিহার্য ব্রত। সবুজ পৃথিবী তৈরিতে তারা সবসময় বৃক্ষরোপণ করে থাকে।
                </div>
              </li>
              <li className="flex items-start gap-2 bg-[#F3ECE0] p-2.5 rounded-lg border border-[#E6DEC9]">
                <CheckCircle className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-gray-900 block mb-0.5">৫. স্কাউট সদাপ্রফুল্ল:</span> 
                  যেকোনো কঠিন প্রতিকূলতা বা প্রতিকূল আবহাওয়ার মাঝে হাহুতাশ না করে, হাসিমুখে এবং অবিচল আত্মবিশ্বাসের সাথে সমস্ত প্রকার সমস্যা বা সংকটের সমাধান খুঁজে বের করা প্রতিটি স্কাউটের প্রধান শক্তি।
                </div>
              </li>
              <li className="flex items-start gap-2 bg-[#F3ECE0] p-2.5 rounded-lg border border-[#E6DEC9]">
                <CheckCircle className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-gray-900 block mb-0.5">৬. স্কাউট মিতব্যয়ী:</span> 
                  সময়, ব্যক্তিগত সম্পদ এবং অন্যের কষ্টার্জিত অর্থের অপচয় বর্জন করে সঠিক উপায়ে হিসাব করে জীবন পরিচালনা করা স্কাউটের মহত্তম অভ্যাস। যা তাদের কঠোর নিয়মানুবর্তী হতে শিক্ষা দেয়।
                </div>
              </li>
              <li className="flex items-start gap-2 bg-[#F3ECE0] p-2.5 rounded-lg border border-[#E6DEC9]">
                <CheckCircle className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold text-gray-900 block mb-0.5">৭. স্কাউট চিন্তা, কথা ও কাজে নির্মল:</span> 
                  নিজের অন্তরকে যাবতীয় কলুষতা ও খারাপ প্ররোচনা থেকে মুক্ত রেখে পরিচ্ছন্ন চিন্তা, মিষ্টভাষী বাক্য ও সুন্দর সমাজকল্যাণমূলক ইতিবাচক কাজে নিয়োজিত থাকার মধ্য দিয়ে তারা নিজেকে আলোকিত আত্মায় পরিণত করে।
                </div>
              </li>
            </ul>

            <p className="pt-2">
              রাজশাহী পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপ এই চিরন্তন মূল্যবোধ ও শাশ্বত বিধিবিধান অক্ষুণ্ণ রেখে চলে। এখানকার প্রতিটি সদস্য তাদের দৈনন্দিন জীবনে স্কাউট আইনের যথাযথ বাস্তবায়ন ঘটিয়ে এবং পলিটেকনিকে সুনাম বৃদ্ধিতে নিরলস কাজ করে যাচ্ছে। আমাদের দৃঢ় প্রত্যাশা হলো, এই স্কাউট বিধিগুলোর আলোয় আলোকিত হয়ে আমাদের প্রতিটি সতীর্থ দেশ ও বৈশ্বিক পর্যায়ে এক একজন গর্বিত সোনার মানুষ হিসেবে সুপ্রতিষ্ঠিত হবে।
            </p>
          </div>
        </article>

      </div>

       {/* Quick Footnote Branding with Paper-textured Aesthetic matching overall Flow */}
      <footer id="about-footer-section" className="relative px-6 py-9 border-t border-[#E6DEC9] text-center bg-[#FAF7F2] mt-8 text-[10px] text-gray-500 shadow-inner rounded-b-2xl">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-600 via-[#C1121F] to-red-800"></div>
        
        <div className="space-y-1">
          <p className="font-extrabold text-[#C1121F] tracking-wide text-xs">রাজশাহী পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপ © ২০২৬</p>
          <p className="text-[9px] text-gray-400 font-medium max-w-md mx-auto leading-relaxed">
            মানবতা ও সার্বক্ষণিক সেবার ক্ষেত্রে সদা প্রস্তুত এক মহান তরুণের ব্রত ও বৈশ্বিক ঐক্য
          </p>
        </div>

        {/* Brand Connectivity Channels in beautifully curated grid */}
        <div className="mt-6">
          <p className="text-[9px] uppercase tracking-widest font-extrabold text-[#C1121F]/80 mb-3 font-mono">
            CONNECTED CHANNELS • আমাদের সংযোগ মাধ্যম
          </p>
          <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
            <a 
              href="https://www.facebook.com/RPIRSG/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-1.5 bg-white hover:bg-[#1877F2]/5 text-[#1877F2] border border-[#E6DEC9] hover:border-[#1877F2]/30 p-2.5 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#1877F2]/10 flex items-center justify-center transition-transform group-hover:scale-110">
                <Facebook className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-extrabold font-sans">Facebook</span>
            </a>

            <a 
              href="https://www.linkedin.com/company/rpirsg"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-1.5 bg-white hover:bg-[#0A66C2]/5 text-[#0A66C2] border border-[#E6DEC9] hover:border-[#0A66C2]/30 p-2.5 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#0A66C2]/10 flex items-center justify-center transition-transform group-hover:scale-110">
                <Linkedin className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-extrabold font-sans">LinkedIn</span>
            </a>

            <a 
              href="https://www.youtube.com/channel/UCPm1ZBjFIAj-UkGfL-driWw"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-1.5 bg-white hover:bg-[#FF0000]/5 text-[#FF0000] border border-[#E6DEC9] hover:border-[#FF0000]/30 p-2.5 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#FF0000]/10 flex items-center justify-center transition-transform group-hover:scale-110">
                <Youtube className="w-4.5 h-4.5" />
              </div>
              <span className="text-[9px] font-extrabold font-sans">YouTube</span>
            </a>
          </div>
        </div>

        {/* Enhanced Interactive Share Interface */}
        <div className="mt-8 pt-6 border-t border-dashed border-[#E6DEC9] max-w-sm mx-auto">
          <div className="bg-white p-4 rounded-2xl border border-[#E6DEC9] shadow-sm space-y-3.5">
            <div className="flex items-center justify-center gap-1.5 text-center">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="font-extrabold text-gray-700 text-[10px] uppercase tracking-wider font-sans">
                শেয়ার করে বন্ধুদের আমন্ত্রন জানান
              </p>
            </div>

            {/* Hidden raw address link, wrapped purely inside an interactive elegant action button */}
            <button
              onClick={handleShareClick}
              className={`w-full py-2.5 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer ${
                copied 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100' 
                  : 'bg-[#C1121F] hover:bg-[#9e0e1a] text-white shadow-red-100'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 animate-bounce" />
                  <span className="text-[10px] uppercase tracking-wider font-sans">লিঙ্ক কপি করা হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-wider font-sans">ড্যাশবোর্ড লিঙ্ক কপি করুন</span>
                </>
              )}
            </button>

            {/* Quick Share to Social Networks Direct Buttons */}
            <div className="space-y-2">
              <p className="text-[8px] text-gray-400 font-semibold tracking-wider uppercase">— সরাসরি সোশ্যাল শেয়ার করুন —</p>
              <div className="flex justify-center gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    'রাজশাহী পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপ এর অফিশিয়াল ড্যাশবোর্ডটি দেখুন: ' + 
                    (typeof window !== 'undefined' ? window.location.origin : 'https://rpirsg.org')
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25d366] border border-[#25D366]/30 py-1.5 rounded-lg text-[9px] font-bold transition-all"
                  title="WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                  <span>WhatsApp</span>
                </a>
                
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.origin : 'https://rpirsg.org'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/30 py-1.5 rounded-lg text-[9px] font-bold transition-all"
                  title="Facebook"
                >
                  <Facebook className="w-3.5 h-3.5 shrink-0" />
                  <span>Facebook</span>
                </a>

                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.origin : 'https://rpirsg.org'
                  )}&text=${encodeURIComponent('রাজশাহী পলিটেকনিক ইনস্টিটিউট রোভার স্কাউট গ্রুপ এর অফিশিয়াল ড্যাশবোর্ড!')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 bg-[#0088CC]/10 hover:bg-[#0088CC]/20 text-[#0088cc] border border-[#0088CC]/30 py-1.5 rounded-lg text-[9px] font-bold transition-all"
                  title="Telegram"
                >
                  <Send className="w-3.5 h-3.5 shrink-0" />
                  <span>Telegram</span>
                </a>
              </div>
            </div>

            <p className="text-[7.5px] text-gray-400 leading-normal max-w-[280px] mx-auto">
              সহজেই রাজশাহী পলিটেকনিক রোভার স্কাউট গ্রুপের এই ড্যাশবোর্ডটি সকল কো-স্কাউট ও শুভাকাঙ্ক্ষীদের সাথে ছড়িয়ে দিন।
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
