import React from 'react';
import { decadeTheme } from '@/lib/decadeTheme';
import { Fingerprint, Verified } from "lucide-react";

export default function SignatureEra({ ratings }) {
  if (!ratings || !Array.isArray(ratings) || ratings.length === 0) return null;

  const decadeCounts = ratings.reduce((acc, curr) => {
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
  if (keys.length === 0) return null;

  const bestDecade = keys.reduce((a, b) => 
    decadeCounts[a] > decadeCounts[b] ? a : b
  );

  const theme = decadeTheme[bestDecade] || { 
    bg: "bg-black", 
    border: "border-black", 
    color: "text-black"
  };

  const eraTitles = {
    1930: "Jazz Age Aficionado",
    1940: "Big Band Believer",
    1950: "Golden Age Crooner",
    1960: "Revolutionary Rocker",
    1970: "Disco & Soul Explorer",
    1980: "Neon Pop Enthusiast",
    1990: "Alternative Icon",
    2000: "Millennium Hitmaker",
    2010: "Streaming Era Specialist",
    2020: "Modern Chart Historian"
  };

  // Convert bg-color-400 to text-color-600 for better readability on bone background
  const textColorClass = theme.bg.replace('bg-', 'text-').replace('400', '600');
  const borderColorClass = theme.bg.replace('bg-', 'border-');

  return (
    <div className="mt-8 mb-4 bg-[#fdfbf7] border-2 border-black relative overflow-hidden transition-all duration-500">
      
      {/* 1. Left Accent Bar - Using the Decade Color */}
      <div className={`absolute left-0 top-0 bottom-0 w-3 ${theme.bg}`} />

      <div className="p-8 pl-10">
        {/* Top Metadata Row */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-black/20" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 leading-none">
                Sonic DNA Profile
              </p>
            </div>
            <p className="text-[9px] font-bold text-black/20 uppercase tracking-widest leading-none">
              Identity Verified • Archive Analysis v1.2
            </p>
          </div>
          <Verified className={`w-6 h-6 ${textColorClass} opacity-40`} />
        </div>
        
        {/* Main Title */}
        <h3 className={`text-4xl md:text-6xl font-cherry font-black italic uppercase leading-none tracking-tighter mb-4 ${textColorClass}`}>
          {eraTitles[bestDecade] || "Hit Music Expert"}
        </h3>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4 border-t border-black/5">
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <span className={`inline-block border-2 ${borderColorClass} ${textColorClass} text-[10px] font-black px-3 py-1 uppercase italic`}>
                  EST. {bestDecade}s
                </span>
                <div className="h-px w-8 bg-black/10" />
                <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">
                  {ratings.length} Cross-Referenced Data Points
                </p>
             </div>
             
             <p className="text-[10px] font-bold text-black/30 uppercase leading-tight max-w-sm">
               Determined by weighted algorithmic frequency. 
               <span className="text-black/50 ml-1 italic">Top-tier scores (8-10) weighted at 5.0x multiplier.</span>
             </p>
          </div>

          {/* Clean Industrial Serial Number */}
          <div className="text-right">
            <p className="font-mono text-[9px] text-black/10 uppercase vertical-text">
              ID-{bestDecade}-{(ratings.length * 7).toString(16).toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}