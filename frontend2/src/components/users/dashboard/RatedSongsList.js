import { useState } from "react";
import Link from "next/link";
import { ListMusic, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

export default function RatedSongsList({ title, songs }) {
  const [expanded, setExpanded] = useState(false);
  
  // Logical Cap: Only expand if data is manageable (e.g., <= 10)
  // Otherwise, we force a redirect to the main table
  const isLargeDataset = songs.length > 10;
  const visibleSongs = expanded ? songs.slice(0, 10) : songs.slice(0, 10);

  if (!songs || songs.length === 0) return null;

  return (
    <div className="bg-[#fdfbf7] border-2 border-black p-6 flex-1 transition-all">
      {/* 1. Header - Stacked to prevent overlapping text */}
      <div className="flex flex-col mb-6 border-b border-black/10 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <ListMusic className="w-4 h-4 opacity-30 text-black" />
          <h3 className="font-cherry font-black uppercase italic text-xl leading-none text-black">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">
            Archive Audit
          </span>
          <div className="w-1 h-1 bg-black/20 rounded-full" />
          <span className="text-[10px] font-black text-black/40 uppercase tracking-widest">
            {songs.length} ENTRIES
          </span>
        </div>
      </div>

      {/* 2. Simplified List Items */}
      <ul className="space-y-4">
        {visibleSongs.map((item) => (
          <li
            key={item.song.id}
            className="flex items-start justify-between gap-4"
          >
            <div className="flex flex-col">
              <Link
                href={`/songs/${item.song.id}`}
                className="text-sm font-black uppercase italic leading-tight hover:text-amber-600 transition-colors"
              >
                {item.song.title}
              </Link>
              <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
                {item.song.artist}
              </span>
            </div>

            <div
              className={`shrink-0 w-8 h-8 flex items-center justify-center border border-black font-cherry font-black italic text-sm
              ${item.score >= 8 ? "bg-amber-400" : "bg-black text-white"}`}
            >
              {item.score}
            </div>
          </li>
        ))}
      </ul>

      {/* 3. Smart Toggle/Redirect Button */}
      {songs.length > 3 && (
        <div className="mt-6">
          {isLargeDataset ? (
            /* REDIRECT for thousands of entries */
            <Link
              href="/profile#history-archive"
              className="w-full flex items-center justify-center gap-2 py-2 border border-black/10 hover:border-black hover:bg-black hover:text-white text-[9px] font-black uppercase tracking-[0.2em] transition-all group"
            >
              EXPLORE FULL ARCHIVE ({songs.length}) <ExternalLink className="w-3 h-3" />
            </Link>
          ) : (
            /* TOGGLE for small manageable lists */
            <button
              className="w-full flex items-center justify-center gap-2 py-2 border border-black/10 hover:border-black hover:bg-black hover:text-white text-[9px] font-black uppercase tracking-[0.2em] transition-all group"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>LESS <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>VIEW ALL {songs.length} <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" /></>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}