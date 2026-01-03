import Link from "next/link";
import PaginationControls from "./PaginationControls";
import { Filter, Clipboard, Download, HelpCircle } from "lucide-react";

export default function HistoryTable({
  ratings,
  filterScore,
  setFilterScore,
  currentPage,
  onPageChange,
  itemsPerPage,
}) {
  const filtered = ratings.filter((r) => r.score >= filterScore);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Throttling logic for massive archives
  const isMassive = filtered.length > 1000;

  const handleDownloadTxt = () => {
    const urls = filtered.map((r) => r.spotify_url).filter((u) => u).join("\n");
    const blob = new Blob([urls], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `archive_export_${filterScore}_plus.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCopyClipboard = () => {
    if (filtered.length > 2000) {
      const proceed = window.confirm(
        `You are copying ${filtered.length} URLs. This may temporarily freeze your browser or Spotify. Use 'Download .TXT' for safer handling of large lists. Proceed?`
      );
      if (!proceed) return;
    }

    const urls = filtered.map((r) => r.spotify_url).filter((u) => u).join("\n");
    if (urls) {
      navigator.clipboard.writeText(urls);
      alert(
        isMassive
          ? `SUCCESS: ${filtered.length} URLs copied. Note: High-volume paste may take a moment in Spotify.`
          : `${filtered.length} Spotify URLs copied to clipboard!`
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Centered Filter - Professional Control Panel */}
      <div className="bg-[#fdfbf7] border-2 border-black p-8 flex flex-col items-center overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-4 h-4 opacity-30 text-black" />
          <span className="font-black uppercase tracking-[0.3em] text-[10px] text-black/50">
            Filter Archive by Minimum Score
          </span>
        </div>

        <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-1.5 md:gap-2 w-full max-w-2xl overflow-x-auto pb-2 no-scrollbar">
          {[...Array(10)].map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setFilterScore(i + 1);
                onPageChange(1);
              }}
              className={`shrink-0 w-8 h-8 md:w-10 md:h-10 border-2 border-black font-cherry font-black italic transition-all
                ${
                  filterScore === i + 1
                    ? "bg-amber-400 text-black"
                    : "bg-white text-black/40 hover:text-black hover:bg-gray-50"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <p className="mt-4 text-[9px] font-bold text-black/20 uppercase tracking-widest">
          Showing entries with score ≥ {filterScore}
        </p>
      </div>

      {/* 2. Professional Archive Table */}
      <div className="bg-white border-2 border-black overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#fdfbf7] border-b-2 border-black text-black font-cherry uppercase italic text-xs">
            <tr>
              <th className="p-4 border-r-2 border-black/5">Artist</th>
              <th className="p-4">Song Title</th>
              <th className="p-4 text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y border-black/5">
            {paginated.map((r, i) => {
              const isElite = r.score >= 8;
              return (
                <tr
                  key={i}
                  className="hover:bg-amber-50/50 transition-colors group"
                >
                  <td className="p-4 uppercase text-[10px] font-black text-black/40 border-r-2 border-black/5 tracking-wider">
                    {r.song_artist}
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/songs/${r.song_slug}`}
                      className="text-sm font-bold uppercase italic hover:text-amber-600 transition-colors"
                    >
                      {r.song_title}
                    </Link>
                  </td>
                  <td className="p-4 text-right">
                    <span
                      className={`inline-block w-8 text-center py-1 border-2 border-black font-cherry font-black italic text-xs
                      ${
                        isElite
                          ? "bg-amber-400"
                          : "bg-black text-white opacity-80"
                      }`}
                    >
                      {r.score}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 3. Footer Pagination */}
      <PaginationControls
        currentPage={currentPage}
        totalItems={filtered.length}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />

      {/* 4. Quiet Universal Export Bar */}
      <div className="mt-8 border-t border-black/5 pt-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">
                Archive Export Tool
              </p>
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  isMassive ? "bg-amber-500" : "bg-[#1DB954]"
                }`}
              />
            </div>
            <p className="text-[11px] font-bold text-black/60 italic leading-relaxed">
              Export {filtered.length} songs.{" "}
              <span className="text-black font-black not-italic">Desktop Instruction:</span> Copy
              URLs, open a Spotify playlist, click the empty center, and press{" "}
              <kbd className="font-sans border border-black/20 px-1.5 rounded bg-white text-[10px] shadow-sm">
                Ctrl/Cmd + V
              </kbd>{" "}
              to bulk-import.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            {/* Clipboard Action */}
            <button
              onClick={handleCopyClipboard}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 border-2 border-black bg-white hover:bg-black hover:text-white transition-all group"
            >
              <Clipboard className="w-4 h-4 opacity-50 group-hover:opacity-100" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Copy URLs
              </span>
            </button>

            {/* .TXT Backup Action */}
            <button
              onClick={handleDownloadTxt}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-all group"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Download .TXT
              </span>
            </button>
          </div>
        </div>

        {isMassive && (
          <div className="mt-4 flex items-center gap-2 justify-center lg:justify-start">
            <HelpCircle className="w-3 h-3 text-amber-600" />
            <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">
              Large archive detected: Clipboard may lag. .TXT is recommended for
              1,000+ entries.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}