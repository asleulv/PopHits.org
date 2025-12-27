import { Shuffle } from "lucide-react";
import RandomHitsByDecadeClient from "@/components/FrontPage/RandomHitsByDecadeClient";

export default function RandomHitsByDecadeSection({
  groupedByDecade,
  initialDecade,
}) {
  if (Object.keys(groupedByDecade).length === 0) {
    return (
      <section className="mb-12 bg-yellow-50 text-slate-900 p-10 w-full rounded-3xl border-4 border-black border-dashed">
        <div className="flex justify-center items-center py-12">
          <p className="text-xl font-black uppercase tracking-widest animate-pulse text-slate-400">
            Scanning the Archive...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12 bg-yellow-50 text-slate-900 p-6 md:p-10 w-full rounded-3xl">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-10">
        <div className="bg-blue-950 text-white px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px] mb-4 flex items-center gap-2">
          <Shuffle size={14} /> Random Generator
        </div>
        
        <h2 className="text-4xl md:text-6xl font-black text-center tracking-tighter italic uppercase text-slate-900 leading-none">
          The <span className="text-blue-950 decoration-8 decoration-black">Time Machine</span>
        </h2>
        
        <p className="text-sm font-mono mt-4 text-slate-600 text-center max-w-md">
          Roll the dice on music history. Select a decade to pull a random hit from our deep archive.
        </p>
      </div>

      {/* Main Content Component */}
      <RandomHitsByDecadeClient
        groupedByDecade={groupedByDecade}
        initialDecade={initialDecade}
      />
    </section>
  );
}