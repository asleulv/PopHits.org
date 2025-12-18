"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Calendar, Clock } from 'lucide-react';

export default function NumberOneHitsSection({ numberOneHits }) {
  const [randomHits, setRandomHits] = useState([]);

  useEffect(() => {
    if (numberOneHits && numberOneHits.length > 0) {
      const shuffled = [...numberOneHits].sort(() => Math.random() - 0.5);
      setRandomHits(shuffled.slice(0, 8));
    }
  }, [numberOneHits]);

  if (!numberOneHits || numberOneHits.length === 0) {
    return (
      <section className="relative mb-12 md:w-full w-[100vw] ml-[50%] translate-x-[-50%] bg-yellow-50 p-10 md:rounded-3xl rounded-none border-y-4 md:border-4 border-black border-dashed">
        <div className="flex justify-center items-center py-12 text-center">
          <p className="font-black uppercase tracking-widest text-slate-900">Scanning Records...</p>
        </div>
      </section>
    );
  }

  return (
    /* Center-pull logic to fix the lopsided slide on mobile */
    <section className="relative mb-12 md:w-full w-[100vw] ml-[50%] translate-x-[-50%] bg-yellow-50 p-6 md:p-10 md:rounded-3xl rounded-none md:border-4 border-y-4 border-x-0 border-black animate-fadeIn">
      
      {/* HEADER: Centered for BOTH mobile and desktop */}
      <div className="flex flex-col items-center mb-10 px-2 md:px-0 text-center">
        <div className="bg-blue-950 text-white px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px] mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
          <Trophy size={14} fill="currentColor" /> Peak Achievement
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic uppercase text-slate-900 leading-none">
          The <span className="text-blue-950">Number Ones</span>
        </h2>
      </div>

      {/* GRID: 2 columns on mobile to keep it compact */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 px-2 md:px-0">
        {randomHits.map((song) => (
          <div
            key={song.id}
            className="bg-blue-950 border-2 md:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden"
          >
            <div className="p-3 md:p-5 flex-grow flex flex-col justify-between text-center">
              <div>
                <Link href={`/songs/${song.slug}`} className="group">
                  <h3 className="text-xs md:text-lg font-black uppercase leading-tight mb-1 md:mb-2 text-yellow-400 group-hover:text-white transition-colors line-clamp-2">
                    {song.title}
                  </h3>
                </Link>
                
                <p className="text-[9px] md:text-sm mb-2 md:mb-3 font-bold uppercase text-white/90">
                  {song.artist}
                </p>
                
                <div className="flex items-center justify-center gap-1 text-[9px] md:text-[11px] font-mono font-black text-yellow-400/70">
                  <Calendar size={10} />
                  <span>{song.year}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center justify-center gap-1 text-[8px] md:text-[10px] font-black uppercase text-blue-950 mb-3 bg-yellow-400 py-1 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span>{song.weeks_on_chart} WKS TOP</span>
                </div>
                
                <Link
                  href={`/songs/${song.slug}`}
                  className="block w-full text-center text-[9px] md:text-[10px] bg-white text-black border-2 border-black py-1.5 font-black uppercase hover:bg-yellow-400 transition-all active:translate-y-0.5"
                >
                  View Hit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER: Centered on mobile and desktop */}
      <div className="text-center mt-12 px-2 md:px-0">
        <Link
          href="/songs?filter=number-one"
          className="inline-block px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs border-2 border-black hover:bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition-all"
        >
          View Full Archive →
        </Link>
      </div>
    </section>
  );
}