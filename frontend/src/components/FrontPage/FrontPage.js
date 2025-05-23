import React, {
  useEffect,
  useState,
  Suspense,
  lazy,
  useMemo,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Search,
  Heart,
  Headphones,
  Zap,
  Disc,
  CalendarDays,
  Shuffle,
  Flame,
} from "lucide-react";
import { Grid } from "react-loader-spinner";
import {
  getTopRatedSongs,
  getRandomHitsByDecade,
  getSongsWithImages,
} from "../../services/api";

const NumberOneHitsSection = lazy(() => import("./NumberOneHitsSection"));

const FrontPage = () => {
  const [topRatedSongs, setTopRatedSongs] = useState([]);
  const [randomHitsByDecade, setRandomHitsByDecade] = useState([]);
  const [songWithImage, setSongWithImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeDecade, setActiveDecade] = useState(null);

  useEffect(() => {
    const fetchTopRatedSongs = async () => {
      try {
        const response = await getTopRatedSongs();
        setTopRatedSongs(response.songs || response);
      } catch (error) {
        console.error("Error fetching top-rated songs:", error);
      }
    };

    const fetchRandomHitsByDecade = async () => {
      try {
        const response = await getRandomHitsByDecade();
        setRandomHitsByDecade(response.songs || response);
      } catch (error) {
        console.error("Error fetching random hits by decade:", error);
      }
    };

    const fetchAllData = async () => {
      await fetchTopRatedSongs();
      await fetchRandomHitsByDecade();
      setIsLoading(false); // Correct state variable
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    const fetchSongWithImage = async () => {
      try {
        const response = await getSongsWithImages();
        const songsWithImages = response.songs || response;
        if (songsWithImages.length > 0) {
          const randomSong =
            songsWithImages[Math.floor(Math.random() * songsWithImages.length)];
          setSongWithImage(randomSong);
        }
      } catch (error) {
        console.error("Error fetching songs with images:", error);
      }
    };

    fetchSongWithImage();
  }, []);

  useEffect(() => {
    if (randomHitsByDecade.length > 0) {
      const availableDecades = Array.from(
        new Set(randomHitsByDecade.map((song) => getDecade(song.year)))
      );
      if (availableDecades.length > 0) {
        const randomDecade =
          availableDecades[Math.floor(Math.random() * availableDecades.length)];
        setActiveDecade(randomDecade);
      }
    }
  }, [randomHitsByDecade]);

  const getDecade = (year) => {
    const decade = Math.floor(year / 10) * 10;
    return `${decade}s`;
  };

  const groupedByDecade = randomHitsByDecade.reduce((acc, song) => {
    const decade = getDecade(song.year);
    if (!acc[decade]) {
      acc[decade] = [];
    }
    acc[decade].push(song);
    return acc;
  }, {});

  const getRandomSubset = (arr, num) => {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  const refreshRandomHitsByDecade = async () => {
    try {
      const response = await getRandomHitsByDecade();
      setRandomHitsByDecade(response.songs || response);
    } catch (error) {
      console.error("Error fetching random hits by decade:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Grid
          visible={true}
          height="80"
          width="80"
          ariaLabel="grid-loading"
          wrapperStyle={{}}
          wrapperClass="grid-wrapper"
          color="#f472b6 "
        />
      </div>
    );
  }

  // Generate year buttons from 1958 to today
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1958 + 1 },
    (_, i) => 1958 + i
  );

  return (
    <div className="px-0 py-8 sm:px-4 md:px-6 lg:px-8 mx-auto max-w-full">
      <Helmet>
        <title>PopHits.org - 70 years of hit songs</title>
        <meta
          name="description"
          content="Explore top-rated songs, random hits by decade, and number one hits on PopHits.org. Discover iconic singles from the 50s to today."
        />
        <meta
          name="keywords"
          content="pop hits, greatest pop songs, chart-topping hits, music history, Billboard Hot 100"
        />
      </Helmet>

      {/* Enhanced Hero Section with animation */}
      <div className="flex flex-col md:flex-row md:space-x-8 mb-12 w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm animate-fadeIn">
        <div className="flex-1 mb-6 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-cherry font-bold mb-6 text-center bg-gradient-to-r from-blue-500 via-pink-400 to-purple-900 bg-clip-text text-transparent pb-2">
            THE HIT SONG DATABASE
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
      text: (
        <>
          Create playlists{" "}
          <span className="ml-1 text-blue-600 hover:text-blue-800 underline">
            (<a href="https://www.youtube.com/watch?v=818njtSUKd8&t=1s">demo</a>)
          </span>
        </>
      ),
      hoverColor: "group-hover:text-blue-800",
    },
    {
      href: "/quiz-generator",
      icon: <Zap className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />,
      text: "Test your hit knowledge",
      hoverColor: "group-hover:text-green-800",
    },
  ].map(({ href, icon, text, hoverColor }, idx) => (
    <div key={idx} className="flex items-center gap-2 group p-1 hover:bg-gray-100 rounded-lg transition-all duration-300 flex-wrap justify-center md:justify-start">
      {icon}
      <a href={href} className={`font-medium transition-colors hover:underline ${hoverColor}`}>
        {text}
      </a>
    </div>
  ))}
</div>

          </div>
        </div>

        {songWithImage && (
          <div className="flex-1 mb-0 md:mb-0 w-full">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 w-full relative lg:rounded-xl shadow-lg transform transition-transform">
              <h2 className="text-xl md:text-3xl font-cherry font-semibold mb-4 text-center flex items-center justify-center gap-2">
                <Disc className="w-8 h-8 text-pink-400 animate-spin-slow" />
                Featured hit
              </h2>
              <div className="relative w-full bg-gray-700 rounded-lg overflow-hidden shadow-md">
                <img
                  src={songWithImage.image_upload}
                  alt={`${songWithImage.title} by ${songWithImage.artist} - Album cover from ${songWithImage.year}`}
                  className="w-full h-full object-cover transition-all duration-500 hover:brightness-110"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black via-black/70 to-transparent text-white">
                  <div className="text-center text-xl md:text-2xl">
                    <Link
                      to={`/artist/${songWithImage.artist_slug}`}
                      className="text-blue-200 hover:text-pink-300 transition-colors hover:underline"
                    >
                      {songWithImage.artist}
                    </Link>
                    {" - "}
                    <Link
                      to={`/songs/${songWithImage.slug}`}
                      className="text-blue-200 hover:text-pink-300 transition-colors hover:underline"
                    >
                      {songWithImage.title}
                    </Link>
                    {" ("}
                    <Link
                      to={`/year/${songWithImage.year}`}
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

      <section className="mb-8 text-black p-6 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm">
        <h2 className="text-xl md:text-3xl font-cherry font-semibold mb-6 text-center flex items-center justify-center gap-2">
          <CalendarDays className="w-8 h-8 text-pink-600" />
          <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">Hits by year</span>
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {years.map((year) => (
            <Link
              key={year}
              to={`/year/${year}`}
              className="px-4 py-2 rounded-lg text-md bg-gray-200 text-gray-800 hover:bg-pink-400 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-sm"
            >
              {year}
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-8 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 text-white p-8 w-full lg:rounded-xl shadow-lg">
        <div className="flex flex-col items-center md:flex-row md:justify-center gap-4 mb-6">
          <h2 className="text-xl md:text-3xl font-cherry font-semibold flex items-center gap-3 text-white">
            <Shuffle className="w-8 h-8 text-pink-400" />
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Random hits by decade</span>
          </h2>
          <button
            onClick={refreshRandomHitsByDecade}
            className="ml-3 px-4 py-2 rounded-md bg-pink-600 hover:bg-pink-500 hover:text-white transition-all duration-300 text-white font-semibold text-sm md:text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-md transform"
          >
            Refresh
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full mb-6">
            <div className="flex flex-wrap justify-center gap-3 px-2">
              {Object.keys(groupedByDecade).map((decade) => (
                <button
                  key={decade}
                  onClick={() => setActiveDecade(decade)}
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
            {activeDecade && groupedByDecade[activeDecade].length > 0 ? (
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
                      to={`/songs/${song.slug}`}
                      className="text-pink-300 hover:text-pink-200 transition-colors hover:underline font-bold"
                    >
                      {song.title}
                    </Link>{" "}
                    by{" "}
                    <Link
                      to={`/artist/${song.artist_slug}`}
                      className="text-blue-300 hover:text-blue-200 transition-colors hover:underline font-bold"
                    >
                      {song.artist}
                    </Link>{" "}
                    entered the charts in{" "}
                    <Link
                      to={`/year/${song.year}`}
                      className="text-green-300 hover:text-green-200 transition-colors hover:underline font-bold"
                    >
                      {song.year}
                    </Link>{" "}
                    peaking at{" "}
                    <span className="bg-pink-700 text-white px-2 py-1 rounded-full font-bold">
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
              {topRatedSongs && topRatedSongs.length > 0 ? (
                topRatedSongs.map((song, index) => (
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
                      <span className="block md:hidden text-gray-700 bg-gray-50 p-3 rounded-lg shadow-sm">
                        <Link
                          to={`/songs/${song.slug}`}
                          className="text-blue-800 font-bold text-lg hover:text-pink-600 transition-colors"
                        >
                          {song.title}
                        </Link>
                        <br className="block md:hidden" />{" "}
                        <Link
                          to={`/artist/${song.artist_slug}`}
                          className="text-blue-800 hover:underline hover:text-pink-600 transition-colors"
                        >
                          {song.artist}
                        </Link>
                        <br className="block md:hidden" />{" "}
                        <Link
                          to={`/year/${song.year}`}
                          className="text-blue-800 hover:underline hover:text-pink-600 transition-colors"
                        >
                          {song.year}
                        </Link>
                        <br className="block md:hidden" />{" "}
                        <span className="block md:hidden bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold px-3 py-1 rounded-full mt-2 inline-block">
                          Rating: {song.average_user_score}/10
                        </span>
                      </span>

                      <span className="hidden md:block">
                        <Link
                          to={`/songs/${song.slug}`}
                          className="text-blue-800 font-bold hover:text-pink-600 transition-colors"
                        >
                          {song.title}
                        </Link>
                      </span>
                    </td>

                    {/* Separate cells for Artist, Year, and Score */}
                    <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-sm md:text-base">
                      <Link
                        to={`/artist/${song.artist_slug}`}
                        className="text-blue-700 hover:text-pink-600 transition-colors hover:underline"
                      >
                        {song.artist}
                      </Link>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-sm md:text-base">
                      <Link
                        to={`/year/${song.year}`}
                        className="text-blue-700 hover:text-pink-600 transition-colors hover:underline"
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
                ))
              ) : (
                <tr className="flex flex-col md:table-row md:w-full">
                  <td colSpan="5" className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center">
                      <Grid
                        visible={true}
                        height="40"
                        width="40"
                        ariaLabel="grid-loading"
                        color="#f472b6"
                      />
                      <span className="ml-2">Loading top-rated songs...</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-6">
          <Link 
            to="/songs?sort=rating" 
            className="inline-block px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-lg shadow-md hover:from-pink-600 hover:to-pink-700 transition-all hover:text-white duration-300 transform"
          >
            All rated songs
          </Link>
        </div>
      </section>

      <Suspense fallback={<div>Loading Number One Hits...</div>}>
        <NumberOneHitsSection />
      </Suspense>
    </div>
  );
};

export default FrontPage;
