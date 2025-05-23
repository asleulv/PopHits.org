import React, { useState } from "react";
import { Button, Select, Table, Spin, message } from "antd";
import { generatePlaylist } from "../../services/api";
import { Music, RefreshCw, Copy, Filter, Calendar, BarChart2 } from "lucide-react";

const { Option } = Select;

const PlaylistGenerator = () => {
  const [numSongs, setNumSongs] = useState(10);
  const [hitLevel, setHitLevel] = useState(1);
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [selectedDecades, setSelectedDecades] = useState([
    "1950",
    "1960",
    "1970",
    "1980",
    "1990",
    "2000",
    "2010",
    "2020",
  ]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGeneratePlaylist = async () => {
    setLoading(true);
    setErrorMessage(""); // Clear previous error message
    try {
      console.log("Generating playlist with params:", {
        numSongs,
        hitLevel,
        selectedDecades,
      });
      const data = await generatePlaylist(numSongs, hitLevel, selectedDecades);
      if (data.length === 0) {
        setErrorMessage("No songs match the criteria.");
      } else {
        setPlaylist(data);
      }
    } catch (error) {
      console.error("Failed to generate playlist:", error);
      setErrorMessage("No songs available for the given criteria.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle copying all URLs to clipboard
  const handleCopyAllUrls = () => {
    const songUrls = playlist.map((song) => song.spotify_url).join("\n");
    navigator.clipboard.writeText(songUrls)
      .then(() => message.success("All song URLs copied to clipboard!"))
      .catch(() => message.error("Failed to copy song URLs."));
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => <strong>{text}</strong>,
    },
    {
      title: "Artist",
      dataIndex: "artist",
      key: "artist",
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Peak Rank",
      dataIndex: "peak_rank",
      key: "peak_rank",
    },
  ];

  const decadesOptions = [
    { label: "1950s", value: "1950" },
    { label: "1960s", value: "1960" },
    { label: "1970s", value: "1970" },
    { label: "1980s", value: "1980" },
    { label: "1990s", value: "1990" },
    { label: "2000s", value: "2000" },
    { label: "2010s", value: "2010" },
    { label: "2020s", value: "2020" },
  ];

  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-2xl md:text-4xl px-1 py-1 font-cherry font-bold mb-6 text-center text-pink-500 flex items-center justify-center gap-3">
  <Music className="w-8 h-8" />
  <span>Hit Song Playlist Generator</span>
</h1>



      {/* Introduction */}
      <div className="mb-8">
        <p className="text-center text-gray-700 text-lg max-w-3xl mx-auto">
          Generate custom playlists of hit songs by selecting decades and popularity levels.
          Perfect for discovering both chart-toppers and hidden gems from your favorite eras.
        </p>
      </div>

      {/* Container to match the width */}
      <div className="w-full">
        {/* Decades filter - Full-width frame */}
        <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-6 h-6 text-pink-500" />
            <span className="text-lg font-semibold text-gray-700">
              Select Decades:
            </span>
          </div>
          <Select
            mode="multiple"
            value={selectedDecades}
            onChange={(values) => setSelectedDecades(values)}
            className="w-full"
            placeholder="Select one or more decades"
            maxTagCount={6}
          >
            {decadesOptions.map(({ label, value }) => (
              <Option key={value} value={value}>
                {label}
              </Option>
            ))}
          </Select>
        </div>

        {/* Three columns layout */}
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
          {/* First column: Select Number of Songs */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-sm w-full md:w-1/3 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <Music className="w-6 h-6 text-pink-500" />
              <span className="text-lg font-semibold text-gray-700">
                Number of Songs:
              </span>
            </div>
            <Select
              value={numSongs}
              onChange={(value) => setNumSongs(value)}
              className="w-full"
              size="large"
            >
              {[10, 20, 25, 50, 100].map((num) => (
                <Option key={num} value={num}>
                  {num} songs
                </Option>
              ))}
            </Select>
          </div>

          {/* Second column: Hit Size */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-sm w-full md:w-1/3 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <BarChart2 className="w-6 h-6 text-pink-500" />
              <span className="text-lg font-semibold text-gray-700">
                Hit Level:
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">1 = #1 hits, 10 = obscure hits</p>
            <Select
              value={hitLevel}
              onChange={(value) => setHitLevel(value)}
              className="w-full"
              size="large"
            >
              {[...Array(10).keys()].map((level) => (
                <Option key={level + 1} value={level + 1}>
                  Level {level + 1}
                </Option>
              ))}
            </Select>
          </div>

          {/* Third column: Buttons */}
          <div className="flex flex-col justify-end gap-4 w-full md:w-1/3">
            <Button
              onClick={handleGeneratePlaylist}
              className="w-full px-6 py-3 text-lg text-pink-400 hover:text-pink-500 rounded-xl shadow-md flex items-center justify-center transition-all duration-200 ease-in-out"
              size="large"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Generate Playlist
            </Button>

            {/* Copy All URLs Button */}
            {playlist.length > 0 && (
              <Button
                onClick={handleCopyAllUrls}
                className="w-full px-6 py-3 text-lg text-pink-400 hover:text-pink-500 rounded-xl shadow-md flex items-center justify-center transition-all duration-200 ease-in-out"
                size="large"
              >
                <Copy className="w-5 h-5 mr-2" />
                Copy All URLs
              </Button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Spin size="large" tip={<span className="mt-3 text-gray-600">Generating your custom playlist...</span>} />
          </div>
        </div>
      ) : (
        <>
          {errorMessage ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mt-6 text-center">
              <p className="font-medium">{errorMessage}</p>
              <p className="text-sm mt-2">Try adjusting your filters to find more songs.</p>
            </div>
          ) : (
            playlist.length > 0 && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6">
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
                  `}
                </style>
                <Table
                  dataSource={playlist}
                  columns={columns}
                  rowKey="id"
                  pagination={false}
                  rowClassName="hover:bg-gray-50 transition-colors"
                />
                
                <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
                  <p className="text-gray-600">
                    <span className="font-medium">{playlist.length}</span> songs generated based on your criteria
                  </p>
                </div>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default PlaylistGenerator;
