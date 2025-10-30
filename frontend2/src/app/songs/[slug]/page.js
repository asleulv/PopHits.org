import Link from "next/link";
import { getSongBySlug, getSongTimelineBySlug } from "@/lib/api";
import { SongProvider } from "@/contexts/SongContext";
import SongDetailContent from "@/components/SongDetail/SongDetailContent";

// Generate metadata for better SEO
export async function generateMetadata({ params }) {
  const { slug } = await params; // Await params here
  const song = await getSongBySlug(slug);

  return {
    title: `${song.title} by ${song.artist} | PopHits.org`,
    description: `${song.title} by ${song.artist} (${song.year}) hit #${song.peak_rank} on the Billboard Hot 100. Listen, view chart stats, read trivia, rate the song, and join the discussion on PopHits.`,
    openGraph: {
      type: "music.song",
      title: `${song.title} by ${song.artist}`,
      description: `${song.title} by ${song.artist} (${song.year}) hit #${song.peak_rank} on the Billboard Hot 100. Listen, view chart stats, read trivia, rate the song, and join the discussion on PopHits.`,
      url: `https://pophits.org/songs/${song.slug}`,
      siteName: "PopHits.org",
      images: [
        {
          url:
            song.image_upload ||
            "https://pophits.org/static/gfx/oldhits_logo.png",
          width: 1200,
          height: 630,
          alt: song.image_upload
            ? `${song.title} by ${song.artist} cover art`
            : `${song.title} by ${song.artist} - PopHits.org`,
          type: "image/png",
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${song.title} by ${song.artist}`,
      description: `${song.title} by ${song.artist} (${song.year}) hit #${song.peak_rank} on the Billboard Hot 100. Listen, view chart stats, read trivia, rate the song, and join the discussion on PopHits.`,
      images: [
        song.image_upload || "https://pophits.org/static/gfx/oldhits_logo.png",
      ],
    },
    alternates: {
      canonical: `https://pophits.org/songs/${song.slug}`,
    },
  };
}

export default async function SongDetailPage({ params }) {
  const { slug } = await params; // Await params here
  const song = await getSongBySlug(slug);

  if (!song) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          <h1 className="text-2xl font-bold mb-2">Song Not Found</h1>
          <p>Sorry, we couldn&rsquo;t find the song you&rsquo;re looking for.</p>
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

  // Fetch timeline server-side
  const timelineData = await getSongTimelineBySlug(slug);

  // JSON-LD schema (unchanged)
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SongProvider initialSong={song}>
        <SongDetailContent initialTimeline={timelineData.timeline || []} />
      </SongProvider>
    </>
  );
}
