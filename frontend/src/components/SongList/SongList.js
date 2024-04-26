import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Table, Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getSongs } from "../../services/api";

const SongTable = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [totalSongs, setTotalSongs] = useState(0);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [searchText, setSearchText] = useState("");
  const location = useLocation();

  useEffect(() => {
    fetchData();
  }, [page, perPage, sortField, sortOrder, searchText, location]);

  const fetchData = async () => {
    try {
      setLoading(true);
  
      const pathname = location.pathname;
      const artistSlug = pathname.split("/artist/")[1];
      const year = pathname.split("/year/")[1];
  
      let data;
  
      if (artistSlug) {
        data = await getSongs(page, perPage, "artist", artistSlug, sortField, sortOrder, searchText);
      } else if (year) {
        data = await getSongs(page, perPage, "year", year, sortField, sortOrder, searchText);
      } else {
        data = await getSongs(page, perPage, null, null, sortField, sortOrder, searchText);
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

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleReset = () => {
    setSearchText(""); // Clear search text
    setPage(1); // Reset page to 1
    setPerPage(25); // Reset items per page to default
    setSortField(null); // Reset sort field
    setSortOrder(null); // Reset sort order

    // Navigate to the initial table route
    navigate("/songs");
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: true,
      render: (text, record) => <Link to={`/songs/${record.slug}`}>{text}</Link>,
    },
    {
      title: "Artist",
      dataIndex: "artist",
      key: "artist",
      sorter: true,
      render: (text, record) => <Link to={`/artist/${record.artist_slug}`}>{text}</Link>,
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      sorter: true,
      render: (text, record) => <Link to={`/year/${text}`}>{text}</Link>,
    },
    {
      title: "Peak Rank",
      dataIndex: "peak_rank",
      key: "peak_rank",
      sorter: true,
    },
    {
      title: "Average Score",
      dataIndex: "average_user_score",
      key: "average_user_score",
      sorter: true,
    },
  ];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, padding: 8 }}>
        <Space>
          <Input.Search
            placeholder="Search artist/title"
            onSearch={handleSearch}
            enterButton={<SearchOutlined />}
            allowClear
            style={{ width: 300 }}
          />
          <Button onClick={handleReset}>Reset</Button>
        </Space>
      </div>
      <div style={{ overflowX: "auto" }}>
        <Table
          dataSource={songs}
          columns={columns}
          loading={loading}
          pagination={{
            current: page,
            pageSize: perPage,
            total: totalSongs,
            onChange: (newPage) => {
              setPage(newPage);
            },
            onShowSizeChange: (current, newSize) => {
              setPage(1);
              setPerPage(newSize);
            },
          }}
          onChange={handleTableChange}
        />
      </div>
      <div style={{ marginTop: 16 }}>
        Showing {songs.length} of {totalSongs} hit songs
      </div>
    </>
  );
};

export default SongTable;
