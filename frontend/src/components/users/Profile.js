import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getUserProfile,
  getBookmarkedSongs,
  deleteAllBookmarks,
} from "../../services/api";

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
      <h2 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center">User Profile</h2>
      {userProfile ? (
        <div className="profile-user-container">
          <div className="profile-user-box">
            <p>Username: {userProfile.username}</p>
            <p>Email: {userProfile.email}</p>
            <Link to="/profile/update" className="profile-update-link">
              Update Info
            </Link>{" "}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <div style={{ borderTop: "1px solid #ccc" }}></div>
      <div className="tab-container">
        <button
          className={tab === "rating" ? "active-tab" : "inactive-tab"}
          onClick={() => setTab("rating")}
        >
          📊Rating History
        </button>
        <button
          className={tab === "bookmarks" ? "active-tab" : "inactive-tab"}
          onClick={() => setTab("bookmarks")}
        >
          ❤️Bookmarked Songs
        </button>
      </div>

      {tab === "rating" && (
        <>
          <div className="relative mb-6">
            <div className="text-rating-filter">
              Display songs from minimum rating
            </div>
            <label htmlFor="labels-range-input" className="sr-only">
              Labels range
            </label>
            <div className="slider-box">
              <input
                id="labels-range-input"
                type="range"
                value={filterScore}
                min="1"
                max="10"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                onChange={(e) => setFilterScore(e.target.value)}
              />
            </div>
            {[...Array(10)].map((_, index) => (
              <span
                key={index}
                className="text-sm text-gray-500 absolute"
                style={{
                  left: `${(index / 9) * 100}%`,
                  transform: "translateX(-50%)",
                  bottom: "20px",
                }}
              >
                {index + 1}
              </span>
            ))}
          </div>

          {currentSongsRating && currentSongsRating.length > 0 ? (
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Artist</th>
                  <th className="px-4 py-2">Song</th>
                  <th className="px-4 py-2">Your rating</th>
                </tr>
              </thead>
              <tbody>
                {currentSongsRating.map((rating) => (
                  <tr key={rating.id}>
                    <td className="border px-4 py-2">{rating.song_artist}</td>
                    <td className="border px-4 py-2">
                      <Link
                        to={`/songs/${rating.song_slug}`}
                        className="song-link"
                      >
                        {rating.song_title}
                      </Link>
                    </td>
                    <td
                      className="border px-4 py-2"
                      style={{ textAlign: "right" }}
                    >
                      {rating.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center items-center h-48">
              <p>😶No rating history yet</p>
            </div>
          )}

          {filteredRatingHistory.length > songsPerPageRating && (
            <nav className="mt-4">
              <ul className="history-pagination">
                {[
                  ...Array(
                    Math.ceil(filteredRatingHistory.length / songsPerPageRating)
                  ),
                ].map((_, index) => (
                  <li key={index} className="page-item">
                    <button
                      onClick={() => paginateRating(index + 1)}
                      className={
                        currentPageRating === index + 1
                          ? "page-link active"
                          : "page-link"
                      }
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
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Artist</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Year</th>
                </tr>
              </thead>
              <tbody>
                {currentSongsBookmarks.map((song) => (
                  <tr key={song.id}>
                    <td className="border px-4 py-2">{song.artist}</td>
                    <td className="border px-4 py-2">
                      <Link to={`/songs/${song.slug}`} className="song-link">
                        {song.title}
                      </Link>
                    </td>
                    <td
                      className="border px-4 py-2"
                      style={{ textAlign: "right" }}
                    >
                      {song.year}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center items-center h-48">
              <p>😶No bookmarked songs yet</p>
            </div>
          )}

          {bookmarkedSongs.length > songsPerPageBookmarks && (
            <nav className="mt-4">
              <ul className="history-pagination">
                {[
                  ...Array(
                    Math.ceil(bookmarkedSongs.length / songsPerPageBookmarks)
                  ),
                ].map((_, index) => (
                  <li key={index} className="page-item">
                    <button
                      onClick={() => paginateBookmarks(index + 1)}
                      className={
                        currentPageBookmarks === index + 1
                          ? "page-link active"
                          : "page-link"
                      }
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
            <div className="delete-bookmarks-button-container">
              <button
                onClick={handleDeleteAllBookmarks}
                className="delete-bookmarks-button"
              >
                ☢️ Delete All Bookmarks
              </button>
            </div>
          )}
        </>
      )}

      <div className="spotify-clipboard-box">
        <button onClick={copySpotifyUrls} className="copy-spotify-urls-button">
          📋 Copy Spotify URLs to clipboard
        </button>
        <div className="spotify-clipboard-text">
          Once clicked, you can easily paste the songs into a new Spotify
          playlist using ctrl+v/command+v.
        </div>
      </div>

      {/* Dropdown menu for selecting songs per page */}
      <div className="songs-per-page-dropdown">
        <label htmlFor="songs-per-page">Songs per page:</label>
        <select
          id="songs-per-page"
          value={tab === "rating" ? songsPerPageRating : songsPerPageBookmarks}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            tab === "rating"
              ? setSongsPerPageRating(value)
              : setSongsPerPageBookmarks(value);
          }}
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
