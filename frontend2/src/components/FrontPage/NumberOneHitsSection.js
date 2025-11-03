"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Calendar, Clock } from 'lucide-react';

export default function NumberOneHitsSection({ numberOneHits }) {
  const [randomHits, setRandomHits] = useState([]);

  // Function to get 8 random number one hits
  useEffect(() => {
    if (numberOneHits && numberOneHits.length > 0) {
      // Create a copy of the array to avoid mutating the original
      const shuffled = [...numberOneHits].sort(() => Math.random() - 0.5);
      setRandomHits(shuffled.slice(0, 8));
    }
  }, [numberOneHits]);

  if (!numberOneHits || numberOneHits.length === 0) {
    return (
      <section className="mb-12 p-8 w-full bg-yellow-50 lg:rounded-xl shadow-xl text-slate-900">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-8">
          <h2 className="text-xl md:text-3xl font-cherry font-semibold flex items-center gap-3 text-center">
            <Trophy className="hidden lg:block w-8 h-8 text-amber-500" />
            <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent">The Number Ones: Billboard Hot 100 Chart Toppers</span>
          </h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12 p-8 w-full bg-yellow-50 lg:rounded-xl shadow-xl text-slate-900">
      <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-8">
        <h2 className="text-xl md:text-3xl font-cherry font-semibold flex items-center gap-3 text-center">
          <Trophy className="hidden lg:block w-8 h-8 text-amber-500" />
          <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent">The Number Ones: Billboard Hot 100 Chart Toppers</span>
        </h2>
        <Link
          href="/songs?filter=number-one"
          className="ml-3 px-4 py-2 rounded-full font-cherry bg-slate-900 hover:bg-slate-700 text-gray-200 hover:text-white font-semibold text-sm shadow-md transform transition-all duration-300"
        >
          View Full List
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {randomHits.length > 0 ? (
          randomHits.map((song) => (
            <div
              key={song.id}
              className="bg-white border border-slate-400 rounded-lg p-5 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:border-slate-500"
            >
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-cherry font-semibold mb-2">
                  <Link
                    href={`/songs/${song.slug}`}
                    className="text-slate-900 font-cherry hover:text-amber-600 transition-colors"
                  >
                    {song.title}
                  </Link>
                </h3>
                
                <p className="text-md mb-3">
                  <span className="text-slate-600">by</span>{" "}
                  <Link
                    href={`/artist/${song.artist_slug}`}
                    className="text-amber-700 font-cherry hover:text-amber-600 transition-colors font-medium"
                  >
                    {song.artist}
                  </Link>
                </p>
                
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600 mb-2">
                  <Calendar className="w-4 h-4 text-slate-700 flex-shrink-0" />
                  <Link
                    href={`/year/${song.year}`}
                    className="text-slate-700 hover:text-slate-900 transition-colors font-medium"
                  >
                    {song.year}
                  </Link>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-300 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-slate-700" />
                <p className="text-sm font-medium text-slate-700">
                  <span className="text-slate-900 font-bold">{song.weeks_on_chart}</span> weeks on chart
                </p>
              </div>
              
              {song.spotify_url && (
                <div className="mt-3 text-center">
                  <a 
                    href={song.spotify_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block text-xs bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-3 py-1 rounded-full transition-colors"
                  >
                    Listen on Spotify
                  </a>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-slate-700 col-span-4 p-6 bg-white border border-slate-400 rounded-lg">
            No number one hits available.
          </p>
        )}
      </div>
    </section>
  );
}
