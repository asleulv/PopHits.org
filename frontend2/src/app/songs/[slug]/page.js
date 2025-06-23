import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  Calendar,
  TrendingUp,
  Clock,
  Star,
  Music,
  SquarePlay,
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
    description: `${song.title} by ${song.artist} (${song.year}) hit #${song.peak_rank} on the Billboard Hot 100. Listen, view chart stats, read trivia, rate the song, and join the discussion on PopHits.`,
    openGraph: {
      title: `${song.title} by ${song.artist}`,
      description: `${song.title} by ${song.artist} (${song.year}) hit #${song.peak_rank} on the Billboard Hot 100. Listen, view chart stats, read trivia, rate the song, and join the discussion on PopHits.`,
      url: `https://pophits.org/songs/${song.slug}`,
      siteName: "PopHits.org",
      images: [
        {
          url:
            song.image_upload ||
            "https://pophits.org/static/gfx/oldhits_logo.png",
          width: 800,
          height: 600,
          alt: `${song.title} by ${song.artist}`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${song.title} by ${song.artist}`,
      description: `${song.title} by ${song.artist} (${song.year}) hit #${song.peak_rank} on the Billboard Hot 100. Listen, view chart stats, read trivia, rate the song, and join the discussion on PopHits.`,
      images: [
        song.image_upload ||
          "https://pophits.org/static/media/oldhits_logo.png",
      ],
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
          <p>
            Sorry, we couldn&rsquo;t find the song you&rsquo;re looking for.
          </p>
          <Link
            href="/"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Build JSON-LD schema for a MusicRecording (Song)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: song.title,
    byArtist: {
      "@type": "MusicGroup",
      name: song.artist,
    },
    datePublished: song.year?.toString() || undefined,
    image:
      song.image_upload || "https://pophits.org/static/gfx/oldhits_logo.png",
    url: `https://pophits.org/songs/${song.slug}`,

    // Only include aggregateRating if song has actual ratings
    ...(song.average_user_score &&
      song.total_ratings > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: song.average_user_score.toString(),
          ratingCount: song.total_ratings.toString(),
          bestRating: "10",
          worstRating: "1",
        },
      }),

    description:
      song.review ||
      `Listen to ${song.title} by ${song.artist}, peaked at #${song.peak_rank} on the Billboard Hot 100.`,
    inAlbum: song.album
      ? {
          "@type": "MusicAlbum",
          name: song.album,
        }
      : undefined,
    duration: song.duration || undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        // dangerouslySetInnerHTML is needed for JSON-LD injection in React
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SongProvider initialSong={song}>
        <SongDetailContent />
      </SongProvider>
    </>
  );
}
