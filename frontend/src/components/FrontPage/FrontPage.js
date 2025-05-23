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
        <title>PopHits.org - 50 years of hit songs</title>
        <meta
          name="description"
          content="Explore top-rated songs, random hits by decade, and number one hits on PopHits.org"
        />
      </Helmet>

      <div className="flex flex-col md:flex-row md:space-x-8 mb-12 w-full">
        <div className="flex-1 mb-6 md:mb-0">
          <h1 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center bg-gradient-to-r from-pink-500 to-purple-900 bg-clip-text text-transparent pb-1">
            THE HIT SONG DATABASE
          </h1>

          <p className="mb-6 text-center md:text-left text-sm md:text-lg">
            <strong>
              Listen, rate, and revisit the most iconic songs in pop music
              history.
            </strong>
          </p>
          <p className="mb-6 text-center md:text-left text-sm md:text-lg">
            Browse over{" "}
            <span className="text-purple-900 font-bold">30,000</span> tracks
            spanning decades of pop history — from massive hits to forgotten
            gems. Start exploring your favorites today.
          </p>

          <div className="mb-6 text-center md:text-left text-sm md:text-lg">
            <div className="space-y-4 text-md md:text-lg text-center md:text-left">
              <div className="flex items-center gap-3 group">
                <Search className="w-5 h-5 text-purple-800 group-hover:scale-110 transition-transform" />
                <a
                  href="/songs"
                  className="font-medium group-hover:text-purple-900 transition-colors hover:underline"
                >
                  Explore and find unheard gems
                </a>
              </div>

              <div className="flex items-center gap-3 group">
                <Heart className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
                <a
                  href="/songs"
                  className="font-medium group-hover:text-red-700 transition-colors hover:underline"
                >
                  Rediscover old favourites
                </a>
              </div>

              <div className="flex items-center gap-3 group">
                <Headphones className="w-5 h-5 text-blue-700 group-hover:scale-110 transition-transform" />
                <a
                  href="/playlist-generator"
                  className="font-medium group-hover:text-blue-800 transition-colors hover:underline"
                >
                  Create playlists from your favorites
                </a>
                <span className="font-medium group-hover:text-blue-800 transition-colors">
                  {" "}
                  (
                  <a
                    href="https://www.youtube.com/watch?v=818njtSUKd8&t=1s"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    instructions
                  </a>
                  )
                </span>
              </div>

              <div className="flex items-center gap-3 group">
                <Zap className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                <a
                  href="/quiz-generator"
                  className="font-medium group-hover:text-green-800 transition-colors hover:underline"
                >
                  Test your knowledge with our quiz generator
                </a>
              </div>
            </div>
          </div>
        </div>

        {songWithImage && (
          <div className="flex-1 mb-0 md:mb-0 w-full">
            <div className="bg-gray-800 text-white p-6 w-full relative lg:rounded-xl">
              <h2 className="text-xl md:text-3xl font-cherry font-semibold mb-4 text-center flex items-center justify-center gap-2">
                <Disc className="w-8 h-8 text-white" />
                Featured hit
              </h2>
              <div className="relative w-full bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={songWithImage.image_upload}
                  alt={songWithImage.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-4 bg-black bg-opacity-50 text-white">
                  <div className="text-center text-xl md:text-2xl">
                    <Link
                      to={`/artist/${songWithImage.artist_slug}`}
                      className="text-blue-200 hover:underline"
                    >
                      {songWithImage.artist}
                    </Link>
                    {" - "}
                    <Link
                      to={`/songs/${songWithImage.slug}`}
                      className="text-blue-200 hover:underline"
                    >
                      {songWithImage.title}
                    </Link>
                    {" ("}
                    <Link
                      to={`/year/${songWithImage.year}`}
                      className="text-blue-200 hover:underline"
                    >
                      {songWithImage.year}
                    </Link>
                    {")"}
                  </div>
                  <p className="mt-2 text-sm text-center">
                    {songWithImage.average_user_score > 0 ? (
                      <>
                        Average User Rating:{" "}
                        <span className="font-bold">
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

      <section className="mb-0 text-black p-6 w-full">
        <h2 className="text-xl md:text-3xl font-cherry font-semibold mb-4 text-center flex items-center justify-center gap-2">
          <CalendarDays className="w-8 h-8 text-pink-600" />
          Hits by year
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {years.map((year) => (
            <Link
              key={year}
              to={`/year/${year}`}
              className="px-4 py-2 rounded-lg text-md bg-gray-200 text-gray-800 hover:bg-pink-400 hover:text-gray-100"
            >
              {year}
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-0 bg-gray-800 text-white p-6 w-full lg:rounded-xl">
        <div className="flex flex-col items-center md:flex-row md:justify-center gap-4 mb-4">
          <h2 className="text-xl md:text-3xl font-cherry font-semibold flex items-center gap-2 text-white">
            <Shuffle className="w-8 h-8 text-white" />
            Random hits by decade
          </h2>
          <button
            onClick={refreshRandomHitsByDecade}
            className="ml-3 px-3 py-1 rounded-md bg-pink-600 hover:bg-pink-700 hover:text-pink-100 transition-colors duration-300 text-white font-semibold text-sm md:text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            Refresh
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full overflow-x-auto mb-4">
            <div className="flex flex-wrap justify-center gap-2">
              {Object.keys(groupedByDecade).map((decade) => (
                <button
                  key={decade}
                  onClick={() => setActiveDecade(decade)}
                  className={`px-4 py-2 rounded-lg text-md bg-gray-200 text-gray-800 hover:bg-pink-400 hover:text-gray-100 ${
                    activeDecade === decade ? "bg-pink-400 text-gray-100" : ""
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
                <div key={song.id} className="mb-4 w-full">
                  <iframe
                    src={`https://open.spotify.com/embed/track/${song.spotify_url
                      .split("/")
                      .pop()}`}
                    width="100%"
                    height="380"
                    frameBorder="0"
                    allowtransparency="true"
                    allow="encrypted-media"
                    className="w-full"
                  ></iframe>
                  <p className="mt-2 text-center text-sm">
                    <Link
                      to={`/songs/${song.slug}`}
                      className="text-blue-200 hover:underline"
                    >
                      <b>{song.title}</b>
                    </Link>{" "}
                    by{" "}
                    <Link
                      to={`/artist/${song.artist_slug}`}
                      className="text-blue-200 hover:underline"
                    >
                      <b>{song.artist}</b>
                    </Link>{" "}
                    entered the charts in{" "}
                    <Link
                      to={`/year/${song.year}`}
                      className="text-blue-200 hover:underline"
                    >
                      <b>{song.year}</b>
                    </Link>{" "}
                    peaking at #{song.peak_rank}
                  </p>
                </div>
              ))
            ) : (
              <p>No songs available for this decade.</p>
            )}
          </div>
        </div>
      </section>

      <section className="mb-0 text-black p-6 w-full">
        <h2 className="text-xl md:text-3xl font-cherry font-semibold mb-4 flex items-center justify-center gap-2 text-center">
          <Flame className="w-8 h-8 text-pink-500" />
          Top 10 user ranked hits
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {topRatedSongs && topRatedSongs.length > 0 ? (
                topRatedSongs.map((song, index) => (
                  <tr
                    key={song.id}
                    className="flex flex-col md:table-row md:w-full text-center md:text-left"
                  >
                    {/* Ranking Cell */}
                    <td className="flex md:table-cell px-4 py-2 whitespace-nowrap text-black text-xl md:text-base items-center justify-center md:justify-start">
                      <span className="block md:hidden font-medium text-gray-500">
                        #{index + 1}
                      </span>
                      <span className="hidden md:block">{index + 1}</span>
                    </td>

                    {/* Info Cell with Title, Artist, Year, and Score */}
                    <td className="flex flex-col md:table-cell px-4 py-2 whitespace-nowrap text-sm md:text-base">
                      <span className="block md:hidden text-gray-700">
                        <Link
                          to={`/songs/${song.slug}`}
                          className="text-blue-800 font-bold"
                        >
                          {song.title}
                        </Link>
                        <br className="block md:hidden" />{" "}
                        {/* Line break on mobile */}
                        <Link
                          to={`/artist/${song.artist_slug}`}
                          className="text-blue-800 hover:underline"
                        >
                          {song.artist}
                        </Link>
                        <br className="block md:hidden" />{" "}
                        {/* Line break on mobile */}
                        <Link
                          to={`/year/${song.year}`}
                          className="text-blue-800 hover:underline"
                        >
                          {song.year}
                        </Link>
                        <br className="block md:hidden" />{" "}
                        {/* Line break on mobile */}
                        <span className="block md:hidden bg-pink-200 text-pink-700 font-bold px-2 py-1 rounded mt-1">
                          Rating: {song.average_user_score}/10
                        </span>
                      </span>

                      <span className="hidden md:block">
                        <Link
                          to={`/songs/${song.slug}`}
                          className="text-blue-800 font-bold"
                        >
                          {song.title}
                        </Link>
                      </span>
                    </td>

                    {/* Separate cells for Artist, Year, and Score */}
                    <td className="flex md:table-cell px-4 py-2 whitespace-nowrap text-sm md:text-base hidden md:block">
                      <Link
                        to={`/artist/${song.artist_slug}`}
                        className="text-blue-800 hover:underline"
                      >
                        {song.artist}
                      </Link>
                    </td>
                    <td className="flex md:table-cell px-4 py-2 whitespace-nowrap text-sm md:text-base hidden md:block">
                      <Link
                        to={`/year/${song.year}`}
                        className="text-blue-800 hover:underline"
                      >
                        {song.year}
                      </Link>
                    </td>
                    <td className="flex md:table-cell px-4 py-2 whitespace-nowrap text-sm md:text-base hidden md:block">
                      <span className="bg-pink-200 text-pink-700 font-bold px-2 py-1 rounded">
                        {song.average_user_score}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="flex flex-col md:table-row md:w-full">
                  <td colSpan="5" className="px-4 py-2 text-center">
                    Loading top-rated songs...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-4"></div>
      </section>

      <Suspense fallback={<div>Loading Number One Hits...</div>}>
        <NumberOneHitsSection />
      </Suspense>
    </div>
  );
};

export default FrontPage;
