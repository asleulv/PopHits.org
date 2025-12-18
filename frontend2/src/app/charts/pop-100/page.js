// app/charts/pop-100/page.js
import Link from "next/link";
import {
  User,
  Clock,
  TrendingUp,
  ChevronUp,
  Minus,
  ShieldCheck,
  Zap,
  Info,
} from "lucide-react";
import { getTrendingArchive } from "@/lib/api";

function formatTimeAgo(timestamp) {
  if (!timestamp) return "Recently";
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

export default async function Pop100Page() {
  const songs = await getTrendingArchive(100);

  return (
    <main className="p-4 md:p-10 max-w-7xl mx-auto bg-yellow-50 min-h-screen">
      <header className="mb-12">
        {/* Centered Branding Section */}
        <div className="flex flex-col items-center border-b-8 border-black pb-10">
          <div className="bg-black text-yellow-400 inline-flex items-center gap-2 px-4 py-1.5 text-[10px] md:text-xs font-black uppercase mb-6 tracking-[0.2em]">
            <TrendingUp size={16} /> Official Community Chart
          </div>

          <h1 className="text-7xl md:text-[12rem] font-black italic uppercase tracking-tighter leading-none text-center">
            THE POP 100
          </h1>

          <p className="font-mono text-sm md:text-base mt-6 text-slate-600 uppercase font-bold tracking-widest text-center">
            Real-time research • Verified Ratings • Deep Archive
          </p>
        </div>

        {/* Improved Methodology: Two High-Impact Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-5xl mx-auto">
          {/* Rule 1: Movement */}
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
            <div className="absolute top-[-10px] right-[-10px] text-yellow-100 opacity-20 group-hover:rotate-12 transition-transform">
              <Zap size={100} />
            </div>
            <div className="relative flex items-center gap-5">
              <div className="bg-yellow-400 p-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Zap className="text-black fill-current" size={24} />
              </div>
              <div>
                <h3 className="font-black uppercase text-sm tracking-tighter">
                  Live Velocity Ranking
                </h3>
                <p className="text-xs font-bold text-slate-500 uppercase mt-1 leading-tight">
                  Position is determined by{" "}
                  <span className="text-black">Velocity</span>—how recently and
                  frequently the community is researching and rating a hit.
                </p>
              </div>
            </div>
          </div>

          {/* Rule 2: Quality */}
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
            <div className="absolute top-[-10px] right-[-10px] text-blue-50 opacity-10 group-hover:rotate-12 transition-transform">
              <ShieldCheck size={100} />
            </div>
            <div className="relative flex items-center gap-5">
              <div className="bg-blue-600 p-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-black uppercase text-sm tracking-tighter">
                  The 7.0 Elite Floor
                </h3>
                <p className="text-xs font-bold text-slate-500 uppercase mt-1 leading-tight">
                  A song must maintain a community average of{" "}
                  <span className="text-black">7.0 or higher</span> to qualify.
                  Sub-par tracks are strictly excluded.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="overflow-hidden border-4 border-black bg-white rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-4 divide-black">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-4 text-center text-[10px] font-black uppercase tracking-widest">
                  Rank
                </th>
                <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest">
                  Score
                </th>
                <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest">
                  Song
                </th>
                <th className="px-4 py-4 text-right text-[10px] font-black uppercase tracking-widest hidden md:table-cell">
                  Recent Activity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-black">
              {songs.map((song, index) => {
                const isClimbing =
                  new Date() - new Date(song.latest_time) < 3600000;

                return (
                  <tr
                    key={`rank-${index}-${song.id}`}
                    className="hover:bg-yellow-50 transition-colors"
                  >
                    {/* Column 0: Rank + Movement */}
                    <td className="px-4 py-6 text-center align-middle border-r-4 border-black w-24">
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-4xl font-black italic tracking-tighter leading-none mb-1">
                          {index + 1}
                        </span>
                        {isClimbing ? (
                          <div className="flex items-center text-green-600 font-black text-[10px] uppercase">
                            <ChevronUp size={14} strokeWidth={4} /> HOT
                          </div>
                        ) : (
                          <div className="text-slate-300">
                            <Minus size={14} strokeWidth={4} />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Column 1: Avg. Score */}
                    <td className="px-4 py-6 align-middle w-32">
                      <span className="bg-yellow-400 border-2 border-black px-3 py-1 font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        {song.average_user_score}
                      </span>
                    </td>

                    {/* Column 2: Details */}
                    <td className="px-4 py-6 align-middle">
                      <Link
                        href={`/songs/${song.slug}`}
                        className="group inline-block"
                      >
                        <div className="font-black uppercase text-xl md:text-2xl leading-none group-hover:underline underline-offset-4 decoration-4">
                          {song.title}
                        </div>
                        <div className="text-sm font-bold uppercase text-slate-500 mt-1">
                          {song.artist}{" "}
                          <span className="text-slate-300 mx-1">•</span>{" "}
                          {song.year}
                        </div>
                      </Link>
                    </td>

                    {/* Column 3: Activity Feed */}
                    <td className="px-4 py-6 hidden md:table-cell text-right align-middle">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-black uppercase">
                            @{song.latest_rater}
                          </span>
                          <span className="bg-blue-950 text-white text-[11px] font-black px-2 py-0.5 rounded border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {song.latest_score}/10
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                          <Clock size={12} /> {formatTimeAgo(song.latest_time)}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
