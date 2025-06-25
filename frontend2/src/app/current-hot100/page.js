import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Minus,
  Star,
} from "lucide-react";
import { getCurrentHot100 } from "@/lib/api";

export const revalidate = 86400;

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

export default async function CurrentHot100Page() {
  // Fetch current Hot 100 data
  const currentHot100Data = await getCurrentHot100();
  const songs = currentHot100Data.songs || [];
  const lastUpdated =
    currentHot100Data.last_updated || new Date().toISOString();

  // Format the last updated date
  const lastUpdatedDate = new Date(lastUpdated);
  const formattedDate = lastUpdatedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // JSON-LD structured data for the chart as a MusicPlaylist
  const chartJsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicPlaylist",
    name: "Current Billboard Hot 100 Chart",
    description:
      "The current Billboard Hot 100 chart featuring the top 100 songs in the United States with weekly updates",
    datePublished: lastUpdated,
    numTracks: songs.length,
    url: "https://pophits.org/current-hot100",
    track: songs.slice(0, 10).map((song, index) => ({
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

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center bg-gradient-to-r from-pink-500 via-purple-600 to-purple-900 bg-clip-text text-transparent">
          <div className="flex items-center justify-center gap-2 px-1 py-1">
            <TrendingUp className="hidden lg:block w-8 h-8 text-pink-500" />
            <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">
              Current Billboard Hot 100
            </span>
          </div>
        </h1>

        <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800 text-center">
          Weekly Billboard Hot 100 Chart Updates with Spotify Links
        </h2>

        <div className="bg-white p-4 rounded-lg shadow-md mb-8 text-center">
          <p className="text-gray-600">
            Last updated: <span className="font-semibold">{formattedDate}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            The Billboard Hot 100 is updated weekly. This data represents the
            most recent chart.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="text-center py-12">Loading current Hot 100...</div>
          }
        >
          {songs.length > 0 ? (
            <>
              {/* Mobile view - Cards */}
              <div className="md:hidden space-y-4">
                {songs.map((song) => (
                  <div
                    key={song.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                  >
                    {/* Top section - Rank, Title/Artist, Movement */}
                    <div className="flex items-center p-4 bg-gray-50">
                      {/* Left - Rank number */}
                      <div className="flex-shrink-0 w-10 h-10 bg-pink-500 text-white font-bold rounded-full flex items-center justify-center text-sm mr-4">
                        {song.current_position}
                      </div>

                      {/* Center - Song info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate text-sm">
                          <Link
                            href={`/songs/${song.slug}`}
                            className="hover:text-pink-600 transition-colors"
                          >
                            {song.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 truncate text-sm">
                          <Link
                            href={`/artist/${song.artist_slug}`}
                            className="hover:text-pink-600 transition-colors"
                          >
                            {song.artist}
                          </Link>
                        </p>
                      </div>

                      {/* Right - Movement indicator */}
                      <div className="flex-shrink-0 ml-3">
                        {song.position_change > 0 && (
                          <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <ArrowUp className="w-3 h-3" />
                            <span className="text-xs font-medium ml-1">
                              {song.position_change}
                            </span>
                          </div>
                        )}
                        {song.position_change < 0 && (
                          <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-full">
                            <ArrowDown className="w-3 h-3" />
                            <span className="text-xs font-medium ml-1">
                              {Math.abs(song.position_change)}
                            </span>
                          </div>
                        )}
                        {song.position_change === 0 && (
                          <div className="flex items-center text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            <Minus className="w-3 h-3" />
                          </div>
                        )}
                        {song.position_change === null && (
                          <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            <Star className="w-3 h-3" />
                            <span className="text-xs font-medium ml-1">
                              NEW
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Chart stats section with background */}
                    <div className="bg-white px-4 py-3 border-t border-gray-100">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            Weeks
                          </div>
                          <div className="text-sm font-semibold text-gray-800">
                            {song.weeks_on_chart}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Peak</div>
                          <div className="text-sm font-semibold text-gray-800">
                            #{song.peak_rank}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            Last Week
                          </div>
                          <div className="text-sm font-semibold text-gray-800">
                            #{song.last_week_position || "-"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Spotify section with distinct background */}
                    {song.spotify_url && (
                      <div className="bg-green-50 px-4 py-3 border-t border-green-100">
                        <a
                          href={song.spotify_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 text-green-700 hover:text-green-800 transition-colors text-sm font-medium"
                        >
                          <Image
                            src="/icons/spotify.png"
                            alt="Spotify"
                            width={14}
                            height={14}
                          />
                          <span>Listen on Spotify</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop view - Table */}
              <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-16">
                          Position
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-16">
                          Change
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Artist
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24">
                          Last Week
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24">
                          Peak
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24">
                          Weeks on Chart
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {songs.map((song, index) => (
                        <tr
                          key={song.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="font-bold text-lg">
                              {song.current_position || index + 1}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {song.position_change > 0 ? (
                              <span className="flex items-center text-green-500">
                                <ArrowUp className="w-4 h-4 mr-1" />
                                <span>{song.position_change}</span>
                              </span>
                            ) : song.position_change < 0 ? (
                              <span className="flex items-center text-red-500">
                                <ArrowDown className="w-4 h-4 mr-1" />
                                <span>{Math.abs(song.position_change)}</span>
                              </span>
                            ) : song.position_change === 0 ? (
                              <span className="flex items-center text-gray-500">
                                <Minus className="w-4 h-4 mr-1" />
                                <span>-</span>
                              </span>
                            ) : (
                              <span className="flex items-center text-blue-500">
                                <Star className="w-4 h-4 mr-1" />
                                <span>New</span>
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col">
                              <Link
                                href={`/songs/${song.slug}`}
                                className="text-gray-900 font-medium hover:text-pink-600 transition-colors"
                              >
                                {song.title}
                              </Link>
                              {song.spotify_url && (
                                <a
                                  href={song.spotify_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block text-xs bg-green-800 hover:text-white hover:bg-green-700 text-green-100 px-2 py-0.5 rounded-full transition-colors mt-1 w-fit"
                                >
                                  Listen on Spotify
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Link
                              href={`/artist/${song.artist_slug}`}
                              className="text-pink-600 hover:text-gray-900 transition-colors"
                            >
                              {song.artist}
                            </Link>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium bg-gray-200 text-black">
                              {song.last_week_position
                                ? `#${song.last_week_position}`
                                : "-"}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium bg-yellow-200 text-black">
                              {song.peak_rank ? `#${song.peak_rank}` : "-"}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium bg-cyan-200 text-black">
                              {song.weeks_on_chart
                                ? `${song.weeks_on_chart}`
                                : "-"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No Hot 100 Data Available
              </h2>
              <p className="text-gray-600">
                The current Billboard Hot 100 data is not available at the
                moment. Please check back later.
              </p>
            </div>
          )}
        </Suspense>

        {/* Internal Linking Section */}
        <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Explore More Chart History
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/songs?sort_by=average_user_score&order=desc"
              className="text-pink-600 hover:text-gray-800 transition-colors font-medium"
            >
              Top User-Rated Billboard Hits
            </Link>
            <Link
              href="/year/2024"
              className="text-pink-600 hover:text-gray-800 transition-colors font-medium"
            >
              2024 Chart Hits by Year
            </Link>
            <Link
              href="/blog"
              className="text-pink-600 hover:text-gray-800 transition-colors font-medium"
            >
              Chart Analysis & Music Insights
            </Link>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            About the Billboard Hot 100
          </h3>
          <p className="text-gray-600 mb-4">
            The Billboard Hot 100 is the music industry standard record chart in
            the United States for songs, published weekly by Billboard magazine.
            Chart rankings are based on sales (physical and digital), radio
            play, and online streaming in the United States.
          </p>
          <p className="text-gray-600">
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
