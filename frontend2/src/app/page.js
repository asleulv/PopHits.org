import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { 
  Search, Heart, Headphones, Zap, Disc, 
  CalendarDays, Shuffle, Flame, TrendingUp, ListMusic 
} from "lucide-react";
import { 
  getTopRatedSongs, 
  getRandomHitsByDecade, 
  getSongsWithImages, 
  getCurrentHot100,
  getNumberOneHits,
  getLatestBlogPost
} from "@/lib/api";
import NumberOneHitsSection from "@/components/FrontPage/NumberOneHitsSection";
import LatestBlogPostSection from "@/components/FrontPage/LatestBlogPostSection";

// Helper function to get decade from year
function getDecade(year) {
  const decade = Math.floor(year / 10) * 10;
  return `${decade}s`;
}

export const metadata = {
  title: "PopHits.org - 70 years of hit songs",
  description: "Explore top-rated songs, random hits by decade, and number one hits on PopHits.org. Discover iconic singles from the 50s to today.",
  keywords: "pop hits, greatest pop songs, chart-topping hits, music history, Billboard Hot 100",
};

export default async function FrontPage() {
  // Fetch data with error handling
  let topRatedSongs = [];
  let randomHitsByDecade = [];
  let songsWithImages = [];
  let numberOneHits = [];
  let currentHot100 = { songs: [] };
  let songWithImage = null;
  let activeDecade = null;
  let latestBlogPost = null;

  try {
    // Fetch data in parallel
    const [topRatedSongsData, randomHitsByDecadeData, songsWithImagesData, currentHot100Data, numberOneHitsData, latestBlogPostData] = 
      await Promise.all([
        getTopRatedSongs(),
        getRandomHitsByDecade(),
        getSongsWithImages(),
        getCurrentHot100(),
        getNumberOneHits(),
        getLatestBlogPost(),
      ]);
    
    // Process data
    topRatedSongs = topRatedSongsData.songs || topRatedSongsData;
    randomHitsByDecade = randomHitsByDecadeData.songs || randomHitsByDecadeData;
    songsWithImages = songsWithImagesData.songs || songsWithImagesData;
    currentHot100 = currentHot100Data;
    numberOneHits = numberOneHitsData.songs || numberOneHitsData;
    latestBlogPost = latestBlogPostData;
    
    // Get a random song with image
    if (songsWithImages.length > 0) {
      songWithImage = songsWithImages[Math.floor(Math.random() * songsWithImages.length)];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    // Continue with empty data - we'll handle this in the UI
  }
  
  // Group songs by decade
  const groupedByDecade = randomHitsByDecade.reduce((acc, song) => {
    const decade = getDecade(song.year);
    if (!acc[decade]) {
      acc[decade] = [];
    }
    acc[decade].push(song);
    return acc;
  }, {});
  
  // Get a random decade
  const availableDecades = Object.keys(groupedByDecade);
  if (availableDecades.length > 0) {
    activeDecade = availableDecades[Math.floor(Math.random() * availableDecades.length)];
  }
  
  // Generate year buttons from 1958 to today
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1958 + 1 },
    (_, i) => 1958 + i
  );

  return (
    <div className="px-0 py-8 sm:px-4 md:px-6 lg:px-8 mx-auto max-w-full ">
      {/* Enhanced Hero Section with animation */}
      <div className="flex flex-col md:flex-row md:space-x-8 mb-12 w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm animate-fadeIn">
        <div className="flex-1 mb-6 md:mb-0">
          <h1 className="text-3xl md:text-4xl underline font-cherry font-bold mb-6 text-center bg-gradient-to-r from-blue-500 via-pink-400 to-purple-900 bg-clip-text text-transparent pb-2">
            The hit song database
          </h1>

          <p className="mb-6 text-center md:text-left text-md md:text-xl font-semibold">
            Listen, rate, and revisit the most iconic songs in pop music history.
          </p>
          <p className="mb-6 text-center md:text-left text-sm md:text-lg">
            Browse over{" "}
            <span className="text-purple-900 font-bold">30,000</span> tracks
            spanning decades of pop history — from massive hits to forgotten
            gems. Start exploring your favorites today.
          </p>

          <div className="mb-6 text-center md:text-left">
            <div className="space-y-3 text-sm md:text-md text-center md:text-left">
              {[
                {
                  href: "/songs",
                  icon: <Search className="w-5 h-5 text-purple-800 group-hover:scale-110 transition-transform" />,
                  text: "Explore and find unheard gems",
                  hoverColor: "group-hover:text-purple-900",
                },
                {
                  href: "/songs",
                  icon: <Heart className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />,
                  text: "Rediscover old favourites",
                  hoverColor: "group-hover:text-red-700",
                },
                {
                  href: "/playlist-generator",
                  icon: <Headphones className="w-5 h-5 text-blue-700 group-hover:scale-110 transition-transform" />,
                  text: "Create playlists",
                  hoverColor: "group-hover:text-blue-800",
                },
                {
                  href: "/quiz-generator",
                  icon: <Zap className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />,
                  text: "Test your hit knowledge",
                  hoverColor: "group-hover:text-green-800",
                },
                {
                  href: "/current-hot100",
                  icon: <TrendingUp className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />,
                  text: "Current Billboard Hot 100",
                  hoverColor: "group-hover:text-orange-600",
                },
              ].map(({ href, icon, text, hoverColor }, idx) => (
                <div key={idx} className="flex items-center gap-2 group p-1 hover:bg-gray-100 rounded-lg transition-all duration-300 flex-wrap justify-center md:justify-start">
                  {icon}
                  <Link href={href} className={`font-medium transition-colors hover:underline ${hoverColor}`}>
                    {text}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {songWithImage && (
          <div className="flex-1 mb-0 md:mb-0 w-full">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 w-full relative lg:rounded-xl shadow-lg transform transition-transform">
              <h2 className="text-xl md:text-3xl font-cherry font-semibold mb-4 text-center flex items-center justify-center gap-2">
                <Disc className="w-8 h-8 text-pink-400" />
                Featured hit
              </h2>
              <div className="relative w-full bg-gray-700 rounded-lg overflow-hidden shadow-md">
                <Image
                  src={songWithImage.image_upload}
                  alt={`${songWithImage.title} by ${songWithImage.artist} - Album cover from ${songWithImage.year}`}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover transition-all duration-500 hover:brightness-110"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black via-black/70 to-transparent text-white">
                  <div className="text-center text-xl md:text-2xl">
                    <Link
                      href={`/artist/${songWithImage.artist_slug}`}
                      className="text-blue-200 hover:text-pink-300 transition-colors hover:underline"
                    >
                      {songWithImage.artist}
                    </Link>
                    {" - "}
                    <Link
                      href={`/songs/${songWithImage.slug}`}
                      className="text-blue-200 hover:text-pink-300 transition-colors hover:underline"
                    >
                      {songWithImage.title}
                    </Link>
                    {" ("}
                    <Link
                      href={`/year/${songWithImage.year}`}
                      className="text-blue-200 hover:text-pink-300 transition-colors hover:underline"
                    >
                      {songWithImage.year}
                    </Link>
                    {")"}
                  </div>
                  <p className="mt-2 text-sm text-center">
                    {songWithImage.average_user_score > 0 ? (
                      <>
                        Average User Rating:{" "}
                        <span className="font-bold bg-pink-600 text-white px-2 py-1 rounded-full">
                          {songWithImage.average_user_score.toFixed(1)}
                        </span>
                      </>
                    ) : (
                      "No ratings yet"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Latest Blog Post Section */}
      <LatestBlogPostSection latestBlogPost={latestBlogPost} />

      <section className="mb-8 text-black p-6 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm">
        <h2 className="text-xl md:text-3xl font-cherry font-semibold mb-6 text-center flex items-center justify-center gap-2">
          <CalendarDays className="w-8 h-8 text-pink-600" />
          <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">Hits by year</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {years.map((year) => {
            // Determine decade for color coding
            const decade = Math.floor(year / 10) * 10;
            
            // Define color classes based on decade
            let colorClass;
            switch (decade) {
              case 1950:
                colorClass = "bg-blue-100 text-blue-800 hover:bg-blue-500";
                break;
              case 1960:
                colorClass = "bg-green-100 text-green-800 hover:bg-green-500";
                break;
              case 1970:
                colorClass = "bg-yellow-100 text-yellow-800 hover:bg-yellow-500";
                break;
              case 1980:
                colorClass = "bg-purple-100 text-purple-800 hover:bg-purple-500";
                break;
              case 1990:
                colorClass = "bg-red-100 text-red-800 hover:bg-red-500";
                break;
              case 2000:
                colorClass = "bg-indigo-100 text-indigo-800 hover:bg-indigo-500";
                break;
              case 2010:
                colorClass = "bg-pink-100 text-pink-800 hover:bg-pink-500";
                break;
              case 2020:
                colorClass = "bg-cyan-100 text-cyan-800 hover:bg-cyan-500";
                break;
              default:
                colorClass = "bg-gray-200 text-gray-800 hover:bg-gray-500";
            }
            
            return (
              <Link
                key={year}
                href={`/year/${year}`}
                className={`px-4 py-2 rounded-lg text-md ${colorClass} hover:text-white transition-all duration-300 transform hover:scale-105 shadow-sm`}
              >
                {year}
              </Link>
            );
          })}
        </div>
      </section>

      {randomHitsByDecade.length > 0 ? (
        <section className="mb-8 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 text-white p-8 w-full lg:rounded-xl shadow-lg">
          <div className="flex flex-col items-center md:flex-row md:justify-center gap-4 mb-6">
            <h2 className="text-xl md:text-3xl font-cherry font-semibold flex items-center gap-3 text-white">
              <Shuffle className="w-8 h-8 text-yellow-400" />
              <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">Random hits by decade</span>
            </h2>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-full mb-6">
              <div className="flex flex-wrap justify-center gap-3 px-2">
                {Object.keys(groupedByDecade).map((decade) => (
                  <button
                    key={decade}
                    className={`px-5 py-2 rounded-lg text-md transition-all duration-300 transform hover:scale-105 shadow-md ${
                      activeDecade === decade 
                        ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold" 
                        : "bg-gray-200 text-gray-800 hover:bg-pink-400 hover:text-white"
                    }`}
                  >
                    {decade}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full">
              {activeDecade && groupedByDecade[activeDecade]?.length > 0 ? (
                groupedByDecade[activeDecade].map((song) => (
                  <div key={song.id} className="mb-8 w-full bg-gray-700 rounded-lg p-4 shadow-lg transform transition-all duration-300 hover:shadow-xl">
                    <iframe
                      src={`https://open.spotify.com/embed/track/${song.spotify_url
                        .split("/")
                        .pop()}`}
                      width="100%"
                      height="380"
                      frameBorder="0"
                      allowtransparency="true"
                      allow="encrypted-media"
                      className="w-full rounded-md shadow-md"
                      title={`${song.title} by ${song.artist}`}
                    ></iframe>
                    <p className="mt-4 text-center text-sm bg-gray-800 p-3 rounded-lg shadow-inner">
                      <Link
                        href={`/songs/${song.slug}`}
                        className="text-pink-300 hover:text-pink-200 transition-colors font-bold"
                      >
                        {song.title}
                      </Link>{" "}
                      by{" "}
                      <Link
                        href={`/artist/${song.artist_slug}`}
                        className="text-blue-300 hover:text-blue-200 transition-colors font-bold"
                      >
                        {song.artist}
                      </Link>{" "}
                      entered the charts in{" "}
                      <Link
                        href={`/year/${song.year}`}
                        className="text-gray-300 hover:text-gray-400 transition-colors font-bold"
                      >
                        {song.year}
                      </Link>{" "}
                      peaking at{""}
                      <span className="text-pink-300 px-2 py-1 rounded-full font-bold">
                        #{song.peak_rank}
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center p-6 bg-gray-700 rounded-lg">No songs available for this decade.</p>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="mb-8 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 text-white p-8 w-full lg:rounded-xl shadow-lg">
          <div className="flex justify-center items-center py-12">
            <p className="text-xl">Loading random hits by decade...</p>
          </div>
        </section>
      )}

      {topRatedSongs.length > 0 ? (
        <section className="mb-8 text-black p-6 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm">
          <h2 className="text-xl md:text-3xl font-cherry font-semibold mb-6 text-center flex items-center justify-center gap-2">
            <Flame className="w-8 h-8 text-pink-500" />
            <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">Top 10 user ranked hits</span>
          </h2>
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200 border-collapse">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <tr className="hidden md:table-row">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Artist</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Year</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topRatedSongs.map((song, index) => (
                  <tr
                    key={song.id}
                    className="flex flex-col md:table-row md:w-full text-center md:text-left hover:bg-gray-50 transition-colors duration-200"
                  >
                    {/* Ranking Cell */}
                    <td className="flex md:table-cell px-4 py-3 whitespace-nowrap text-black text-xl md:text-base items-center justify-center md:justify-start">
                      <span className="block md:hidden font-medium text-gray-500">
                        #{index + 1}
                      </span>
                      <span className="hidden md:block font-semibold">
                        {index === 0 ? (
                          <span className="text-yellow-500 text-xl">1</span>
                        ) : index === 1 ? (
                          <span className="text-gray-400 text-lg">2</span>
                        ) : index === 2 ? (
                          <span className="text-amber-600 text-lg">3</span>
                        ) : (
                          index + 1
                        )}
                      </span>
                    </td>

                    {/* Info Cell with Title, Artist, Year, and Score */}
                    <td className="flex flex-col md:table-cell px-4 py-3 whitespace-nowrap text-sm md:text-base">
                      <span className="block md:hidden text-gray-700 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 p-1 rounded-lg shadow-sm">
                        <Link
                          href={`/songs/${song.slug}`}
                          className="text-gray-700 font-bold text-lg hover:text-pink-600 transition-colors break-words whitespace-normal"
                        >
                          {song.title}
                        </Link>
                        <br className="block md:hidden" />{" "}
                        <Link
                          href={`/artist/${song.artist_slug}`}
                          className="text-pink-600 text-lg hover:text-gray-800 transition-colors"
                        >
                          {song.artist}
                        </Link>
                        <br className="block md:hidden" />{" "}
                        <Link
                          href={`/year/${song.year}`}
                          className="text-cyan-500 hover:text-pink-600 font-semibold transition-colors"
                        >
                          {song.year}
                        </Link>
                        <br className="block md:hidden" />{" "}
                        <span className="block md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full text-lg font-medium bg-pink-500 text-white">
                          {song.average_user_score}
                        </span>
                      </span>

                      <span className="hidden md:block">
                        <Link
                          href={`/songs/${song.slug}`}
                          className="text-gray-800 font-bold hover:text-pink-600 transition-colors"
                        >
                          {song.title}
                        </Link>
                      </span>
                    </td>

                    {/* Separate cells for Artist, Year, and Score */}
                    <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-sm md:text-base">
                      <Link
                        href={`/artist/${song.artist_slug}`}
                        className="text-pink-600 hover:text-gray-800 transition-colors"
                      >
                        {song.artist}
                      </Link>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-sm md:text-base">
                      <Link
                        href={`/year/${song.year}`}
                        className="text-cyan-600 hover:text-pink-600 transition-colors"
                      >
                        {song.year}
                      </Link>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-sm md:text-base">
                      <span className="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold px-3 py-1 rounded-full">
                        {song.average_user_score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-6">
            <Link 
              href="/songs?sort_by=average_user_score&order=desc" 
              className="inline-block px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-full shadow-md hover:from-pink-600 hover:to-pink-700 transition-all hover:text-white duration-300 transform"
            >
              All rated songs
            </Link>
          </div>
        </section>
      ) : (
        <section className="mb-8 text-black p-6 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm">
          <h2 className="text-xl md:text-3xl font-cherry font-semibold mb-6 text-center flex items-center justify-center gap-2">
            <Flame className="w-8 h-8 text-pink-500" />
            <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">Top 10 user ranked hits</span>
          </h2>
          <div className="flex justify-center items-center py-12">
            <p className="text-xl">Loading top rated songs...</p>
          </div>
        </section>
      )}

      <Suspense fallback={<div>Loading Number One Hits...</div>}>
        <NumberOneHitsSection numberOneHits={numberOneHits} />
      </Suspense>

      {/* Current Hot 100 Preview Section */}
      {currentHot100 && currentHot100.songs && currentHot100.songs.length > 0 ? (
        <section className="mb-8 text-black p-6 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm">
          <h2 className="text-xl md:text-3xl font-cherry font-semibold mb-6 text-center flex items-center justify-center gap-2">
            <ListMusic className="w-8 h-8 text-pink-500" />
            <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">Current Billboard Hot 100</span>
          </h2>
          
          <div className="overflow-x-auto rounded-lg shadow-md mb-6">
            <table className="min-w-full divide-y divide-gray-200 border-collapse">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-16">Position</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Artist</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentHot100.songs.slice(0, 5).map((song, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap font-bold">{song.current_position || index + 1}</td>
                    <td className="px-4 py-3">
                      <Link href={`/songs/${song.slug}`} className="text-gray-900 font-bold hover:text-pink-600 transition-colors">
                        {song.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/artist/${song.artist_slug}`} className="text-pink-600 hover:text-gray-900 transition-colors">
                        {song.artist}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="text-center">
            <Link 
              href="/current-hot100" 
              className="inline-block px-6 py-2 bg-pink-600 text-white font-semibold rounded-full shadow-md hover:bg-pink-700 hover:text-white transform"
            >
              View Full Hot 100 Chart
            </Link>
          </div>
        </section>
      ) : (
        <section className="mb-8 text-black p-6 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm">
          <h2 className="text-xl md:text-3xl font-cherry font-semibold mb-6 text-center flex items-center justify-center gap-2">
            <ListMusic className="w-8 h-8 text-pink-500" />
            <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">Current Billboard Hot 100</span>
          </h2>
          <div className="flex justify-center items-center py-12">
            <p className="text-xl">Loading current Hot 100 chart...</p>
          </div>
        </section>
      )}
    </div>
  );
}
