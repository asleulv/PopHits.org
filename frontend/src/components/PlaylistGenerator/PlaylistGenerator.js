import React, { useState, useEffect } from "react";
import { Button, Select, Table, Spin, Input, message } from "antd";
import { generatePlaylist } from "../../services/api";
import {
  getSpotifyAuthUrl,
  handleAuthCallback,
  isAuthenticated,
  clearAccessToken,
} from "../../services/spotifyAuth";
import {
  getSpotifyUserId,
  createPlaylist,
  addTracksToPlaylist,
} from "../../services/spotifyPlaylist";

const { Option } = Select;

const PlaylistGenerator = () => {
  const [numSongs, setNumSongs] = useState(10);
  const [hitLevel, setHitLevel] = useState(1);
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [authUrl, setAuthUrl] = useState("");
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [selectedDecades, setSelectedDecades] = useState([
    "1950",
    "1960",
    "1970",
    "1980",
    "1990",
    "2000",
  ]);
  const [errorMessage, setErrorMessage] = useState(""); // Added errorMessage state

  useEffect(() => {
    const checkAuthStatus = async () => {
      const hash = window.location.hash;

      // Handle authentication callback if present in the URL
      if (hash) {
        handleAuthCallback(hash);
        return; // Exit early to prevent further processing
      }

      // Check if user is authenticated
      if (!isAuthenticated()) {
        setAuthUrl(getSpotifyAuthUrl());
        setIsConnected(false);
      } else {
        const token = localStorage.getItem("spotifyAccessToken");
        const tokenExpiresAt = localStorage.getItem("spotifyTokenExpiresAt");

        if (
          token &&
          tokenExpiresAt &&
          new Date().getTime() >= parseInt(tokenExpiresAt)
        ) {
          clearAccessToken();
          setIsConnected(false);
          setAuthUrl(getSpotifyAuthUrl());
        } else {
          setIsConnected(true);
        }
      }
    };

    checkAuthStatus();
  }, [authUrl, isConnected]); // Add dependencies if necessary

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

  const createSpotifyPlaylist = async () => {
    if (!isConnected) {
      message.warning("You need to connect to Spotify first!");
      return;
    }

    setCreatingPlaylist(true);

    const accessToken = localStorage.getItem("spotifyAccessToken");
    const userId = await getSpotifyUserId(accessToken);

    if (!userId) {
      message.error("Failed to get Spotify user ID. Reconnecting...");
      setCreatingPlaylist(false);
      reconnectToSpotify();
      return;
    }

    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const finalPlaylistName =
        playlistName || `PopHits.org - Hit Level ${hitLevel} - ${currentDate}`;
      const playlistId = await createPlaylist(
        accessToken,
        userId,
        finalPlaylistName
      );
      const trackUris = playlist
        .map((song) => song.spotify_url)
        .filter((url) => url)
        .join(",");

      await addTracksToPlaylist(accessToken, playlistId, trackUris);
      message.success(
        `Playlist '${finalPlaylistName}' created successfully on Spotify!`
      );
    } catch (error) {
      console.error("Failed to create playlist:", error);
      message.error("Failed to create playlist on Spotify.");
    } finally {
      setCreatingPlaylist(false);
    }
  };

  const reconnectToSpotify = () => {
    clearAccessToken();
    window.location.href = getSpotifyAuthUrl();
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
  ];

  return (
    <div className="p-4 min-h-screen">
      <div className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center">
        🤖 Hit Song Playlist Generator
      </div>

      {/* Introduction */}
      <div className="mb-4">
        <p className="mb-6 text-center md:text-left text-sm md:text-lg">
          Generate your random hit playlists and filter on decades and how
          big/obscure hits you want to include. After the list has been
          generated, you can easily send it as a playlist to Spotify. To build
          playlists from your ranked or bookmarked songs, please visit your{" "}
          <a href="/profile" className="text-blue-500 underline">
            profile
          </a>{" "}
          (registered users only).
        </p>
        {!isConnected && (
          <p className="mb-6 text-center md:text-center text-sm md:text-lg bg-yellow-200 border border-yellow-400 text-yellow-800 p-4 rounded-lg">
            ⚠️ To be able to send playlists to Spotify, you need to connect your
            Spotify account.
          </p>
        )}
      </div>

      {/* Container to match the width */}
      <div className="w-full">
        {/* Spotify Authentication Button */}
        {!isConnected ? (
          // If the user is not connected, show the "Connect to Spotify" button
          <div className="mb-4 text-center">
            <Button
              type="primary"
              href={authUrl}
              className="w-full md:w-1/3 mb-4 bg-blue-500 border-blue-600 text-white hover:bg-blue-600 hover:border-blue-700"
            >
              Connect to Spotify
            </Button>
          </div>
        ) : (
          // If the user is connected, show the "Disconnect from Spotify" button
          <div className="mb-4 text-center">
            <Button
              type="primary"
              onClick={() => {
                clearAccessToken(); // Clear Spotify tokens
                setIsConnected(false); // Update state to reflect disconnection
                message.info("You have been disconnected from Spotify.");
              }}
              className="w-full md:w-1/3 mb-4 bg-red-500 border-red-600 text-white hover:bg-red-600 hover:border-red-700"
            >
              Disconnect from Spotify
            </Button>
          </div>
        )}

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

          {/* Third column: Playlist Name and Buttons */}
          <div className="flex flex-col justify-end gap-4 w-full md:w-1/3">
            {/* Input for playlist name */}
            <Input
              placeholder="Enter playlist name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full mb-4 p-2 border border-gray-300  text-lg font-semibold focus:border-blue-500 focus:ring focus:ring-blue-200"
            />

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

            {playlist.length > 0 && (
              <Button
                onClick={createSpotifyPlaylist}
                className="w-full px-6 py-3 text-lg text-white border border-green-700 rounded flex items-center justify-center hover:bg-green-700 bg-green-400"
                loading={creatingPlaylist}
                disabled={!isConnected} // Disable the button if not connected
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Send to Spotify
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
