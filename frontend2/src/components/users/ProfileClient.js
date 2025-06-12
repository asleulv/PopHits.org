"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Heart,
  HeartOff,
  BarChart2,
  Clipboard,
  Trash2,
  User,
  Award,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Star,
  BarChart,
} from "lucide-react";

// Decade color mapping (matches FrontPage year button style)
const decadeColors = {
  1950: "border-4 border-blue-200 text-blue-600 px-2 py-1 rounded",
  1960: "border-4 border-green-200 text-green-600 px-2 py-1 rounded",
  1970: "border-4 border-yellow-200 text-yellow-600 px-2 py-1 rounded",
  1980: "border-4 border-purple-200 text-purple-600 px-2 py-1 rounded",
  1990: "border-4 border-red-200 text-red-600 px-2 py-1 rounded",
  2000: "border-4 border-indigo-200 text-indigo-600 px-2 py-1 rounded",
  2010: "border-4 border-pink-200 text-pink-600 px-2 py-1 rounded",
  2020: "border-4 border-cyan-200 text-cyan-600 px-2 py-1 rounded",
};

// Score color mapping for bar chart (red to green)
const scoreColors = {
  0: "bg-gray-300",
  1: "bg-red-300",
  2: "bg-red-200",
  3: "bg-orange-300",
  4: "bg-orange-200",
  5: "bg-yellow-200",
  6: "bg-yellow-300",
  7: "bg-green-200",
  8: "bg-green-300",
  9: "bg-blue-200",
  10: "bg-blue-300",
};

const PaginationControls = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 3) endPage = Math.min(totalPages - 1, 4);
      if (currentPage >= totalPages - 2)
        startPage = Math.max(2, totalPages - 3);
      if (startPage > 2) pageNumbers.push("...");
      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
      if (endPage < totalPages - 1) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };
  const pageNumbers = getPageNumbers();
  return (
    <nav className="mt-6" aria-label="Pagination">
      <div className="flex justify-center overflow-x-auto py-2 max-w-full">
        <ul className="inline-flex items-center -space-x-px">
          <li>
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 ml-0 leading-tight rounded-l-md border ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100 hover:text-pink-600"
              } border-gray-300`}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </li>
          {pageNumbers.map((pageNumber, index) => (
            <li key={index}>
              {pageNumber === "..." ? (
                <span className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(pageNumber)}
                  className={`px-3 py-2 leading-tight border ${
                    currentPage === pageNumber
                      ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium"
                      : "bg-white text-gray-700 hover:bg-gray-100 hover:text-pink-600"
                  } border-gray-300`}
                  aria-label={`Go to page ${pageNumber}`}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </button>
              )}
            </li>
          ))}
          <li>
            <button
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-2 leading-tight rounded-r-md border ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100 hover:text-pink-600"
              } border-gray-300`}
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default function ProfileClient() {
  const { user, isAuthenticated, authToken, logoutUser } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [ratingHistory, setRatingHistory] = useState([]);
  const [bookmarkedSongs, setBookmarkedSongs] = useState([]);
  const [filterScore, setFilterScore] = useState(1);
  const [currentPageRating, setCurrentPageRating] = useState(1);
  const [currentPageBookmarks, setCurrentPageBookmarks] = useState(1);
  const [songsPerPageRating, setSongsPerPageRating] = useState(10);
  const [songsPerPageBookmarks, setSongsPerPageBookmarks] = useState(10);
  const [tab, setTab] = useState("rating");
  const [userStats, setUserStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const availableSongsPerPage = [5, 10, 25, 50, 100];

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const getBaseUrl = () => {
    return process.env.NODE_ENV === "development"
      ? "http://localhost:8000"
      : "https://pophits.org";
  };
  const baseUrl = getBaseUrl();

  useEffect(() => {
    const fetchData = async () => {
      if (!authToken) return;
      try {
        const profileResponse = await fetch(`${baseUrl}/api/profile/`, {
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          credentials: "include",
        });
        if (!profileResponse.ok) throw new Error("Failed to fetch profile");
        const profileData = await profileResponse.json();
        setUserProfile(profileData.user_data);
        if (profileData.rating_history)
          setRatingHistory(profileData.rating_history);

        const bookmarkedResponse = await fetch(
          `${baseUrl}/api/songs/bookmarked-songs/`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "include",
          }
        );
        if (!bookmarkedResponse.ok)
          throw new Error("Failed to fetch bookmarked songs");
        const bookmarkedData = await bookmarkedResponse.json();
        setBookmarkedSongs(bookmarkedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [authToken, baseUrl]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!userProfile || !userProfile.username) return;
      try {
        const statsResponse = await fetch(
          `${baseUrl}/api/profile/stats/${encodeURIComponent(
            userProfile.username
          )}/`,
          {
            headers: {
              Authorization: `Token ${authToken}`,
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "include",
          }
        );
        if (!statsResponse.ok) throw new Error("Failed to fetch user stats");
        const statsData = await statsResponse.json();
        setUserStats(statsData);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };
    fetchStats();
  }, [userProfile, authToken, baseUrl]);

  useEffect(() => {
    setCurrentPageRating(1);
  }, [filterScore]);
  useEffect(() => {
    tab === "rating" ? setCurrentPageRating(1) : setCurrentPageBookmarks(1);
  }, [tab]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDeleteAllBookmarks = async () => {
    if (bookmarkedSongs.length === 0) {
      alert("There are no bookmarks to delete 🤪");
      return;
    }
    const numBookmarksToDelete = bookmarkedSongs.length;
    const confirmDelete = window.confirm(
      `${numBookmarksToDelete} bookmarks will be deleted. Are you sure?`
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `${baseUrl}/api/songs/bookmarked-songs/delete-all/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Token ${authToken}`,
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to delete bookmarks");
        setBookmarkedSongs([]);
      } catch (error) {
        console.error("Error deleting bookmarks:", error);
        alert("Failed to delete bookmarks. Please try again.");
      }
    }
  };

  const copySpotifyUrls = () => {
    const songs = tab === "rating" ? filteredRatingHistory : bookmarkedSongs;
    const spotifyUrls = songs
      .map((rating) => rating.spotify_url)
      .filter((url) => url)
      .join("\n");
    if (spotifyUrls.trim() !== "") {
      navigator.clipboard.writeText(spotifyUrls);
      const count = spotifyUrls.split("\n").length;
      alert(`${count} Spotify URLs copied to clipboard!`);
    } else {
      alert("No Spotify URLs to copy!");
    }
  };

  const filteredRatingHistory = ratingHistory.filter(
    (rating) => rating.score >= filterScore
  );
  const indexOfLastSongRating = currentPageRating * songsPerPageRating;
  const indexOfFirstSongRating = indexOfLastSongRating - songsPerPageRating;
  const currentSongsRating = filteredRatingHistory.slice(
    indexOfFirstSongRating,
    indexOfLastSongRating
  );
  const indexOfLastSongBookmarks = currentPageBookmarks * songsPerPageBookmarks;
  const indexOfFirstSongBookmarks =
    indexOfLastSongBookmarks - songsPerPageBookmarks;
  const currentSongsBookmarks = bookmarkedSongs.slice(
    indexOfFirstSongBookmarks,
    indexOfLastSongBookmarks
  );
  const paginateRating = (pageNumber) => setCurrentPageRating(pageNumber);
  const paginateBookmarks = (pageNumber) => setCurrentPageBookmarks(pageNumber);

  if (!isAuthenticated && !isLoading) return null;

  // Score distribution bar chart
  const renderScoreDistribution = () => {
    if (!userStats || !userStats.score_distribution) return null;
    // Find the max count for scaling
    const maxCount = Math.max(
      ...userStats.score_distribution.map((s) => s.count)
    );
    return (
      <div className="mt-10 mb-8 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-center mb-3 gap-2">
          <BarChart className="w-6 h-6 text-blue-500" />
          <h4 className="text-lg font-semibold text-gray-700">
            Score Distribution
          </h4>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-2xl mx-auto">
          {userStats.score_distribution
            .filter((s) => s.score > 0) // skip 0 if you want, or include it
            .map(({ score, count }) => (
              <div key={score} className="flex items-center gap-2">
                <span className="w-6 text-right text-xs font-bold text-gray-700">
                  {score}
                </span>
                <div className="flex-1 h-6 rounded-full overflow-hidden bg-gray-200 relative">
                  <div
                    className={`${
                      scoreColors[score] || "bg-gray-400"
                    } h-full w-full transition-all duration-500 absolute left-0 top-0`}
                    style={{
                      width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%`,
                      minWidth: count > 0 ? "2rem" : 0,
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
        <div className="text-center text-xs text-gray-500 mt-2">
          <span>Shows how many times you gave each score.</span>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center bg-gradient-to-r from-pink-500 via-purple-600 to-purple-900 bg-clip-text text-transparent">
        <div className="flex items-center justify-center gap-2 px-1 py-1">
          <CircleUserRound className="w-8 h-8 text-pink-500" />
          <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">
            User Profile
          </span>
        </div>
      </h1>

      {userProfile ? (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm mb-8">
          <div className="flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-pink-500 mr-2" />
            <h3 className="text-xl font-semibold text-gray-700">
              Account Information
            </h3>
          </div>
          <div className="flex flex-col space-y-2 items-center">
            <p className="text-gray-700">
              <span className="font-semibold">Username:</span>{" "}
              {userProfile.username}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> {userProfile.email}
            </p>
            <Link
              href="/profile/update"
              className="mt-2 text-pink-600 hover:text-pink-700 transition-colors font-medium"
            >
              Update Account Info
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-24">
          <p className="text-gray-500">Loading profile information...</p>
        </div>
      )}

      {/* Rating Progress Indicator */}
      {userProfile && userStats && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm mb-8">
          <div className="flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-pink-500 mr-2" />
            <h3 className="text-xl font-semibold text-gray-700">
              Rating Progress
            </h3>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-4">
            <div className="flex flex-col items-center mb-4 md:mb-0">
              <p className="text-gray-500 text-sm">Songs Rated</p>
              <p className="text-3xl font-bold text-pink-600 ml-1">
                {userStats.songs_rated}
              </p>
            </div>
            <div className="flex flex-col items-center mb-4 md:mb-0">
              <p className="text-gray-500 text-sm">Total Songs</p>
              <p className="text-3xl font-bold text-gray-700 ml-1">
                {userStats.total_songs}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-gray-500 text-sm">Completion</p>
              <p className="text-3xl font-bold text-blue-600 ml-1">
                {userStats.percent_rated}%
              </p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-500 to-blue-500 h-4 transition-all duration-500"
              style={{
                width: `${Math.min(100, userStats.percent_rated)}%`,
                minWidth: userStats.songs_rated > 0 ? "4px" : "0",
              }}
            ></div>
          </div>
          <p className="text-center text-gray-500 text-sm">
            You&rsquo;ve rated {userStats.songs_rated} out of{" "}
            {userStats.total_songs} songs in our database
          </p>
          {/* Average Score per Decade */}
          {userStats.decade_averages &&
            userStats.decade_averages.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-center mb-3 gap-2">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <h4 className="text-lg font-semibold text-gray-700">
                    Average Score per Decade
                  </h4>
                </div>
                <div className="flex flex-wrap justify-center gap-5">
                  {userStats.decade_averages
                    .sort((a, b) => a.decade - b.decade)
                    .map(({ decade, avg_score }) => (
                      <div
                        key={decade}
                        className={`flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full shadow-lg font-bold text-lg ${
                          decadeColors[decade] || "bg-gray-200 text-gray-800"
                        }`}
                        style={{ minWidth: "5rem", minHeight: "5rem" }}
                      >
                        <span className="text-xs font-semibold mb-1">
                          {decade}s
                        </span>
                        <span className="text-2xl font-extrabold">
                          {avg_score !== null ? avg_score.toFixed(2) : "–"}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Score Distribution Bar Chart */}
      {renderScoreDistribution()}

      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-full shadow-md p-1 inline-flex">
          <button
            className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${
              tab === "rating"
                ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setTab("rating")}
          >
            <BarChart2 className="w-5 h-5" />
            Rating History
          </button>
          <button
            className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${
              tab === "bookmarks"
                ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setTab("bookmarks")}
          >
            <Heart className="w-5 h-5" />
            Bookmarked Songs
          </button>
        </div>
      </div>

      {tab === "rating" && (
        <>
          <div className="mb-8 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm">
            <div className="text-center mb-4">
              <p className="text-lg font-medium text-gray-700">
                Display songs with minimum rating of:{" "}
                <span className="font-bold text-pink-600">{filterScore}</span>
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              {[...Array(10)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setFilterScore(index + 1)}
                  className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full shadow-md transition-all duration-300 ${
                    filterScore === index + 1
                      ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-label={`Filter by minimum rating of ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <p className="text-sm text-center text-gray-500 italic">
              Click a number to set the minimum rating filter
            </p>
          </div>
          {currentSongsRating && currentSongsRating.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3 md:w-auto">
                        Artist
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3 md:w-auto">
                        Song
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3 md:w-auto">
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentSongsRating.map((rating, index) => (
                      <tr
                        key={`rating-${rating.song_slug}-${index}`}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-700 break-words">
                          {rating.song_artist}
                        </td>
                        <td className="px-4 py-3 text-sm break-words">
                          <Link
                            href={`/songs/${rating.song_slug}`}
                            className="text-blue-600 hover:text-pink-600 transition-colors"
                          >
                            {rating.song_title}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-right text-sm">
                          <span className="bg-pink-100 text-pink-800 font-medium px-2.5 py-0.5 rounded-full">
                            {rating.score}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-48 bg-white rounded-xl shadow-md">
              <div className="flex flex-col items-center text-gray-500">
                <BarChart2 className="w-10 h-10 text-gray-400 mb-2" />
                <p>No rating history yet</p>
              </div>
            </div>
          )}
          <PaginationControls
            currentPage={currentPageRating}
            totalItems={filteredRatingHistory.length}
            itemsPerPage={songsPerPageRating}
            onPageChange={paginateRating}
          />
        </>
      )}

      {tab === "bookmarks" && (
        <>
          {currentSongsBookmarks && currentSongsBookmarks.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3 md:w-auto">
                        Artist
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3 md:w-auto">
                        Title
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3 md:w-auto">
                        Year
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentSongsBookmarks.map((song) => (
                      <tr
                        key={song.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-700 break-words">
                          {song.artist}
                        </td>
                        <td className="px-4 py-3 text-sm break-words">
                          <Link
                            href={`/songs/${song.slug}`}
                            className="text-blue-600 hover:text-pink-600 transition-colors"
                          >
                            {song.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-right text-sm">
                          <span className="text-gray-700 font-medium">
                            {song.year}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-48 bg-white rounded-xl shadow-md">
              <div className="flex flex-col items-center text-gray-500">
                <HeartOff className="w-10 h-10 text-gray-400 mb-2" />
                <p>No bookmarked songs yet</p>
              </div>
            </div>
          )}
          <PaginationControls
            currentPage={currentPageBookmarks}
            totalItems={bookmarkedSongs.length}
            itemsPerPage={songsPerPageBookmarks}
            onPageChange={paginateBookmarks}
          />
          {currentSongsBookmarks.length > 0 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleDeleteAllBookmarks}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete All Bookmarks
              </button>
            </div>
          )}
        </>
      )}

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm mt-8 mb-6">
        <div className="flex items-center justify-center mb-4">
          <Clipboard className="w-6 h-6 text-pink-500 mr-2" />
          <h3 className="text-xl font-semibold text-gray-700">
            Spotify Playlist Creation
          </h3>
        </div>
        <p className="text-gray-600 text-center mb-4">
          Copy Spotify URLs to create a playlist with your songs
        </p>
        <div className="flex justify-center">
          <button
            onClick={copySpotifyUrls}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors flex items-center gap-2"
          >
            <Clipboard className="w-5 h-5" />
            Copy Spotify URLs to clipboard
          </button>
        </div>
        <p className="text-gray-500 text-sm text-center mt-3">
          Once copied, paste the URLs into a new Spotify playlist using
          Ctrl+V/Command+V
        </p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-center gap-3 mb-8">
        <label htmlFor="songs-per-page" className="text-gray-700 font-medium">
          Songs per page:
        </label>
        <select
          id="songs-per-page"
          value={tab === "rating" ? songsPerPageRating : songsPerPageBookmarks}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            tab === "rating"
              ? setSongsPerPageRating(value)
              : setSongsPerPageBookmarks(value);
          }}
          className="bg-gray-50 border border-gray-300 text-gray-700 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          {availableSongsPerPage.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
