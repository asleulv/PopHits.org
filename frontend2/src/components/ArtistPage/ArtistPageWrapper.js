"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getSongs, getArtistBySlug } from "@/lib/api";
import SongListPage from "@/components/SongList/SongListPage";
import ArtistInfo from "@/components/ArtistPage/ArtistInfo";

// Helper function to capitalize words
function capitalizeWords(str) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function ArtistPageWrapper() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [songs, setSongs] = useState([]);
  const [totalSongs, setTotalSongs] = useState(0);
  const [artistData, setArtistData] = useState(null);
  const [loading, setLoading] = useState(true);

  // We use a Ref to track the current request to solve the race condition
  const latestRequest = useRef(0);
  
  const artistSlug = params?.slug;
  const artistName = artistSlug ? capitalizeWords(artistSlug) : "";

  // Parse search parameters
  const query = searchParams.get("query") || "";
  const filter = searchParams.get("filter") || null;
  const unrated = searchParams.get("unrated") === "true";
  const decade = searchParams.get("decade") || null;
  const sortBy = searchParams.get("sort_by") || null;
  const order = searchParams.get("order") || null;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("per_page") || "25", 10);

  // Determine peak rank filter
  const peakRankFilter = filter === "number-one" ? "1" : null;

  useEffect(() => {
    // Increment the request ID for every new attempt
    const requestId = ++latestRequest.current;

    async function fetchData() {
      if (!artistSlug) return;

      try {
        setLoading(true);

        const [songsData, artistDataResponse] = await Promise.all([
          getSongs({
            page: page,
            perPage: perPage,
            type: "artist",
            slug: artistSlug,
            sortBy: sortBy,
            order: order,
            query: query,
            peakRank: peakRankFilter,
            unrated: unrated,
            decade: decade,
          }),
          getArtistBySlug(artistSlug),
        ]);

        // THE LOCK: Only update if this request matches the current state
        if (requestId === latestRequest.current) {
          setSongs(songsData.results || []);
          setTotalSongs(songsData.count || 0);
          setArtistData(artistDataResponse);
          setLoading(false);
        }
      } catch (error) {
        if (requestId === latestRequest.current) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      }
    }

    fetchData();
  }, [
    artistSlug,
    page,
    perPage,
    sortBy,
    order,
    query,
    filter,
    unrated,
    decade,
    peakRankFilter,
  ]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-10 bg-yellow-50">
        <div className="bg-black text-yellow-400 px-10 py-5 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-2xl font-black uppercase italic animate-pulse">
          Accessing Archive...
        </div>
        <p className="mt-4 font-mono text-xs uppercase font-bold tracking-widest text-slate-500">
          Isolating {artistName} Records
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-yellow-50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        {artistData && (
          <div className="mb-12">
            <ArtistInfo artistData={artistData} />
          </div>
        )}

        <div className="bg-white border-4 border-black rounded-xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-2">
          {/* IMPORTANT CHANGE: We pass the actual 'songs' state 
              NOT 'initialSongs'. This forces the list to show 
              what we just fetched.
          */}
          <SongListPage
            songs={songs} 
            totalSongs={totalSongs}
            filterType="artist"
            filterValue={artistSlug}
            artistSlug={artistSlug}
            artistName={artistName}
            initialPage={page}
            initialPerPage={perPage}
            initialSortField={sortBy}
            initialSortOrder={order}
            initialNumberOneFilter={filter === "number-one"}
            initialUnratedFilter={unrated}
            initialDecadeFilter={decade}
            initialSearchQuery={query}
          />
        </div>
      </div>
    </main>
  );
}