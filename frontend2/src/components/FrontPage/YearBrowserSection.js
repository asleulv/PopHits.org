import Link from "next/link";
import { CalendarDays } from "lucide-react";

export default function YearBrowserSection({ years }) {
  return (
    <section className="mb-8 p-6 w-full bg-white">
      <h2 className="text-2xl md:text-3xl font-cherry font-black mb-6 text-center flex items-center justify-center gap-2">
        <CalendarDays className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
        <span className="text-slate-900">Browse by Year</span>
      </h2>

      <div className="flex flex-wrap justify-center gap-3">
        {years.map((year) => (
          <Link
            key={year}
            href={`/year/${year}`}
            className="px-5 py-2 border-2 border-slate-900 bg-white text-slate-900 font-cherry text-sm transition-all hover:bg-slate-900 hover:text-white"
          >
            {year}
          </Link>
        ))}
      </div>
    </section>
  );
}
