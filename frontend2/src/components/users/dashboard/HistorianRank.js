import { ShieldCheck, Zap } from "lucide-react";

export default function HistorianRank({ stats }) {
  if (!stats) return null;
  const { historian_title, historian_points, next_rank } = stats;

  return (
    <div className="border-2 border-black p-4 bg-amber-400 relative overflow-hidden">
      {/* Background Decal - Darker amber for subtle tactical look */}
      <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-black/10 -rotate-12" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-baseline mb-1">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-black" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
              Authorization Level
            </span>
          </div>
          <span className="font-mono text-xl font-black italic text-black">
            {historian_points} <span className="text-xs opacity-70">PTS</span>
          </span>
        </div>

        <h2 className="text-4xl font-black italic uppercase leading-none mb-4 text-black tracking-tighter">
          {historian_title}
        </h2>

        {/* --- PROTOCOL BRIEFING --- */}
        <div className="mb-6 border-t border-b border-black/20 py-4">
          <p className="text-[11px] text-black font-bold uppercase leading-tight mb-3">
            Advance your clearance by evaluating tracks and providing historical context.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/5 p-2 border-l-2 border-black">
              <span className="text-[8px] font-bold text-black/50 uppercase tracking-widest">Protocol 01</span>
              <p className="text-[11px] font-black italic uppercase text-black">Rating: +10 PTS</p>
            </div>
            <div className="bg-black/5 p-2 border-l-2 border-black">
              <span className="text-[8px] font-bold text-black/50 uppercase tracking-widest">Protocol 02</span>
              <p className="text-[11px] font-black italic uppercase text-black">Comment: +25 PTS</p>
            </div>
          </div>
        </div>

        {/* Progress Bar - Black segments on a low-opacity black track */}
        {next_rank && (
          <div className="space-y-1">
            <div className="flex h-4 border-2 border-black p-0.5 gap-1 bg-black/10">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 transition-colors duration-500 ${
                    i < (next_rank.percent / 10) ? 'bg-black' : 'bg-black/5'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase italic text-black">
              <span className="opacity-70">Next Objective: {next_rank.next_title}</span>
              <span>{next_rank.remaining} TO AUTHORIZATION</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}