import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Table, Button, Switch, Select } from "antd";
import { getSongs } from "../../services/api";

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

  const years = Array.from({ length: 51 }, (_, i) => (1958 + i).toString());

  const getHeading = () => {
    if (yearFilter) {
      return `📅
 All ${yearFilter} hits`;
    }
    if (artistName) {
      return `🎤 All hits by ${capitalizeWords(artistName)}`;
    }
    if (searchQuery) {
      return `🔍 Displaying results for "${searchQuery}"`;
    }
    return "🧾 All hits";
  };

  return (
    <>
      <div className="text-center my-4 text-xl font-bold">{getHeading()}</div>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4 p-4 rounded-lg">
        <div className="flex items-center border border-gray-300 p-4 bg-gray-50 w-full md:w-1/3">
          <span className="text-lg font-semibold mr-4">#1 hits filter</span>
          <Switch
            onChange={handleSwitchChange}
            checked={onlyNumberOneHits}
            className="transform scale-125 bg-gray-300 checked:bg-blue-600"
          />
        </div>

        <div className="flex flex-col border border-gray-300 p-4 bg-gray-50 w-full md:w-1/3">
          <span className="mb-2 text-lg font-semibold">Jump to year:</span>
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
            className="w-full px-6 py-3 text-lg text-white border border-pink-300 rounded flex items-center justify-center hover:bg-blue-600 bg-pink-400"
          >
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Reset filters
          </Button>
        </div>
      </div>
      <div className="block md:hidden text-center mb-2 text-gray-500">
        <span>Swipe left/right to view more columns</span>
      </div>
      <div className="table-container overflow-x-auto">
        <Table
          dataSource={songs}
          columns={columns}
          loading={loading}
          pagination={{
            current: page,
            pageSize: perPage,
            total: totalSongs,
            onChange: (newPage) => setPage(newPage),
            onShowSizeChange: (current, newSize) => {
              setPage(1);
              setPerPage(newSize);
            },
          }}
          onChange={handleTableChange}
        />
      </div>
      <div className="mt-4 text-center">
        Showing {songs.length} of {totalSongs} hit songs
      </div>
    </>
  );
};

export default SongList;
