"use client";

import { useState, useEffect, useRef } from "react";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { toggleBookmarkSong } from "@/lib/api";
import { useSong } from "@/contexts/SongContext";

export default function SongActions({ showRatingOnly = false }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasInitializedRef = useRef(false);
  const {
    song,
    userScore,
    setUserScore,
    averageScore,
    isBookmarked,
    setIsBookmarked,
    refreshSongData,
  } = useSong();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);

    // Only refresh on mount or when song.slug changes, not when refreshSongData changes
    if (token && song.slug) {
      refreshSongData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.slug]); // Only re-run when slug changes

  const handleScoreChange = async (score) => {
    if (!isAuthenticated) return;
    const authToken = localStorage.getItem("authToken");
    const finalScore = userScore === score ? 0 : score;

    // Optimistically update UI
    setUserScore(finalScore);

    try {
      const response = await fetch(
        `${
          process.env.NODE_ENV === "development"
            ? "http://localhost:8000"
            : "https://pophits.org"
        }/api/songs/${song.id}/rate/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
          body: JSON.stringify({ rating: finalScore }),
        }
      );

      if (response.ok) {
        // Refresh to get updated average score
        setTimeout(() => {
          refreshSongData();
        }, 500);
      } else {
        // Revert optimistic update on failure
        setUserScore(userScore);
      }
    } catch (error) {
      console.error("Rating failed:", error);
      // Revert optimistic update on failure
      setUserScore(userScore);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) return;
    
    // Optimistically update UI
    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);

    try {
      const authToken = localStorage.getItem("authToken");
      const response = await toggleBookmarkSong(song.id, authToken);
      setIsBookmarked(response.is_bookmarked);
      
      // Refresh to sync any other data
      await refreshSongData();
    } catch (error) {
      console.error("Bookmark toggle failed:", error);
      // Revert optimistic update on failure
      setIsBookmarked(previousState);
    }
  };

  return (
    <div className="w-full">
      {!showRatingOnly && (
        <div className="flex items-center justify-center gap-4 mb-4">
          {isAuthenticated ? (
            <button
              onClick={handleBookmarkToggle}
              className={`p-3 w-12 h-12 rounded-full shadow-md transition-all ${
                isBookmarked
                  ? "bg-amber-400 text-slate-900"
                  : "bg-white text-slate-400 border border-slate-300"
              }`}
            >
              <Bookmark
                className="w-5 h-5"
                fill={isBookmarked ? "currentColor" : "none"}
              />
            </button>
          ) : (
            <div className="text-sm text-slate-600">
              <Link href="/login" className="text-amber-700 font-medium">
                Login
              </Link>{" "}
              to bookmark/rate
            </div>
          )}

          {averageScore !== null && (
            <div className="bg-slate-900 text-amber-400 font-bold w-12 h-12 flex items-center justify-center rounded-full border border-slate-700 shadow-md">
              {averageScore === 0
                ? "-"
                : typeof averageScore === "number"
                ? averageScore.toFixed(1)
                : averageScore}
            </div>
          )}
        </div>
      )}

      {showRatingOnly && isAuthenticated && (
        <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-700 mb-4">
          <div className="flex flex-col items-center">
            <p className="text-lg font-medium text-white mb-3">Your Score:</p>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 max-w-md mx-auto">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  onClick={() => handleScoreChange(i + 1)}
                  className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full cursor-pointer transition-all ${
                    userScore === i + 1
                      ? "bg-amber-400 text-slate-900 font-bold scale-110"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
