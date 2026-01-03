import React from 'react';
import { BarChart3, Info } from "lucide-react";

export default function ScoreDistribution({ distribution }) {
  if (!distribution) return null;

  const allScores = Array.from({ length: 10 }, (_, i) => i + 1);
  const distMap = Object.fromEntries(
    distribution.map(({ score, count }) => [score, count])
  );

  const maxCount = Math.max(1, ...allScores.map((score) => distMap[score] || 0));
  const totalRatings = allScores.reduce((sum, score) => sum + (distMap[score] || 0), 0);

  return (
    <div className="mt-8 bg-[#fdfbf7] border-2 border-black p-8">
      
      {/* 1. Lightened Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-black/10 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-black">
            <BarChart3 className="w-5 h-5 opacity-50" />
            <h4 className="text-2xl font-cherry font-black uppercase tracking-tighter">
              Scoring Distribution
            </h4>
          </div>
          <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mt-1">
            Archive Density Index • {totalRatings} Entries
          </p>
        </div>

        {/* Subtle Legend */}
        <div className="flex gap-4 text-[9px] font-black uppercase tracking-tighter text-black/60">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-amber-400" /> <span>High (8-10)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-black" /> <span>Standard (1-7)</span>
          </div>
        </div>
      </div>

      {/* 2. Slimmer Data Rows */}
      <div className="space-y-1">
        {[...allScores].reverse().map((score) => {
          const count = distMap[score] || 0;
          const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;
          const isElite = score >= 8;

          return (
            <div key={score} className="flex items-center gap-4 py-1 group">
              {/* Clean Score Label */}
              <span className={`w-6 font-cherry font-black text-sm italic ${isElite ? 'text-amber-500' : 'text-black/40'}`}>
                {score}
              </span>

              {/* Minimalist Bar */}
              <div className="flex-1 h-4 bg-black/[0.03] relative overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out 
                    ${isElite ? 'bg-amber-400' : 'bg-black'}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              {/* Quiet Stats */}
              <div className="w-16 text-right">
                <span className="text-[10px] font-black text-black leading-none">
                  {count} <span className="opacity-30 font-normal">HITS</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Integrated Footer */}
      <div className="mt-8 pt-4 border-t border-black/5 flex justify-between items-center text-[9px] font-bold text-black/30 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-2">
          <Info className="w-3 h-3" />
          <span>Higher bar length indicates statistical frequency</span>
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
        </div>
      </div>
    </div>
  );
}