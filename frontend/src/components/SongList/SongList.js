import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Table, Button, Switch, Select } from "antd";
import { getSongs } from "../../services/api";
import {
  Search,
  Music,
  Calendar,
  Filter,
  RefreshCw,
  Award,
} from "lucide-react";

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
  const [yearFilter, setYearFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [artistName, setArtistName] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");
    const filter = queryParams.get("filter");
    setSearchQuery(query || "");
    setOnlyNumberOneHits(filter === "number-one");

    const pathname = location.pathname;
    const artistSlug = pathname.includes("/artist/")
      ? pathname.split("/artist/")[1].split("/")[0]
      : null;
    const yearPath = pathname.includes("/year/")
      ? pathname.split("/year/")[1]
      : null;

    setYearFilter(yearPath || null);
    fetchData(query || "", artistSlug, yearPath, filter === "number-one");
  }, [
    location.pathname,
    location.search,
    page,
    perPage,
    sortField,
    sortOrder,
    onlyNumberOneHits,
    yearFilter,
  ]);

  const fetchData = async (query, artistSlug, year, numberOneFilter) => {
    try {
      setLoading(true);

      let peakRankFilter = numberOneFilter ? "1" : null;

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
          peakRankFilter
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
          peakRankFilter
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
          peakRankFilter
        );
        setArtistName("");
      }

      const songsData = Array.isArray(data) ? data[0] : data;

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
    const artistSlug = location.pathname.includes("/artist/")
      ? location.pathname.split("/artist/")[1].split("/")[0]
      : null;
    const path = artistSlug
      ? `/artist/${artistSlug}`
      : yearFilter
      ? `/year/${yearFilter}`
      : "/songs";

    navigate(
      `${path}${
        query
          ? `?query=${query}&filter=${checked ? "number-one" : ""}`
          : `?filter=${checked ? "number-one" : ""}`
      }`
    );
  };

  const handleYearChange = (value) => {
    setYearFilter(value === "all" ? null : value);

    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");
    const filter = onlyNumberOneHits ? "&filter=number-one" : "";
    const artistSlug = location.pathname.includes("/artist/")
      ? location.pathname.split("/artist/")[1].split("/")[0]
      : null;
    let path =
      value === "all"
        ? artistSlug
          ? `/artist/${artistSlug}`
          : "/songs"
        : `/year/${value}`;

    navigate(`${path}${query ? `?query=${query}${filter}` : filter}`);
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

  const getHeading = () => {
    const containerClass = "flex items-center justify-center gap-2 px-1 py-1";
    const textClass = "bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent";
    const iconClass = "w-8 h-8 text-pink-500"; // Give icons a visible color

    if (yearFilter) {
      return (
        <div className={containerClass}>
          <Calendar className={iconClass} />
          <span className={textClass}>All {yearFilter} hits</span>
        </div>
      );
    }
    if (artistName) {
      return (
        <div className={containerClass}>
          <Music className={iconClass} />
          <span className={textClass}>All hits by {capitalizeWords(artistName)}</span>
        </div>
      );
    }
    if (searchQuery) {
      return (
        <div className={containerClass}>
          <Search className={iconClass} />
          <span className={textClass}>Displaying results for "{searchQuery}"</span>
        </div>
      );
    }
    return (
      <div className={containerClass}>
        <Filter className={iconClass} />
        <span className={textClass}>All hits</span>
      </div>
    );
  };

  return (
    <>
      <h1 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center bg-gradient-to-r from-pink-500 via-purple-600 to-purple-900 bg-clip-text text-transparent">
        {getHeading()}
      </h1>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 rounded-lg">
        <div className="flex items-center bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-sm w-full md:w-1/3 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-pink-500" />
            <span className="text-lg font-semibold mr-4">#1 hits only</span>
          </div>
          <Switch
            onChange={handleSwitchChange}
            checked={onlyNumberOneHits}
            className="transform scale-125 bg-gray-300 checked:bg-pink-500"
          />
        </div>

        <div className="flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-sm w-full md:w-1/3 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-pink-500" />
            <span className="text-lg font-semibold">Jump to year:</span>
          </div>
          <Select
            placeholder="Select Year"
            className="w-full text-lg"
            onChange={handleYearChange}
            value={yearFilter || "all"}
            dropdownRender={(menu) => (
              <div className="text-lg md:text-xl">{menu}</div>
            )}
          >
            <Option value="all">All Years</Option>
            {years.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
        </div>

        <div className="w-full md:w-1/3 flex items-center">
          <Button
            onClick={handleReset}
            className="w-full px-6 py-3 text-lg text-pink-400 hover:text-pink-500 rounded-xl shadow-md flex items-center justify-center transition-all duration-200 ease-in-out"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Reset filters
          </Button>
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
      <div className="mt-6 text-center text-gray-600 bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg shadow-sm inline-block mx-auto">
        Showing <span className="font-bold text-pink-600">{songs.length}</span>{" "}
        of <span className="font-bold text-pink-600">{totalSongs}</span> hit
        songs
      </div>
    </>
  );
};

export default SongList;
