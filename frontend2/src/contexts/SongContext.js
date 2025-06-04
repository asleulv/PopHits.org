"use client";

import { createContext, useContext, useState } from 'react';

// Create the context
const SongContext = createContext();

// Create a provider component
export function SongProvider({ children, initialSong }) {
  const [song, setSong] = useState(initialSong);
  const [userScore, setUserScore] = useState(initialSong.user_rating || 0);
  const [averageScore, setAverageScore] = useState(initialSong.average_user_score || 0);
  const [isBookmarked, setIsBookmarked] = useState(initialSong.is_bookmarked || false);

  // Update the song data
  const updateSongData = (newData) => {
    setSong(prevSong => ({ ...prevSong, ...newData }));
    
    if (newData.average_user_score !== undefined) {
      setAverageScore(newData.average_user_score);
    }
    
    if (newData.user_rating !== undefined) {
      setUserScore(newData.user_rating);
    }
    
    if (newData.is_bookmarked !== undefined) {
      setIsBookmarked(newData.is_bookmarked);
    }
  };

  return (
    <SongContext.Provider value={{ 
      song, 
      userScore, 
      setUserScore, 
      averageScore, 
      setAverageScore,
      isBookmarked,
      setIsBookmarked,
      updateSongData
    }}>
      {children}
    </SongContext.Provider>
  );
}

// Create a custom hook to use the context
export function useSong() {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error('useSong must be used within a SongProvider');
  }
  return context;
}
