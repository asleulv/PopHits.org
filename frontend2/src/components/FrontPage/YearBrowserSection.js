import Link from "next/link";
import { CalendarDays } from "lucide-react";

export default function YearBrowserSection({ years }) {
  // Sort years descending so the newest archives appear first
  const sortedYears = [...years].sort((a, b) => b - a);

  return (
    <section className="mb-12 p-6 md:p-10 w-full bg-white rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-10">
        <div className="bg-blue-950 text-white px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px] mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
          <CalendarDays size={14} /> Chronology
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-center tracking-tighter italic uppercase text-slate-900 leading-none">
          Archive <span className="text-blue-950 decoration-8 decoration-black">Timeline</span>
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {sortedYears.map((year) => (
          <Link
            key={year}
            href={`/year/${year}`}
            className="px-6 py-2 border-[3px] border-black bg-white text-black font-black font-mono text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:bg-yellow-400 hover:shadow-none hover:translate-x-1 hover:translate-y-1"
          >
            {year}
          </Link>
        ))}
      </div>
    </section>
  );
}