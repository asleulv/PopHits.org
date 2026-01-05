"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, ArrowRight, UserCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // Ensure this matches your auth path

export default function LeaderboardSection({ data }) {
  const [view, setView] = useState("monthly");
  const { user: loggedInUser } = useAuth();

  if (!data || (!data.all_time && !data.monthly)) return null;

  const currentData = (data[view] || []).slice(0, 5);

  return (
    <section className="mb-12 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center p-6 border-b-2 border-black gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-black p-2">
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-black">
              Top Historians
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Ranked Contribution Index
            </p>
          </div>
        </div>

        {/* Tactical Tab Switcher */}
        <div className="flex border-2 border-black w-full md:w-auto">
          <button
            onClick={() => setView("monthly")}
            className={`flex-1 md:flex-none px-6 py-2 text-xs font-black uppercase italic transition-all ${
              view === "monthly" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setView("all_time")}
            className={`flex-1 md:flex-none px-6 py-2 text-xs font-black uppercase italic border-l-2 border-black transition-all ${
              view === "all_time" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            All-Time
          </button>
        </div>
      </div>

      {/* Table Structure */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-black">
              <th className="px-4 md:px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 w-16 md:w-20">Rank</th>
              <th className="px-4 md:px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Contributor</th>
              <th className="px-4 md:px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hidden md:table-cell text-right">Clearance Level</th>
              <th className="px-4 md:px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, idx) => {
              const isMe = loggedInUser?.username === row.username;
              return (
                <tr 
                  key={row.username} 
                  className={`border-b border-black/10 last:border-0 hover:bg-gray-50 transition-colors ${
                    idx === 0 ? 'bg-amber-400/5' : ''
                  } ${isMe ? 'bg-blue-50/50' : ''}`}
                >
                  <td className="px-4 md:px-6 py-4">
                    <span className={`font-mono font-black text-lg ${idx === 0 ? 'text-amber-500' : 'text-black'}`}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`font-black uppercase italic leading-tight ${isMe ? 'text-blue-600' : 'text-black'}`}>
                        {row.username} {isMe && "(YOU)"}
                      </span>
                      <span className="md:hidden text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                        {row.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-4 hidden md:table-cell text-right">
                    <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5">
                      {row.title}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right">
                    <span className="font-mono font-black text-lg md:text-xl text-black">
                      {row.points.toLocaleString()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Info - Logic based on login status */}
      <div className="p-4 bg-gray-50 border-t-2 border-black flex justify-between items-center">
       

        {loggedInUser ? (
          <Link 
            href="/profile" 
            className="group flex items-center gap-2 bg-black text-white px-3 py-1 text-[10px] font-black uppercase italic hover:bg-amber-400 hover:text-black transition-all"
          >
            <UserCircle className="w-3 h-3" />
            Your Full Stats
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <span className="text-[9px] font-bold text-gray-400 uppercase italic">
            * Protocol 01 + 02 active
          </span>
        )}
      </div>
    </section>
  );
}