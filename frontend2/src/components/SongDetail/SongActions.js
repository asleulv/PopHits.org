"use client";

import { useState, useEffect } from 'react';
import { Bookmark, Star } from 'lucide-react';
import Link from 'next/link';
import { toggleBookmarkSong, submitUserScore } from '@/lib/api';
import ShareButtons from './ShareButtons';
import { useSong } from '@/contexts/SongContext';

export default function SongActions({ showRatingOnly = false }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { song, userScore, setUserScore, averageScore, setAverageScore, isBookmarked, setIsBookmarked } = useSong();

  // Check authentication status on component mount
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    setIsAuthenticated(!!authToken);
    
    // If authenticated, fetch the user's rating and bookmark status for this song
    if (authToken) {
      const fetchUserData = async () => {
        try {
          // Get the user ID from the profile
          const profileResponse = await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://pophits.org'}/api/profile/`, {
            headers: {
              'Authorization': `Token ${authToken}`
            }
          });
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            const userId = profileData.user_data.id;
            
            // Get the user's rating for this song
            const ratingResponse = await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://pophits.org'}/api/songs/ratings/${song.id}/user/${userId}/`, {
              headers: {
                'Authorization': `Token ${authToken}`
              }
            });
            
            if (ratingResponse.ok) {
              const rating = await ratingResponse.json();
              if (rating) {
                setUserScore(rating);
              }
            }
            
            // Get the bookmark status for this song
            const bookmarkResponse = await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://pophits.org'}/api/songs/${song.id}/bookmark-status/`, {
              headers: {
                'Authorization': `Token ${authToken}`
              }
            });
            
            if (bookmarkResponse.ok) {
              const bookmarkData = await bookmarkResponse.json();
              setIsBookmarked(bookmarkData.is_bookmarked);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      
      fetchUserData();
    }
  }, [song, setUserScore, setIsBookmarked]);

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) return;
    
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await toggleBookmarkSong(song.id, authToken);
      setIsBookmarked(response.is_bookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleScoreChange = async (score) => {
    if (!isAuthenticated) return;
    
    try {
      const authToken = localStorage.getItem('authToken');
      
      // If clicking the same score, remove the rating
      if (userScore === score) {
        setUserScore(0);
        
        // Submit the rating directly with fetch instead of using the helper function
        await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://pophits.org'}/api/songs/${song.id}/rate/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`
          },
          body: JSON.stringify({ rating: 0 })
        });
      } else {
        setUserScore(score);
        
        // Submit the rating directly with fetch instead of using the helper function
        await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://pophits.org'}/api/songs/${song.id}/rate/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`
          },
          body: JSON.stringify({ rating: score })
        });
      }
      
      // Fetch the updated song to get the new average score
      const updatedSong = await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://pophits.org'}/api/songs/${song.slug}/`);
      if (updatedSong.ok) {
        const songData = await updatedSong.json();
        setAverageScore(songData.average_user_score);
      }
    } catch (error) {
      console.error('Error setting score:', error);
    }
  };

  return (
    <div className="w-full">
      {/* Bookmark and Average Score UI */}
      {!showRatingOnly && (
        <div className="flex items-center justify-center gap-4 mb-4">
          {isAuthenticated && (
            <button
              className={`transform transition-transform hover:scale-110 p-3 w-12 h-12 rounded-full shadow-md ${
                isBookmarked
                  ? "bg-amber-400 text-slate-900"
                  : "bg-white text-slate-400 hover:bg-slate-100 border border-slate-300"
              }`}
              onClick={handleBookmarkToggle}
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <Bookmark
                className={`w-5 h-5 ${
                  isBookmarked ? "text-slate-900" : "text-slate-400"
                }`}
                fill={isBookmarked ? "currentColor" : "none"}
              />
            </button>
          )}
          
          {averageScore !== null && (
            <div className="bg-slate-900 text-amber-400 font-bold w-12 h-12 flex items-center justify-center rounded-full shadow-md border border-slate-700">
              <span className="text-lg">
                {averageScore === 0
                  ? "-"
                  : typeof averageScore === 'number' 
                    ? Number.isInteger(averageScore) 
                      ? averageScore.toString() 
                      : averageScore.toFixed(1)
                    : averageScore}
              </span>
            </div>
          )}
          
          {!isAuthenticated && (
            <div className="text-sm text-slate-600">
              <Link href="/login" className="text-amber-700 hover:text-amber-900 font-medium">
                Login
              </Link> to bookmark and rate
            </div>
          )}
        </div>
      )}
      
      {/* Rating UI */}
      {showRatingOnly && isAuthenticated && (
        <div className="bg-slate-900 p-6 rounded-xl shadow-sm mb-4 border border-slate-700">
          <div className="flex flex-col items-center">
            <p className="text-lg font-medium text-white mb-3 text-center">
              Your Score:
            </p>

            {/* Responsive grid: 2 rows of 5 on mobile, 1 row of 10 on desktop */}
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 max-w-md mx-auto mb-2">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full shadow-md transition-all duration-300 cursor-pointer transform hover:scale-110 ${
                    userScore === index + 1
                      ? "bg-amber-400 text-slate-900 font-bold"
                      : "bg-white text-slate-700 font-semibold hover:bg-slate-100 border border-slate-300"
                  }`}
                  onClick={() => handleScoreChange(index + 1)}
                >
                  {index + 1}
                </div>
              ))}
            </div>

            <p className="text-sm text-slate-400 italic text-center mt-3">
              Click a number to rate, click again to remove your rating
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
