import Link from "next/link";
import { notFound } from "next/navigation";
import { getChartDates, getChartByDate } from "@/lib/api";

export async function generateStaticParams() {
  const { dates } = await getChartDates();
  return dates.map((date) => ({ date: date }));
}

export async function generateMetadata({ params }) {
  const { date } = params;
  return {
    title: `Billboard Hot 100 - ${date}`,
    description: `Complete Billboard Hot 100 chart for ${date}`,
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

export default async function ChartPage({ params }) {
  const { date } = params;
  const data = await getChartByDate(date);

  if (!data || !data.entries) {
    notFound();
  }

  const dateRange = getChartDateRange(data.chart_date);
  const isRequestedDate = date !== data.chart_date;
  const chartDate = new Date(data.chart_date);
  const formattedDate = chartDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-yellow-50 p-4 md:p-8">
      {/* Newspaper Header */}
      <div className="max-w-6xl mx-auto mb-8 border-4 border-black bg-black text-white p-6 text-center">
        <div className="text-sm tracking-widest mb-2">
          POPHITS.ORG PRESENTING
        </div>
        <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-3">
          HOT 100
        </h1>
        <div className="text-sm">
          FOR THE WEEK ENDING {formattedDate.toUpperCase()}
        </div>
      </div>

      {isRequestedDate && (
        <div className="max-w-6xl mx-auto mb-8 border-2 border-black bg-white p-4">
          <p className="text-xs text-center text-gray-600">
            Requested {date} • Showing chart for {data.chart_date}
          </p>
        </div>
      )}

      {/* Chart Grid - Newspaper style 2 columns */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {data.entries.map((song) => (
          <div
            key={song.slug}
            className="border-b-2 border-black pb-4 flex gap-3"
          >
            {/* Position Number - Big & Bold */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-black text-lg">
                {song.position}
              </div>
            </div>

            {/* Song Info */}
            <div className="flex-grow min-w-0">
              <h3 className="font-black text-sm md:text-base leading-tight tracking-tight uppercase hover:underline">
                <Link href={`/songs/${song.slug}`}>{song.title}</Link>
              </h3>
              <p className="text-xs md:text-sm text-gray-700 mt-1">
                <Link
                  href={`/artists/${song.artist
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="font-bold text-gray-700 hover:text-blue-600 hover:underline"
                >
                  {song.artist}
                </Link>
              </p>

              {/* Movement & Stats Row */}
              <div className="flex gap-2 mt-2">
                <MovementBadge song={song} />
                <p className="text-xs text-gray-500">
                  Peak: {song.peak_rank} • {song.weeks_on_chart} wks
                  {song.previous_rank && ` • Prev: ${song.previous_rank}`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-12 text-center border-t-4 border-black pt-4 text-xs text-gray-600">
        <p>Billboard Hot 100 Historical Chart</p>
      </div>
    </div>
  );
}
