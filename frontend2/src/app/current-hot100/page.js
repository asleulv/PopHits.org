import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUp,
  ArrowDown,
  Minus,
  Star,
} from "lucide-react";
import { getCurrentHot100 } from "@/lib/api";

export const revalidate = 3600; // Revalidate every hour

export const metadata = {
  title: "Current Billboard Hot 100 Chart - Weekly Updates | PopHits.org",
  description:
    "Listen to the current Billboard Hot 100 chart hits with Spotify integration. View weekly chart updates, position changes, and discover trending songs from the latest Billboard rankings. Updated weekly with chart analysis.",
  keywords:
    "current hot 100, billboard hot 100, trending songs, popular music, current hits, weekly chart updates, spotify, chart analysis",
  openGraph: {
    title: "Current Billboard Hot 100 Chart - Weekly Updates | PopHits.org",
    description:
      "Listen to the current Billboard Hot 100 chart hits with Spotify integration. View weekly chart updates and discover trending songs.",
    url: "https://pophits.org/current-hot100",
    siteName: "PopHits.org",
    type: "website",
    images: [
      {
        url: "https://pophits.org/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Current Billboard Hot 100 Chart - PopHits.org",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Current Billboard Hot 100 Chart - Weekly Updates | PopHits.org",
    description:
      "Listen to the current Billboard Hot 100 chart hits with Spotify integration. View weekly chart updates and discover trending songs.",
    images: ["https://pophits.org/og-image.jpg"],
  },
  alternates: {
    canonical: "https://pophits.org/current-hot100",
  },
};

function MovementBadge({ song }) {
  if (song.position_change === null || song.position_change === undefined) {
    return (
      <span className="text-xs font-black text-green-700 bg-green-100 px-2 py-1 rounded">
        ★ NEW
      </span>
    );
  }

  if (song.position_change > 0) {
    return (
      <span className="text-xs font-black text-green-700 bg-green-100 px-2 py-1 rounded">
        ↑ {song.position_change}
      </span>
    );
  } else if (song.position_change < 0) {
    return (
      <span className="text-xs font-black text-red-700 bg-red-100 px-2 py-1 rounded">
        ↓ {Math.abs(song.position_change)}
      </span>
    );
  }

  return <span className="text-xs font-black text-gray-600 px-2 py-1">—</span>;
}

function formatChartDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function CurrentHot100Page() {
  const data = await getCurrentHot100();

  if (!data || !data.songs || data.songs.length === 0) {
    notFound();
  }

  const formattedDate = formatChartDate(data.chart_date);

  // JSON-LD structured data for the chart as a MusicPlaylist
  const chartJsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicPlaylist",
    name: "Current Billboard Hot 100 Chart",
    description:
      "The current Billboard Hot 100 chart featuring the top 100 songs in the United States with weekly updates",
    datePublished: data.chart_date,
    numTracks: data.songs.length,
    url: "https://pophits.org/current-hot100",
    track: data.songs.slice(0, 10).map((song, index) => ({
      "@type": "MusicRecording",
      name: song.title,
      byArtist: {
        "@type": "MusicGroup",
        name: song.artist,
      },
      position: song.current_position || index + 1,
    })),
  };

  return (
    <>
      {/* JSON-LD structured data injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(chartJsonLd) }}
      />

      <div className="min-h-screen bg-yellow-50 p-4 md:p-8">
        {/* Newspaper Header */}
        <div className="max-w-6xl mx-auto mb-8 border-4 border-black bg-black text-white p-6 text-center">
          <div className="text-sm tracking-widest mb-2">
            POPHITS.ORG PRESENTING
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-3">
            HOT 100
          </h1>
          <div className="text-sm">
            CURRENT CHART — {formattedDate.toUpperCase()}
          </div>
        </div>

        {/* Chart Grid - Newspaper style 2 columns */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {data.songs.map((song, index) => (
            <div
              key={song.id || song.slug || index}
              className="border-b-2 border-black pb-4 flex gap-3"
            >
              {/* Position Number - Big & Bold */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-black text-lg">
                  {song.current_position || index + 1}
                </div>
              </div>

              {/* Song Info */}
              <div className="flex-grow min-w-0">
                <h3 className="font-black text-sm md:text-base leading-tight tracking-tight uppercase hover:text-grey-800 hover:underline">
                  <Link
                    href={`/songs/${song.slug}`}
                    className="hover:text-white"
                  >
                    {song.title}
                  </Link>
                </h3>
                <p className="text-xs md:text-sm text-gray-700 mt-1">
                  <Link
                    href={`/artist/${song.artist_slug}`}
                    className="font-bold text-gray-700 hover:text-yellow-600 hover:underline"
                  >
                    {song.artist}
                  </Link>
                </p>

                {/* Movement & Stats Row */}
                <div className="flex flex-col gap-2 mt-2">
                  <div>
                    <MovementBadge song={song} />
                  </div>
                  <p className="text-xs text-gray-600">
                    Peak: #{song.peak_rank || "-"} • {song.weeks_on_chart || 0}{" "}
                    wks
                    {song.last_week_position &&
                      ` • Prev: #${song.last_week_position}`}
                  </p>
                  {song.spotify_url && (
                    <a
                      href={song.spotify_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-green-700 hover:text-green-900 hover:underline"
                    >
                      ♫ Listen on Spotify
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="max-w-6xl mx-auto mt-12 text-center border-t-4 border-black pt-4 text-xs text-gray-600">
          <p>Billboard Hot 100 Current Chart</p>
        </div>

        {/* Internal Linking Section */}
        <div className="max-w-6xl mx-auto mt-12 border-4 border-black bg-white p-6 text-center">
          <h3 className="text-lg font-black uppercase mb-4 tracking-tight">
            Explore More Chart History
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/songs?sort_by=average_user_score&order=desc"
              className="font-bold text-gray-900 hover:text-yellow-600 hover:underline"
            >
              Top User-Rated Hits
            </Link>
            <Link
              href="/year/2024"
              className="font-bold text-gray-900 hover:text-yellow-600 hover:underline"
            >
              2024 Chart Hits by Year
            </Link>
            <Link
              href="/blog"
              className="font-bold text-gray-900 hover:text-yellow-600 hover:underline"
            >
              Chart Analysis & Insights
            </Link>
          </div>
        </div>

        {/* About Section */}
        <div className="max-w-6xl mx-auto mt-8 border-2 border-black bg-white p-6">
          <h3 className="text-lg font-black uppercase mb-4 tracking-tight">
            About the Billboard Hot 100
          </h3>
          <p className="text-sm text-gray-700 mb-3">
            The Billboard Hot 100 is the music industry standard record chart in
            the United States for songs, published weekly by Billboard magazine.
            Chart rankings are based on sales (physical and digital), radio
            play, and online streaming in the United States.
          </p>
          <p className="text-sm text-gray-700">
            A new chart is compiled and officially released to the public by
            Billboard on Tuesdays but posted on the web on Mondays. The tracking
            week for sales and streaming begins on Friday and ends on Thursday,
            while the radio play tracking week runs from Monday to Sunday.
          </p>
        </div>
      </div>
    </>
  );
}
