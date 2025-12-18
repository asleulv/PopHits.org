"use client";

import { useState } from "react";
import Link from "next/link";

export default function RandomHitsByDecadeClient({ groupedByDecade, initialDecade }) {
  const decades = Object.keys(groupedByDecade);
  const [activeDecade, setActiveDecade] = useState(initialDecade || (decades.length > 0 ? decades[0] : null));

  return (
    <div className="flex flex-col items-center w-full">
      {/* Decade Selector Tabs */}
      <div className="w-full mb-10">
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 px-2">
          {decades.map((decade) => (
            <button
              key={decade}
              onClick={() => setActiveDecade(decade)}
              className={`px-6 py-2 text-sm md:text-base font-black uppercase tracking-widest border-2 border-black transition-all ${
                activeDecade === decade
                  ? "bg-blue-950 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black hover:bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              {decade}
            </button>
          ))}
        </div>
      </div>

      {/* Song Display Area */}
      <div className="w-full max-w-4xl">
        {activeDecade && groupedByDecade[activeDecade]?.length > 0 ? (
          groupedByDecade[activeDecade].map((song) => (
            <div
              key={song.id}
              className="mb-12 w-full bg-white border-4 border-black p-4 md:p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
            >
              {/* Spotify Embed with Brutalist Frame */}
              <div className="border-2 border-black bg-black">
                <iframe
                  src={`https://open.spotify.com/embed/track/${song.spotify_url
                    .split("/")
                    .pop()}`}
                  width="100%"
                  height="380"
                  frameBorder="0"
                  allowtransparency="true"
                  allow="encrypted-media"
                  className="w-full"
                  title={`${song.title} by ${song.artist}`}
                ></iframe>
              </div>

              {/* Song Meta Description */}
              <p className="mt-6 text-sm md:text-base leading-relaxed text-slate-900 font-medium bg-yellow-50 border-t-2 border-black p-4">
                <Link
                  href={`/songs/${song.slug}`}
                  className="text-blue-950 hover:underline font-black uppercase decoration-2 underline-offset-4"
                >
                  {song.title}
                </Link>{" "}
                by{" "}
                <Link
                  href={`/artist/${song.artist_slug}`}
                  className="text-slate-700 hover:text-black font-bold decoration-1 underline-offset-2 hover:underline"
                >
                  {song.artist}
                </Link>{" "}
                entered the charts in{" "}
                <Link
                  href={`/year/${song.year}`}
                  className="text-slate-700 hover:text-black font-black"
                >
                  {song.year}
                </Link>{" "}
                peaking at{" "}
                <span className="inline-block bg-blue-950 text-white px-3 py-0.5 border border-black font-black italic ml-1">
                  #{song.peak_rank}
                </span>
              </p>
            </div>
          ))
        ) : (
          <div className="text-center p-12 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-black uppercase tracking-widest text-slate-400">
              No songs found in this archive segment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}