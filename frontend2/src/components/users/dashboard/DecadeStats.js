import React from 'react';
import { Star, Info } from "lucide-react";

// Desaturated, archival-ink versions of the decade colors
const decadeStyles = {
  1930: "bg-rose-900/10 border-rose-900/30 text-rose-900",
  1940: "bg-orange-900/10 border-orange-900/30 text-orange-900",
  1950: "bg-blue-900/10 border-blue-900/30 text-blue-900",
  1960: "bg-green-900/10 border-green-900/30 text-green-900",
  1970: "bg-yellow-700/10 border-yellow-700/30 text-yellow-800",
  1980: "bg-purple-900/10 border-purple-900/30 text-purple-900",
  1990: "bg-red-900/10 border-red-900/30 text-red-900",
  2000: "bg-indigo-900/10 border-indigo-900/30 text-indigo-900",
  2010: "bg-amber-600/10 border-amber-600/30 text-amber-700",
  2020: "bg-cyan-900/10 border-cyan-900/30 text-cyan-900",
};

export default function DecadeStats({ averages }) {
  const activeDecades = averages
    ?.filter(d => d.avg_score !== null)
    .sort((a, b) => a.decade - b.decade);

  if (!activeDecades || activeDecades.length === 0) return null;

  return (
    <div className="mt-8 bg-[#fdfbf7] border-2 border-black p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-black/10 pb-6 gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-black text-left">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h4 className="text-2xl font-cherry font-black uppercase tracking-tighter">
              Decade Power Rankings
            </h4>
          </div>
          <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] mt-1 text-left">
            Mean performance index by chronological era
          </p>
        </div>
        
        <div className="hidden md:block text-[9px] font-black uppercase tracking-tighter text-black/20 pb-1">
          Index Ref: {new Date().getFullYear()} / METRIC-7
        </div>
      </div>
      
      {/* The Chart Container */}
      <div className="relative h-[200px] w-full max-w-4xl mx-auto mt-10">
        {/* Subtle Baseline */}
        <div className="absolute bottom-[30px] left-0 right-0 h-px bg-black z-10" />

        <div className="flex items-end justify-between h-full w-full gap-2 md:gap-4">
          {activeDecades.map(({ decade, avg_score }) => {
            const barHeightPercent = (avg_score / 10) * 100;
            const style = decadeStyles[decade] || "bg-black/5 border-black/10 text-black/40";

            return (
              <div key={decade} className="group relative flex-1 flex flex-col items-center h-full">
                
                {/* Score Tag (Replaces the Bubble) */}
                <div 
                  className={`absolute z-20 px-1.5 py-0.5 border-x border-t border-black transition-all group-hover:bg-black group-hover:text-white ${style}`}
                  style={{ bottom: `calc(30px + ${barHeightPercent}%)` }} 
                >
                  <span className="text-[9px] md:text-[10px] font-black tracking-tighter">
                    {avg_score.toFixed(1)}
                  </span>
                </div>

                {/* The Bar */}
                <div 
                  className={`absolute bottom-[30px] w-full border-x border-t border-black transition-all duration-700 ease-out ${style}`}
                  style={{ height: `${barHeightPercent}%` }}
                >
                  {/* Fine horizontal hatching lines effect (optional) */}
                  <div className="w-full h-full opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#000_2px,#000_3px)]" />
                </div>

                {/* Decade Label */}
                <div className="absolute bottom-0 w-full text-center h-[20px] flex items-center justify-center">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tighter text-black/40 group-hover:text-black">
                    {decade.toString().slice(2)}s
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 pt-4 border-t border-black/5 flex justify-between items-center text-[8px] font-black text-black/20 uppercase tracking-[0.3em]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 border border-black/20" />
          <span>Metric: Weighted Mean Average</span>
        </div>
        <span>Archive Record #{(averages.length * 12).toString(16).toUpperCase()}</span>
      </div>
    </div>
  );
}