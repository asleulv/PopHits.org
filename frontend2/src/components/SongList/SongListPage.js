"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Search, Filter, Calendar, Music, Star, Award } from "lucide-react";
import SongListClient from "@/components/SongList/SongListClient";

export default function SongListPage({
  initialSongs,
  totalSongs,
  filterType = null,
  filterValue = null,
  yearFilter = null,
  artistSlug = null,
  artistName = null,
  tagSlug = null,
  tagName = null,
}) {
  const searchParams = useSearchParams();

  // Parse search parameters
  const query = searchParams.get("query") || "";
  const filter = searchParams.get("filter") || null;
  const unrated = searchParams.get("unrated") === "true";
  const decade = searchParams.get("decade") || null;
  const sortBy = searchParams.get("sort_by") || null;
  const order = searchParams.get("order") || null;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("per_page") || "25", 10);

  // Generate page title based on filters
  let pageTitle = "All Hit Songs";

  if (artistName) {
    pageTitle = `${artistName} Hits`;
    if (query) pageTitle = `${artistName}: Search Results for "${query}"`;
    if (filter === "number-one") pageTitle = `${artistName}: #1 Hits Only`;
    if (unrated) pageTitle = `${artistName}: Unrated Songs`;
    if (decade) pageTitle = `${artistName}: ${decade}s Hits`;
    if (unrated && filter === "number-one")
      pageTitle = `${artistName}: Unrated #1 Hits`;
  } else if (yearFilter) {
    pageTitle = `${yearFilter} Hits`;
    if (query) pageTitle = `${yearFilter}: Search Results for "${query}"`;
    if (filter === "number-one") pageTitle = `${yearFilter}: #1 Hits Only`;
    if (unrated) pageTitle = `${yearFilter}: Unrated Songs`;
    if (unrated && filter === "number-one")
      pageTitle = `${yearFilter}: Unrated #1 Hits`;
  } else if (tagName) {
    pageTitle = `${tagName} Hits`;
    if (query) pageTitle = `${tagName}: Search Results for "${query}"`;
    if (filter === "number-one") pageTitle = `${tagName}: #1 Hits Only`;
    if (unrated) pageTitle = `${tagName}: Unrated Songs`;
    if (decade) pageTitle = `${tagName}: ${decade}s Hits`;
    if (unrated && filter === "number-one")
      pageTitle = `${tagName}: Unrated #1 Hits`;
  } else {
    if (query) pageTitle = `Search Results for "${query}"`;
    if (filter === "number-one") pageTitle = "#1 Hits Only";
    if (unrated) pageTitle = "Unrated Songs";
    if (decade) pageTitle = `${decade}s Hits`;
    if (unrated && filter === "number-one") pageTitle = "Unrated #1 Hits";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center bg-gradient-to-r from-black via-slate-700 to-slate-900 bg-clip-text text-transparent">
        <div className="flex items-center justify-center gap-2 px-1 py-1">
          {unrated ? (
            <Star className="w-8 h-8 text-black" />
          ) : filter === "number-one" ? (
            <Award className="w-8 h-8 text-black" />
          ) : query ? (
            <Search className="w-8 h-8 text-black" />
          ) : decade ? (
            <Calendar className="w-8 h-8 text-black" />
          ) : artistName ? (
            <Music className="w-8 h-8 text-black" />
          ) : (
            <Filter className="w-8 h-8 text-black" />
          )}
          <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent">
            {pageTitle}
          </span>
        </div>
      </h1>

      <Suspense
        fallback={
          <div className="text-center py-12 text-slate-700">
            Loading songs...
          </div>
        }
      >
        <SongListClient
          initialSongs={initialSongs}
          totalSongs={totalSongs}
          initialPage={page}
          initialPerPage={perPage}
          initialSortField={sortBy}
          initialSortOrder={order}
          initialNumberOneFilter={filter === "number-one"}
          initialUnratedFilter={unrated}
          initialDecadeFilter={decade}
          initialSearchQuery={query}
          yearFilter={yearFilter}
          artistSlug={artistSlug}
          artistName={artistName}
          tagSlug={tagSlug}
          tagName={tagName}  
        />
      </Suspense>
    </div>
  );
}
