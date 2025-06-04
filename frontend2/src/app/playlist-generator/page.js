import { Suspense } from 'react';
import { Music } from 'lucide-react';
import PlaylistGeneratorClient from '@/components/PlaylistGenerator/PlaylistGeneratorClient';

export const metadata = {
  title: 'Hit Song Playlist Generator | PopHits.org',
  description: 'Generate custom playlists of hit songs by selecting decades and popularity levels. Perfect for discovering both chart-toppers and hidden gems from your favorite eras.',
  keywords: 'playlist generator, hit songs, music playlist, billboard hits, custom playlist',
  openGraph: {
    title: 'Hit Song Playlist Generator | PopHits.org',
    description: 'Generate custom playlists of hit songs by selecting decades and popularity levels.',
    url: 'https://pophits.org/playlist-generator',
    siteName: 'PopHits.org',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Hit Song Playlist Generator | PopHits.org',
    description: 'Generate custom playlists of hit songs by selecting decades and popularity levels.',
  },
  alternates: {
    canonical: 'https://pophits.org/playlist-generator',
  },
};

export default function PlaylistGeneratorPage() {
  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center bg-gradient-to-r from-pink-500 via-purple-600 to-purple-900 bg-clip-text text-transparent">
        <div className="flex items-center justify-center gap-2 px-1 py-1">
          <Music className="w-8 h-8 text-pink-500" />
          <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">
            Hit Song Playlist Generator
          </span>
        </div>
      </h1>
      
      <div className="mb-8">
        <p className="text-center text-gray-700 text-lg max-w-3xl mx-auto">
          Generate custom playlists of hit songs by selecting decades and popularity levels.
          Perfect for discovering both chart-toppers and hidden gems from your favorite eras.
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-12">Loading playlist generator...</div>}>
        <PlaylistGeneratorClient />
      </Suspense>
    </div>
  );
}
