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
  Clipboard,
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
  tagSlug: initialTagSlug,
  tagName,
}) {
  const [songs, setSongs] = useState(initialSongs || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
  const [tagSlug, setTagSlug] = useState(initialTagSlug || null);
  const [disableAutoFetch, setDisableAutoFetch] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const artistParam = params.get("artist");
    if (artistParam) {
      setArtistSlug(artistParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const queryParam = params.get("query");
    if (queryParam !== null && queryParam !== searchQuery) {
      setSearchQuery(queryParam);
    }
  }, [searchParams, searchQuery]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsAuthenticated(!!authToken);
  }, []);

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();

    if (page > 1) params.set("page", page.toString());
    if (perPage !== 25) params.set("per_page", perPage.toString());

    if (onlyNumberOneHits) params.set("filter", "number-one");
    if (onlyUnratedSongs) params.set("unrated", "true");
    if (decadeFilter) params.set("decade", decadeFilter);
    if (searchQuery) params.set("query", searchQuery);
    if (artistSlug) params.set("artist", artistSlug);

    if (sortField) params.set("sort_by", sortField);
    if (sortOrder) params.set("order", sortOrder);

    let path = "/songs";
    if (artistSlug) {
      path = `/artist/${artistSlug}`;
    } else if (yearFilter) {
      path = `/year/${yearFilter}`;
    } else if (tagSlug) {
      path = `/tags/${tagSlug}`;
    }

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
    tagSlug,
    router,
  ]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const peakRankFilter = onlyNumberOneHits ? "1" : null;

      let filterType = null;
      let filterValue = null;

      if (artistSlug) {
        filterType = "artist";
        filterValue = artistSlug;
      } else if (yearFilter) {
        filterType = "year";
        filterValue = yearFilter;
      }

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
        decadeFilter,
        tagSlug,
        authToken  
      );

      setSongs(data.results || []);
      setTotalCount(data.count || 0);
    } catch (error) {
      console.error("Error fetching songs:", error);
      if (error.message && error.message.includes("404")) {
        setError(
          "No results found for this search. Please try different search terms."
        );
      } else {
        setError(
          "An error occurred while fetching songs. Please try again later."
        );
      }
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
    tagSlug,
  ]);

  const getPageTitle = useCallback(() => {
    let prefix = "";
    let base = "Hits";
    let suffix = "";

    if (onlyUnratedSongs) {
      prefix = "Unrated ";
    }

    if (onlyNumberOneHits) {
      prefix = prefix + "#1 ";
    }

    if (artistSlug) {
      const formattedArtistName = artistName || artistSlug.replace(/-/g, " ");
      base = `${formattedArtistName} Hits`;
    } else if (yearFilter) {
      base = `${yearFilter} Hits`;
    } else if (decadeFilter) {
      base = `${decadeFilter}s Hits`;
    } else if (tagName) {
      base = `${tagName} Hits`;
    } else if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    } else {
      base = "All Hits";
    }

    if (decadeFilter && (artistSlug || yearFilter)) {
      suffix = ` from the ${decadeFilter}s`;
    }

    return `${prefix}${base}${suffix}`;
  }, [
    onlyUnratedSongs,
    onlyNumberOneHits,
    artistSlug,
    artistName,
    yearFilter,
    decadeFilter,
    searchQuery,
    tagName,
  ]);

  useEffect(() => {
    try {
      document.title = `${getPageTitle()} | PopHits.org`;

      const h1Element = document.querySelector("h1 span.bg-gradient-to-r");
      if (h1Element) {
        h1Element.textContent = getPageTitle();
      }
    } catch (error) {
      console.error("Error updating page title:", error);
    }
  }, [
    onlyNumberOneHits,
    onlyUnratedSongs,
    decadeFilter,
    yearFilter,
    searchQuery,
    artistSlug,
    artistName,
    getPageTitle,
  ]);

  useEffect(() => {
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
    updateUrl,
  ]);

  useEffect(() => {
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
    fetchData,
  ]);

  const handleNumberOneToggle = (checked) => {
    setOnlyNumberOneHits(checked);
    setPage(1);
  };

  const handleUnratedToggle = (checked) => {
    setOnlyUnratedSongs(checked);
    setPage(1);
  };

  const handleDecadeChange = (decade) => {
    setDecadeFilter(decade === "all" ? null : decade);
    setYearFilter(null);
    setPage(1);
  };

  const handleYearChange = (year) => {
    setYearFilter(year === "all" ? null : year);
    setDecadeFilter(null);
    setPage(1);

    if (year === "all") {
      router.push("/songs");
    } else {
      const query = artistSlug ? `?artist=${artistSlug}` : "";
      router.push(`/year/${year}${query}`);
    }
  };

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

    if (tagSlug) {
      router.push(`/tags/${tagSlug}`); // stay on tag page
    } else {
      router.push("/songs");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleSort = async (field) => {
    setDisableAutoFetch(true);

    let newSortField = field;
    let newSortOrder;

    if (sortField === field) {
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    } else {
      newSortField = field;
      newSortOrder = "asc";
    }

    console.log(`Sorting by ${newSortField} in ${newSortOrder} order`);
    console.log(`Current URL: ${window.location.href}`);

    setSortField(newSortField);
    setSortOrder(newSortOrder);

    try {
      setLoading(true);

      const peakRankFilter = onlyNumberOneHits ? "1" : null;

      let filterType = null;
      let filterValue = null;

      if (artistSlug) {
        filterType = "artist";
        filterValue = artistSlug;
      } else if (yearFilter) {
        filterType = "year";
        filterValue = yearFilter;
      }

      const apiSortOrder = newSortOrder === "desc" ? "-" : "";

      const authToken = isAuthenticated ? localStorage.getItem("authToken") : null;

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
        decadeFilter,
        authToken  
      );

      console.log("API response:", data);

      setSongs(data.results || []);
      setTotalCount(data.count || 0);
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);

      setDisableAutoFetch(false);
    }

    const params = new URLSearchParams(window.location.search);

    params.set("sort_by", newSortField);
    params.set("order", newSortOrder);

    let path = "/songs";
    if (artistSlug) {
      path = `/artist/${artistSlug}`;
    } else if (yearFilter) {
      path = `/year/${yearFilter}`;
    }

    const queryString = params.toString();
    const newUrl = `${path}${queryString ? `?${queryString}` : ""}`;
    console.log("Navigating to:", newUrl);
    router.push(newUrl, { scroll: false });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1958 + 1 }, (_, i) =>
    (1958 + i).toString()
  );

  const currentDecade = Math.floor(currentYear / 10) * 10;
  const decades = Array.from(
    { length: (currentDecade - 1950) / 10 + 1 },
    (_, i) => {
      const decade = 1950 + i * 10;
      return { value: decade.toString(), label: `${decade}s` };
    }
  );

  const totalPages = Math.ceil(totalCount / perPage);
  const showingFrom = (page - 1) * perPage + 1;
  const showingTo = Math.min(page * perPage, totalCount);

  return (
    <div>
      {/* Filters Section */}
      {!artistSlug && (
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          {/* Left Column - Toggle Switches */}
          <div className="w-full md:w-1/3">
            {/* #1 Hits Only Toggle */}
            <div className="bg-yellow-50 p-4 rounded-lg shadow-sm mb-4 flex flex-col items-center gap-2 border border-slate-300">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-600" />
                <span className="text-lg font-medium text-slate-900">
                  #1 hits only
                </span>
              </div>
              <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                <input
                  type="checkbox"
                  id="numberOneToggle"
                  className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border-4 rounded-full appearance-none cursor-pointer peer border-slate-400 checked:border-amber-400 left-0 checked:left-6"
                  checked={onlyNumberOneHits}
                  onChange={(e) => handleNumberOneToggle(e.target.checked)}
                />
                <label
                  htmlFor="numberOneToggle"
                  className="block w-full h-full overflow-hidden rounded-full cursor-pointer bg-slate-300 peer-checked:bg-amber-400"
                ></label>
              </div>
            </div>

            {/* Unrated Songs Toggle */}
            {isAuthenticated && (
              <div className="bg-yellow-50 p-4 rounded-lg shadow-sm flex flex-col items-center gap-2 border border-slate-300">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-amber-600" />
                  <span className="text-lg font-medium text-slate-900">
                    Unrated songs only
                  </span>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                  <input
                    type="checkbox"
                    id="unratedToggle"
                    className="absolute w-6 h-6 transition duration-200 ease-in-out transform bg-white border-4 rounded-full appearance-none cursor-pointer peer border-slate-400 checked:border-slate-900 left-0 checked:left-6"
                    checked={onlyUnratedSongs}
                    onChange={(e) => handleUnratedToggle(e.target.checked)}
                  />
                  <label
                    htmlFor="unratedToggle"
                    className="block w-full h-full overflow-hidden rounded-full cursor-pointer bg-slate-300 peer-checked:bg-slate-900"
                  ></label>
                </div>
              </div>
            )}
          </div>

          {/* Middle Column - Dropdowns */}
          <div className="w-full md:w-1/3">
            {/* Year Filter */}
            <div className="bg-yellow-50 p-4 rounded-lg shadow-sm mb-4 border border-slate-300">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-6 h-6 text-amber-600" />
                <span className="text-lg font-medium text-slate-900">
                  Jump to year:
                </span>
              </div>
              <select
                className="w-full p-2 border border-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-900"
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
            <div className="bg-yellow-50 p-4 rounded-lg shadow-sm border border-slate-300">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-6 h-6 text-amber-600" />
                <span className="text-lg font-medium text-slate-900">
                  Filter by decade:
                </span>
              </div>
              <select
                className="w-full p-2 border border-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-900"
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
            <button
              onClick={handleReset}
              className="w-full bg-yellow-50 p-4 rounded-lg shadow-sm text-amber-700 hover:text-amber-900 flex items-center justify-center gap-2 text-lg font-medium transition-colors h-full border border-slate-300"
            >
              <RefreshCw className="w-5 h-5" />
              Reset all filters
            </button>
          </div>
        </div>
      )}

      {/* Sort Controls */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-4 border border-slate-400">
        <h3 className="text-lg font-medium text-slate-900 mb-2">Sort by:</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSort("title")}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              sortField === "title"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300"
            }`}
          >
            Title {sortField === "title" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("artist")}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              sortField === "artist"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300"
            }`}
          >
            Artist {sortField === "artist" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("year")}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              sortField === "year"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300"
            }`}
          >
            Year {sortField === "year" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("peak_rank")}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              sortField === "peak_rank"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300"
            }`}
          >
            Peak Rank{" "}
            {sortField === "peak_rank" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("average_user_score")}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              sortField === "average_user_score"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300"
            }`}
          >
            Score{" "}
            {sortField === "average_user_score" &&
              (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSort("weeks_on_chart")}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              sortField === "weeks_on_chart"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300"
            }`}
          >
            Weeks{" "}
            {sortField === "weeks_on_chart" &&
              (sortOrder === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>

      {/* Songs List - Desktop View (Table) */}
      <div className="hidden lg:block overflow-x-auto bg-white rounded-xl shadow-md border border-slate-400">
        <table className="min-w-full divide-y divide-slate-300">
          <thead className="bg-slate-50 border-b border-slate-300">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                Title
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                Artist
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                Year
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                Peak Rank
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                Average Score
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-700">
                Weeks on Chart
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-300">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
                    <span className="ml-2 text-slate-700">
                      Loading songs...
                    </span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center">
                  <div className="flex flex-col items-center justify-center py-6">
                    <Search className="w-10 h-10 text-red-500 mb-2" />
                    <span className="text-red-600 font-medium">{error}</span>
                    <button
                      onClick={handleReset}
                      className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-700 transition-colors"
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
                    <Search className="w-10 h-10 text-slate-400 mb-2" />
                    <span className="text-slate-600">No hits found</span>
                  </div>
                </td>
              </tr>
            ) : (
              songs.map((song) => (
                <tr
                  key={song.id}
                  className="hover:bg-yellow-50 transition-colors border-b border-slate-300"
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    <Link
                      href={`/songs/${song.slug}`}
                      className="text-slate-900 font-medium hover:text-amber-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {song.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <Link
                      href={`/artist/${song.artist_slug}`}
                      className="text-amber-700 hover:text-slate-900 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {song.artist}
                    </Link>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <Link
                      href={`/year/${song.year}`}
                      className="text-slate-700 hover:text-amber-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {song.year}
                    </Link>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-slate-900">
                    {song.peak_rank}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {song.average_user_score ? (
                      <span className="bg-amber-100 text-amber-900 px-2 py-1 rounded-full">
                        {song.average_user_score.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-slate-900">
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
          <div className="bg-white rounded-xl shadow-md p-6 text-center border border-slate-400">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
              <span className="ml-2 text-slate-700">Loading songs...</span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center border border-slate-400">
            <div className="flex flex-col items-center justify-center py-6">
              <Search className="w-10 h-10 text-red-500 mb-2" />
              <span className="text-red-600 font-medium">{error}</span>
              <button
                onClick={handleReset}
                className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-700 transition-colors"
              >
                Reset Search
              </button>
            </div>
          </div>
        ) : songs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center border border-slate-400">
            <div className="flex flex-col items-center justify-center py-6">
              <Search className="w-10 h-10 text-slate-400 mb-2" />
              <span className="text-slate-600">No hits found</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {songs.map((song) => (
              <div
                key={song.id}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border border-slate-400"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <Link
                      href={`/songs/${song.slug}`}
                      className="text-lg font-medium text-slate-900 hover:text-amber-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {song.title}
                    </Link>
                    <div className="mt-1">
                      <Link
                        href={`/artist/${song.artist_slug}`}
                        className="text-amber-700 hover:text-slate-900 transition-colors"
                        onClick={(e) => {
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
                      className="text-slate-700 hover:text-amber-700 transition-colors text-sm"
                      onClick={(e) => {
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
                      <span className="text-slate-600">Peak:</span>
                      <span className="font-medium ml-1 text-slate-900">
                        #{song.peak_rank}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600">Weeks:</span>
                      <span className="font-medium ml-1 text-slate-900">
                        {song.weeks_on_chart}
                      </span>
                    </div>
                  </div>
                  <div>
                    {song.average_user_score ? (
                      <span className="bg-amber-100 text-amber-900 px-2 py-1 rounded-full text-xs">
                        {song.average_user_score.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-slate-400">Not rated</span>
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
              className={`px-3 py-1 rounded-md border transition-colors ${
                page === 1
                  ? "bg-slate-50 text-slate-400 cursor-not-allowed border-slate-300"
                  : "bg-white text-slate-800 hover:bg-slate-100 border-slate-300"
              }`}
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-3 py-1 rounded-md border transition-colors ${
                page === 1
                  ? "bg-slate-50 text-slate-400 cursor-not-allowed border-slate-300"
                  : "bg-white text-slate-800 hover:bg-slate-100 border-slate-300"
              }`}
            >
              Prev
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                  className={`px-3 py-1 rounded-md border transition-colors ${
                    page === pageNum
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-800 hover:bg-slate-100 border-slate-300"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded-md border transition-colors ${
                page === totalPages
                  ? "bg-slate-50 text-slate-400 cursor-not-allowed border-slate-300"
                  : "bg-white text-slate-800 hover:bg-slate-100 border-slate-300"
              }`}
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded-md border transition-colors ${
                page === totalPages
                  ? "bg-slate-50 text-slate-400 cursor-not-allowed border-slate-300"
                  : "bg-white text-slate-800 hover:bg-slate-100 border-slate-300"
              }`}
            >
              Last
            </button>
          </nav>
        </div>
      )}

      {/* Results Summary */}
      <div className="mt-6 w-full text-center text-slate-700 bg-yellow-50 p-3 rounded-lg shadow-sm border border-slate-300">
        Showing{" "}
        <span className="font-bold text-amber-700">
          {showingFrom}-{showingTo}
        </span>{" "}
        of <span className="font-bold text-amber-700">{totalCount}</span> hit
        songs
      </div>

      {/* Copy Spotify URLs Button */}
      <div className="flex justify-center mt-4 mb-4">
        <button
          onClick={() => {
            const urls = songs
              .map((song) => song.spotify_url)
              .filter((url) => url)
              .slice(0, 1000);
            if (urls.length > 0) {
              navigator.clipboard.writeText(urls.join("\n"));
              alert(
                `${urls.length} Spotify URL${
                  urls.length === 1 ? "" : "s"
                } copied to clipboard!`
              );
            } else {
              alert("No Spotify URLs to copy!");
            }
          }}
          className="bg-slate-900 hover:bg-slate-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors flex items-center gap-2"
        >
          <Clipboard className="w-5 h-5" />
          Copy Spotify URLs to clipboard
        </button>
      </div>
    </div>
  );
}
