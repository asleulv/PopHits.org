import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getUserProfile,
  getBookmarkedSongs,
  deleteAllBookmarks,
  getTotalSongsCount,
} from "../../services/api";
import { Heart, BarChart2, Clipboard, Trash2, User, PieChart, Award } from "lucide-react";

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [ratingHistory, setRatingHistory] = useState([]);
  const [bookmarkedSongs, setBookmarkedSongs] = useState([]);
  const [filterScore, setFilterScore] = useState(1);
  const [currentPageRating, setCurrentPageRating] = useState(1);
  const [currentPageBookmarks, setCurrentPageBookmarks] = useState(1);
  const [songsPerPageRating, setSongsPerPageRating] = useState(10); // Default songs per page for rating history
  const [songsPerPageBookmarks, setSongsPerPageBookmarks] = useState(10); // Default songs per page for bookmarks
  const [tab, setTab] = useState("rating"); // Default tab
  const [totalSongsCount, setTotalSongsCount] = useState(0); // Total songs in database

  const availableSongsPerPage = [5, 10, 25, 50, 100]; // Options for songs per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const profileResponse = await getUserProfile(authToken);
        setUserProfile(profileResponse.user_data);
        if (profileResponse.rating_history) {
          setRatingHistory(profileResponse.rating_history);
        }

        const bookmarkedResponse = await getBookmarkedSongs(authToken);
        setBookmarkedSongs(bookmarkedResponse);
        
        // Fetch total songs count
        const totalCount = await getTotalSongsCount();
        setTotalSongsCount(totalCount);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteAllBookmarks = async () => {
    // Check if there are no bookmarks to delete
    if (bookmarkedSongs.length === 0) {
      // Display an error message to the user
      alert("There are no bookmarks to delete 🤪");
      return;
    }

    // Get the number of bookmarks to be deleted
    const numBookmarksToDelete = bookmarkedSongs.length;

    // Show a confirmation message to the user
    const confirmDelete = window.confirm(
      `${numBookmarksToDelete} bookmarks will be deleted. Are you sure?`
    );

    if (confirmDelete) {
      try {
        await deleteAllBookmarks();
        // Optionally, you can update the UI or show a success message
        // For example, you can refetch the bookmarked songs after deletion
        const authToken = localStorage.getItem("authToken");
        const bookmarkedResponse = await getBookmarkedSongs(authToken);
        setBookmarkedSongs(bookmarkedResponse);
      } catch (error) {
        console.error("Error deleting bookmarks:", error);
        // Handle error
      }
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

  const copySpotifyUrls = () => {
    const songs = tab === "rating" ? filteredRatingHistory : bookmarkedSongs;
    const spotifyUrls = songs
      .map((rating) => rating.spotify_url)
      .filter((url) => url) // Filter out null or empty values
      .join("\n");
    
    if (spotifyUrls.trim() !== "") { // Check if spotifyUrls is not empty
      navigator.clipboard.writeText(spotifyUrls);
      const count = spotifyUrls.split("\n").length; // Count the number of URLs
      alert(`${count} Spotify URLs copied to clipboard!`);
    } else {
      alert("No Spotify URLs to copy!");
    }
  };
  

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center bg-gradient-to-r from-pink-500 via-purple-600 to-purple-900 bg-clip-text text-transparent">User Profile</h2>
      
      {userProfile ? (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm mb-8">
          <div className="flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-pink-500 mr-2" />
            <h3 className="text-xl font-semibold text-gray-700">Account Information</h3>
          </div>
          <div className="flex flex-col space-y-2 items-center">
            <p className="text-gray-700"><span className="font-semibold">Username:</span> {userProfile.username}</p>
            <p className="text-gray-700"><span className="font-semibold">Email:</span> {userProfile.email}</p>
            <Link 
              to="/profile/update" 
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
      {userProfile && totalSongsCount > 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm mb-8">
          <div className="flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-pink-500 mr-2" />
            <h3 className="text-xl font-semibold text-gray-700">Rating Progress</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-4">

            <div className="flex flex-col items-center mb-4 md:mb-0">
              <p className="text-gray-500 text-sm">Songs Rated</p>
              <p className="text-3xl font-bold text-pink-600 ml-1">{ratingHistory.length}</p>
            </div>
            
            <div className="flex flex-col items-center mb-4 md:mb-0">
              <p className="text-gray-500 text-sm">Total Songs</p>
              <p className="text-3xl font-bold text-gray-700 ml-1">{totalSongsCount}</p>
            </div>
            
            <div className="flex flex-col items-center">
              <p className="text-gray-500 text-sm">Completion</p>
              <p className="text-3xl font-bold text-blue-600 ml-1">
                {((ratingHistory.length / totalSongsCount) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
  <div
    className="bg-gradient-to-r from-pink-500 to-blue-500 h-4 transition-all duration-500"
    style={{
      width: `${Math.min(100, (ratingHistory.length / totalSongsCount) * 100)}%`,
      minWidth: ratingHistory.length > 0 ? '4px' : '0',
    }}
  ></div>
</div>
          
          <p className="text-center text-gray-500 text-sm">
            You've rated {ratingHistory.length} out of {totalSongsCount} songs in our database
          </p>
        </div>
      )}
      
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
              <p className="text-lg font-medium text-gray-700">Display songs with minimum rating of: <span className="font-bold text-pink-600">{filterScore}</span></p>
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
            
            <p className="text-sm text-center text-gray-500 italic">Click a number to set the minimum rating filter</p>
          </div>

          {currentSongsRating && currentSongsRating.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Add responsive container with horizontal scrolling */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {/* Adjust column widths for better mobile display */}
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3 md:w-auto">Artist</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3 md:w-auto">Song</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3 md:w-auto">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentSongsRating.map((rating) => (
                      <tr key={rating.id} className="hover:bg-gray-50 transition-colors">
                        {/* Remove whitespace-nowrap to allow text wrapping on mobile */}
                        <td className="px-4 py-3 text-sm text-gray-700 break-words">{rating.song_artist}</td>
                        <td className="px-4 py-3 text-sm break-words">
                          <Link
                            to={`/songs/${rating.song_slug}`}
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

          {filteredRatingHistory.length > songsPerPageRating && (
            <nav className="mt-6 flex justify-center">
              <ul className="flex space-x-2">
                {[
                  ...Array(
                    Math.ceil(filteredRatingHistory.length / songsPerPageRating)
                  ),
                ].map((_, index) => (
                  <li key={index}>
                    <button
                      onClick={() => paginateRating(index + 1)}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        currentPageRating === index + 1
                          ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                      aria-label={`Go to page ${index + 1}`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </>
      )}

      {tab === "bookmarks" && (
        <>
          {currentSongsBookmarks && currentSongsBookmarks.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Add responsive container with horizontal scrolling */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {/* Adjust column widths for better mobile display */}
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3 md:w-auto">Artist</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3 md:w-auto">Title</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3 md:w-auto">Year</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentSongsBookmarks.map((song) => (
                      <tr key={song.id} className="hover:bg-gray-50 transition-colors">
                        {/* Remove whitespace-nowrap to allow text wrapping on mobile */}
                        <td className="px-4 py-3 text-sm text-gray-700 break-words">{song.artist}</td>
                        <td className="px-4 py-3 text-sm break-words">
                          <Link
                            to={`/songs/${song.slug}`}
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
                <Heart className="w-10 h-10 text-gray-400 mb-2" />
                <p>No bookmarked songs yet</p>
              </div>
            </div>
          )}

          {bookmarkedSongs.length > songsPerPageBookmarks && (
            <nav className="mt-6 flex justify-center">
              <ul className="flex space-x-2">
                {[
                  ...Array(
                    Math.ceil(bookmarkedSongs.length / songsPerPageBookmarks)
                  ),
                ].map((_, index) => (
                  <li key={index}>
                    <button
                      onClick={() => paginateBookmarks(index + 1)}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        currentPageBookmarks === index + 1
                          ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                      aria-label={`Go to page ${index + 1}`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Render "Delete All Bookmarks" button only when there are bookmarked songs */}
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
          <h3 className="text-xl font-semibold text-gray-700">Spotify Playlist Creation</h3>
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
          Once copied, paste the URLs into a new Spotify playlist using Ctrl+V/Command+V
        </p>
      </div>

      {/* Dropdown menu for selecting songs per page */}
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
};

export default Profile;
