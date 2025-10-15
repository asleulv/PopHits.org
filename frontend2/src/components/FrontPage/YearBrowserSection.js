import Link from "next/link";
import { CalendarDays } from "lucide-react";

export default function YearBrowserSection({ years }) {
  const getYearColorClass = (year) => {
    const decade = Math.floor(year / 10) * 10;
    switch (decade) {
      case 1950:
        return "bg-blue-100 text-blue-800 hover:bg-blue-500";
      case 1960:
        return "bg-green-100 text-green-800 hover:bg-green-500";
      case 1970:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-500";
      case 1980:
        return "bg-purple-100 text-purple-800 hover:bg-purple-500";
      case 1990:
        return "bg-red-100 text-red-800 hover:bg-red-500";
      case 2000:
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-500";
      case 2010:
        return "bg-pink-100 text-pink-800 hover:bg-pink-500";
      case 2020:
        return "bg-cyan-100 text-cyan-800 hover:bg-cyan-500";
      default:
        return "bg-gray-200 text-gray-800 hover:bg-gray-500";
    }
  };

  return (
    <section className="mb-8 text-black p-6 w-full bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-md">
      <h2 className="text-xl md:text-3xl font-cherry font-semibold mb-6 text-center flex flex-col lg:flex-row items-center justify-center gap-2">
        <CalendarDays className="hidden lg:block w-8 h-8 text-pink-600" />
        <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">
          Browse Billboard Hot 100 Hits by Year
        </span>
      </h2>
      <div className="flex flex-wrap justify-center gap-2">
        {years.map((year) => (
          <Link
            key={year}
            href={`/year/${year}`}
            className={`px-4 py-2 rounded-lg text-md ${getYearColorClass(year)} ring-1 ring-inset ring-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-100 transform hover:scale-105 shadow-sm`}
          >
            {year}
          </Link>
        ))}
      </div>
    </section>
  );
}
