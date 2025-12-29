"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Music, Grid3x3, List, Loader } from "lucide-react";
import { getArtists } from "@/lib/api";

export default function ArtistsListClient({
  initialArtists = [],
  totalCount,
  currentLetter = "All",
}) {
  const [artists, setArtists] = useState(initialArtists);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(2);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [selectedLetter, setSelectedLetter] = useState(currentLetter);
  const [displayCount, setDisplayCount] = useState(totalCount || 0);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // HYBRID FILTER: This ensures the search works on the current list INSTANTLY
  const visibleArtists = artists.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const styles = {
    panel: "bg-[#FCF9F1] border-2 md:border-[3px] border-[#0F172A]",
    header:
      "bg-[#0F172A] text-[#FCF9F1] px-3 py-1.5 md:px-4 md:py-2 flex justify-between items-center",
    badge:
      "bg-[#FFD700] border-2 border-[#0F172A] px-1.5 py-0.5 font-mono font-black text-[#0F172A] text-[10px] inline-block",
    input:
      "w-full p-2 pl-8 border-2 border-[#0F172A] font-bold text-[11px] focus:bg-[#FFD700]/10 bg-white outline-none text-[#0F172A]",
    alphabetBtn:
      "px-2 py-1 border-2 border-[#0F172A] text-[10px] font-black uppercase transition-all",
  };

  // 1. Handle Debounce for Database Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 2. Fetch from Database when Search Query or Letter changes
  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      setPage(2);
      try {
        const data = await getArtists({
          page: 1,
          pageSize: 100,
          search: debouncedSearch || undefined, // Queries the backend
          letter: selectedLetter !== "All" ? selectedLetter : undefined,
        });
        setArtists(data.results || []);
        setHasMore(data.next !== null);
        setDisplayCount(data.count || 0);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [debouncedSearch, selectedLetter]);

  // 3. Infinite Scroll Logic
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data = await getArtists({
        page,
        pageSize: 100,
        search: debouncedSearch || undefined,
        letter: selectedLetter !== "All" ? selectedLetter : undefined,
      });
      if (data.results?.length > 0) {
        setArtists((prev) => {
          const existingIds = new Set(prev.map((a) => a.id));
          const newUnique = data.results.filter((a) => !existingIds.has(a.id));
          return [...prev, ...newUnique];
        });
        setPage((p) => p + 1);
        setHasMore(data.next !== null);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading artists:", error);
    } finally {
      setLoading(false);
    }
  }, [page, selectedLetter, debouncedSearch, loading, hasMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    setSearchQuery(""); // Clear search box when clicking a letter
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-[#0F172A] text-[#FFD700] px-3 py-1 mb-2 border-2 border-[#0F172A]">
          <Music className="w-3 h-3 fill-[#FFD700]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Artist Directory
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black italic uppercase text-[#0F172A] leading-none tracking-tight">
          Browse All Artists
        </h1>
        <div className="w-20 h-1.5 mx-auto bg-[#FFD700] mt-4"></div>
      </div>

      {/* Controls Console */}
      <div className={`${styles.panel} !border-t-0 !rounded-none overflow-hidden mb-8`}>
        <div className={styles.header}>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-[0.1em]">
              Database Controls
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1 transition-colors ${viewMode === "grid" ? "text-[#FFD700]" : "text-white/50"}`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1 transition-colors ${viewMode === "list" ? "text-[#FFD700]" : "text-white/50"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="max-w-md">
            <label className="text-[8px] font-black uppercase text-slate-500 block mb-1">
              Search Directory
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 text-[#0F172A] w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Find artist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div>
            <label className="text-[8px] font-black uppercase text-slate-500 block mb-1">
              Filter by Initial
            </label>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => handleLetterClick("All")}
                className={`${styles.alphabetBtn} ${selectedLetter === "All" ? "bg-[#0F172A] text-white" : "bg-white text-[#0F172A]"}`}
              >
                All
              </button>
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter)}
                  className={`${styles.alphabetBtn} ${selectedLetter === letter ? "bg-[#0F172A] text-white" : "bg-white text-[#0F172A]"}`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary Badge */}
      <div className="mb-6 flex justify-center">
        <span className="bg-[#0F172A] text-[#FCF9F1] px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border-2 border-[#0F172A]">
          {displayCount} {displayCount === 1 ? "Artist" : "Artists"}{" "}
          {searchQuery ? `Matching "${searchQuery}"` : selectedLetter !== "All" ? `Starting with "${selectedLetter}"` : "in Archive"}
        </span>
      </div>

      {/* List/Grid View */}
      {visibleArtists.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {visibleArtists.map((artist) => (
              <Link key={artist.id} href={`/artist/${artist.slug}`} className="group">
                <div className={`${styles.panel} p-3 hover:bg-[#FFD700]/5 transition-all h-full flex flex-col`}>
                  <div className="relative w-full aspect-square border-2 border-[#0F172A] overflow-hidden mb-3 bg-[#0F172A]/5">
                    {artist.image ? (
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 16vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Music className="w-8 h-8 text-[#0F172A]/20" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-black text-[11px] uppercase leading-tight mb-1 group-hover:text-amber-700">
                    {artist.name}
                  </h3>
                  {artist.total_hits && (
                    <span className={styles.badge + " mt-auto scale-90 origin-left"}>
                      {artist.total_hits} HITS
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.panel + " overflow-hidden"}>
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#0F172A] text-[#FCF9F1]">
                <tr>
                  <th className="px-4 py-2 text-[10px] font-black uppercase tracking-widest">Artist Name</th>
                  <th className="px-4 py-2 text-[10px] font-black uppercase tracking-widest hidden md:table-cell">Nationality</th>
                  <th className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-center">Hits</th>
                </tr>
              </thead>
              <tbody className="bg-[#FCF9F1]">
                {visibleArtists.map((artist) => (
                  <tr key={artist.id} className="border-b-[1px] border-[#0F172A]/10 hover:bg-[#FFD700]/5">
                    <td className="px-4 py-2">
                      <Link href={`/artist/${artist.slug}`} className="font-black text-xs uppercase hover:underline text-[#0F172A]">
                        {artist.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2 font-bold text-[10px] uppercase text-slate-500 hidden md:table-cell">
                      {artist.nationality || "—"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className={styles.badge}>{artist.total_hits}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        !loading && (
          <div className={`${styles.panel} p-20 text-center`}>
            <Music className="w-12 h-12 text-[#0F172A]/10 mx-auto mb-4" />
            <p className="font-black uppercase text-xs tracking-widest text-[#0F172A]">No artists found</p>
          </div>
        )
      )}

      {loading && (
        <div className="flex flex-col items-center py-12">
          <Loader className="w-6 h-6 animate-spin text-[#0F172A] mb-2" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Syncing Archive...</span>
        </div>
      )}
    </div>
  );
}