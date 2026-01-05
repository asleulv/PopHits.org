"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Clipboard, Star, Award, Loader2 } from "lucide-react";

// Widget Imports
import ProfileHeader from "./dashboard/DossierHeader";
import StatCard from "./dashboard/StatCard";
import DecadeStats from "./dashboard/DecadeStats";
import RatedSongsList from "./dashboard/RatedSongsList";
import ScoreDistribution from "./dashboard/ScoreDistribution";
import HistoryTable from "./dashboard/HistoryTable";
import BookmarkTable from "./dashboard/BookmarkTable";
import TopArtists from "./dashboard/TopArtists";
import GenreHeatmap from "./dashboard/GenreHeatMap";
import HistorianRank from "./dashboard/HistorianRank";

// --- Loading Component ---
const LoadingDossier = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 animate-in fade-in duration-500">
    <div className="relative">
      <Loader2 className="w-20 h-20 animate-spin text-black" strokeWidth={2.5} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
      </div>
    </div>
    <div className="text-center space-y-2">
      <h2 className="inline-block bg-black text-white px-4 py-1 text-xs font-black italic uppercase tracking-[0.2em]">
        Status: Accessing Archive
      </h2>
      <p className="text-3xl font-black italic uppercase tracking-tighter text-black">
        Retrieving Personnel Data...
      </p>
    </div>
  </div>
);

export default function ProfileClient() {
  const { isAuthenticated, authToken } = useAuth();
  const router = useRouter();

  const [userProfile, setUserProfile] = useState(null);
  const [ratingHistory, setRatingHistory] = useState([]);
  const [bookmarkedSongs, setBookmarkedSongs] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // UI State
  const [tab, setTab] = useState("rating");
  const [filterScore, setFilterScore] = useState(1);
  const [currentPageRating, setCurrentPageRating] = useState(1);
  const [currentPageBookmarks, setCurrentPageBookmarks] = useState(1);

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8000"
      : "https://pophits.org";

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) router.push("/login");
  }, [isAuthenticated, isLoading, router]);

  // Phase 1: Fetch Profile and Bookmarks
  useEffect(() => {
    const fetchCoreData = async () => {
      if (!authToken) return;
      try {
        const [pRes, bRes] = await Promise.all([
          fetch(`${baseUrl}/api/profile/`, {
            headers: {
              Authorization: `Token ${authToken}`,
              "X-Requested-With": "XMLHttpRequest",
            },
          }),
          fetch(`${baseUrl}/api/songs/bookmarked-songs/`, {
            headers: {
              Authorization: `Token ${authToken}`,
              "X-Requested-With": "XMLHttpRequest",
            },
          }),
        ]);
        
        const pData = await pRes.json();
        const bData = await bRes.json();

        setUserProfile(pData.user_data);
        setRatingHistory(pData.rating_history || []);
        setBookmarkedSongs(bData);
      } catch (err) {
        console.error("Error fetching core data:", err);
        setIsLoading(false); // Stop loading on error so UI can show error state
      }
    };
    fetchCoreData();
  }, [authToken, baseUrl]);

  // Phase 2: Fetch Stats (depends on userProfile from Phase 1)
  useEffect(() => {
    if (!userProfile?.username) return;

    const fetchStatsData = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/api/profile/stats/${encodeURIComponent(
            userProfile.username
          )}/`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
              "X-Requested-With": "XMLHttpRequest",
            },
          }
        );
        const statsData = await res.json();
        setUserStats(statsData);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        // Only set loading to false once the heaviest data (stats) is in
        setIsLoading(false);
      }
    };
    fetchStatsData();
  }, [userProfile, authToken, baseUrl]);

  const copySpotifyUrls = () => {
    const songs =
      tab === "rating"
        ? ratingHistory.filter((r) => r.score >= filterScore)
        : bookmarkedSongs;
    const urls = songs
      .map((s) => s.spotify_url)
      .filter((u) => u)
      .join("\n");
    if (urls) {
      navigator.clipboard.writeText(urls);
      alert("Spotify URLs copied!");
    }
  };

  const handleDeleteAllBookmarks = async () => {
    if (!window.confirm(`Delete ${bookmarkedSongs.length} bookmarks?`)) return;
    await fetch(`${baseUrl}/api/songs/bookmarked-songs/delete-all/`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${authToken}`,
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    setBookmarkedSongs([]);
  };

  // 1. Loading Guard
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-20">
        <LoadingDossier />
      </div>
    );
  }

  // 2. Auth Guard
  if (!isAuthenticated) return null;

  // 3. Main Render
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* 1. Header Title */}
      <div className="text-center space-y-2">
        <h2 className="inline-block bg-black text-white px-4 py-1 text-sm font-black italic uppercase tracking-tighter">
          THE JOURNEY THROUGH POP MUSIC
        </h2>
        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-black block">
          USER PROFILE
        </h1>
      </div>

      {/* 2. Unified Personnel Dossier */}
      <ProfileHeader userProfile={userProfile} ratings={ratingHistory} />

      {userStats && (
        <section className="space-y-8">
          {/* 2.5 New Historian Rank Widget */}
          <HistorianRank stats={userStats} />
          
          {/* 3. Metrics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              label="Songs Rated"
              value={userStats.songs_rated}
              subtext="COLLECTED BY YOU"
              icon={Star}
              colorClass="text-amber-600"
            />
            <StatCard
              label="Archive Size"
              value={userStats.total_songs}
              subtext="HITS IN DATABASE"
              icon={Clipboard}
              colorClass="text-black"
            />
            <StatCard
              label="Completion"
              value={`${userStats.percent_rated}%`}
              subtext="OF CHART HISTORY"
              icon={Award}
              colorClass="text-blue-600"
            />
          </div>

          <DecadeStats averages={userStats.decade_averages} />
          <GenreHeatmap ratings={ratingHistory} />
          <ScoreDistribution distribution={userStats.score_distribution} />
          <TopArtists ratings={ratingHistory} />

          <div className="flex flex-col md:flex-row gap-6">
            <RatedSongsList
              title="Highest Rated"
              songs={userStats.highest_rated_songs}
            />
            <RatedSongsList
              title="Lowest Rated"
              songs={userStats.lowest_rated_songs}
            />
          </div>
        </section>
      )}

      {/* 4. Archive Index Tabs */}
      <section id="history-archive" className="space-y-6 scroll-mt-20">
        <div className="flex justify-center border-b-4 border-black pb-1 gap-4">
          {["rating", "bookmarks"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-cherry font-black uppercase italic text-2xl px-6 py-2 transition-all ${
                tab === t
                  ? "bg-black text-white translate-y-[-4px]"
                  : "text-gray-400 hover:text-black"
              }`}
            >
              {t === "rating" ? "History" : "Bookmarks"}
            </button>
          ))}
        </div>

        {tab === "rating" ? (
          <HistoryTable
            ratings={ratingHistory}
            filterScore={filterScore}
            setFilterScore={setFilterScore}
            currentPage={currentPageRating}
            onPageChange={setCurrentPageRating}
            itemsPerPage={10}
          />
        ) : (
          <BookmarkTable
            bookmarks={bookmarkedSongs}
            currentPage={currentPageBookmarks}
            onPageChange={setCurrentPageBookmarks}
            itemsPerPage={10}
            onCopy={copySpotifyUrls}
            onDeleteAll={handleDeleteAllBookmarks}
          />
        )}
      </section>
    </div>
  );
}