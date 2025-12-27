"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Music2 } from 'lucide-react';

export default function NumberOneHitsSection({ numberOneHits }) {
  const [randomHits, setRandomHits] = useState([]);

  const formatArtist = (name) => {
    if (!name) return "";
    if (name.length > 20) { // Shorter threshold for mobile efficiency
      const splitters = [" feat.", " ft.", " featuring", " &", " /", " X "];
      for (const split of splitters) {
        if (name.toLowerCase().includes(split)) {
          return name.split(new RegExp(split, 'i'))[0] + "...";
        }
      }
    }
    return name;
  };

  useEffect(() => {
    if (numberOneHits && numberOneHits.length > 0) {
      const shuffled = [...numberOneHits].sort(() => Math.random() - 0.5);
      setRandomHits(shuffled.slice(0, 20));
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
    <section className="relative mb-12 md:w-full w-[100vw] ml-[50%] translate-x-[-50%] bg-yellow-50 p-4 md:p-10 md:rounded-3xl rounded-none md:border-4 border-y-4 border-x-0 border-black animate-fadeIn">
      
      {/* HEADER */}
      <div className="flex flex-col items-center mb-6 md:mb-8 px-2 md:px-0 text-center">
        <div className="bg-blue-950 text-white px-3 py-0.5 md:px-4 md:py-1 font-black uppercase tracking-[0.2em] text-[9px] md:text-[10px] mb-3 md:mb-4 flex items-center gap-2">
          <Trophy size={12} className="md:w-[14px]" fill="currentColor" /> Peak Achievement
        </div>
        <h2 className="text-2xl md:text-5xl font-black tracking-tighter italic uppercase text-slate-900 leading-none">
          The <span className="text-blue-950">Number Ones</span>
        </h2>
        <p className="text-sm font-mono mt-2 text-slate-600 text-center">
          The songs that went all the way to the top of the charts in the US!
        </p>
      </div>

      {/* ULTRA COMPACT PILL CLOUD */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 px-1 md:px-0">
        {randomHits.map((song) => (
          <Link
            key={song.id}
            href={`/songs/${song.slug}`}
            className="group flex items-center gap-1.5 md:gap-3 bg-blue-950 border-[1.5px] md:border-2 border-black px-2.5 py-1.5 md:px-4 md:py-2 transition-all max-w-[160px] md:max-w-[350px]"
          >
            <Music2 size={12} className="text-yellow-400 shrink-0 md:w-[14px]" />
            
            <div className="flex flex-col leading-tight min-w-0">
              {/* Title: Smaller on mobile, restricted width to force wrapping/truncation */}
              <span className="text-[10px] md:text-[14px] font-black uppercase text-yellow-400 group-hover:text-white transition-colors truncate">
                {song.title}
              </span>
              {/* Artist/Year: Tiny on mobile */}
              <span className="text-[8px] md:text-[10px] font-bold uppercase text-white/60 truncate">
                {formatArtist(song.artist)} <span className="hidden md:inline text-yellow-400/50 mx-1">•</span> <span className="md:inline">{song.year}</span>
              </span>
            </div>

            {/* Weeks: Thinner divider on mobile */}
            <div className="ml-1 pl-1.5 border-l border-white/20 text-[8px] md:text-[9px] font-black text-white/40 group-hover:text-yellow-400 shrink-0">
              {song.weeks_on_chart}W
            </div>
          </Link>
        ))}
      </div>

      {/* FOOTER */}
      <div className="text-center mt-8 md:mt-10 px-2 md:px-0">
        <Link
          href="/songs?filter=number-one"
          className="inline-block px-6 py-2.5 md:px-8 md:py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] md:text-xs border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          View Full Archive
        </Link>
      </div>
    </section>
  );
}