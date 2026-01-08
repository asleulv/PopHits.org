"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  TrendingUp, // Added for peak icon
  Clock, // Added for weeks icon
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
  // --- STATE AND INITIALIZATION ---
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
  const [isMounted, setIsMounted] = useState(false);
  const [artistSlug, setArtistSlug] = useState(initialArtistSlug || null);
  const [tagSlug, setTagSlug] = useState(initialTagSlug || null);
  const [disableAutoFetch, setDisableAutoFetch] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const hasSyncedAuth = useRef(false);
  const isFirstRender = useRef(true);

  // --- STYLING CONSTANTS ---
  const styles = {
    panel: "bg-[#FCF9F1] border-2 md:border-[3px] border-[#0F172A] mt-0",
    header:
      "bg-[#0F172A] text-[#FCF9F1] px-3 py-1.5 md:px-4 md:py-2 flex justify-between items-center",
    select:
      "w-full p-2 border-2 border-[#0F172A] font-mono text-[11px] font-bold focus:bg-[#FFD700]/10 bg-white outline-none",
    badge:
      "bg-[#FFD700] border-2 border-[#0F172A] px-1.5 py-0.5 font-mono font-black text-[#0F172A] text-[10px] inline-block",
    btnSort:
      "px-2 py-1 border-2 border-[#0F172A] text-[9px] font-bold uppercase transition-all",
    ratingCircle:
      "flex items-center justify-center w-5 h-5 rounded-full bg-white border-2 border-[#0F172A] text-[10px] font-black text-[#0F172A] shrink-0",
  };

  // --- DATA FETCHING AND HANDLERS ---
  const getPageTitle = useCallback(() => {
    let prefix = onlyUnratedSongs ? "Unrated " : "";
    if (onlyNumberOneHits) prefix += "#1 ";
    let base = artistSlug
      ? `${artistName || artistSlug.replace(/-/g, " ")} Hits`
      : yearFilter
      ? `${yearFilter} Hits`
      : decadeFilter
      ? `${decadeFilter}s Hits`
      : tagName
      ? `${tagName} Hits`
      : searchQuery
      ? `Results for "${searchQuery}"`
      : "All Hits";
    return `${prefix}${base}${
      decadeFilter && (artistSlug || yearFilter)
        ? ` from the ${decadeFilter}s`
        : ""
    }`;
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

  const fetchData = useCallback(
    async (isManualSync = false) => {
      if (!isManualSync) setLoading(true);
      try {
        const authToken = localStorage.getItem("authToken");
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
          filterType,
          filterValue,
          sortField,
          sortOrder === "desc" ? "-" : "",
          searchQuery,
          onlyNumberOneHits ? "1" : null,
          onlyUnratedSongs,
          decadeFilter,
          tagSlug,
          authToken
        );
        setSongs(data.results || []);
        setTotalCount(data.count || 0);
      } catch (err) {
        setError("Sync failed.");
      } finally {
        setLoading(false);
      }
    },
    [
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
      tagSlug,
    ]
  );

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      if (!hasSyncedAuth.current) {
        hasSyncedAuth.current = true;
        fetchData(true);
      }
    }
  }, [fetchData]);

  useEffect(() => {
    if (!disableAutoFetch && isMounted && !isFirstRender.current) {
      fetchData();
    }
    isFirstRender.current = false;
  }, [fetchData, disableAutoFetch, isMounted]);

  const handleYearChange = (year) => {
    setYearFilter(year === "all" ? null : year);
    setPage(1);
    if (year === "all") router.push("/songs");
    else
      router.push(`/year/${year}${artistSlug ? `?artist=${artistSlug}` : ""}`);
  };

  const handleSort = (field) => {
    setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
    setPage(1);
  };

  const handleReset = () => {
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
      {/* SECTION: PAGE HEADER & TITLE */}
      {!hideTitle && (
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#0F172A] text-[#FFD700] px-3 py-1 mb-2 border-2 border-[#0F172A]">
            {onlyUnratedSongs ? (
              <Star className="w-3 h-3 fill-[#FFD700]" />
            ) : onlyNumberOneHits ? (
              <Award className="w-3 h-3 fill-[#FFD700]" />
            ) : (
              <Filter className="w-3 h-3" />
            )}
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Archive Index
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase italic">
            {getPageTitle()}
          </h1>
          <div className="w-20 h-1.5 mx-auto bg-[#FFD700] mt-4"></div>
        </div>
      )}

      {/* SECTION: DATABASE FILTERS */}
      {!artistSlug && (
        <div className={styles.panel}>
          <div className={`${styles.header} !mt-0`}>
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white">
              Database Controls
            </span>
            <button
              onClick={handleReset}
              className="group flex items-center gap-2 px-3 py-1 rounded-full border border-[#FFD700]/20 bg-[#FFD700]/5 hover:bg-[#FFD700] transition-all"
            >
              <RefreshCw className="w-3 h-3 text-[#FFD700] group-hover:text-[#0F172A] group-hover:rotate-180 transition-all duration-500" />
              <span className="text-[9px] font-black uppercase text-[#FFD700] group-hover:text-[#0F172A]">
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
                  placeholder="Search..."
                  className="w-full p-2 pl-7 border-2 border-[#0F172A] font-bold text-[11px] focus:bg-[#FFD700]/10 outline-none"
                />
                <Search className="absolute left-2 top-2 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
            <select
              className={styles.select}
              value={yearFilter || "all"}
              onChange={(e) => handleYearChange(e.target.value)}
            >
              <option value="all">ALL YEARS</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
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
              <option value="all">ALL DECADES</option>
              {decades.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            <div className="flex gap-3 pb-1 justify-between md:justify-start">
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

      {/* SECTION: SORTING CONTROLS */}
      <div
        className={`${styles.panel} p-2 flex flex-col md:flex-row items-start md:items-center gap-2`}
      >
        <span className="text-[9px] font-black uppercase text-slate-500 md:border-r-2 md:border-slate-200 md:pr-2">
          Sort
        </span>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "title", label: "Song Title" },
            { id: "artist", label: "Artist" },
            { id: "year", label: "First charted" },
            { id: "peak_rank", label: "US Peak Pos." },
            { id: "average_user_score", label: "PopHits Score" },
            { id: "weeks_on_chart", label: "Weeks On Chart" },
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

      {/* SECTION: MAIN DATA DISPLAY (TABLE & MOBILE LIST) */}
      <div className={styles.panel}>
        {/* TABLE VIEW (HIDDEN ON MOBILE) */}
        <table className="hidden md:table w-full text-left border-collapse bg-[#FCF9F1]">
          <thead>
            <tr className="bg-[#0F172A] text-[#FCF9F1]">
              {/* YOUR SCORE HEADER */}
              <th
                title="Your rating for this song"
                className="px-4 py-2 text-[10px] font-black uppercase text-center w-20 border-r border-[#FCF9F1]/10 cursor-help"
              >
                YOU
              </th>

              {/* MAP SHORTENED HEADERS */}
              {[
                { label: "Hit", hover: "Title of the Hit Song" },
                { label: "Artist", hover: "Recording Artist" },
                { label: "Year", hover: "Year First Charted" },
                { label: "Peak", hover: "Highest US Chart Position" },
                { label: "PopHits", hover: "Global Pophits Community Score" },
                { label: "Weeks", hover: "Total Weeks on US Chart" },
              ].map((h) => (
                <th
                  key={h.label}
                  title={h.hover}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest cursor-help ${
                    h.label === "PopHits" ? "text-center w-24" : ""
                  }`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody
            suppressHydrationWarning
            className={loading ? "opacity-40" : ""}
          >
            {songs.map((song) => (
              <tr
                key={song.id}
                /* ZEBRA STRIPING: Using odd/even background colors instead of borders */
                className="odd:bg-white even:bg-[#FCF9F1] hover:bg-yellow-50 transition-colors group"
              >
                {/* YOUR SCORE COLUMN: Reduced height to h-10 (40px) */}
                <td className="p-0 align-middle">
                  <div className="flex justify-center items-center h-10 font-mono font-black text-lg text-[#0F172A]">
                    {isMounted && isAuthenticated && song.user_rating > 0 ? (
                      song.user_rating
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </div>
                </td>

                {/* SONG INFO: Changed py-2 to py-1 to reduce row height */}
                <td className="px-4 py-1 font-bold text-[13px] text-left align-middle">
                  <Link
                    href={`/songs/${song.slug}`}
                    className="hover:underline"
                  >
                    {song.title}
                  </Link>
                </td>

                <td className="px-4 py-1 font-medium text-sm align-middle opacity-80">
                  <Link
                    href={`/artist/${song.artist_slug}`}
                    className="hover:underline"
                  >
                    {song.artist}
                  </Link>
                </td>

                <td className="px-4 py-1 font-mono font-bold text-sm align-middle">
                  {song.year}
                </td>

                <td className="px-4 py-1 font-mono font-bold text-sm align-middle text-slate-500">
                  #{song.peak_rank}
                </td>

                {/* PH SCORE: Kept yellow, removed side borders, reduced height */}
                <td className="p-0 bg-[#FFD700] align-middle">
                  <div className="flex justify-center items-center h-10 font-mono font-black text-sm text-[#0F172A]">
                    {song.average_user_score && song.average_user_score > 0
                      ? song.average_user_score.toFixed(1)
                      : "—"}
                  </div>
                </td>

                <td className="px-4 py-1 font-mono font-bold text-sm align-middle text-center">
                  {song.weeks_on_chart}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MOBILE VIEW (HIDDEN ON DESKTOP) */}
        <div className="md:hidden divide-y-2 divide-[#0F172A] bg-[#FCF9F1]">
          {songs.map((song) => (
            <div
              key={song.id}
              className="flex items-stretch active:bg-[#FFD700]/10 transition-colors"
            >
              {/* LEFT CELL: Main Info (Title, Artist, Metadata) */}
              <div className="flex-1 p-3 min-w-0 border-r-2 border-[#0F172A]">
                <div className="mb-2">
                  <Link
                    href={`/songs/${song.slug}`}
                    className="font-black text-[13px] uppercase leading-none block truncate mb-1"
                  >
                    {song.title}
                  </Link>
                  <Link
                    href={`/artist/${song.artist_slug}`}
                    className="text-[12px] font-bold text-[#0F172A]/70 uppercase tracking-tight"
                  >
                    {song.artist}
                  </Link>
                </div>

                {/* Vintage Styled Metadata Row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 border-t border-[#0F172A]/10 mt-1">
                  {/* Year Label */}
                  <div className="flex items-center gap-1 font-mono text-[10px] font-black uppercase">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-400">CHARTED:</span>
                    <span className="text-[#0F172A]">{song.year}</span>
                  </div>

                  {/* Peak Position Label */}
                  <div className="flex items-center gap-1 font-mono text-[10px] font-black uppercase">
                    <TrendingUp className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-400">US PEAK:</span>
                    <span className="text-[#0F172A]">#{song.peak_rank}</span>
                  </div>

                  {/* Weeks Label */}
                  <div className="flex items-center gap-1 font-mono text-[10px] font-black uppercase">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-400">WEEKS:</span>
                    <span className="text-[#0F172A]">
                      {song.weeks_on_chart}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT CELLS: The Split Rating Box (Stacked) */}
              <div className="w-16 flex flex-col shrink-0 border-l-1 border-[#0F172A]">
                {/* Top Box: YOUR SCORE - Uses flex-1 to fill exactly half */}
                <div className="flex-1 flex flex-col items-center justify-center bg-white px-1 min-h-[40px]">
                  <span className="text-[7px] font-black text-[#0F172A]/40 uppercase tracking-tighter leading-none mb-1 text-center">
                    YOUR SCORE
                  </span>
                  <span className="font-mono text-[14px] font-black leading-none text-[#0F172A]">
                    {isMounted && isAuthenticated && song.user_rating > 0
                      ? song.user_rating
                      : "—"}
                  </span>
                </div>

                {/* Bottom Box: POPHITS.ORG - Uses flex-1 and a top border as the divider */}
                <div className="flex-1 flex flex-col items-center justify-center bg-[#FFD700] px-1 border-t-2 border-[#0F172A] min-h-[40px]">
                  <span className="text-[7px] font-black text-[#0F172A]/40 uppercase tracking-tighter leading-none mb-1 text-center">
                    POPHITS.ORG
                  </span>
                  <span className="font-mono text-[14px] font-black leading-none text-[#0F172A]">
                    {song.average_user_score && song.average_user_score > 0
                      ? song.average_user_score.toFixed(1)
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: PAGINATION & BULK ACTIONS */}
      <div className="space-y-4 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="bg-[#0F172A] text-[#FCF9F1] px-4 py-2 text-[10px] font-black uppercase border-2 border-[#0F172A] w-full md:w-auto text-center">
            {showingFrom}-{showingTo} / {totalCount} hits
          </div>
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="border-2 border-[#0F172A] px-2 py-1 text-[9px] font-black uppercase bg-white disabled:opacity-30"
            >
              First
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border-2 border-[#0F172A] p-1 bg-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-4 py-1.5 flex items-center font-mono font-black text-[11px] border-2 border-[#0F172A] bg-white min-w-[60px] justify-center">
              {page} / {totalPages || 1}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border-2 border-[#0F172A] p-1 bg-white disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="border-2 border-[#0F172A] px-2 py-1 text-[9px] font-black uppercase bg-white disabled:opacity-30"
            >
              Last
            </button>
          </nav>
        </div>
        <button
          onClick={() => {
            const urls = songs.map((s) => s.spotify_url).filter(Boolean);
            if (urls.length > 0) {
              navigator.clipboard.writeText(urls.join("\n"));
              alert("Copied!");
            }
          }}
          className="w-full bg-[#0F172A] text-[#FFD700] py-3 border-2 border-[#0F172A] flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest"
        >
          <Clipboard className="w-4 h-4" /> Copy all Spotify URLs to clipboard
        </button>
      </div>
    </div>
  );
}
