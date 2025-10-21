"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Music, Grid3x3, List } from "lucide-react";

export default function ArtistsListClient({ artists }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("All");
  const [viewMode, setViewMode] = useState("list"); // 'grid' or 'list'

  // Filter artists
  const filteredArtists = artists.filter((artist) => {
    const matchesSearch = artist.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesLetter =
      selectedLetter === "All" ||
      artist.name.charAt(0).toUpperCase() === selectedLetter;

    return matchesSearch && matchesLetter;
  });

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
        Browse Artists
      </h1>

      {/* Search and View Toggle */}
      <div className="max-w-2xl mx-auto mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* View mode toggle */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded ${
              viewMode === "grid"
                ? "bg-white shadow-sm text-pink-500"
                : "text-gray-600 hover:text-gray-900"
            }`}
            title="Grid view"
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded ${
              viewMode === "list"
                ? "bg-white shadow-sm text-pink-500"
                : "text-gray-600 hover:text-gray-900"
            }`}
            title="List view"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Alphabet filter */}
      <div className="flex flex-wrap justify-center gap-1 mb-8">
        <button
          onClick={() => setSelectedLetter("All")}
          className={`px-3 py-1 rounded transition-colors ${
            selectedLetter === "All"
              ? "bg-pink-500 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          }`}
        >
          All
        </button>
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className={`px-3 py-1 rounded transition-colors ${
              selectedLetter === letter
                ? "bg-pink-500 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-center text-gray-600 mb-6">
        Showing {filteredArtists.length} artist
        {filteredArtists.length !== 1 && "s"}
      </p>

      {/* Artists - Grid View */}
      {viewMode === "grid" && filteredArtists.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredArtists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artist/${artist.slug}`}
              className="group"
            >
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-4">
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
                  <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center mb-3">
                    <Music className="w-12 h-12 text-white opacity-80" />
                  </div>
                )}

                <h3 className="font-semibold text-center text-sm line-clamp-2 group-hover:text-pink-600 transition-colors mb-1">
                  {artist.name}
                </h3>

                {artist.total_hits && (
                  <p className="text-xs text-gray-500 text-center">
                    {artist.total_hits}{" "}
                    {artist.total_hits === 1 ? "hit" : "hits"}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Artists - List View */}
      {viewMode === "list" && filteredArtists.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-2 px-4 font-semibold text-gray-700 text-sm">
                  Artist
                </th>
                <th className="text-left py-2 px-4 font-semibold text-gray-700 text-sm hidden md:table-cell">
                  Nationality
                </th>
                <th className="text-center py-2 px-4 font-semibold text-gray-700 text-sm">
                  Hits
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredArtists.map((artist) => (
                <tr
                  key={artist.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2 px-4">
                    <Link
                      href={`/artist/${artist.slug}`}
                      className="flex gap-3 group"
                    >
                      
                      <span className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors text-sm">
                        {artist.name}
                      </span>
                    </Link>
                  </td>
                  <td className="py-2 px-4 text-gray-600 text-sm hidden md:table-cell">
                    {artist.nationality || "—"}
                  </td>
                  <td className="py-2 px-4 text-center text-gray-900 font-medium text-sm">
                    {artist.total_hits}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No results */}
      {filteredArtists.length === 0 && (
        <div className="text-center py-12">
          <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No artists found</p>
          <p className="text-gray-400 text-sm mt-2">
            Try a different search or filter
          </p>
        </div>
      )}
    </div>
  );
}
