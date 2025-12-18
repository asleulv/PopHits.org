import Link from "next/link";
import { Clock, Activity } from "lucide-react";

// Helper to calculate "Time Ago"
function formatTimeAgo(timestamp) {
  if (!timestamp) return "RECENTLY";
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);

  if (seconds < 60) return "JUST NOW";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}M AGO`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}H AGO`;
  return `${Math.floor(hours / 24)}D AGO`;
}

export default function CommunityFavorites({ topRatedData }) {
  const songs = topRatedData || [];

  return (
    <section className="mb-12 md:w-full w-screen md:mx-0 mx-[-1rem] bg-yellow-50 p-6 md:p-10 md:rounded-3xl rounded-none md:border-4 border-y-4 border-x-0 border-black animate-fadeIn">
      {/* Left-Aligned Header on Mobile */}
      <div className="flex flex-col items-start md:items-center mb-8">
        <div className="bg-blue-950 text-white px-3 py-1 font-black uppercase tracking-widest text-[10px] mb-4 flex items-center gap-2">
          <Activity size={12} className="text-yellow-400" /> Community Choice
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-left md:text-center tracking-tighter italic uppercase text-slate-900 leading-none">
          Trending <span className="text-blue-950">Archive</span>
        </h2>
      </div>

      {/* The Table */}
      <div className="overflow-hidden border-4 border-black bg-white mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-4 divide-black">
            <thead className="bg-black text-white">
              <tr className="divide-x-4 divide-white/20">
                <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest w-20">Score</th>
                <th className="px-4 py-4 text-left text-[10px] font-black uppercase tracking-widest">Entry Details</th>
                <th className="px-4 py-4 text-right text-[10px] font-black uppercase tracking-widest hidden sm:table-cell">Latest Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-black">
              {songs.map((song, index) => (
                <tr key={song.id || index} className="group hover:bg-yellow-50 transition-colors">
                  
                  {/* Column 1: Score */}
                  <td className="px-4 py-6 align-top">
                    <div className="bg-yellow-400 border-2 border-black px-2 py-1 font-black text-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center w-fit">
                      {song.average_user_score || "—"}
                    </div>
                  </td>

                  {/* Column 2: Song + Simple Activity Log */}
                  <td className="px-4 py-6">
                    <div className="flex flex-col items-start text-left">
                      <Link href={`/songs/${song.slug}`} className="block">
                        <div className="font-black uppercase text-lg md:text-2xl leading-none group-hover:text-blue-950 transition-colors">
                          {song.title}
                        </div>
                        <div className="text-xs font-bold uppercase text-slate-600 mt-1">
                          {song.artist} <span className="text-black mx-1">•</span> {song.year}
                        </div>
                      </Link>

                      {/* MOBILE ACTIVITY: Straight Text, Left Aligned */}
                      <div className="mt-3 flex sm:hidden items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-blue-950">
                         <span>@{song.latest_rater} RATED IT {song.latest_score}/10</span>
                         <span className="text-slate-400 font-mono">•</span>
                         <span className="text-slate-500 font-mono">{formatTimeAgo(song.latest_time)}</span>
                      </div>
                    </div>
                  </td>

                  {/* Column 3: Desktop Activity */}
                  <td className="px-4 py-6 hidden sm:table-cell align-middle text-right">
                    <div className="flex flex-col items-end">
                      <div className="text-[11px] font-black uppercase text-slate-900">
                        @{song.latest_rater} <span className="text-blue-950">— {song.latest_score}/10</span>
                      </div>
                      <div className="text-[10px] font-black text-slate-400 mt-1 uppercase">
                        {formatTimeAgo(song.latest_time)}
                      </div>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Left-Aligned CTA on Mobile */}
      <div className="text-left md:text-center">
        <Link
          href="/charts/pop-100"
          className="inline-block px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs border-2 border-black hover:bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition-all"
        >
          View Full Archive →
        </Link>
      </div>
    </section>
  );
}