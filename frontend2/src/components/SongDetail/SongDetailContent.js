"use client";

import Link from "next/link";
import { Suspense, useState, useEffect } from "react";
import {
  Calendar,
  TrendingUp,
  Clock,
  Star,
  Music,
  SquarePlay,
} from "lucide-react";
import SongActions from "@/components/SongDetail/SongActions";
import SongTimeline from "@/components/SongDetail/SongTimeline";
import SongComments from "@/components/SongDetail/SongComments";
import ShareButtons from "./ShareButtons";
import { useSong } from "@/contexts/SongContext";

export default function SongDetailContent({ initialTimeline = [] }) {
  function getTrackIdFromUrl(url) {
    if (!url) return null;
    const parts = url.split("/");
    return parts[parts.length - 1];
  }

  const { song } = useSong();
  const [showTimeline, setShowTimeline] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      {/* Enhanced Song Title Section */}
      <div className="flex flex-col items-center justify-center mb-6 bg-yellow-50 p-4 rounded-xl shadow-sm border border-slate-300">
        <h1 className="text-3xl md:text-5xl px-1 py-1 font-cherry font-bold mb-2 text-center bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent">
          {song.title}
          <span className="block text-xl md:text-2xl font-medium text-slate-600">
            by{" "}
            <Link
              href={`/artist/${song.artist_slug}`}
              className="text-slate-900 hover:text-amber-700 transition-colors"
            >
              {song.artist}
            </Link>
          </span>
        </h1>

        <SongActions showRatingOnly={false} />
      </div>

      {/* Song Information Box with Lucide icons */}
      <h2 className="sr-only">Song Information</h2>
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg mb-6 border border-slate-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 p-4 rounded-lg text-center">
            <Calendar className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <div className="text-slate-200 text-sm">Year</div>
            <div className="font-bold text-amber-400 text-2xl">{song.year}</div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg text-center">
            <TrendingUp className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <div className="text-slate-200 text-sm">Peak Position</div>
            <div className="font-bold text-amber-400 text-2xl">
              #{song.peak_rank}
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg text-center">
            <Clock className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <div className="text-slate-200 text-sm">Weeks on Chart</div>
            <div className="font-bold text-amber-400 text-2xl">
              {song.weeks_on_chart}
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg text-center">
            <Star className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <div className="text-slate-200 text-sm">Total Ratings</div>
            <div className="font-bold text-amber-400 text-2xl">
              {song.total_ratings}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline toggle button above the scrollable chart */}
      {song?.slug && initialTimeline && initialTimeline.length > 0 && (
        <section
          className="mb-8 bg-yellow-50 rounded-xl shadow p-6 border border-slate-300"
          aria-labelledby="timeline-label"
        >
          <h2 id="timeline-label" className="sr-only">
            Chart Timeline
          </h2>
          <button
            className="px-5 py-2 text-slate-900 font-medium rounded-lg border border-slate-400 bg-white shadow hover:bg-slate-50 transition mb-2"
            onClick={() => setShowTimeline((prev) => !prev)}
            aria-expanded={showTimeline}
          >
            {showTimeline ? "Hide Chart Timeline" : "Show Chart Timeline"}
          </button>
          {showTimeline && (
            <div className="mt-4 max-h-96 overflow-y-auto">
              <SongTimeline timeline={initialTimeline} />
            </div>
          )}
        </section>
      )}

      {/* Audio Player */}
      <div className="mb-4">
        <h2 className="sr-only">Spotify Player</h2>
        {song.spotify_url ? (
          <div className="overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <iframe
              src={`https://open.spotify.com/embed/track/${getTrackIdFromUrl(
                song.spotify_url
              )}?utm_source=generator`}
              width="100%"
              height="252"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ borderRadius: "12px" }}
              title={`${song.title} by ${song.artist} on Spotify`}
            ></iframe>
          </div>
        ) : (
          <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-700">
            <p className="text-center text-lg font-semibold mb-4">
              No audio link available
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`https://open.spotify.com/search/${encodeURIComponent(
                  `${song.artist} ${song.title}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-300 flex items-center gap-2"
              >
                <Music className="w-4 h-4" /> Search Spotify
              </a>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  `${song.artist} ${song.title}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-300 flex items-center gap-2"
              >
                <SquarePlay className="w-4 h-4" /> Search YouTube
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Rating UI - Client Component */}
      <div className="mb-4">
        <SongActions showRatingOnly={true} />
      </div>

      {/* Share Options */}
      <ShareButtons song={song} />

      {/* Review Section */}
      <div className="mb-8">
        <h2 className="sr-only">Artist Bio</h2>
        <div className="bg-white p-6 rounded-xl border border-slate-400">
          <div
            className="prose max-w-none text-slate-800"
            dangerouslySetInnerHTML={{ __html: song.review }}
          />
        </div>
      </div>

      {/* Comments Section - Client Component */}
      <Suspense fallback={<div>Loading comments...</div>}>
        <SongComments song={song} />
      </Suspense>
    </div>
  );
}
