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
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen space-y-10">
      
      {/* 1. Header Section - Brutalist Style */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-1">
          <Music className="w-4 h-4" />
          <h2 className="text-xs font-black italic uppercase tracking-[0.3em]">
            Archive Tool // Sequence Generator
          </h2>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-black leading-none">
          Playlist Generator
        </h1>

        <div className="max-w-2xl mx-auto pt-4 border-t-2 border-black/10">
          <p className="text-lg md:text-xl font-bold text-black/60 uppercase tracking-tight leading-tight italic">
            Filter the historical record by decade and chart intensity. 
            Discover both the era-defining anthems and the obscure artifacts.
          </p>
        </div>
      </div>

      {/* 2. Main Interface */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <Suspense 
          fallback={
            <div className="flex flex-col items-center justify-center py-20 border-2 border-black bg-[#fdfbf7]">
              <div className="w-12 h-12 border-4 border-black border-t-transparent animate-spin mb-4" />
              <p className="font-black uppercase italic tracking-widest text-xs">Calibrating Generator...</p>
            </div>
          }
        >
          <PlaylistGeneratorClient />
        </Suspense>
      </div>

      {/* 3. Footer Branding */}
      <div className="pt-12 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 italic">
          PopHits.org // Custom Retrieval Engine v2.6
        </p>
      </div>
    </div>
  );
}