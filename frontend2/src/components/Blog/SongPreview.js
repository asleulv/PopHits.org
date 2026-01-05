"use client";

import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, Calendar, Star } from 'lucide-react';

export default function SongPreview({ song }) {
  return (
    <Link href={`/songs/${song.slug}`} className="group block mb-4">
      <div className="bg-white border-2 border-black transition-all group-hover:bg-[#fdfbf7] flex h-24 overflow-hidden">
        
        {/* 1. Artist/Song Image - Fixed Aspect */}
        <div className="flex-shrink-0 w-24 h-full relative border-r-2 border-black bg-gray-100">
          <Image
            src={song.image_upload || '/gfx/oldhits_logo.png'}
            alt={`${song.title} by ${song.artist}`}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            unoptimized={true}
          />
        </div>
        
        {/* 2. Content Container - Pinned to the Left */}
        <div className="flex-1 flex flex-col justify-center px-5 min-w-0">
          {/* Song Title & Score */}
          <div className="flex items-center gap-3">
            <h3 className="font-black italic uppercase text-xl md:text-2xl tracking-tighter text-black truncate leading-tight group-hover:text-amber-600 transition-colors">
              {song.title} ({song.artist})
            </h3>
            {song.average_user_score > 0 && (
              <div className="bg-amber-400 border-2 border-black px-1.5 py-0.5 flex items-center gap-1 shrink-0">
                <Star size={10} fill="black" />
                <span className="text-[10px] font-black tracking-tighter">{song.average_user_score}</span>
              </div>
            )}
          </div>
          
   
          
          {/* Metadata - Pinned Left under Artist */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
              <Calendar className="w-3 h-3 text-black" />
              <span className="text-[9px] font-black uppercase tracking-widest italic">{song.year}</span>
            </div>
            <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
              <TrendingUp className="w-3 h-3 text-black" />
              <span className="text-[9px] font-black uppercase tracking-widest italic">Peak #{song.peak_rank}</span>
            </div>
          </div>
        </div>
        
        {/* 3. Action Bar - Sharp Vertical Partition */}
        <div className="w-12 border-l-2 border-black flex items-center justify-center bg-black/5 group-hover:bg-black group-hover:text-white transition-all shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}