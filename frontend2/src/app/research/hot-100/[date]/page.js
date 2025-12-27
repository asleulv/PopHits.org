export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getChartDates, getChartByDate } from "@/lib/api";



// FIX 1: Await params in generateMetadata
export async function generateMetadata({ params }) {
  const resolvedParams = await params; // Must await here
  const { date } = resolvedParams;
  
  return {
    title: `Data Archive - ${date}`,
    description: `Internal research dataset for week ending ${date}`,
    robots: { index: false, follow: false },
  };
}

function getChartDateRange(chartDate) {
  const endDate = new Date(chartDate);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 6);

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return `${formatDate(startDate)} – ${formatDate(endDate)}`;
}

function MovementBadge({ song }) {
  if (song.is_new) {
    return (
      <span className="text-xs font-black text-green-700 bg-green-100 px-2 py-1 rounded">
        ★ NEW
      </span>
    );
  }

  if (song.movement === null) {
    return null;
  }

  if (song.movement > 0) {
    return (
      <span className="text-xs font-black text-green-700 bg-green-100 px-2 py-1 rounded">
        ↑ {song.movement}
      </span>
    );
  } else if (song.movement < 0) {
    return (
      <span className="text-xs font-black text-red-700 bg-red-100 px-2 py-1 rounded">
        ↓ {Math.abs(song.movement)}
      </span>
    );
  }

  return <span className="text-xs font-black text-gray-600 px-2 py-1">—</span>;
}

// FIX 2: Await params in the main component
export default async function ChartPage({ params }) {
  const resolvedParams = await params; // Must await here
  const { date } = resolvedParams;
  
  const data = await getChartByDate(date);

  if (!data || !data.entries) {
    notFound();
  }

  const chartDate = new Date(data.chart_date);
  const formattedDate = chartDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-yellow-50 p-4 md:p-8">
      {/* Newspaper Header */}
      <div className="max-w-6xl mx-auto mb-8 border-4 border-black bg-black text-white p-6 text-center shadow-[10px_10px_0px_0px_rgba(0,0,0,0.15)]">
        <div className="text-sm tracking-widest mb-2 font-bold opacity-70 uppercase">
          POPHITS.ORG INTERNAL ARCHIVE
        </div>
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-3 italic">
          THE HIT LIST
        </h1>
        <div className="text-sm font-mono tracking-wider">
          DATASET COMPILED: {formattedDate.toUpperCase()}
        </div>
        
        {/* Navigation Button */}
        <Link 
          href="/research" 
          className="inline-block mt-4 text-xs font-black border-2 border-white px-4 py-2 hover:bg-white hover:text-black transition-colors"
        >
          ← BACK TO CALENDAR
        </Link>
      </div>

      {/* Warning Box for exact date matches */}
      {date !== data.chart_date && (
        <div className="max-w-6xl mx-auto mb-8 border-2 border-black bg-white p-4">
          <p className="text-xs text-center text-gray-600 font-bold uppercase">
            Requested: {date} • Closest Indexed Match: {data.chart_date}
          </p>
        </div>
      )}

      {/* Chart Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {data.entries.map((song) => (
          <div
            key={song.slug}
            className="border-b-2 border-black pb-4 flex gap-3 group"
          >
            {/* Position Number */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-xl border-2 border-black group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                {song.position}
              </div>
            </div>

            {/* Song Info */}
            <div className="flex-grow min-w-0">
              <h3 className="font-black text-sm md:text-base leading-tight tracking-tight uppercase">
                <Link href={`/songs/${song.slug}`} className="hover:bg-black hover:text-white px-1">
                  {song.title}
                </Link>
              </h3>
              <p className="text-xs md:text-sm mt-1">
                <Link
                  href={`/artist/${song.artist_slug}`}
                  className="font-bold text-gray-700 hover:text-yellow-600 underline decoration-2 underline-offset-2"
                >
                  {song.artist}
                </Link>
              </p>

              {/* Stats Row */}
              <div className="flex gap-2 mt-2 items-center">
                <MovementBadge song={song} />
                <p className="text-[10px] md:text-xs font-mono text-gray-500 uppercase">
                  Pk: {song.peak_rank} / Wks: {song.weeks_on_chart}
                  {song.previous_rank && ` / Prv: ${song.previous_rank}`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-12 text-center border-t-2 border-black pt-6 text-[10px] text-gray-400 uppercase tracking-widest">
        <p>© PopHits.org Private Research Data — No Unauthorized Distribution</p>
      </div>
    </div>
  );
}