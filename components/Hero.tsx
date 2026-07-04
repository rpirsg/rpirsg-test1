'use client'

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export default function Hero() {
  return (
    <section className="relative py-16 bg-transparent overflow-hidden border-b border-gray-100">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-50 to-transparent opacity-50 -z-0"></div>

      <div className="max-w-7xl mx-auto px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
                <span className="text-[#C1121F] text-xs font-bold uppercase tracking-widest">Emergency Response Active</span>
              </div>
              
              <h1 className="font-heading text-6xl font-black text-[#0B1F3B] leading-[1.1] mb-6">
                Donate Blood,<br/><span className="text-[#C1121F]">Save Lives.</span>
              </h1>
              
              <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-md italic font-light">
                RPIRSG connects voluntary blood donors with emergency patients, ensuring rapid, reliable, and life-saving blood support across Rajshahi.
              </p>
              
              <div className="flex gap-4">
                <Button size="lg" className="bg-[#0B1F3B] text-white px-6 py-3 rounded-lg text-sm font-bold shadow-xl">Find Blood Donor</Button>
                <Button size="lg" variant="outline" className="border-2 border-[#C1121F] text-[#C1121F] px-6 py-3 rounded-lg text-sm font-bold">Become a Volunteer</Button>
              </div>
            </motion.div>

            <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
                {[
                  { label: "Registered Donors", value: "4,281" },
                  { label: "Active Online", value: "142" },
                  { label: "Lives Saved", value: "982" },
                  { label: "Camps Hosted", value: "34" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white p-5 rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 flex flex-col items-center text-center">
                        <span className="text-3xl font-black text-[#C1121F]">{stat.value}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{stat.label}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
