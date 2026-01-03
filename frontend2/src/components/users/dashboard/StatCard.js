import React from 'react';

export default function StatCard({ label, value, subtext, icon: Icon, colorClass = "text-amber-600" }) {
  return (
    <div className="bg-[#fdfbf7] border-2 border-black p-6 flex flex-col items-center justify-center relative min-w-[140px] flex-1 group transition-colors hover:bg-white">
      {/* 1. Flattened Icon - No more floating shadow */}
      <div className="absolute -top-4 bg-white border-2 border-black rounded-full p-2.5 transition-transform group-hover:scale-110">
        {Icon && <Icon className="w-4 h-4 text-black opacity-80" />}
      </div>

      <div className="mt-2 text-center">
        {/* 2. The Big Metric */}
        <p className={`text-4xl md:text-5xl font-black font-cherry italic tracking-tighter leading-none mb-2 ${colorClass}`}>
          {value}
        </p>
        
        {/* 3. The Label - Spaced out like Archive Metadata */}
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black leading-none">
          {label}
        </p>

        {/* 4. Subtext - Clean and Quiet */}
        {subtext && (
          <div className="mt-3 pt-2 border-t border-black/5">
            <p className="text-[8px] font-black text-black/20 uppercase tracking-widest leading-tight max-w-[120px] mx-auto group-hover:text-black/40 transition-colors">
              {subtext}
            </p>
          </div>
        )}
      </div>

      {/* Industrial Detail - Bottom Corner */}
      <div className="absolute bottom-1 right-1 opacity-10">
        <div className="w-2 h-2 border-r border-b border-black" />
      </div>
    </div>
  );
}