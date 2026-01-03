import React from 'react';
import { Flame, Info } from 'lucide-react';

export default function GenreHeatmap({ ratings }) {
  if (!ratings || !Array.isArray(ratings) || ratings.length === 0) return null;

  const tagStats = ratings.reduce((acc, curr) => {
    const tags = curr.artist_tags || [];
    const score = curr.score || 0;
    tags.forEach(tagName => {
      if (!acc[tagName]) acc[tagName] = { name: tagName, count: 0, totalScore: 0 };
      acc[tagName].count += 1;
      acc[tagName].totalScore += score;
    });
    return acc;
  }, {});

  const topTags = Object.values(tagStats).sort((a, b) => b.count - a.count).slice(0, 15);
  if (topTags.length === 0) return null;

  return (
    <div className="mt-8 bg-[#fdfbf7] p-8 border-2 border-black">
      {/* Header Section - Matches Scoring Dist Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 border-b border-black/10 pb-6 gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-black">
            <Flame className="w-5 h-5 text-amber-500" />
            <h4 className="text-2xl font-cherry font-black uppercase tracking-tighter">
              SONIC DNA HEATMAP
            </h4>
          </div>
          <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mt-1 flex items-center gap-2">
            <Info className="w-3 h-3" />
            Mapping stylistic distribution
          </p>
        </div>

        {/* Legend - Clean & Integrated */}
        <div className="flex gap-4 text-[9px] font-black uppercase tracking-tighter text-black/60 pt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-amber-400" /> <span>High (Avg 8+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-black" /> <span>Frequent</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {topTags.map((tag, idx) => {
          const avg = tag.totalScore / tag.count;
          const isHighRated = avg >= 8;
          
          let sizeClass = "text-sm";
          if (tag.count > 10) sizeClass = "text-xl";
          else if (tag.count > 5) sizeClass = "text-lg";
          
          return (
            <div 
              key={idx}
              className={`px-4 py-2 border-2 flex flex-col items-center select-none transition-colors
                ${isHighRated 
                  ? 'bg-amber-400 border-black text-black' 
                  : 'bg-black border-black text-white'}`}
            >
              <span className={`font-cherry font-black uppercase italic leading-none mb-1 ${sizeClass}`}>
                {tag.name}
              </span>
              
              <div className="flex gap-2 items-center font-black">
                <span className="text-[8px] uppercase opacity-60">Hits: {tag.count}</span>
                <div className={`w-0.5 h-0.5 rounded-full ${isHighRated ? 'bg-black/30' : 'bg-white/30'}`} />
                <span className={`text-[8px] uppercase italic ${isHighRated ? 'text-black' : 'text-amber-400'}`}>
                  Avg: {avg.toFixed(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-[9px] font-bold text-black/20 uppercase tracking-[0.3em] italic">
        * Aggregated archive performance index • {ratings.length} Entries
      </p>
    </div>
  );
}