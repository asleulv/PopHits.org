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
      <section className="mb-12 p-10 w-full bg-yellow-50 rounded-3xl border-4 border-black border-dashed">
        <div className="flex justify-center items-center py-12">
          <p className="font-black uppercase tracking-widest text-slate-400">Scanning Records...</p>
        </div>
      </section>
    );
  }

  return (
    /* Responsive Wrapper: full width/no radius on mobile, contained with radius on desktop */
    <section className="mb-12 md:w-full w-screen md:mx-0 mx-[-1rem] bg-yellow-50 p-6 md:p-10 md:rounded-3xl rounded-none md:border-4 border-y-4 border-x-0 border-black animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col items-center mb-10">
        <div className="bg-blue-950 text-white px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px] mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
          <Trophy size={14} fill="currentColor" /> Peak Achievement
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-center tracking-tighter italic uppercase text-slate-900 leading-none">
          The <span className="text-blue-950">Number Ones</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2 md:px-0">
        {randomHits.map((song) => (
          <div
            key={song.id}
            className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden"
          >
            {/* Card Header Color Block */}
            <div className="bg-blue-950 p-2 border-b-4 border-black flex justify-center">
               <Trophy size={16} className="text-yellow-400" />
            </div>

            <div className="p-5 flex-grow flex flex-col justify-between text-center">
              <div>
                <Link href={`/songs/${song.slug}`} className="group">
                  <h3 className="text-lg font-black uppercase leading-tight mb-2 group-hover:text-blue-950 transition-colors">
                    {song.title}
                  </h3>
                </Link>
                
                <p className="text-sm mb-3 font-bold uppercase text-slate-500">
                  by{" "}
                  <Link href={`/artist/${song.artist_slug}`} className="text-blue-950 hover:underline decoration-2 underline-offset-4 font-black">
                    {song.artist}
                  </Link>
                </p>
                
                <div className="flex items-center justify-center gap-2 text-[11px] font-mono font-black text-slate-400">
                  <Calendar size={12} className="text-blue-950" />
                  <Link href={`/year/${song.year}`} className="hover:text-black">
                    {song.year}
                  </Link>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-slate-100">
                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-blue-950 mb-4 bg-yellow-400 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Clock size={12} />
                  <span>{song.weeks_on_chart} WEEKS AT TOP</span>
                </div>
                
                {song.spotify_url && (
                  <a 
                    href={song.spotify_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full text-center text-[10px] bg-white border-2 border-black py-2 font-black uppercase hover:bg-yellow-400 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
                  >
                    Listen Now
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="text-center mt-12">
        <Link
          href="/songs?filter=number-one"
          className="inline-block px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs border-2 border-black hover:bg-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
        >
          View Full Archive List →
        </Link>
      </div>
    </section>
  );
}