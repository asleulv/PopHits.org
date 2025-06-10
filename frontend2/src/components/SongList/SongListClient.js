"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Filter,
  Calendar,
  Music,
  Star,
  Award,
  RefreshCw,
} from "lucide-react";
import { getSongs } from "@/lib/api";

export default function SongListClient({
  initialSongs,
  totalSongs,
  initialPage,
  initialPerPage,
  initialSortField,
  initialSortOrder,
  initialNumberOneFilter,
  initialUnratedFilter,
  initialDecadeFilter,
  initialSearchQuery,
  artistSlug: initialArtistSlug,
  artistName,
  yearFilter: initialYearFilter,
}) {
  // State
  const [songs, setSongs] = useState(initialSongs || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // New state for error handling
  const [page, setPage] = useState(initialPage || 1);
  const [perPage, setPerPage] = useState(initialPerPage || 25);
  const [totalCount, setTotalCount] = useState(totalSongs || 0);
  const [sortField, setSortField] = useState(initialSortField || null);
  const [sortOrder, setSortOrder] = useState(initialSortOrder || null);
  const [onlyNumberOneHits, setOnlyNumberOneHits] = useState(
    initialNumberOneFilter || false
  );
  const [onlyUnratedSongs, setOnlyUnratedSongs] = useState(
    initialUnratedFilter || false
  );
  const [decadeFilter, setDecadeFilter] = useState(initialDecadeFilter || null);
  const [yearFilter, setYearFilter] = useState(initialYearFilter || null);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || "");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [artistSlug, setArtistSlug] = useState(initialArtistSlug || null);
  // Disable automatic data fetching when sort changes
  const [disableAutoFetch, setDisableAutoFetch] = useState(false);

  // Router and search params
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract artist slug from URL if present
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const artistParam = params.get("artist");
    if (artistParam) {
      setArtistSlug(artistParam);
    }
  }, [searchParams]);

  // Extract search query from URL if present
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const queryParam = params.get("query");
    if (queryParam !== null && queryParam !== searchQuery) {
      setSearchQuery(queryParam);
    }
  }, [searchParams, searchQuery]);

  // Check authentication status on component mount
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsAuthenticated(!!authToken);
  }, []);

  // Function to update URL with current filters
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();

    // Add pagination
    if (page > 1) params.set("page", page.toString());
    if (perPage !== 25) params.set("per_page", perPage.toString());

    // Add filters
    if (onlyNumberOneHits) params.set("filter", "number-one");
    if (onlyUnratedSongs) params.set("unrated", "true");
    if (decadeFilter) params.set("decade", decadeFilter);
    if (searchQuery) params.set("query", searchQuery);
    if (artistSlug) params.set("artist", artistSlug);

    // Add sorting
    if (sortField) params.set("sort_by", sortField);
    if (sortOrder) params.set("order", sortOrder);

    // Determine base path
    let path = "/songs";
    if (artistSlug) {
      path = `/artist/${artistSlug}`;
    } else if (yearFilter) {
      path = `/year/${yearFilter}`;
    }

    // Update URL without refreshing the page
    const queryString = params.toString();
    const newUrl = `${path}${queryString ? `?${queryString}` : ""}`;
    router.push(newUrl, { scroll: false });
  }, [
    page,
    perPage,
    onlyNumberOneHits,
    onlyUnratedSongs,
    decadeFilter,
    searchQuery,
    artistSlug,
    sortField,
    sortOrder,
    yearFilter,
    router,
  ]);

  // Fetch data when filters change
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Reset any previous errors

      const peakRankFilter = onlyNumberOneHits ? "1" : null;

      // Determine filter type and value
      let filterType = null;
      let filterValue = null;

      if (artistSlug) {
        filterType = "artist";
        filterValue = artistSlug;
      } else if (yearFilter) {
        filterType = "year";
        filterValue = yearFilter;
      }

      // Get auth token if available and unrated filter is active
      const authToken = isAuthenticated
        ? localStorage.getItem("authToken")
        : null;

      console.log("Fetching songs with unrated filter:", onlyUnratedSongs);
      console.log("Auth token available:", !!authToken);

      const data = await getSongs(
        page,
        perPage,
        filterType,
        filterValue,
        sortField,
        sortOrder === "desc" ? "-" : "",
        searchQuery,
        peakRankFilter,
        onlyUnratedSongs,
        decadeFilter
      );

      setSongs(data.results || []);
      setTotalCount(data.count || 0);
    } catch (error) {
      console.error("Error fetching songs:", error);
      // Set error state with user-friendly message
      if (error.message && error.message.includes("404")) {
        setError(
          "No results found for this search. Please try different search terms."
        );
      } else {
        setError(
          "An error occurred while fetching songs. Please try again later."
        );
      }
      // Reset songs and total count on error
      setSongs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    perPage,
    artistSlug,
    yearFilter,
    sortField,
    sortOrder,
    searchQuery,
    onlyNumberOneHits,
    onlyUnratedSongs,
    decadeFilter,
    isAuthenticated,
  ]);

  // Generate page title based on filters
  const getPageTitle = useCallback(() => {
    // Start with base title parts
    let prefix = "";
    let base = "Hits";
    let suffix = "";

    // Add unrated prefix if needed
    if (onlyUnratedSongs) {
      prefix = "Unrated ";
    }

    // Add #1 prefix if needed
    if (onlyNumberOneHits) {
      prefix = prefix + "#1 ";
    }

    // Determine the base part of the title
    if (artistSlug) {
      const formattedArtistName = artistName || artistSlug.replace(/-/g, " ");
      base = `${formattedArtistName} Hits`;
    } else if (yearFilter) {
      base = `${yearFilter} Hits`;
    } else if (decadeFilter) {
      base = `${decadeFilter}s Hits`;
    } else if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    } else {
      base = "All Hits";
    }

    // Add decade suffix for artist or year filters
    if (decadeFilter && (artistSlug || yearFilter)) {
      suffix = ` from the ${decadeFilter}s`;
    }

    // Combine all parts
    return `${prefix}${base}${suffix}`;
  }, [
    onlyUnratedSongs,
    onlyNumberOneHits,
    artistSlug,
    artistName,
    yearFilter,
    decadeFilter,
    searchQuery,
  ]);

  // Update document title when filters change
  useEffect(() => {
    // Update the page title and header in a safer way
    try {
      // Update the document title
      document.title = `${getPageTitle()} | PopHits.org`;

      // Update the h1 element text
      const h1Element = document.querySelector("h1 span.bg-gradient-to-r");
      if (h1Element) {
        h1Element.textContent = getPageTitle();
      }

      // Get the icon container
      const iconContainer = document.querySelector("h1 div.flex");
      if (iconContainer) {
        // Create a new icon element based on filters
        let newIcon;

        if (onlyUnratedSongs) {
          newIcon = <Star className="w-8 h-8 text-pink-500" />;
        } else if (onlyNumberOneHits) {
          newIcon = <Award className="w-8 h-8 text-pink-500" />;
        } else if (searchQuery) {
          newIcon = <Search className="w-8 h-8 text-pink-500" />;
        } else if (decadeFilter) {
          newIcon = <Calendar className="w-8 h-8 text-pink-500" />;
        } else if (artistSlug) {
          newIcon = <Music className="w-8 h-8 text-pink-500" />;
        } else if (yearFilter) {
          newIcon = <Calendar className="w-8 h-8 text-pink-500" />;
        } else {
          newIcon = <Filter className="w-8 h-8 text-pink-500" />;
        }

        // Instead of manipulating the DOM directly, we'll update the page title
        // The actual icon will be handled by the SongListPage component on re-render
      }
    } catch (error) {
      console.error("Error updating page title:", error);
      // Don't let this error break the app
    }
  }, [
    onlyNumberOneHits,
    onlyUnratedSongs,
    decadeFilter,
    yearFilter,
    searchQuery,
    artistSlug,
    artistName,
    getPageTitle, // Add getPageTitle to the dependency array
  ]);

  // Update URL when filters change
  useEffect(() => {
    // Only update URL if we're not navigating to an artist or song detail page
    if (
      !window.location.pathname.startsWith("/artist/") &&
      !window.location.pathname.startsWith("/songs/") &&
      !window.location.pathname.startsWith("/year/")
    ) {
      updateUrl();
    }
  }, [
    page,
    perPage,
    sortField,
    sortOrder,
    onlyNumberOneHits,
    onlyUnratedSongs,
    decadeFilter,
    yearFilter,
    searchQuery,
    artistSlug,
    updateUrl, // Add updateUrl to the dependency array
  ]);

  // Fetch data when URL changes
  useEffect(() => {
    // Skip automatic data fetching if manual fetch is in progress
    if (!disableAutoFetch) {
      fetchData();
    }
  }, [
    page,
    perPage,
    sortField,
    sortOrder,
    onlyNumberOneHits,
    onlyUnratedSongs,
    decadeFilter,
    yearFilter,
    searchQuery,
    artistSlug,
    disableAutoFetch,
    fetchData, // Add fetchData to the dependency array
  ]);

  // Handle number one hits toggle
  const handleNumberOneToggle = (checked) => {
    setOnlyNumberOneHits(checked);
    setPage(1); // Reset to first page
  };

  // Handle unrated songs toggle
  const handleUnratedToggle = (checked) => {
    setOnlyUnratedSongs(checked);
    setPage(1); // Reset to first page
  };

  // Handle decade filter change
  const handleDecadeChange = (decade) => {
    setDecadeFilter(decade === "all" ? null : decade);
    setYearFilter(null); // Clear year filter when decade changes
    setPage(1); // Reset to first page
  };

  // Handle year filter change
  const handleYearChange = (year) => {
    setYearFilter(year === "all" ? null : year);
    setDecadeFilter(null); // Clear decade filter when year changes
    setPage(1); // Reset to first page

    // Update URL for year navigation
    if (year === "all") {
      router.push("/songs");
    } else {
      const query = artistSlug ? `?artist=${artistSlug}` : "";
      router.push(`/year/${year}${query}`);
    }
  };

  // Handle reset filters
  const handleReset = () => {
    setPage(1);
    setPerPage(25);
    setSortField(null);
    setSortOrder(null);
    setOnlyNumberOneHits(false);
    setOnlyUnratedSongs(false);
    setDecadeFilter(null);
    setYearFilter(null);
    setSearchQuery("");
    setArtistSlug(null);

    router.push("/songs");
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page
    // Search query is already updated via the input field
  };

  // Handle sort
  const handleSort = async (field) => {
    // Set flag to disable automatic data fetching
    setDisableAutoFetch(true);

    let newSortField = field;
    let newSortOrder;

    if (sortField === field) {
      // Toggle order if same field
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    } else {
      // Default to ascending for new field
      newSortField = field;
      newSortOrder = "asc";
    }

    // Log for debugging
    console.log(`Sorting by ${newSortField} in ${newSortOrder} order`);
    console.log(`Current URL: ${window.location.href}`);

    // Update state with the new sort parameters first
    setSortField(newSortField);
    setSortOrder(newSortOrder);

    // Manually trigger data fetch with new sort parameters
    try {
      setLoading(true);

      const peakRankFilter = onlyNumberOneHits ? "1" : null;

      // Determine filter type and value
      let filterType = null;
      let filterValue = null;

      if (artistSlug) {
        filterType = "artist";
        filterValue = artistSlug;
      } else if (yearFilter) {
        filterType = "year";
        filterValue = yearFilter;
      }

      // Convert sortOrder to the format expected by the API
      const apiSortOrder = newSortOrder === "desc" ? "-" : "";

      // Log the request parameters
      console.log("Fetching with parameters:", {
        page,
        perPage,
        filterType,
        filterValue,
        sortField: newSortField,
        sortOrder: apiSortOrder,
        searchQuery,
        peakRankFilter,
        onlyUnratedSongs,
        decadeFilter,
      });

      // Make the API request
      const data = await getSongs(
        page,
        perPage,
        filterType,
        filterValue,
        newSortField,
        apiSortOrder,
        searchQuery,
        peakRankFilter,
        onlyUnratedSongs,
        decadeFilter
      );

      // Log the response
      console.log("API response:", data);

      // Update state with the new data
      setSongs(data.results || []);
      setTotalCount(data.count || 0);
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);

      // Re-enable automatic data fetching after manual fetch is complete
      setDisableAutoFetch(false);
    }

    // Update URL with new sort parameters
    const params = new URLSearchParams(window.location.search);

    // Update sort parameters
    params.set("sort_by", newSortField);
    params.set("order", newSortOrder);

    // Determine base path
    let path = "/songs";
    if (artistSlug) {
      path = `/artist/${artistSlug}`;
    } else if (yearFilter) {
      path = `/year/${yearFilter}`;
    }

    // Update URL without refreshing the page
    const queryString = params.toString();
    const newUrl = `${path}${queryString ? `?${queryString}` : ""}`;
    console.log("Navigating to:", newUrl);
    router.push(newUrl, { scroll: false });
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  // Generate years for dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1958 + 1 }, (_, i) =>
    (1958 + i).toString()
  );

  // Generate decades for dropdown
  const currentDecade = Math.floor(currentYear / 10) * 10;
  const decades = Array.from(
    { length: (currentDecade - 1950) / 10 + 1 },
    (_, i) => {
      const decade = 1950 + i * 10;
      return { value: decade.toString(), label: `${decade}s` };
    }
  );

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / perPage);
  const showingFrom = (page - 1) * perPage + 1;
  const showingTo = Math.min(page * perPage, totalCount);

  return (
    <div>
      {/* Filters Section */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        {/* Left Column - Toggle Switches */}
        <div className="w-full md:w-1/3">
          {/* #1 Hits Only Toggle */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-orange-300" />
              <span className="text-lg font-medium">#1 hits only</span>
            </div>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
              <input
                type="checkbox"
                id="numberOneToggle"
                className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border-4 rounded-full appearance-none cursor-pointer peer border-gray-300 checked:border-pink-500 left-0 checked:left-6"
                checked={onlyNumberOneHits}
                onChange={(e) => handleNumberOneToggle(e.target.checked)}
              />
              <label
                htmlFor="numberOneToggle"
                className="block w-full h-full overflow-hidden rounded-full cursor-pointer bg-gray-300 peer-checked:bg-pink-500"
              ></label>
            </div>
          </div>

          {/* Unrated Songs Toggle - Only visible when logged in */}
          {isAuthenticated && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-gray-500" />
                <span className="text-lg font-medium">Unrated songs only</span>
              </div>
              <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                <input
                  type="checkbox"
                  id="unratedToggle"
                  className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border-4 rounded-full appearance-none cursor-pointer peer border-gray-300 checked:border-blue-500 left-0 checked:left-6"
                  checked={onlyUnratedSongs}
                  onChange={(e) => handleUnratedToggle(e.target.checked)}
                />
                <label
                  htmlFor="unratedToggle"
                  className="block w-full h-full overflow-hidden rounded-full cursor-pointer bg-gray-300 peer-checked:bg-blue-500"
                ></label>
              </div>
            </div>
          )}
        </div>

        {/* Middle Column - Dropdowns */}
        <div className="w-full md:w-1/3">
          {/* Year Filter */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-6 h-6 text-pink-500" />
              <span className="text-lg font-medium">Jump to year:</span>
            </div>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={yearFilter || "all"}
              onChange={(e) => handleYearChange(e.target.value)}
            >
              <option value="all">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Decade Filter */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-medium">Filter by decade:</span>
            </div>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={decadeFilter || "all"}
              onChange={(e) => handleDecadeChange(e.target.value)}
            >
              <option value="all">All Decades</option>
              {decades.map((decade) => (
                <option key={decade.value} value={decade.value}>
                  {decade.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Column - Reset Button */}
        <div className="w-full md:w-1/3">
          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full bg-gray-50 p-4 rounded-lg shadow-sm text-pink-500 hover:text-pink-600 flex items-center justify-center gap-2 text-lg font-medium transition-colors h-full"
          >
            <RefreshCw className="w-5 h-5" />
            Reset all filters
          </button>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-4">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Sort by:</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSort("title")}
            className={`px-3 py-1 rounded-md text-sm ${
              sortField === "title"
                ? "bg-pink-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Title {sortField === "title" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("artist")}
            className={`px-3 py-1 rounded-md text-sm ${
              sortField === "artist"
                ? "bg-pink-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Artist {sortField === "artist" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("year")}
            className={`px-3 py-1 rounded-md text-sm ${
              sortField === "year"
                ? "bg-pink-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Year {sortField === "year" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("peak_rank")}
            className={`px-3 py-1 rounded-md text-sm ${
              sortField === "peak_rank"
                ? "bg-pink-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Peak Rank{" "}
            {sortField === "peak_rank" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("average_user_score")}
            className={`px-3 py-1 rounded-md text-sm ${
              sortField === "average_user_score"
                ? "bg-pink-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Score{" "}
            {sortField === "average_user_score" &&
              (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("weeks_on_chart")}
            className={`px-3 py-1 rounded-md text-sm ${
              sortField === "weeks_on_chart"
                ? "bg-pink-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Weeks{" "}
            {sortField === "weeks_on_chart" &&
              (sortOrder === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>

      {/* Songs List - Desktop View (Table) */}
      <div className="hidden lg:block overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Title
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Artist
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Year
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Peak Rank
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Average Score
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Weeks on Chart
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                    <span className="ml-2">Loading songs...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center">
                  <div className="flex flex-col items-center justify-center py-6">
                    <Search className="w-10 h-10 text-red-400 mb-2" />
                    <span className="text-red-500 font-medium">{error}</span>
                    <button
                      onClick={handleReset}
                      className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                    >
                      Reset Search
                    </button>
                  </div>
                </td>
              </tr>
            ) : songs.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center">
                  <div className="flex flex-col items-center justify-center py-6">
                    <Search className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-gray-500">No hits found</span>
                  </div>
                </td>
              </tr>
            ) : (
              songs.map((song) => (
                <tr
                  key={song.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    <Link
                      href={`/songs/${song.slug}`}
                      className="text-gray-900 font-medium hover:text-pink-600 transition-colors"
                      onClick={(e) => {
                        // Prevent the updateUrl effect from running
                        e.stopPropagation();
                      }}
                    >
                      {song.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <Link
                      href={`/artist/${song.artist_slug}`}
                      className="text-pink-600 hover:text-gray-900 transition-colors"
                      onClick={(e) => {
                        // Prevent the updateUrl effect from running
                        e.stopPropagation();
                      }}
                    >
                      {song.artist}
                    </Link>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <Link
                      href={`/year/${song.year}`}
                      className="text-blue-600 hover:text-pink-600 transition-colors"
                      onClick={(e) => {
                        // Prevent the updateUrl effect from running
                        e.stopPropagation();
                      }}
                    >
                      {song.year}
                    </Link>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {song.peak_rank}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {song.average_user_score ? (
                      <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                        {song.average_user_score.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {song.weeks_on_chart}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Songs List - Mobile View (Cards) */}
      <div className="lg:hidden">
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
              <span className="ml-2">Loading songs...</span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="flex flex-col items-center justify-center py-6">
              <Search className="w-10 h-10 text-red-400 mb-2" />
              <span className="text-red-500 font-medium">{error}</span>
              <button
                onClick={handleReset}
                className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
              >
                Reset Search
              </button>
            </div>
          </div>
        ) : songs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="flex flex-col items-center justify-center py-6">
              <Search className="w-10 h-10 text-gray-400 mb-2" />
              <span className="text-gray-500">No hits found</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {songs.map((song) => (
              <div
                key={song.id}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      href={`/songs/${song.slug}`}
                      className="text-lg font-medium text-gray-900 hover:text-pink-600 transition-colors"
                      onClick={(e) => {
                        // Prevent the updateUrl effect from running
                        e.stopPropagation();
                      }}
                    >
                      {song.title}
                    </Link>
                    <div className="mt-1">
                      <Link
                        href={`/artist/${song.artist_slug}`}
                        className="text-pink-600 hover:text-gray-900 transition-colors"
                        onClick={(e) => {
                          // Prevent the updateUrl effect from running
                          e.stopPropagation();
                        }}
                      >
                        {song.artist}
                      </Link>
                    </div>
                  </div>
                  <div className="text-right">
                    <Link
                      href={`/year/${song.year}`}
                      className="text-blue-600 hover:text-pink-600 transition-colors text-sm"
                      onClick={(e) => {
                        // Prevent the updateUrl effect from running
                        e.stopPropagation();
                      }}
                    >
                      {song.year}
                    </Link>
                  </div>
                </div>

                <div className="mt-3 flex justify-between text-sm">
                  <div className="flex space-x-4">
                    <div>
                      <span className="text-gray-500">Peak:</span>
                      <span className="font-medium ml-1">
                        #{song.peak_rank}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Weeks:</span>
                      <span className="font-medium ml-1">
                        {song.weeks_on_chart}
                      </span>
                    </div>
                  </div>
                  <div>
                    {song.average_user_score ? (
                      <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">
                        {song.average_user_score.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-gray-400">Not rated</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={page === 1}
              className={`px-3 py-1 rounded-md ${
                page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-3 py-1 rounded-md ${
                page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Prev
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded-md ${
                    page === pageNum
                      ? "bg-pink-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded-md ${
                page === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded-md ${
                page === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Last
            </button>
          </nav>
        </div>
      )}

      {/* Results Summary */}
      <div className="mt-6 w-full text-center text-gray-600 bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg shadow-sm">
        Showing{" "}
        <span className="font-bold text-pink-600">
          {showingFrom}-{showingTo}
        </span>{" "}
        of <span className="font-bold text-pink-600">{totalCount}</span> hit
        songs
      </div>
    </div>
  );
}
