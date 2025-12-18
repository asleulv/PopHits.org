import Link from "next/link";
import { CalendarDays } from "lucide-react";

export default function YearBrowserSection({ years }) {
  // Sort years descending so the newest archives appear first
  const sortedYears = [...years].sort((a, b) => b - a);

  return (
    /* Changes:
       - Changed bg-white to bg-blue-950
       - Added w-screen mx-[-1rem] for edge-to-edge mobile width
       - Added md:rounded-3xl rounded-none for mobile consistency
       - Added md:border-4 border-y-4 border-x-0 for cleaner mobile edges
    */
    <section className="relative mb-12 bg-blue-950 p-6 md:p-10 md:rounded-3xl rounded-none md:border-4 border-y-4 border-x-0 border-black md:w-full w-[100vw] ml-[50%] translate-x-[-50%] shadow-none">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-10">
        {/* Fixed Version */}
        <div className="bg-yellow-400 text-black px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px] mb-4 flex items-center gap-2 whitespace-nowrap w-fit mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <CalendarDays size={14} />
          <span>Chronology</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-center tracking-tighter italic uppercase text-white leading-none">
          Archive{" "}
          <span className="text-yellow-400 decoration-black decoration-8">
            Timeline
          </span>
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-3 md:gap-4 px-2 md:px-0">
        {sortedYears.map((year) => (
          <Link
            key={year}
            href={`/year/${year}`}
            className="px-5 py-2 md:px-6 md:py-2 border-[3px] border-black bg-white text-black font-black font-mono text-sm md:text-base transition-all hover:bg-yellow-400 active:bg-yellow-500"
          >
            {year}
          </Link>
        ))}
      </div>
    </section>
  );
}
