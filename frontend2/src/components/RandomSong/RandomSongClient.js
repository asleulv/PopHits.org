"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Music } from 'lucide-react';

export default function RandomSongClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomSong = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch a random song from our API route
        const response = await fetch('/api/songs/random', {
          cache: 'no-store',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch random song: ${response.status}`);
        }
        
        const song = await response.json();
        
        // Navigate to the song detail page
        if (song && song.slug) {
          router.push(`/songs/${song.slug}`);
        } else {
          // If no song was found, navigate to the songs list
          router.push('/songs');
        }
      } catch (error) {
        console.error('Error fetching random song:', error);
        setError(error.message);
        // After 3 seconds, redirect to songs page
        setTimeout(() => {
          router.push('/songs');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomSong();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      {loading ? (
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Finding a random hit...</h2>
          <p className="text-gray-600">Searching through the Billboard Hot 100 archives</p>
        </div>
      ) : error ? (
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p className="font-bold">Error finding a random song</p>
            <p>{error}</p>
          </div>
          <p className="text-gray-600">Redirecting to songs page in a moment...</p>
        </div>
      ) : (
        <div className="text-center">
          <Music className="h-16 w-16 text-pink-500 mb-4 mx-auto animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Redirecting to a random hit...</h2>
          <p className="text-gray-600">Just a moment while we take you there</p>
        </div>
      )}
    </div>
  );
}
