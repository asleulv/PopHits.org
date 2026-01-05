"use client";

import { useState } from "react";
import Link from "next/link";
import { Music, RefreshCw, Copy, Calendar, BarChart2, Loader2, CheckCircle2, AlertOctagon, ExternalLink } from "lucide-react";
import { generatePlaylist } from "@/lib/api";

export default function PlaylistGeneratorClient() {
  const [numSongs, setNumSongs] = useState(10);
  const [hitLevel, setHitLevel] = useState(1);
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [selectedDecades, setSelectedDecades] = useState([
    "1950", "1960", "1970", "1980", "1990", "2000", "2010", "2020",
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
      const data = await generatePlaylist(numSongs, hitLevel, selectedDecades);
      if (data.length === 0) {
        setErrorMessage("No songs match the criteria.");
      } else {
        setPlaylist(data);
      }
    } catch (error) {
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
          message: 'URLs copied to clipboard'
        });
        setTimeout(() => setNotification(null), 3000);
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
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      {/* Brutalist Toast - Flat */}
      {notification && (
        <div className={`fixed bottom-8 right-8 z-50 p-4 border-2 border-black flex items-center gap-3 animate-in slide-in-from-bottom-4 ${
          notification.type === 'success' ? 'bg-amber-400 text-black' : 'bg-red-600 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertOctagon size={20} />}
          <p className="font-black uppercase italic text-sm tracking-tight">{notification.message}</p>
        </div>
      )}
      
      {/* 1. Decade Selection Box */}
      <div className="bg-white border-2 border-black p-6">
        <div className="flex items-center gap-3 mb-6 border-b-2 border-black pb-2">
          <Calendar size={20} />
          <span className="text-lg font-black italic uppercase tracking-tighter">Temporal Selection</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {decadesOptions.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => {
                setSelectedDecades(prev => 
                  prev.includes(value) ? prev.filter(d => d !== value) : [...prev, value]
                );
              }}
              className={`py-2 font-black italic uppercase text-xs border-2 border-black transition-colors ${
                selectedDecades.includes(value)
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-yellow-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quantity Card */}
        <div className="bg-white border-2 border-black p-5">
          <div className="flex items-center gap-2 mb-4 opacity-40">
            <Music size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Quantity</span>
          </div>
          <select
            value={numSongs}
            onChange={(e) => setNumSongs(Number(e.target.value))}
            className="w-full bg-transparent border-b-2 border-black py-1 font-black italic text-xl outline-none appearance-none"
          >
            {[10, 20, 25, 50, 100].map((num) => (
              <option key={num} value={num}>{num} Songs</option>
            ))}
          </select>
        </div>

        {/* Intensity Card */}
        <div className="bg-white border-2 border-black p-5">
          <div className="flex items-center gap-2 mb-4 opacity-40">
            <BarChart2 size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Saturation</span>
          </div>
          <select
            value={hitLevel}
            onChange={(e) => setHitLevel(Number(e.target.value))}
            className="w-full bg-transparent border-b-2 border-black py-1 font-black italic text-xl outline-none appearance-none"
          >
            {[...Array(10).keys()].map((level) => (
              <option key={level + 1} value={level + 1}>Hit Level {level + 1}</option>
            ))}
          </select>
        </div>

        {/* Main Action Buttons */}
        <div className="flex flex-col gap-2 justify-end">
          <button
            onClick={handleGeneratePlaylist}
            disabled={loading}
            className="w-full bg-black text-white py-4 font-black uppercase italic text-xl border-2 border-black hover:bg-amber-500 hover:text-black transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Initialize List"}
          </button>
          {playlist.length > 0 && (
            <button
              onClick={handleCopyAllUrls}
              className="w-full bg-white text-black py-2 font-black uppercase italic text-sm border-2 border-black hover:bg-black hover:text-white transition-all"
            >
              Copy All URLs
            </button>
          )}
        </div>
      </div>

      {/* 2. Results Table */}
      <div className="pt-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-black/20">
             <Loader2 size={40} className="animate-spin text-black mb-4" />
             <p className="font-black uppercase italic tracking-widest text-xs">Compiling Records...</p>
          </div>
        ) : (
          <>
            {errorMessage ? (
              <div className="bg-red-600 text-white border-2 border-black p-4 text-center font-black uppercase italic">
                {errorMessage}
              </div>
            ) : (
              playlist.length > 0 && (
                <div className="border-2 border-black overflow-hidden bg-white">
                  <div className="bg-black text-white p-3 flex justify-between items-center">
                    <h2 className="font-black italic uppercase tracking-tighter text-lg">
                      Playlist Archive Output // {playlist.length} Items
                    </h2>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-yellow-50/50 border-b-2 border-black">
                          {["Track", "Artist", "Year", "Rank", "Listen"].map((h) => (
                            <th key={h} className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-black/5">
                        {playlist.map((song) => (
                          <tr key={song.id} className="hover:bg-yellow-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <Link href={`/songs/${song.slug}`} className="font-black uppercase italic text-lg tracking-tighter block group-hover:text-amber-600">
                                {song.title}
                              </Link>
                            </td>
                            <td className="px-6 py-4 font-bold text-xs uppercase tracking-tight">
                              <Link href={`/artist/${song.artist_slug}`} className="hover:underline">
                                {song.artist}
                              </Link>
                            </td>
                            <td className="px-6 py-4 font-black italic text-xl tracking-tighter">
                              {song.year}
                            </td>
                            <td className="px-6 py-4">
                              <span className="bg-black text-white px-2 py-0.5 font-black text-xs">
                                #{song.peak_rank}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {song.spotify_url && (
                                <a
                                  href={song.spotify_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-black hover:text-green-600 transition-colors"
                                >
                                  <ExternalLink size={18} />
                                </a>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}