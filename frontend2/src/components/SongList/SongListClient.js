"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Filter,
  Calendar,
  Music,
  Star,
  Award,
  RefreshCw,
  Clipboard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getSongs } from "@/lib/api";

export default function SongListClient({
  initialSongs,
  totalSongs,
  initialPage,
  initialPerPage,
  initialSortField,
  initialSortOrder,
  initialNumberOneFilter,
  initialUnratedFilter,
  initialDecadeFilter,
  initialSearchQuery,
  artistSlug: initialArtistSlug,
  artistName,
  yearFilter: initialYearFilter,
  tagSlug: initialTagSlug,
  tagName,
  hideTitle,
}) {
  const [songs, setSongs] = useState(initialSongs || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage || 1);
  const [perPage, setPerPage] = useState(initialPerPage || 25);
  const [totalCount, setTotalCount] = useState(totalSongs || 0);
  const [sortField, setSortField] = useState(initialSortField || null);
  const [sortOrder, setSortOrder] = useState(initialSortOrder || null);
  const [onlyNumberOneHits, setOnlyNumberOneHits] = useState(
    initialNumberOneFilter || false
  );
  const [onlyUnratedSongs, setOnlyUnratedSongs] = useState(
    initialUnratedFilter || false
  );
  const [decadeFilter, setDecadeFilter] = useState(initialDecadeFilter || null);
  const [yearFilter, setYearFilter] = useState(initialYearFilter || null);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || "");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [artistSlug, setArtistSlug] = useState(initialArtistSlug || null);
  const [tagSlug, setTagSlug] = useState(initialTagSlug || null);
  const [disableAutoFetch, setDisableAutoFetch] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // STREAMLINED STYLING - NO SHADOWS
  const styles = {
    panel: "bg-[#FCF9F1] border-2 md:border-[3px] border-[#0F172A]",
    header:
      "bg-[#0F172A] text-[#FCF9F1] px-3 py-1.5 md:px-4 md:py-2 flex justify-between items-center",
    select:
      "w-full p-2 border-2 border-[#0F172A] font-mono text-[11px] font-bold focus:bg-[#FFD700]/10 bg-white outline-none",
    badge:
      "bg-[#FFD700] border-2 border-[#0F172A] px-1.5 py-0.5 font-mono font-black text-[#0F172A] text-[10px] inline-block",
    btnSort:
      "px-2 py-1 border-2 border-[#0F172A] text-[9px] font-bold uppercase transition-all",
  };

  // REACTIVE HEADLINE LOGIC
  const getPageTitle = useCallback(() => {
    let prefix = "";
    let base = "Hits";
    let suffix = "";

    if (onlyUnratedSongs) prefix = "Unrated ";
    if (onlyNumberOneHits) prefix = prefix + "#1 ";

    if (artistSlug) {
      const formattedArtistName = artistName || artistSlug.replace(/-/g, " ");
      base = `${formattedArtistName} Hits`;
    } else if (yearFilter) {
      base = `${yearFilter} Hits`;
    } else if (decadeFilter) {
      base = `${decadeFilter}s Hits`;
    } else if (tagName) {
      base = `${tagName} Hits`;
    } else if (searchQuery) {
      return `Results for "${searchQuery}"`;
    } else {
      base = "All Hits";
    }

    if (decadeFilter && (artistSlug || yearFilter)) {
      suffix = ` from the ${decadeFilter}s`;
    }

    return `${prefix}${base}${suffix}`;
  }, [
    onlyUnratedSongs,
    onlyNumberOneHits,
    artistSlug,
    artistName,
    yearFilter,
    decadeFilter,
    searchQuery,
    tagName,
  ]);

  const showingFrom = (page - 1) * perPage + 1;
  const showingTo = Math.min(page * perPage, totalCount);
  const totalPages = Math.ceil(totalCount / perPage);

  const handleReset = useCallback(() => {
    setPage(1);
    setSortField(null);
    setSortOrder(null);
    setOnlyNumberOneHits(false);
    setOnlyUnratedSongs(false);
    setDecadeFilter(null);
    setYearFilter(null);
    setSearchQuery("");
    setArtistSlug(null);
    if (tagSlug) router.push(`/tags/${tagSlug}`);
    else router.push("/songs");
  }, [tagSlug, router]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const authToken = isAuthenticated
        ? localStorage.getItem("authToken")
        : null;

      // Correctly identify if we are filtering by Artist, Year, or Tag
      const filterType = artistSlug
        ? "artist"
        : yearFilter
        ? "year"
        : tagSlug
        ? "tag"
        : null;
      const filterValue = artistSlug || yearFilter || tagSlug || null;

      const data = await getSongs(
        page,
        perPage,
        filterType, // Argument 3: "tag"
        filterValue, // Argument 4: "christmas"
        sortField,
        sortOrder === "desc" ? "-" : "",
        searchQuery,
        onlyNumberOneHits ? "1" : null,
        onlyUnratedSongs,
        decadeFilter,
        tagSlug, // Argument 11
        authToken
      );
      setSongs(data.results || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      setError("Sync failed.");
    } finally {
      setLoading(false);
    }
  }, [
    page,
    perPage,
    artistSlug,
    yearFilter,
    sortField,
    sortOrder,
    searchQuery,
    onlyNumberOneHits,
    onlyUnratedSongs,
    decadeFilter,
    isAuthenticated,
    tagSlug,
  ]);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("authToken"));
  }, []);
  useEffect(() => {
    if (!disableAutoFetch) fetchData();
  }, [fetchData, disableAutoFetch]);

  const handleYearChange = (year) => {
    setYearFilter(year === "all" ? null : year);
    setDecadeFilter(null);
    setPage(1);
    if (year === "all") router.push("/songs");
    else
      router.push(`/year/${year}${artistSlug ? `?artist=${artistSlug}` : ""}`);
  };

  const handleSort = (field) => {
    const newOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
    setPage(1);
  };

  const years = Array.from(
    { length: new Date().getFullYear() - 1958 + 1 },
    (_, i) => (1958 + i).toString()
  );
  const decades = Array.from(
    {
      length: (Math.floor(new Date().getFullYear() / 10) * 10 - 1950) / 10 + 1,
    },
    (_, i) => {
      const d = 1950 + i * 10;
      return { value: d.toString(), label: `${d}s` };
    }
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Editorial Headline Section */}
      {!hideTitle && (
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#0F172A] text-[#FFD700] px-3 py-1 mb-2 border-2 border-[#0F172A]">
            {onlyUnratedSongs ? (
              <Star className="w-3 h-3 fill-[#FFD700]" />
            ) : onlyNumberOneHits ? (
              <Award className="w-3 h-3 fill-[#FFD700]" />
            ) : searchQuery ? (
              <Search className="w-3 h-3" />
            ) : decadeFilter ? (
              <Calendar className="w-3 h-3" />
            ) : artistSlug ? (
              <Music className="w-3 h-3" />
            ) : (
              <Filter className="w-3 h-3" />
            )}
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {searchQuery
                ? "Search Results"
                : artistSlug
                ? "Artist Profile"
                : decadeFilter
                ? "Decade Archive"
                : "Archive Index"}
            </span>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black uppercase italic">
              {getPageTitle()}
            </h1>
          </div>

          <div className="w-20 h-1.5 mx-auto bg-[#FFD700] mt-4"></div>
        </div>
      )}

      {/* Database Controls */}
      {!artistSlug && (
        <div
          className={`border-[3px] border-[#0F172A] rounded-none overflow-hidden bg-white shadow-sm mb-4`}
        >
          <div
            className={`${styles.header} !bg-[#0F172A] !border-none !rounded-none !m-0 !py-2 !px-4 flex items-center justify-between`}
          >
            {/* Left Side: Title */}
            <div className="flex items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white">
                Database Controls
              </span>
            </div>

            {/* Right Side: Reset Button */}
            <button
  onClick={handleReset}
  className="group ml-5 flex items-center gap-2 px-3 py-1 rounded-full border border-[#FFD700]/20 bg-[#FFD700]/5 hover:bg-[#FFD700] hover:border-[#FFD700] transition-all duration-300"
>
  <RefreshCw className="w-3 h-3 text-[#FFD700] group-hover:text-[#0F172A] group-hover:rotate-180 transition-all duration-500" />
  <span className="text-[9px] font-black uppercase tracking-widest text-[#FFD700] group-hover:text-[#0F172A]">
    Reset Filters
  </span>
</button>
          </div>

          <div className="p-3 md:p-4 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 items-end">
            <div className="col-span-2 md:col-span-1 space-y-1">
              <label className="text-[8px] font-black uppercase text-slate-500">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Song or Artist..."
                  className="w-full p-2 pl-7 border-2 border-[#0F172A] font-bold text-[11px] focus:bg-[#FFD700]/10 outline-none"
                />
                <Search className="absolute left-2 top-2 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase text-slate-500">
                Year
              </label>
              <select
                className={styles.select}
                value={yearFilter || "all"}
                onChange={(e) => handleYearChange(e.target.value)}
              >
                <option value="all">ALL</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase text-slate-500">
                Decade
              </label>
              <select
                className={styles.select}
                value={decadeFilter || "all"}
                onChange={(e) => {
                  setDecadeFilter(
                    e.target.value === "all" ? null : e.target.value
                  );
                  setYearFilter(null);
                }}
              >
                <option value="all">ALL</option>
                {decades.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 md:col-span-1 flex gap-3 pb-1 justify-between md:justify-start">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyNumberOneHits}
                  onChange={(e) => setOnlyNumberOneHits(e.target.checked)}
                  className="w-3.5 h-3.5 border-2 border-[#0F172A] accent-[#FFD700]"
                />
                <span className="text-[9px] font-bold uppercase">#1 Hits</span>
              </label>
              {isAuthenticated && (
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyUnratedSongs}
                    onChange={(e) => setOnlyUnratedSongs(e.target.checked)}
                    className="w-3.5 h-3.5 border-2 border-[#0F172A] accent-[#0F172A]"
                  />
                  <span className="text-[9px] font-bold uppercase">
                    Unrated
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Wrapping Sort Section */}
      <div
        className={`${styles.panel} p-2 flex flex-col md:flex-row items-start md:items-center gap-2`}
      >
        <span className="text-[9px] font-black uppercase text-slate-500 md:border-r-2 md:border-slate-200 md:pr-2">
          Sort
        </span>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "title", label: "Song" },
            { id: "artist", label: "Artist" },
            { id: "year", label: "Release Year" },
            { id: "peak_rank", label: "US Chart Peak" },
            { id: "average_user_score", label: "PopHits Score" },
            { id: "weeks_on_chart", label: "Chart Weeks" },
          ].map((field) => (
            <button
              key={field.id}
              onClick={() => handleSort(field.id)}
              className={`${styles.btnSort} ${
                sortField === field.id
                  ? "bg-[#0F172A] text-white"
                  : "bg-white hover:bg-[#FFD700]/20"
              }`}
            >
              {field.label}{" "}
              {sortField === field.id && (sortOrder === "asc" ? "↑" : "↓")}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.panel}>
        {/* Desktop Table */}
        <table className="hidden md:table w-full text-left border-collapse bg-[#FCF9F1]">
          <thead>
            <tr className="bg-[#0F172A] text-[#FCF9F1]">
              {["Title", "Artist", "Year", "US Peak", "Score", "Weeks"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-2 text-[10px] font-black uppercase tracking-widest"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="p-12 text-center font-bold animate-pulse text-[10px] uppercase tracking-widest"
                >
                  Retrieving...
                </td>
              </tr>
            ) : (
              songs.map((song) => (
                <tr
                  key={song.id}
                  className="border-b-[1px] border-[#0F172A]/10 hover:bg-[#FFD700]/5 transition-colors"
                >
                  <td className="px-4 py-2 font-black text-xs">
                    <Link
                      href={`/songs/${song.slug}`}
                      className="hover:underline"
                    >
                      {song.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2 font-bold text-xs text-[#0F172A]">
                    <Link href={`/artist/${song.artist_slug}`}>
                      {song.artist}
                    </Link>
                  </td>
                  <td className="px-4 py-2 font-mono font-bold text-xs text-[#0F172A]">
                    <Link
                      href={`/year/${song.year}`}
                      className="hover:underline"
                    >
                      {song.year}
                    </Link>
                  </td>
                  <td className="px-4 py-2 font-mono font-bold text-xs text-[#0F172A]">
                    #{song.peak_rank}
                  </td>
                  <td className="px-4 py-2">
                    {song.average_user_score ? (
                      <span className={styles.badge}>
                        {song.average_user_score.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-200">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2 font-mono font-bold text-xs text-[#0F172A]">
                    {song.weeks_on_chart}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Mobile View */}
        <div className="md:hidden divide-y-2 divide-[#0F172A]/10 bg-[#FCF9F1]">
          {loading ? (
            <div className="p-10 text-center font-bold animate-pulse text-[10px] uppercase">
              Retrieving Archive...
            </div>
          ) : (
            songs.map((song) => (
              <div key={song.id} className="p-3 active:bg-[#FFD700]/10">
                <div className="flex justify-between items-baseline gap-4 mb-0.5">
                  <div className="flex items-baseline min-w-0">
                    <Link
                      href={`/songs/${song.slug}`}
                      className="font-black text-[11px] truncate uppercase leading-tight shrink"
                    >
                      {song.title}
                    </Link>
                    {song.average_user_score ? (
                      <span
                        className={`${styles.badge} ml-2 scale-90 origin-left shrink-0`}
                      >
                        {song.average_user_score.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-200 ml-2 shrink-0">
                        -
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/year/${song.year}`}
                    className="font-mono text-[11px] font-black text-[#0F172A] shrink-0"
                  >
                    {song.year}
                  </Link>
                </div>
                <div className="flex justify-between gap-4">
                  <Link
                    href={`/artist/${song.artist_slug}`}
                    className="text-[10px] font-bold text-[#0F172A]/70 truncate uppercase"
                  >
                    {song.artist}
                  </Link>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-[10px] font-black text-slate-800 uppercase">
                      US RANK: #{song.peak_rank}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="space-y-4 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="bg-[#0F172A] text-[#FCF9F1] px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 border-[#0F172A] w-full md:w-auto text-center">
            {showingFrom}-{showingTo} / {totalCount} hits
          </div>

          <nav className="flex items-center gap-1 w-full md:w-auto justify-center">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className={`border-2 border-[#0F172A] px-2 py-1 text-[9px] font-black uppercase transition-colors ${
                page === 1
                  ? "bg-slate-100 text-slate-400 border-slate-300"
                  : "bg-white hover:bg-[#FFD700]"
              }`}
            >
              First
            </button>

            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`border-2 border-[#0F172A] p-1 transition-colors ${
                page === 1
                  ? "bg-slate-100 text-slate-400 border-slate-300"
                  : "bg-white hover:bg-[#FFD700]"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="px-4 py-1.5 flex items-center font-mono font-black text-[11px] border-2 border-[#0F172A] bg-white min-w-[60px] justify-center">
              {page} / {totalPages || 1}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`border-2 border-[#0F172A] p-1 transition-colors ${
                page === totalPages
                  ? "bg-slate-100 text-slate-400 border-slate-300"
                  : "bg-white hover:bg-[#FFD700]"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className={`border-2 border-[#0F172A] px-2 py-1 text-[9px] font-black uppercase transition-colors ${
                page === totalPages
                  ? "bg-slate-100 text-slate-400 border-slate-300"
                  : "bg-white hover:bg-[#FFD700]"
              }`}
            >
              Last
            </button>
          </nav>
        </div>

        <div className="w-full">
          <button
            onClick={() => {
              const urls = songs
                .map((s) => s.spotify_url)
                .filter(Boolean)
                .slice(0, 1000);

              if (urls.length > 0) {
                navigator.clipboard.writeText(urls.join("\n"));
                alert(`${urls.length} Spotify URLs copied to clipboard!`);
              } else {
                alert("No Spotify URLs available to copy.");
              }
            }}
            className="w-full bg-[#0F172A] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#0F172A] transition-colors py-3 px-4 border-2 border-[#0F172A] flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest"
          >
            <Clipboard className="w-4 h-4" />
            Copy all Spotify URLs to clipboard
          </button>
        </div>
      </div>
    </div>
  );
}
