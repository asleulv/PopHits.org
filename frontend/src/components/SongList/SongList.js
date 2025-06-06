import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Table, Switch, Select } from "antd";
import { getSongs } from "../../services/api";
import {
  Search,
  Music,
  Calendar,
  Filter,
  RefreshCw,
  Award,
  Star,
} from "lucide-react";
import { useAuth } from "../../services/auth";

const { Option } = Select;

const SongList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [totalSongs, setTotalSongs] = useState(0);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [onlyNumberOneHits, setOnlyNumberOneHits] = useState(false);
  const [onlyUnratedSongs, setOnlyUnratedSongs] = useState(false);
  const [yearFilter, setYearFilter] = useState(null);
  const [decadeFilter, setDecadeFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [artistName, setArtistName] = useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);

    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");
    const filter = queryParams.get("filter");
    const unratedFilter = queryParams.get("unrated");
    const decadeParam = queryParams.get("decade");
    const sortByParam = queryParams.get("sort_by");
    const orderParam = queryParams.get("order");

    setSearchQuery(query || "");
    setOnlyNumberOneHits(filter === "number-one");
    setOnlyUnratedSongs(unratedFilter === "true");
    setDecadeFilter(decadeParam || null);
    
    // Set sorting parameters from URL if present
    if (sortByParam) {
      setSortField(sortByParam);
    }
    if (orderParam) {
      setSortOrder(orderParam === "desc" ? "-" : "");
    }

    const pathname = location.pathname;
    const artistSlug = pathname.includes("/artist/")
      ? pathname.split("/artist/")[1].split("/")[0]
      : null;
    const yearPath = pathname.includes("/year/")
      ? pathname.split("/year/")[1]
      : null;

    setYearFilter(yearPath || null);
    fetchData(
      query || "",
      artistSlug,
      yearPath,
      filter === "number-one",
      unratedFilter === "true",
      decadeParam
    );
  }, [
    location.pathname,
    location.search,
    page,
    perPage,
    sortField,
    sortOrder,
    onlyNumberOneHits,
    onlyUnratedSongs,
    yearFilter,
  ]);

  const fetchData = async (
    query,
    artistSlug,
    year,
    numberOneFilter,
    unratedOnly = false,
    decade = null
  ) => {
    try {
      setLoading(true);

      let peakRankFilter = numberOneFilter ? "1" : null;

      // Log the unratedOnly parameter to verify it's being passed correctly
      console.log("Fetching data with unratedOnly:", unratedOnly);

      // Log decade filter
      console.log("Decade filter:", decade);

      let data;
      if (artistSlug) {
        data = await getSongs(
          page,
          perPage,
          "artist",
          artistSlug,
          sortField,
          sortOrder,
          query,
          peakRankFilter,
          unratedOnly,
          decade
        );
        setArtistName(artistSlug.replace(/-/g, " "));
      } else if (year) {
        data = await getSongs(
          page,
          perPage,
          "year",
          year,
          sortField,
          sortOrder,
          query,
          peakRankFilter,
          unratedOnly,
          decade
        );
        setArtistName("");
      } else {
        data = await getSongs(
          page,
          perPage,
          null,
          null,
          sortField,
          sortOrder,
          query,
          peakRankFilter,
          unratedOnly,
          decade
        );
        setArtistName("");
      }

      // Log the response to see if the backend is returning filtered results
      console.log("API response:", data);

      const songsData = Array.isArray(data) ? data[0] : data;

      // Log detailed information about the response
      console.log("Songs data:", songsData);
      console.log("Total songs count:", songsData.count);
      console.log("Unrated filter active:", unratedOnly);

      // Check if the backend is actually filtering
      if (unratedOnly) {
        console.log(
          "Expected: Total count should be less than 24271 if filtering is working"
        );
      }

      setSongs(songsData.results);
      setTotalSongs(songsData.count);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    if (sorter && sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order === "descend" ? "-" : "");
    }
    setPage(pagination.current);
    setPerPage(pagination.pageSize);
  };

  const handleReset = () => {
    setPage(1);
    setPerPage(25);
    setSortField(null);
    setSortOrder(null);
    setOnlyNumberOneHits(false);
    setOnlyUnratedSongs(false);
    setYearFilter(null);
    setSearchQuery("");

    const artistSlug = location.pathname.includes("/artist/")
      ? location.pathname.split("/artist/")[1].split("/")[0]
      : null;

    if (artistSlug) {
      navigate(`/artist/${artistSlug}`);
    } else {
      navigate("/songs");
    }
  };

  const handleSwitchChange = (checked) => {
    setOnlyNumberOneHits(checked);

    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");
    const decade = queryParams.get("decade");
    const artistSlug = location.pathname.includes("/artist/")
      ? location.pathname.split("/artist/")[1].split("/")[0]
      : null;
    const path = artistSlug
      ? `/artist/${artistSlug}`
      : yearFilter
      ? `/year/${yearFilter}`
      : "/songs";

    // Create a new URLSearchParams object to build the query properly
    const newParams = new URLSearchParams();
    
    // Add existing query if present
    if (query) {
      newParams.append("query", query);
    }
    
    // Add decade parameter if present
    if (decade) {
      newParams.append("decade", decade);
    }
    
    // Add number one filter if checked
    if (checked) {
      newParams.append("filter", "number-one");
    }
    
    // Add unrated filter if active
    if (onlyUnratedSongs) {
      newParams.append("unrated", "true");
    }
    
    // Preserve sort parameters if they exist
    if (sortField) {
      newParams.append("sort_by", sortField);
    }
    if (sortOrder) {
      newParams.append("order", sortOrder === "-" ? "desc" : "asc");
    }

    // Convert params to string and navigate
    const paramString = newParams.toString();
    navigate(`${path}${paramString ? `?${paramString}` : ""}`);
  };

  const handleUnratedSwitchChange = (checked) => {
    setOnlyUnratedSongs(checked);

    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");
    const decade = queryParams.get("decade");
    const artistSlug = location.pathname.includes("/artist/")
      ? location.pathname.split("/artist/")[1].split("/")[0]
      : null;
    const path = artistSlug
      ? `/artist/${artistSlug}`
      : yearFilter
      ? `/year/${yearFilter}`
      : "/songs";

    // Create a new URLSearchParams object to build the query properly
    const newParams = new URLSearchParams();

    // Add existing query if present
    if (query) {
      newParams.append("query", query);
    }

    // Add decade parameter if present
    if (decade) {
      newParams.append("decade", decade);
    }

    // Add number one filter if active
    if (onlyNumberOneHits) {
      newParams.append("filter", "number-one");
    }

    // Add unrated filter if checked
    if (checked) {
      newParams.append("unrated", "true");
    }
    
    // Preserve sort parameters if they exist
    if (sortField) {
      newParams.append("sort_by", sortField);
    }
    if (sortOrder) {
      newParams.append("order", sortOrder === "-" ? "desc" : "asc");
    }

    // Convert params to string and navigate
    const paramString = newParams.toString();
    navigate(`${path}${paramString ? `?${paramString}` : ""}`);
  };

  const handleYearChange = (value) => {
    setYearFilter(value === "all" ? null : value);

    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");
    const artistSlug = location.pathname.includes("/artist/")
      ? location.pathname.split("/artist/")[1].split("/")[0]
      : null;
    let path =
      value === "all"
        ? artistSlug
          ? `/artist/${artistSlug}`
          : "/songs"
        : `/year/${value}`;

    // Create a new URLSearchParams object to build the query properly
    const newParams = new URLSearchParams();

    // Add existing query if present
    if (query) {
      newParams.append("query", query);
    }

    // Add number one filter if active
    if (onlyNumberOneHits) {
      newParams.append("filter", "number-one");
    }

    // Add unrated filter if active
    if (onlyUnratedSongs) {
      newParams.append("unrated", "true");
    }
    
    // Preserve sort parameters if they exist
    if (sortField) {
      newParams.append("sort_by", sortField);
    }
    if (sortOrder) {
      newParams.append("order", sortOrder === "-" ? "desc" : "asc");
    }

    // Convert params to string and navigate
    const paramString = newParams.toString();
    navigate(`${path}${paramString ? `?${paramString}` : ""}`);
  };

  const capitalizeWords = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: true,
      render: (text, record) => (
        <Link to={`/songs/${record.slug}`}>
          <strong>{text}</strong>
        </Link>
      ),
      width: 250,
    },
    {
      title: "Artist",
      dataIndex: "artist",
      key: "artist",
      sorter: true,
      render: (text, record) => (
        <Link to={`/artist/${record.artist_slug}`}>{text}</Link>
      ),
      width: 200,
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      sorter: true,
      render: (text, record) => <Link to={`/year/${text}`}>{text}</Link>,
      width: 120,
    },
    {
      title: "Peak Rank",
      dataIndex: "peak_rank",
      key: "peak_rank",
      sorter: true,
      width: 120,
    },
    {
      title: "Average Score",
      dataIndex: "average_user_score",
      key: "average_user_score",
      sorter: true,
      width: 150,
    },
    {
      title: "Weeks on Chart",
      dataIndex: "weeks_on_chart",
      key: "weeks_on_chart",
      sorter: true,
      width: 150,
    },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1958 + 1 }, (_, i) =>
    (1958 + i).toString()
  );

  // Generate decades from 1950s to current decade
  const currentDecade = Math.floor(currentYear / 10) * 10;
  const decades = Array.from(
    { length: (currentDecade - 1950) / 10 + 1 },
    (_, i) => {
      const decade = 1950 + i * 10;
      return { value: decade.toString(), label: `${decade}s` };
    }
  );

  const getHeading = () => {
    const containerClass = "flex items-center justify-center gap-2 px-1 py-1";
    const textClass =
      "bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent";
    const iconClass = "w-8 h-8 text-pink-500"; // Give icons a visible color

    // Add "Unrated" prefix if unrated filter is active
    const unratedPrefix = onlyUnratedSongs ? "Unrated " : "";
    // Add "#1" prefix if number one filter is active
    const numberOnePrefix = onlyNumberOneHits ? "#1 " : "";

    if (yearFilter) {
      return (
        <div className={containerClass}>
          <Calendar className={iconClass} />
          <span className={textClass}>
            {unratedPrefix}
            {numberOnePrefix}
            {yearFilter} hits
          </span>
        </div>
      );
    }
    if (decadeFilter) {
      // Format decade as "1950s", "1960s", etc.
      const decadeLabel = `${decadeFilter}s`;
      return (
        <div className={containerClass}>
          <Calendar className={iconClass} style={{ color: "#3b82f6" }} />
          <span className={textClass}>
            {unratedPrefix}
            {numberOnePrefix}
            {decadeLabel} hits
          </span>
        </div>
      );
    }
    if (artistName) {
      return (
        <div className={containerClass}>
          <Music className={iconClass} />
          <span className={textClass}>
            {unratedPrefix}
            {numberOnePrefix}hits by {capitalizeWords(artistName)}
          </span>
        </div>
      );
    }
    if (searchQuery) {
      return (
        <div className={containerClass}>
          <Search className={iconClass} />
          <span className={textClass}>
            Displaying {unratedPrefix}
            {numberOnePrefix}results for "{searchQuery}"
          </span>
        </div>
      );
    }

    // Default heading
    let headingText = "All hits";
    if (onlyUnratedSongs && onlyNumberOneHits) {
      headingText = "Unrated #1 hits";
    } else if (onlyUnratedSongs) {
      headingText = "Unrated hits";
    } else if (onlyNumberOneHits) {
      headingText = "#1 hits only";
    }

    return (
      <div className={containerClass}>
        {onlyUnratedSongs ? (
          <Star className={iconClass} />
        ) : (
          <Filter className={iconClass} />
        )}
        <span className={textClass}>{headingText}</span>
      </div>
    );
  };

  return (
    <>
      <h1 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center bg-gradient-to-r from-pink-500 via-purple-600 to-purple-900 bg-clip-text text-transparent">
        {getHeading()}
      </h1>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        {/* Left Column - Toggle Switches */}
        <div className="w-full md:w-1/3">
          {/* #1 Hits Only Toggle */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-orange-300" />
              <span className="text-lg font-medium">#1 hits only</span>
            </div>
            <Switch
              onChange={handleSwitchChange}
              checked={onlyNumberOneHits}
              className="transform scale-125 bg-gray-300 checked:bg-pink-500"
            />
          </div>

          {/* Unrated Songs Toggle - Only visible when logged in */}
          {isAuthenticated && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-gray-500" />
                <span className="text-lg font-medium">Unrated songs only</span>
              </div>
              <Switch
                onChange={handleUnratedSwitchChange}
                checked={onlyUnratedSongs}
                className="transform scale-125 bg-gray-300 checked:bg-blue-500"
              />
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
            <Select
              placeholder="Select Year"
              className="w-full"
              onChange={handleYearChange}
              value={yearFilter || "all"}
            >
              <Option value="all">All Years</Option>
              {years.map((year) => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
          </div>

          {/* Decade Filter */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-medium">Filter by decade:</span>
            </div>
            <Select
              placeholder="Select Decade"
              className="w-full"
              onChange={(value) => {
                // Reset year filter when decade is selected
                setYearFilter(null);
                setDecadeFilter(value === "all" ? null : value);

                // Build the URL for decade filtering
                const queryParams = new URLSearchParams(location.search);
                const query = queryParams.get("query");

                // Create a new URLSearchParams object to build the query properly
                const newParams = new URLSearchParams();

                // Add existing query if present
                if (query) {
                  newParams.append("query", query);
                }

                // Add decade parameter if not "all"
                if (value !== "all") {
                  newParams.append("decade", value);
                }

                // Add number one filter if active
                if (onlyNumberOneHits) {
                  newParams.append("filter", "number-one");
                }

                // Add unrated filter if active
                if (onlyUnratedSongs) {
                  newParams.append("unrated", "true");
                }
                
                // Preserve sort parameters if they exist
                if (sortField) {
                  newParams.append("sort_by", sortField);
                }
                if (sortOrder) {
                  newParams.append("order", sortOrder === "-" ? "desc" : "asc");
                }

                // Convert params to string and navigate
                const paramString = newParams.toString();
                navigate(`/songs${paramString ? `?${paramString}` : ""}`);
              }}
              value={decadeFilter || "all"}
            >
              <Option value="all">All Decades</Option>
              {decades.map((decade) => (
                <Option key={decade.value} value={decade.value}>
                  {decade.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        {/* Right Column - Reset Button */}
        <div className="w-full md:w-1/3 flex items-center">
          <button
            onClick={handleReset}
            className="w-full bg-gray-50 p-4 rounded-lg shadow-sm text-pink-500 hover:text-pink-600 flex items-center justify-center gap-2 text-lg font-medium transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Reset filters
          </button>
        </div>
      </div>
      <div className="block md:hidden text-center mb-2 text-gray-500">
        <span>Swipe left/right to view more columns</span>
      </div>
      <div className="table-container overflow-x-auto bg-white rounded-xl shadow-md">
        <style>
          {`
            .ant-table-thead > tr > th {
              background-color: #f9f9f9 !important;
              color: #333 !important;
              font-weight: bold !important;
              padding: 12px 16px !important;
              border-bottom: 2px solid #eaeaea !important;
            }
            .ant-table-tbody > tr > td {
              padding: 10px 16px !important;
              transition: background-color 0.3s ease !important;
            }
            .ant-table-tbody > tr:hover > td {
              background-color: #f5f5f5 !important;
            }
            .ant-table-tbody > tr:nth-child(even) {
              background-color: #fafafa;
            }
            .ant-pagination-item-active {
              border-color: #ec4899 !important;
            }
            .ant-pagination-item-active a {
              color: #ec4899 !important;
            }
            .ant-table-column-sorter-up.active, .ant-table-column-sorter-down.active {
              color: #ec4899 !important;
            }
            .custom-pagination {
  display: flex !important;
  justify-content: center !important;
  margin-top: 1rem;
}
          `}
        </style>
        <Table
          dataSource={songs}
          columns={columns}
          loading={loading}
          rowClassName="hover:bg-gray-50 transition-colors"
          pagination={{
            current: page,
            pageSize: perPage,
            total: totalSongs,
            onChange: (newPage) => setPage(newPage),
            onShowSizeChange: (current, newSize) => {
              setPage(1);
              setPerPage(newSize);
            },
            showSizeChanger: true,
            pageSizeOptions: ["10", "25", "50", "100"],
            className: "custom-pagination",
          }}
          onChange={handleTableChange}
          locale={{
            emptyText: (
              <div className="flex flex-col items-center justify-center py-8">
                <Search className="w-10 h-10 text-gray-400 mb-2" />
                <span className="text-gray-500">No hits found</span>
              </div>
            ),
          }}
        />
      </div>
      <div className="mt-6 w-full text-center text-gray-600 bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg shadow-sm">
        Showing <span className="font-bold text-pink-600">{songs.length}</span>{" "}
        of <span className="font-bold text-pink-600">{totalSongs}</span> hit
        songs
      </div>
    </>
  );
};

export default SongList;
