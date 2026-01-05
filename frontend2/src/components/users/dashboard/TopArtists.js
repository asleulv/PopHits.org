import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Added Image
import { Mic2, Trophy, Star, Info } from 'lucide-react';

export default function TopArtists({ ratings }) {
  if (!ratings || !Array.isArray(ratings) || ratings.length === 0) return null;

  const artistData = ratings.reduce((acc, curr) => {
    const artistName = curr.song_artist || curr.artist;
    const artistSlug = curr.artist_slug; 
    // Assuming image follows a pattern or is available in the rating object
    // If your API provides artist_image, use that; otherwise, we can predict the path
    const artistImage = curr.artist_image || `/images/artists/${artistSlug}.jpg`; 
    
    if (artistName) {
      if (!acc[artistName]) {
        acc[artistName] = { 
          name: artistName, 
          slug: artistSlug, 
          image: artistImage, // Store image in accumulator
          count: 0, 
          totalScore: 0 
        };
      }
      acc[artistName].count += 1;
      acc[artistName].totalScore += (curr.score || 0);
    }
    return acc;
  }, {});

  const topArtists = Object.values(artistData)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  if (topArtists.length === 0) return null;

  return (
    <div className="mt-8 bg-[#fdfbf7] border-2 border-black p-8">
      
      {/* 1. Standardized Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-black/10 pb-6 gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-black">
            <Trophy className="w-5 h-5 opacity-50 text-amber-500 fill-amber-500" />
            <h4 className="text-2xl font-cherry font-black uppercase tracking-tighter">
              Hall of Fame
            </h4>
          </div>
          <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mt-1">
            Top 3 historical contributors to your archive
          </p>
        </div>
        
        <div className="text-[9px] font-black uppercase tracking-tighter text-black/30 pb-1">
          Calculated by Frequency
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topArtists.map((artist, index) => {
          return (
            <Link 
              href={`/artist/${artist.slug}`}
              key={index} 
              className="bg-white border-2 border-black p-5 relative group transition-colors flex flex-col items-center hover:bg-gray-50"
            >
              {/* Rank Badge */}
              <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 font-cherry font-black italic text-sm z-20">
                #{index + 1}
              </div>

              {/* ARTIST IMAGE AREA */}
              <div className="w-20 h-20 rounded-full border-2 border-black bg-gray-50 flex items-center justify-center mb-4 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none transition-all">
                {artist.image ? (
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <Mic2 className="w-6 h-6 text-black/40 group-hover:text-black transition-colors" />
                )}
                
                {/* Visual Overlay if image is missing/errors */}
                <div className="absolute inset-0 flex items-center justify-center -z-10 bg-gray-100">
                    <Mic2 className="w-6 h-6 text-black/20" />
                </div>
              </div>

              <h5 className="font-cherry font-black uppercase text-lg text-center leading-none mb-4 group-hover:text-amber-600 transition-colors min-h-[2.5rem] flex items-center">
                {artist.name}
              </h5>

              <div className="w-full flex border-t-2 border-black divide-x-2 divide-black">
                <div className="flex-1 py-2 flex flex-col items-center">
                  <span className="text-[8px] font-black uppercase text-black/40">Hits</span>
                  <span className="text-xl font-black">{artist.count}</span>
                </div>
                <div className="flex-1 py-2 flex flex-col items-center bg-amber-400">
                  <span className="text-[8px] font-black uppercase text-black/60">Avg</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-2 h-2 fill-black text-black" />
                    <span className="text-xl font-black">{(artist.totalScore / artist.count).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      {/* 3. Standardized Footer */}
      <div className="mt-8 pt-4 border-t border-black/5 flex justify-between items-center text-[9px] font-bold text-black/20 uppercase tracking-[0.2em] italic">
        <div className="flex items-center gap-2">
          <Info className="w-3 h-3" />
          <span>Rankings based on historical volume and weighted preference</span>
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
        </div>
      </div>
    </div>
  );
}