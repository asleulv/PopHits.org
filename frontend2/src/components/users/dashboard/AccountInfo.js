import React from 'react';
import Link from 'next/link';
import { Disc3, Settings, ShieldCheck } from "lucide-react";

export default function AccountInfo({ userProfile }) {
  if (!userProfile) return (
    <div className="flex justify-center items-center h-24 bg-[#fdfbf7] border-2 border-black border-dashed">
      <p className="font-cherry font-black animate-pulse uppercase italic text-black/20 text-xs tracking-widest">
        Accessing Secure Archive...
      </p>
    </div>
  );

  return (
    <div className="bg-[#fdfbf7] border-2 border-black p-10 max-w-xl mx-auto text-center relative mt-20 mb-16 transition-all">
      
      {/* THE DISC-3 ICON BADGE - Cleaned up to match new Icon logic */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2">
        <div className="bg-white border-2 border-black rounded-full p-4 group transition-colors hover:bg-amber-400">
          <Disc3 className="w-10 h-10 text-black transition-transform duration-1000 group-hover:rotate-180" />
        </div>
      </div>

      <div className="pt-8 space-y-4">
        {/* Role Title - Matches 'Archive Audit' metadata tags */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <ShieldCheck className="w-3 h-3 text-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
            Certified Music Historian
          </span>
        </div>
        
        {/* Username - Large but flat */}
        <h1 className="font-cherry font-black text-6xl uppercase italic tracking-tighter text-black leading-none">
          {userProfile.username}
        </h1>
        
        {/* Email */}
        <p className="font-bold text-black/30 text-[10px] tracking-[0.2em] uppercase pb-2">
          {userProfile.email}
        </p>

        <div className="h-0.5 w-12 bg-amber-400 mx-auto" />
        
        {/* Action Button - Matches the 'Copy/Download' style */}
        <div className="pt-6">
          <Link 
            href="/profile/update" 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-2 border-black px-8 py-3 bg-white hover:bg-black hover:text-white transition-all group"
          >
            <Settings className="w-3 h-3 opacity-50 group-hover:opacity-100" />
            Update Credentials
          </Link>
        </div>
      </div>

      {/* Industrial Detail - Top corners */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 opacity-20">
         <div className="w-6 h-[1px] bg-black" />
         <div className="w-4 h-[1px] bg-black" />
      </div>
      <div className="absolute top-4 right-4 flex flex-col gap-1 opacity-20">
         <div className="w-6 h-[1px] bg-black" />
         <div className="w-4 h-[1px] bg-black text-right self-end" />
      </div>

      {/* Identification Footer */}
      <div className="mt-8 pt-4 border-t border-black/5 flex justify-center text-[8px] font-black text-black/20 uppercase tracking-[0.4em]">
        Archive Personnel ID: {userProfile.username?.substring(0, 3)}-{Math.floor(Math.random() * 9000) + 1000}
      </div>
    </div>
  );
}