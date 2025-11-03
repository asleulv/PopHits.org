"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Music, TrendingUp, Calendar } from 'lucide-react';

export default function SongPreview({ song }) {
  return (
    <Link href={`/songs/${song.slug}`} className="block">
      <div className="bg-yellow-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-slate-300">
        <div className="flex items-center">
          {/* Song Image (if available) */}
          <div className="flex-shrink-0 mr-4">
            <Image
              src={song.image_upload || '/gfx/oldhits_logo.png'}
              alt={`${song.title} by ${song.artist}`}
              width={80}
              height={80}
              className="rounded-md object-cover border border-slate-400"
            />
          </div>
          
          {/* Song Info */}
          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-900">{song.title}</h3>
            <p className="text-slate-700">{song.artist}</p>
            
            {/* Song Stats */}
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-amber-600" />
                <span>{song.year}</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-1 text-amber-600" />
                <span>Peak: #{song.peak_rank}</span>
              </div>
              {song.average_user_score > 0 && (
                <div className="flex items-center">
                  <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-xs font-semibold">
                    Score: {song.average_user_score}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Arrow indicator */}
          <div className="ml-2">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
