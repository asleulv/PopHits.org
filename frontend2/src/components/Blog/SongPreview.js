"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Music, TrendingUp, Calendar } from 'lucide-react';

export default function SongPreview({ song }) {
  return (
    <Link href={`/songs/${song.slug}`} className="block">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center">
          {/* Song Image (if available) */}
          <div className="flex-shrink-0 mr-4">
            <Image
              src={song.image_upload || '/gfx/oldhits_logo.png'}
              alt={`${song.title} by ${song.artist}`}
              width={80}
              height={80}
              className="rounded-md object-cover"
            />
          </div>
          
          {/* Song Info */}
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900">{song.title}</h3>
            <p className="text-gray-600">{song.artist}</p>
            
            {/* Song Stats */}
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{song.year}</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Peak: #{song.peak_rank}</span>
              </div>
              {song.average_user_score > 0 && (
                <div className="flex items-center">
                  <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                    Score: {song.average_user_score}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Arrow indicator */}
          <div className="ml-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
