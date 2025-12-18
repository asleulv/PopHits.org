import Link from "next/link";
import { User, Clock, Activity } from "lucide-react";

// Helper to calculate "Time Ago"
function formatTimeAgo(timestamp) {
  if (!timestamp) return "Recently";
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function CommunityFavorites({ topRatedData }) {
  const songs = topRatedData || [];

  return (
    <section className="mb-12 text-slate-900 w-full bg-yellow-50 rounded-3xl p-4 md:p-10">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-black text-white px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px] mb-4">
          Community Choice
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-center tracking-tighter italic uppercase">
          Trending in the Archive
        </h2>
        <p className="text-sm font-mono mt-2 text-slate-600 text-center">
          Live feed of community research and ratings
        </p>
      </div>

      <div className="overflow-hidden border-4 border-black bg-white mb-8 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-4 divide-black">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 md:px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">
                  Avg. Score
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">
                  Song Details
                </th>
                <th className="px-4 md:px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest hidden sm:table-cell text-right">
                  Activity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-black">
              {songs.map((song, index) => (
                <tr
                  key={song.id || index}
                  className="hover:bg-yellow-50 transition-colors group"
                >
                  {/* Column 1: Avg. Score */}
                  <td className="px-4 md:px-6 py-6 align-top">
                    <div className="flex flex-col items-center sm:items-start">
                      <span className="bg-yellow-400 border-2 border-black px-3 py-1 font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        {song.average_user_score || "—"}
                      </span>
                      <span className="text-[9px] font-black uppercase mt-2 text-slate-400 whitespace-nowrap">
                        {song.total_ratings} VOTES
                      </span>
                    </div>
                  </td>

                  {/* Column 2: Song Details + Mobile Activity Info */}
                  <td className="px-4 md:px-6 py-6">
                    <div className="flex flex-col">
                      <Link
                        href={`/songs/${song.slug}`}
                        className="group-hover:translate-x-1 transition-transform inline-block"
                      >
                        <div className="font-black uppercase text-lg md:text-xl leading-none hover:underline underline-offset-4 decoration-4">
                          {song.title}
                        </div>
                        <div className="text-sm font-bold uppercase text-slate-500 mt-1">
                          {song.artist}{" "}
                          <span className="text-slate-300 mx-1">•</span>{" "}
                          {song.year}
                        </div>
                      </Link>

                      {/* Mobile Only: Activity Summary */}
                      <div className="mt-4 flex sm:hidden items-center justify-between gap-2 text-[10px] font-black uppercase bg-slate-100 p-2 border-l-4 border-black">
                        <div className="flex items-center gap-1">
                          <User size={10} />
                          <span>
                            @{song.latest_rater} gave it {song.latest_score}/10
                          </span>
                        </div>
                        <span className="text-slate-400 font-mono italic">
                          {formatTimeAgo(song.latest_time)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Column 3: Desktop Activity (No avatars) */}
                  <td className="px-4 md:px-6 py-6 hidden sm:table-cell align-middle text-right">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black uppercase">
                          @{song.latest_rater}
                        </span>
                        <span className="bg-blue-950 text-white text-[11px] font-black px-2 py-0.5 rounded border border-black">
                          {song.latest_score}/10
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                        <Clock size={12} />
                        <span>{formatTimeAgo(song.latest_time)}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/charts/pop-100"
          className="inline-block px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-xs border-2 border-black hover:bg-yellow-400 transition-all"
        >
          View The Full POP 100 Trending →
        </Link>
      </div>
    </section>
  );
}
