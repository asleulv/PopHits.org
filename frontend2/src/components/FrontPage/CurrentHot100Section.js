import Link from "next/link";
import { ListMusic } from "lucide-react";

export default function CurrentHot100Section({ currentHot100 }) {
  const hasData = currentHot100?.songs?.length > 0;

  if (!hasData) {
    return (
      <section className="mb-8 text-black p-6 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm">
        <h2 className="text-xl md:text-3xl font-cherry font-semibold mb-6 text-center flex items-center justify-center gap-2">
          <ListMusic className="hidden lg:block w-8 h-8 text-pink-500" />
          <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">
            Current Billboard Hot 100 Chart - Weekly Updates
          </span>
        </h2>
        <div className="flex justify-center items-center py-12">
          <p className="text-xl">Loading current Hot 100 chart...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8 text-black p-6 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm">
      <h2 className="text-xl md:text-3xl font-cherry font-semibold mb-6 text-center flex items-center justify-center gap-2">
        <ListMusic className="hidden lg:block w-8 h-8 text-pink-500" />
        <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">
          Current Billboard Hot 100 Chart
        </span>
      </h2>

      <div className="overflow-x-auto rounded-lg shadow-md mb-6">
        <table className="min-w-full divide-y divide-gray-200 border-collapse">
          <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-16">
                Position
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Artist
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentHot100.songs.slice(0, 5).map((song, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap font-bold">
                  {song.current_position || index + 1}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/songs/${song.slug}`}
                    className="text-gray-900 font-bold hover:text-pink-600 transition-colors"
                  >
                    {song.title}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/artist/${song.artist_slug}`}
                    className="text-pink-600 hover:text-gray-900 transition-colors"
                  >
                    {song.artist}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center">
        <Link
          href="/current-hot100"
          className="inline-block px-6 py-2 bg-pink-600 text-white font-semibold rounded-full shadow-md hover:bg-pink-700 hover:text-white transform"
        >
          View Full Hot 100 Chart
        </Link>
      </div>
    </section>
  );
}
