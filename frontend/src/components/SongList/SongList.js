import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAllSongs, getAllSongsByArtist, getAllSongsByYear } from "../../services/api";
import ReactPaginate from "react-paginate";
import { ThreeDots } from "react-loader-spinner";

const SongList = () => {
  const { artist_slug, year } = useParams();
  const [songs, setSongs] = useState([]);
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [perPage] = useState(100);
  const [pageCount, setPageCount] = useState(0);
  const [showingCount, setShowingCount] = useState(0);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        let fetchedSongs;
        if (artist_slug) {
          fetchedSongs = await getAllSongsByArtist(artist_slug); // Call the API function to fetch songs by artist
        } else if (year) {
          fetchedSongs = await getAllSongsByYear(year); // Call the API function to fetch songs by year
        } else {
          fetchedSongs = await getAllSongs(); // Fetch all songs if no filter is applied
        }

        setSongs(fetchedSongs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching songs:", error);
        setLoading(false); // Handle error condition
      }
    };

    fetchSongs();
  }, [artist_slug, year]);

  useEffect(() => {
    if (!loading) {
      const searchedSongs = songs.filter((song) => {
        const searchWords = searchQuery.toLowerCase().split(" ");
        const isInTitle = searchWords.every((word) =>
          song.title.toLowerCase().includes(word)
        );
        const isInArtist = searchWords.every((word) =>
          song.artist.toLowerCase().includes(word)
        );
        return isInTitle || isInArtist;
      });

      const sortedSongs = searchedSongs.sort((a, b) => {
        if (sortBy === "title") {
          return sortOrder === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        } else if (sortBy === "artist") {
          return sortOrder === "asc"
            ? a.artist.localeCompare(b.artist)
            : b.artist.localeCompare(a.artist);
        } else if (sortBy === "year") {
          return sortOrder === "asc" ? a.year - b.year : b.year - a.year;
        } else if (sortBy === "peak_rank") {
          return sortOrder === "asc"
            ? a.peak_rank - b.peak_rank
            : b.peak_rank - a.peak_rank;
        } else if (sortBy === "rating") {
          if (a.average_user_score === b.average_user_score) {
            return b.total_ratings - a.total_ratings;
          } else {
            return sortOrder === "asc"
              ? a.average_user_score - b.average_user_score
              : b.average_user_score - a.average_user_score;
          }
        } else if (sortBy === "ratings") {
          return sortOrder === "asc"
            ? a.total_ratings - b.total_ratings
            : b.total_ratings - a.total_ratings;
        }
        return 0; // Added to handle scenarios where sortBy isn't recognized
      });

      setShowingCount(sortedSongs.length);
      setPageCount(Math.ceil(sortedSongs.length / perPage));

      const offsetStart = offset;
      const offsetEnd = offset + perPage;
      const paginatedSongs = sortedSongs.slice(offsetStart, offsetEnd);
      setFilteredSongs(paginatedSongs);
    }
  }, [loading, songs, searchQuery, offset, perPage, sortBy, sortOrder]);

  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortOrder("asc");
    }
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setOffset(selectedPage * perPage);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setOffset(0);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSortBy("title");
    setSortOrder("asc");
    setOffset(0);
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.value = "";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots
          visible={loading}
          height={80}
          width={80}
          color="#0d458b"
          radius={9}
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="mb-4 text-center font-cherry">
        {artist_slug
          ? `Hits by ${decodeURIComponent(artist_slug)
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}`
          : year
          ? `Hits from ${year}`
          : "Hit Song Database"}
      </h2>

      <div className="mb-4 flex items-center">
        <input
          id="search-input" // Add an id to the input field
          type="text"
          placeholder="Search artist OR song..."
          onChange={handleSearch}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={handleReset}
          className="ml-2 px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
        >
          ❌ <span className="ml-1">Reset</span>
        </button>
      </div>
      <div className="table-container overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-200">
            <th
              onClick={() => handleSort("title")}
              className="px-4 py-2 cursor-pointer"
            >
              Title
            </th>
            <th
              onClick={() => handleSort("artist")}
              className="px-4 py-2 cursor-pointer"
            >
              Artist
            </th>
            <th
              onClick={() => handleSort("year")}
              className="px-4 py-2 cursor-pointer"
            >
              Year
            </th>
            <th
              onClick={() => handleSort("peak_rank")}
              className="px-4 py-2 cursor-pointer"
            >
              Peak
            </th>
            <th
              onClick={() => handleSort("rating")}
              className="px-4 py-2 cursor-pointer"
            >
              Rating
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredSongs.map((song) => (
            <tr key={song.id} className="border-b border-gray-200">
              <td className="px-4 py-2 font-bold">
                <Link to={`/songs/${song.slug}`} className="song-link">
                  {song.title}
                </Link>
              </td>
              <td className="px-4 py-2">
                <Link to={`/artist/${song.artist_slug}`} className="song-link">
                  {song.artist}
                </Link>
              </td>
              <td className="px-4 py-2">
                <Link to={`/year/${song.year}`} className="song-link">
                  {song.year}
                </Link>
              </td>
              <td className="px-4 py-2">{song.peak_rank}</td>
              <td className="px-4 py-2">
                {song.average_user_score === 0
                  ? "N/A"
                  : song.average_user_score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={
          <span className="px-3 py-1 rounded-lg mr-2">Previous</span>
        }
        nextLabel={<span className="px-3 py-1 rounded-lg ml-2">Next</span>}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"flex justify-center"}
        activeClassName={"bg-blue-200 text-white"}
        pageClassName={"px-3 py-1 border rounded-lg mr-2"}
        previousClassName={"px-3 py-1 border rounded-lg mr-2"}
        nextClassName={"px-3 py-1 border rounded-lg ml-2"}
      />
      <div className="text-center mt-4 text-gray-600">
        Showing {showingCount} out of {songs.length} records.
      </div>
    </div>
    </div>
  );
};

export default SongList;
