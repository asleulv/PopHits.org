"use client";

import { useState } from "react";
import Link from "next/link";

export default function RandomHitsByDecadeClient({ groupedByDecade, initialDecade }) {
  const decades = Object.keys(groupedByDecade);
  const [activeDecade, setActiveDecade] = useState(initialDecade || (decades.length > 0 ? decades[0] : null));

  return (
    <div className="flex flex-col items-center">
      <div className="w-full mb-6">
        <div className="flex flex-wrap justify-center gap-3 px-2">
          {decades.map((decade) => (
            <button
              key={decade}
              className={`px-5 py-2 rounded-lg text-md transition-all duration-300 transform hover:scale-105 shadow-md ${
                activeDecade === decade
                  ? "bg-slate-900 text-white font-bold"
                  : "bg-slate-200 text-slate-800 hover:bg-amber-400 hover:text-slate-900"
              }`}
              onClick={() => setActiveDecade(decade)}
            >
              {decade}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full">
        {activeDecade && groupedByDecade[activeDecade]?.length > 0 ? (
          groupedByDecade[activeDecade].map((song) => (
            <div
              key={song.id}
              className="mb-8 w-full bg-white border border-slate-400 rounded-lg p-4 shadow-lg transform transition-all duration-300 hover:shadow-xl"
            >
              <iframe
                src={`https://open.spotify.com/embed/track/${song.spotify_url
                  .split("/")
                  .pop()}`}
                width="100%"
                height="380"
                frameBorder="0"
                allowtransparency="true"
                allow="encrypted-media"
                className="w-full rounded-md shadow-md"
                title={`${song.title} by ${song.artist}`}
              ></iframe>
              <p className="mt-4 text-center text-sm bg-slate-100 p-3 rounded-lg shadow-inner border border-slate-300 text-slate-900">
                <Link
                  href={`/songs/${song.slug}`}
                  className="text-amber-700 hover:text-amber-900 transition-colors font-cherry font-bold"
                >
                  {song.title}
                </Link>{" "}
                by{" "}
                <Link
                  href={`/artist/${song.artist_slug}`}
                  className="text-slate-700 hover:text-slate-900 transition-colors font-cherry"
                >
                  {song.artist}
                </Link>{" "}
                entered the charts in{" "}
                <Link
                  href={`/year/${song.year}`}
                  className="text-slate-700 hover:text-slate-900 transition-colors font-cherry font-bold"
                >
                  {song.year}
                </Link>{" "}
                peaking at{" "}
                <span className="text-white bg-slate-900 px-2 py-1 rounded-full font-cherry font-bold">
                  #{song.peak_rank}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-center p-6 bg-white border border-slate-400 rounded-lg text-slate-700">
            No songs available for this decade.
          </p>
        )}
      </div>
    </div>
  );
}
