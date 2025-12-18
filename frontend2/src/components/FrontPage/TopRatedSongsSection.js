import Link from "next/link";
import { Flame } from "lucide-react";

export default function TopRatedSongsSection({ topRatedSongs }) {
  if (!topRatedSongs || topRatedSongs.length === 0) return null;

  return (
    <section className="mb-12 w-full bg-blue-950 p-4 md:p-10 rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
      {/* Header */}
      <div className="flex flex-col items-center mb-10">
        <div className="bg-yellow-400 text-black px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px] mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
          <Flame size={14} fill="currentColor" /> Hall of Fame
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-center tracking-tighter italic uppercase text-white leading-none">
          The <span className="text-yellow-400">All-Time</span> High Scores
        </h2>
      </div>

      {/* The List */}
      <div className="flex flex-col gap-3">
        {topRatedSongs.map((song, index) => (
          <div
            key={song.id}
            className="flex items-center bg-white border-4 border-black p-3 md:p-4"
          >
            {/* Rank */}
            <div className="w-8 md:w-14 flex-shrink-0 text-xl md:text-3xl font-black italic text-slate-500 tracking-tighter border-r-2 border-slate-100 mr-3">
              {index + 1}
            </div>

            {/* Content - Responsive Layout */}
            <div className="flex-grow min-w-0 pr-2">
              <Link
                href={`/songs/${song.slug}`}
                className="group flex flex-col md:flex-row md:items-baseline md:gap-x-2"
              >
                {/* Mobile: Artist on top / Desktop: Artist first */}
                <span className="text-slate-500 font-bold uppercase text-[10px] md:text-sm tracking-tight group-hover:text-blue-950">
                  {song.artist}
                </span>
                
                {/* Desktop-only separator */}
                <span className="text-slate-300 font-light hidden md:inline">—</span>
                
                {/* Title and Year Container */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-black font-black uppercase text-sm md:text-lg leading-tight group-hover:text-blue-950 truncate">
                    {song.title}
                  </span>
                  <span className="text-slate-400 font-mono text-[9px] md:text-sm shrink-0">
                    ({song.year})
                  </span>
                </div>
              </Link>
            </div>

            {/* Score */}
            <div className="flex-shrink-0">
              <div className="bg-yellow-400 text-black font-black px-3 py-1 text-xs md:text-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {song.average_user_score}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="text-center mt-10">
        <Link
          href="/songs?sort_by=average_user_score&order=desc"
          className="inline-block px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs border-2 border-black hover:bg-yellow-400 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
        >
          View Full Leaderboard →
        </Link>
      </div>
    </section>
  );
}