"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SongListClient from "@/components/SongList/SongListClient";

export default function SongListPage({
  initialSongs,
  totalSongs,
  yearFilter = null,
  artistSlug = null,
  artistName = null,
  tagSlug = null,
  tagName = null,
  hideTitle = false,
}) {
  const searchParams = useSearchParams();

  // Parse initial search parameters to pass into the client component
  const query = searchParams.get("query") || "";
  const filter = searchParams.get("filter") || null;
  const unrated = searchParams.get("unrated") === "true";
  const decade = searchParams.get("decade") || null;
  const sortBy = searchParams.get("sort_by") || null;
  const order = searchParams.get("order") || null;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("per_page") || "25", 10);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Note: The H1 headline is now rendered inside SongListClient 
          to ensure it updates instantly when filters are clicked.
      */}
      <Suspense
        fallback={
          <div className="text-center py-12 font-mono text-[10px] uppercase tracking-widest text-slate-500 animate-pulse">
            Retrieving Archive...
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
          hideTitle={hideTitle}
        />
      </Suspense>
    </div>
  );
}