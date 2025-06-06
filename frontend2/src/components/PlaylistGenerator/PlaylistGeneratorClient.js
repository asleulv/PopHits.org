"use client";

import { useState } from "react";
import Link from "next/link";
import { Music, RefreshCw, Copy, Calendar, BarChart2 } from "lucide-react";
import { generatePlaylist } from "@/lib/api";

export default function PlaylistGeneratorClient() {
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
  const [notification, setNotification] = useState(null);

  const handleGeneratePlaylist = async () => {
    if (selectedDecades.length === 0) {
      setErrorMessage("Please select at least one decade.");
      return;
    }

    setLoading(true);
    setErrorMessage(""); // Clear previous error message
    setNotification(null); // Clear any previous notifications
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
      .then(() => {
        setNotification({
          type: 'success',
          message: 'All song URLs copied to clipboard!'
        });
        
        // Clear notification after 3 seconds
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      })
      .catch(() => {
        setNotification({
          type: 'error',
          message: 'Failed to copy song URLs.'
        });
        
        // Clear notification after 3 seconds
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      });
  };

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
    <div className="w-full">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          <p>{notification.message}</p>
        </div>
      )}
      
      <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <Calendar className="w-6 h-6 text-pink-500" />
          <span className="text-lg font-semibold text-gray-700">
            Select Decades:
          </span>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {decadesOptions.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => {
                if (selectedDecades.includes(value)) {
                  setSelectedDecades(selectedDecades.filter(decade => decade !== value));
                } else {
                  setSelectedDecades([...selectedDecades, value]);
                }
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedDecades.includes(value)
                  ? "bg-pink-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-sm w-full md:w-1/3 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <Music className="w-6 h-6 text-pink-500" />
            <span className="text-lg font-semibold text-gray-700">
              Number of Songs:
            </span>
          </div>
          <select
            value={numSongs}
            onChange={(e) => setNumSongs(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            {[10, 20, 25, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num} songs
              </option>
            ))}
          </select>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-sm w-full md:w-1/3 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <BarChart2 className="w-6 h-6 text-pink-500" />
            <span className="text-lg font-semibold text-gray-700">
              Hit Level:
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-2">1 = #1 hits, 10 = obscure hits</p>
          <select
            value={hitLevel}
            onChange={(e) => setHitLevel(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            {[...Array(10).keys()].map((level) => (
              <option key={level + 1} value={level + 1}>
                Level {level + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col justify-end gap-4 w-full md:w-1/3">
          <button
            onClick={handleGeneratePlaylist}
            disabled={loading}
            className="w-full px-6 py-3 text-lg bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl shadow-md hover:from-pink-600 hover:to-pink-700 flex items-center justify-center transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Generate Playlist
              </>
            )}
          </button>

          {/* Copy All URLs Button */}
          {playlist.length > 0 && (
            <button
              onClick={handleCopyAllUrls}
              className="w-full px-6 py-3 text-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-md hover:from-blue-600 hover:to-blue-700 flex items-center justify-center transition-all duration-200 ease-in-out"
            >
              <Copy className="w-5 h-5 mr-2" />
              Copy All URLs
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating your custom playlist...</p>
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
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-center text-gray-700">
                    Your Custom Playlist ({playlist.length} Songs)
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Artist
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Year
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Peak Rank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Listen
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {playlist.map((song) => (
                        <tr key={song.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            <Link 
                              href={`/songs/${song.slug}`}
                              className="hover:text-pink-600 transition-colors"
                            >
                              {song.title}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-pink-600">
                            <Link 
                              href={`/artist/${song.artist_slug}`}
                              className="hover:text-gray-900 transition-colors"
                            >
                              {song.artist}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {song.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {song.peak_rank}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {song.spotify_url && (
                              <a
                                href={song.spotify_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-800"
                              >
                                Spotify
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
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
}
