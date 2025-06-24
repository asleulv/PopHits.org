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
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold"
                  : "bg-gray-200 text-gray-800 hover:bg-pink-400 hover:text-white"
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
              className="mb-8 w-full bg-gray-700 rounded-lg p-4 shadow-lg transform transition-all duration-300 hover:shadow-xl"
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
              <p className="mt-4 text-center text-sm bg-gray-800 p-3 rounded-lg shadow-inner">
                <Link
                  href={`/songs/${song.slug}`}
                  className="text-pink-300 hover:text-pink-200 transition-colors font-bold"
                >
                  {song.title}
                </Link>{" "}
                by{" "}
                <Link
                  href={`/artist/${song.artist_slug}`}
                  className="text-blue-300 hover:text-blue-200 transition-colors font-bold"
                >
                  {song.artist}
                </Link>{" "}
                entered the charts in{" "}
                <Link
                  href={`/year/${song.year}`}
                  className="text-gray-300 hover:text-gray-400 transition-colors font-bold"
                >
                  {song.year}
                </Link>{" "}
                peaking at{" "}
                <span className="text-pink-300 px-2 py-1 rounded-full font-bold">
                  #{song.peak_rank}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-center p-6 bg-gray-700 rounded-lg">
            No songs available for this decade.
          </p>
        )}
      </div>
    </div>
  );
}