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
  const [viewMode, setViewMode] = useState("list");
  const [selectedLetter, setSelectedLetter] = useState(currentLetter);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const filteredArtists = artists.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const data = await getArtists({
        page,
        pageSize: 100,
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
  }, [page, selectedLetter, loading, hasMore]);

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

  const handleLetterClick = async (letter) => {
    setSelectedLetter(letter);
    setLoading(true);
    setPage(2);

    try {
      const data = await getArtists({
        page: 1,
        pageSize: 100,
        letter: letter !== "All" ? letter : undefined,
      });
      setArtists(data.results || []);
      setHasMore(data.next !== null);
    } catch (error) {
      console.error("Error filtering artists:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent">
        Browse Artists
      </h1>

      {/* Search & View Toggle */}
      <div className="max-w-2xl mx-auto mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-900"
          />
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1 border border-slate-300">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded transition-colors ${
              viewMode === "grid"
                ? "bg-white shadow-sm text-amber-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded transition-colors ${
              viewMode === "list"
                ? "bg-white shadow-sm text-amber-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Alphabet Filter */}
      <div className="flex flex-wrap justify-center gap-1 mb-8">
        <button
          onClick={() => handleLetterClick("All")}
          className={`px-3 py-1 rounded transition-colors border ${
            selectedLetter === "All"
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
          }`}
        >
          All
        </button>
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            className={`px-3 py-1 rounded transition-colors border ${
              selectedLetter === letter
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <p className="text-center text-slate-700 mb-6">
        Showing {filteredArtists.length} artists
        {selectedLetter !== "All" && ` starting with "${selectedLetter}"`}
        {hasMore && " (scroll for more)"}
      </p>

      {/* Grid View */}
      {viewMode === "grid" && filteredArtists.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredArtists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artist/${artist.slug}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-4 border border-slate-400">
                {artist.image ? (
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3">
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-amber-400 to-slate-800 flex items-center justify-center mb-3">
                    <Music className="w-12 h-12 text-white opacity-80" />
                  </div>
                )}
                <h3 className="font-semibold text-center text-sm line-clamp-2 group-hover:text-amber-700 transition-colors mb-1 text-slate-900">
                  {artist.name}
                </h3>
                {artist.total_hits && (
                  <p className="text-xs text-slate-600 text-center">
                    {artist.total_hits}{" "}
                    {artist.total_hits === 1 ? "hit" : "hits"}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && filteredArtists.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto border border-slate-400">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-300">
              <tr>
                <th className="text-left py-2 px-4 font-semibold text-slate-900 text-sm">
                  Artist
                </th>
                <th className="text-left py-2 px-4 font-semibold text-slate-900 text-sm hidden md:table-cell">
                  Nationality
                </th>
                <th className="text-center py-2 px-4 font-semibold text-slate-900 text-sm">
                  Hits
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {filteredArtists.map((artist) => (
                <tr
                  key={artist.id}
                  className="hover:bg-yellow-50 transition-colors"
                >
                  <td className="py-2 px-4">
                    <Link href={`/artist/${artist.slug}`} className="group">
                      <span className="font-medium text-slate-900 group-hover:text-amber-700 transition-colors text-sm">
                        {artist.name}
                      </span>
                    </Link>
                  </td>
                  <td className="py-2 px-4 text-slate-700 text-sm hidden md:table-cell">
                    {artist.nationality || "—"}
                  </td>
                  <td className="py-2 px-4 text-center text-slate-900 font-medium text-sm">
                    {artist.total_hits}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader className="w-6 h-6 animate-spin text-amber-600" />
          <span className="ml-2 text-slate-700">Loading...</span>
        </div>
      )}

      {/* End */}
      {!hasMore && artists.length > 0 && (
        <div className="text-center py-8 text-slate-600">
          <p>
            We hope you find what you are looking for!
          </p>
        </div>
      )}

      {/* No Results */}
      {filteredArtists.length === 0 && !loading && (
        <div className="text-center py-12">
          <Music className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-700 text-lg">No artists found</p>
        </div>
      )}
    </div>
  );
}
