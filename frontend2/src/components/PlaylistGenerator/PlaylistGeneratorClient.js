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
    setErrorMessage("");
    setNotification(null);
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

  const handleCopyAllUrls = () => {
    const songUrls = playlist.map((song) => song.spotify_url).join("\n");
    navigator.clipboard.writeText(songUrls)
      .then(() => {
        setNotification({
          type: 'success',
          message: 'All song URLs copied to clipboard!'
        });
        
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      })
      .catch(() => {
        setNotification({
          type: 'error',
          message: 'Failed to copy song URLs.'
        });
        
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
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white`}>
          <p>{notification.message}</p>
        </div>
      )}
      
      <div className="mb-6 bg-yellow-50 p-5 rounded-xl shadow-sm border border-slate-300">
        <div className="flex items-center gap-3 mb-3">
          <Calendar className="w-6 h-6 text-amber-600" />
          <span className="text-lg font-semibold text-slate-900">
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
              className={`px-4 py-2 rounded-lg transition-colors border ${
                selectedDecades.includes(value)
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
        <div className="bg-yellow-50 p-5 rounded-xl shadow-sm w-full md:w-1/3 transition-all duration-300 hover:shadow-md border border-slate-300">
          <div className="flex items-center gap-3 mb-3">
            <Music className="w-6 h-6 text-amber-600" />
            <span className="text-lg font-semibold text-slate-900">
              Number of Songs:
            </span>
          </div>
          <select
            value={numSongs}
            onChange={(e) => setNumSongs(Number(e.target.value))}
            className="w-full p-2 border border-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-900"
          >
            {[10, 20, 25, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num} songs
              </option>
            ))}
          </select>
        </div>

        <div className="bg-yellow-50 p-5 rounded-xl shadow-sm w-full md:w-1/3 transition-all duration-300 hover:shadow-md border border-slate-300">
          <div className="flex items-center gap-3 mb-3">
            <BarChart2 className="w-6 h-6 text-amber-600" />
            <span className="text-lg font-semibold text-slate-900">
              Hit Level:
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-2">1 = #1 hits, 10 = obscure hits</p>
          <select
            value={hitLevel}
            onChange={(e) => setHitLevel(Number(e.target.value))}
            className="w-full p-2 border border-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-900"
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
            className="w-full px-6 py-3 text-lg bg-slate-900 text-white rounded-xl shadow-md hover:bg-slate-700 flex items-center justify-center transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="w-full px-6 py-3 text-lg bg-slate-700 text-white rounded-xl shadow-md hover:bg-slate-600 flex items-center justify-center transition-all duration-200 ease-in-out"
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-slate-700">Generating your custom playlist...</p>
          </div>
        </div>
      ) : (
        <>
          {errorMessage ? (
            <div className="bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-xl mt-6 text-center">
              <p className="font-medium">{errorMessage}</p>
              <p className="text-sm mt-2">Try adjusting your filters to find more songs.</p>
            </div>
          ) : (
            playlist.length > 0 && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6 border border-slate-400">
                <div className="bg-slate-50 p-4 border-b border-slate-300">
                  <h2 className="text-xl font-semibold text-center text-slate-900">
                    Your Custom Playlist ({playlist.length} Songs)
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-300">
                    <thead className="bg-slate-50 border-b border-slate-300">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Artist
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Year
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Peak Rank
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Listen
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-300">
                      {playlist.map((song) => (
                        <tr key={song.id} className="hover:bg-yellow-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                            <Link 
                              href={`/songs/${song.slug}`}
                              className="hover:text-amber-700 transition-colors"
                            >
                              {song.title}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-amber-700">
                            <Link 
                              href={`/artist/${song.artist_slug}`}
                              className="hover:text-slate-900 transition-colors"
                            >
                              {song.artist}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-900">
                            {song.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-900">
                            {song.peak_rank}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {song.spotify_url && (
                              <a
                                href={song.spotify_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-amber-700 hover:text-amber-900 font-medium"
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
                
                <div className="p-4 bg-slate-50 border-t border-slate-300 text-center">
                  <p className="text-slate-700">
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
