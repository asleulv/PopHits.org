import React, { useState } from "react";
import { Button, Select, Table, Spin, message } from "antd";
import { generatePlaylist } from "../../services/api";

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
      <h1 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center">
        🤖 Hit Song Playlist Generator
      </h1>

      {/* Introduction */}
      <div className="mb-4">
        <p className="mb-6 text-center md:text-left text-sm md:text-lg">
          Generate your random hit playlists and filter on decades and how
          big/obscure hits you want to include.
        </p>
      </div>

      {/* Container to match the width */}
      <div className="w-full">
        {/* Decades filter - Full-width frame */}
        <div className="mb-4 border border-gray-300 p-4 bg-gray-50 w-full">
          <span className="block mb-2 text-lg font-semibold">
            Select Decades:
          </span>
          <Select
            mode="multiple"
            value={selectedDecades}
            onChange={(values) => setSelectedDecades(values)}
            className="w-full"
          >
            {decadesOptions.map(({ label, value }) => (
              <Option key={value} value={value}>
                {label}
              </Option>
            ))}
          </Select>
        </div>

        {/* Three columns layout */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          {/* First column: Select Number of Songs */}
          <div className="flex flex-col border border-gray-300 p-4 bg-gray-50 w-full md:w-1/3">
            <span className="mb-2 text-lg font-semibold">
              Select Number of Songs:
            </span>
            <Select
              value={numSongs}
              onChange={(value) => setNumSongs(value)}
              className="w-full text-lg"
            >
              {[10, 20, 25, 50, 100].map((num) => (
                <Option key={num} value={num}>
                  {num}
                </Option>
              ))}
            </Select>
          </div>

          {/* Second column: Hit Size */}
          <div className="flex flex-col border border-gray-300 p-4 bg-gray-50 w-full md:w-1/3">
            <span className="mb-2 text-lg font-semibold">
              Hit Level (1 = #1 hits, 10 = obscure):
            </span>
            <Select
              value={hitLevel}
              onChange={(value) => setHitLevel(value)}
              className="w-full text-lg"
            >
              {[...Array(10).keys()].map((level) => (
                <Option key={level + 1} value={level + 1}>
                  {level + 1}
                </Option>
              ))}
            </Select>
          </div>

          {/* Third column: Buttons */}
          <div className="flex flex-col justify-end gap-4 w-full md:w-1/3">
            <Button
              onClick={handleGeneratePlaylist}
              className="w-full px-6 py-3 text-lg text-white border border-pink-300 flex items-center justify-center hover:bg-blue-600 bg-pink-400"
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
                  d="M5 12l5 5L20 7"
                />
              </svg>
              Generate Playlist
            </Button>

            {/* Copy All URLs Button */}
            {playlist.length > 0 && (
              <Button
                onClick={handleCopyAllUrls}
                className="mt-4 px-6 py-3 text-lg text-white border border-pink-300 flex items-center justify-center hover:bg-green-600 bg-green-400"
              >
                Copy All URLs
              </Button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <Spin tip="Generating playlist..." />
        </div>
      ) : (
        <>
          {errorMessage ? (
            <div className="text-center text-red-500 mt-4">{errorMessage}</div>
          ) : (
            playlist.length > 0 && (
              <Table
                dataSource={playlist}
                columns={columns}
                rowKey="id"
                pagination={false}
                className="mt-4"
              />
            )
          )}
        </>
      )}
    </div>
  );
};

export default PlaylistGenerator;
