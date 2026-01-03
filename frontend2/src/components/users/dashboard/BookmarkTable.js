import Link from "next/link";
import PaginationControls from "./PaginationControls";
import { Bookmark, Clipboard, Trash2, Download } from "lucide-react";

export default function BookmarkTable({ 
  bookmarks, 
  currentPage, 
  onPageChange, 
  itemsPerPage, 
  onCopy, 
  onDeleteAll 
}) {
  const paginated = bookmarks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDownloadTxt = () => {
    const urls = bookmarks.map((s) => s.spotify_url).filter((u) => u).join("\n");
    const blob = new Blob([urls], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookmarks_export.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Info - Matches History Style */}
      <div className="bg-[#fdfbf7] border-2 border-black p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bookmark className="w-5 h-5 text-black opacity-30" />
          <div>
            <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">Saved Archive</p>
            <p className="text-xs font-bold uppercase italic">{bookmarks.length} Bookmarked Tracks</p>
          </div>
        </div>
 
      </div>

      {/* 2. Professional Table */}
      <div className="bg-white border-2 border-black overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#fdfbf7] border-b-2 border-black text-black font-cherry uppercase italic text-xs">
            <tr>
              <th className="p-4 border-r-2 border-black/5">Artist</th>
              <th className="p-4">Song Title</th>
              <th className="p-4 text-right">Year</th>
            </tr>
          </thead>
          <tbody className="divide-y border-black/5">
            {paginated.map((s, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors group">
                <td className="p-4 uppercase text-[10px] font-black text-black/40 border-r-2 border-black/5 tracking-wider">
                  {s.artist}
                </td>
                <td className="p-4">
                  <Link href={`/songs/${s.slug}`} className="text-sm font-bold uppercase italic hover:text-black transition-colors">
                    {s.title}
                  </Link>
                </td>
                <td className="p-4 text-right font-cherry italic text-black/60">{s.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Footer Pagination */}
      <PaginationControls currentPage={currentPage} totalItems={bookmarks.length} itemsPerPage={itemsPerPage} onPageChange={onPageChange} />

      {/* 4. Action Bar - Consistent with History Table */}
      <div className="mt-8 border-t border-black/5 pt-6 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">Bulk Actions</p>
              <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
            </div>
            <p className="text-[11px] font-bold text-black/60 italic leading-relaxed">
              Export saved tracks. <span className="text-black font-black not-italic">Desktop Instruction:</span> Copy URLs and paste (<kbd className="font-sans border border-black/20 px-1.5 rounded bg-white text-[10px]">Ctrl+V</kbd>) into an empty Spotify playlist.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button onClick={onCopy} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 border-2 border-black bg-white hover:bg-black hover:text-white transition-all group">
              <Clipboard className="w-4 h-4 opacity-50 group-hover:opacity-100" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Copy URLs</span>
            </button>

            <button onClick={handleDownloadTxt} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 border-2 border-black bg-white hover:bg-black hover:text-white transition-all group">
              <Download className="w-4 h-4 opacity-50 group-hover:opacity-100" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">.TXT</span>
            </button>

            <button onClick={onDeleteAll} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 border-2 border-black bg-white text-red-600 hover:bg-red-600 hover:text-white transition-all group">
              <Trash2 className="w-4 h-4 opacity-50 group-hover:opacity-100" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Burn All</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}