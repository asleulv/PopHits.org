import Link from "next/link";
import { Flame } from "lucide-react";

export default function TopRatedSongsSection({ topRatedSongs }) {
  if (!topRatedSongs || topRatedSongs.length === 0) return null;

  return (
    /* FIXED: Using the stable 100vw centering logic to stop horizontal sliding */
    <section className="relative mb-12 bg-blue-950 p-6 md:p-10 md:rounded-3xl rounded-none md:border-4 border-y-4 border-x-0 border-black md:w-full w-[100vw] ml-[50%] translate-x-[-50%] animate-fadeIn">
      
      {/* Header: FULLY CENTERED on all devices per your requirement */}
      <div className="flex flex-col items-center mb-10 px-2 md:px-0 text-center">
        <div className="bg-yellow-400 text-black px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px] mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
          <Flame size={14} fill="currentColor" /> Hall of Fame
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic uppercase text-white leading-none">
          The <span className="text-yellow-400">All-Time</span> High Scores
        </h2>
      </div>

      {/* The List */}
      <div className="flex flex-col gap-3 px-2 md:px-0">
        {topRatedSongs.map((song, index) => (
          <div
            key={song.id}
            className="flex items-center bg-white border-4 border-black p-3 md:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            {/* Rank */}
            <div className="w-8 md:w-14 flex-shrink-0 text-xl md:text-3xl font-black italic text-blue-900 tracking-tighter border-r-2 border-slate-100 mr-3">
              {index + 1}
            </div>

            {/* Content */}
            <div className="flex-grow min-w-0 pr-2 text-left">
              <Link
                href={`/songs/${song.slug}`}
                className="group flex flex-col md:flex-row md:items-baseline md:gap-x-2"
              >
                <span className="text-black font-bold uppercase text-[10px] md:text-sm tracking-tight group-hover:text-blue-950">
                  {song.artist}
                </span>
                
                <span className="text-slate-300 font-light hidden md:inline">-</span>
                
                <div className="flex items-baseline gap-1.5">
                  <span className="text-black font-black uppercase text-sm md:text-lg leading-tight group-hover:text-blue-950 truncate">
                    {song.title}
                  </span>
                  <span className="text-slate-900 font-mono font-bold text-[11px] md:text-sm shrink-0">
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

      {/* Footer CTA: FULLY CENTERED on mobile and desktop */}
      <div className="text-center mt-10 px-2 md:px-0">
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