import React from 'react';
import Link from 'next/link';
import { Disc3, Settings, ShieldCheck, Fingerprint, Verified } from "lucide-react";
import { decadeTheme } from '@/lib/decadeTheme';

export default function ProfileHeader({ userProfile, ratings = [] }) {
  // 1. Safety Guard: Calculate DNA logic internally to prevent "undefined" errors
  const decadeCounts = (ratings || []).reduce((acc, curr) => {
    const year = curr.song_year;
    const score = curr.score || 0;
    if (year) {
      const decade = Math.floor(parseInt(year) / 10) * 10;
      const weight = score >= 8 ? 5 : 1; 
      acc[decade] = (acc[decade] || 0) + weight;
    }
    return acc;
  }, {});

  const keys = Object.keys(decadeCounts);
  const bestDecade = keys.length > 0 ? keys.reduce((a, b) => decadeCounts[a] > decadeCounts[b] ? a : b) : 1980;
  
  // 2. Fallback Theme to prevent the ".bg" crash
  const theme = decadeTheme[bestDecade] || { bg: "bg-purple-400", border: "border-purple-600" };
  const textColorClass = theme.bg.replace('bg-', 'text-').replace('400', '600');

  const eraTitles = {
    1930: "Jazz Age Aficionado", 1940: "Big Band Believer", 1950: "Golden Age Crooner",
    1960: "Revolutionary Rocker", 1970: "Disco & Soul Explorer", 1980: "Neon Pop Enthusiast",
    1990: "Alternative Icon", 2000: "Millennium Hitmaker", 2010: "Streaming Era Specialist",
    2020: "Modern Chart Historian"
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 mb-16 bg-[#fdfbf7] border-2 border-black relative overflow-hidden flex flex-col md:flex-row min-h-[300px]">
      {/* Side Accent Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-2.5 ${theme.bg}`} />

      {/* LEFT PANE: Identity */}
      <div className="md:w-1/3 p-8 border-b-2 md:border-b-0 md:border-r-2 border-black flex flex-col justify-between bg-white/30 pl-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40">Personnel ID</span>
          </div>
          <h1 className="font-cherry font-black text-6xl uppercase italic tracking-tighter text-black leading-none">
            {userProfile?.username || "---"}
          </h1>
          <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest break-all">
            {userProfile?.email}
          </p>
        </div>
        <div className="pt-6">
          <Link href="/profile/update" className="inline-block text-[9px] font-black uppercase border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-all">
            Settings
          </Link>
        </div>
      </div>

      {/* RIGHT PANE: DNA Results */}
      <div className="flex-1 p-8 md:p-12 relative flex flex-col justify-center bg-white/50">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Disc3 className="w-40 h-40" /></div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <Fingerprint className="w-4 h-4 text-black/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 italic">Sonic DNA Profile • Analysis v1.2</span>
          </div>
          <h3 className={`text-5xl md:text-8xl font-cherry font-black italic uppercase leading-[0.85] tracking-tighter ${textColorClass}`}>
            {eraTitles[bestDecade] || "Hit Music Expert"}
          </h3>
          <div className="flex items-center gap-6 pt-8 border-t border-black/10">
            <div className={`px-3 py-1 border-2 border-black text-xs font-black uppercase italic ${textColorClass}`}>EST. {bestDecade}s</div>
            <div className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{ratings.length} Entries Analyzed</div>
          </div>
        </div>
      </div>
    </div>
  );
}