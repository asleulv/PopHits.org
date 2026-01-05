"use client";

import { createContext, useContext, useState } from "react";

const SongContext = createContext();

export function SongProvider({ children, initialSong }) {
  const [song, setSong] = useState(initialSong);
  const [userScore, setUserScore] = useState(initialSong.user_rating || 0);
  const [averageScore, setAverageScore] = useState(
    initialSong.average_user_score || 0
  );
  const [isBookmarked, setIsBookmarked] = useState(
    initialSong.is_bookmarked || false
  );

  const refreshSongData = async () => {
    if (typeof window === "undefined") return;

    const authToken = localStorage.getItem("authToken");

    const internalKey =
      process.env.NEXT_PUBLIC_INTERNAL_API_KEY || "your_actual_key_here";

    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:8000"
        : "https://pophits.org";

    try {
      const headers = {
        "Content-Type": "application/json",
        "X-Internal-Key": internalKey,
      };

      if (authToken) {
        headers["Authorization"] = `Token ${authToken}`;
      }

      // Using timestamp to avoid cache issues
      const response = await fetch(
        `${baseUrl}/api/songs/${song.id}/?t=${Date.now()}`,
        {
          method: "GET",
          headers: headers,
        }
      );

      if (response.ok) {
        const freshData = await response.json();

        // 1. Update the song object and the public average score
        setSong({ ...freshData });
        setAverageScore(freshData.average_user_score);

        // 2. ONLY update userScore if the server response actually contains it.
        // This prevents the circle highlight from being reset to 0 if the 
        // serializer doesn't include the 'user_rating' field.
        if (freshData.user_rating !== undefined && freshData.user_rating !== null) {
          setUserScore(freshData.user_rating);
        }

        // 3. Only update bookmark if it's explicitly in the response
        if (freshData.is_bookmarked !== undefined) {
          setIsBookmarked(freshData.is_bookmarked);
        }

        console.log(
          "✅ Sync Successful! Total Ratings now:",
          freshData.total_ratings
        );
      } else {
        const errorText = await response.text();
        console.error(`❌ Sync Failed (${response.status}):`, errorText);
      }
    } catch (err) {
      console.error("Network error during refresh:", err);
    }
  };

  return (
    <SongContext.Provider
      value={{
        song,
        userScore,
        setUserScore,
        averageScore,
        setAverageScore,
        isBookmarked,
        setIsBookmarked,
        refreshSongData,
      }}
    >
      {children}
    </SongContext.Provider>
  );
}

export function useSong() {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error("useSong must be used within a SongProvider");
  }
  return context;
}