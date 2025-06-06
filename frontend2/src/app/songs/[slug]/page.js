import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { 
  Calendar, 
  TrendingUp, 
  Clock, 
  Star, 
  Music, 
  SquarePlay 
} from "lucide-react";
import { getSongBySlug } from "@/lib/api";
import SongActions from "@/components/SongDetail/SongActions";
import SongComments from "@/components/SongDetail/SongComments";
import { SongProvider } from "@/contexts/SongContext";
import SongDetailContent from "@/components/SongDetail/SongDetailContent";

// Generate metadata for better SEO
export async function generateMetadata({ params }) {
  const song = await getSongBySlug(params.slug);
  
  return {
    title: `${song.title} by ${song.artist} | PopHits.org`,
    description: song.review ? 
      `${song.title} by ${song.artist} (${song.year}) - Peak position: #${song.peak_rank} on the Billboard Hot 100.` : 
      `Listen to ${song.title} by ${song.artist} from ${song.year}. Peak position: #${song.peak_rank} on the Billboard Hot 100.`,
    openGraph: {
      title: `${song.title} by ${song.artist}`,
      description: `${song.title} by ${song.artist} (${song.year}) - Peak position: #${song.peak_rank} on the Billboard Hot 100.`,
      url: `https://pophits.org/songs/${song.slug}`,
      siteName: 'PopHits.org',
      images: [
        {
          url: song.image_upload || 'https://pophits.org/static/gfx/oldhits_logo.png',
          width: 800,
          height: 600,
          alt: `${song.title} by ${song.artist}`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${song.title} by ${song.artist}`,
      description: `${song.title} by ${song.artist} (${song.year}) - Peak position: #${song.peak_rank} on the Billboard Hot 100.`,
      images: [song.image_upload || 'https://pophits.org/static/media/oldhits_logo.png'],
    },
    alternates: {
      canonical: `https://pophits.org/songs/${song.slug}`,
    },
  };
}

// Helper function to extract track ID from Spotify URL
function getTrackIdFromUrl(url) {
  if (!url) return null;
  const parts = url.split("/");
  return parts[parts.length - 1];
}

export default async function SongDetailPage({ params }) {
  const song = await getSongBySlug(params.slug);
  
  if (!song) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          <h1 className="text-2xl font-bold mb-2">Song Not Found</h1>
          <p>Sorry, we couldn&rsquo;t find the song you&rsquo;re looking for.</p>
          <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <SongProvider initialSong={song}>
      <SongDetailContent />
    </SongProvider>
  );
}
