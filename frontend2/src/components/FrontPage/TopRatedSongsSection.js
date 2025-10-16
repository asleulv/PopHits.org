import Link from "next/link";
import { Flame } from "lucide-react";

export default function TopRatedSongsSection({ topRatedSongs }) {
  if (topRatedSongs.length === 0) {
    return (
      <section className="mb-8 text-black p-6 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm">
        <h2 className="text-xl md:text-3xl font-cherry font-semibold mb-6 text-center flex items-center justify-center gap-2">
          <Flame className="hidden lg:block w-8 h-8 text-pink-500" />
          <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">
            Top 10 User-Rated Billboard Chart Hits
          </span>
        </h2>
        <div className="flex justify-center items-center py-12">
          <p className="text-xl">Loading top rated songs...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8 text-black p-6 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm">
      <h2 className="text-xl md:text-3xl font-cherry font-semibold mb-6 text-center flex items-center justify-center gap-2">
        <Flame className="hidden lg:block w-8 h-8 text-pink-500" />
        <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">
          Top 10 User-Rated Billboard Chart Hits
        </span>
      </h2>

      {/* Mobile Layout */}
      <div className="block md:hidden space-y-3">
        {topRatedSongs.map((song, index) => (
          <div
            key={song.id}
            className="flex items-start justify-between py-2 border-b border-gray-200 last:border-b-0"
          >
            <div className="flex gap-3 flex-1 min-w-0">
              <span className="text-gray-400 font-semibold text-sm w-6 text-center">
                #{index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/songs/${song.slug}`}
                  className="text-gray-800 font-semibold text-sm hover:text-pink-600 transition-colors block truncate"
                >
                  {song.title}
                </Link>
                <div className="text-xs text-gray-500 mt-0.5">
                  <Link
                    href={`/artist/${song.artist_slug}`}
                    className="text-pink-600 hover:text-gray-800 transition-colors"
                  >
                    {song.artist}
                  </Link>
                </div>
                <div className="text-xs text-gray-500">
                  <Link
                    href={`/year/${song.year}`}
                    className="text-gray-500 hover:text-pink-600 transition-colors"
                  >
                    {song.year}
                  </Link>
                </div>
              </div>
            </div>
            <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full ml-2 flex-shrink-0">
              {song.average_user_score}
            </span>
          </div>
        ))}
      </div>

      {/* Desktop Layout - keep the same */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200 border-collapse">
          <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Artist
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Year
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Rating
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {topRatedSongs.map((song, index) => (
              <tr
                key={song.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-4 py-3 whitespace-nowrap text-base">
                  <span className="font-semibold">
                    {index === 0 ? (
                      <span className="text-yellow-500 text-xl">1</span>
                    ) : index === 1 ? (
                      <span className="text-gray-400 text-lg">2</span>
                    ) : index === 2 ? (
                      <span className="text-amber-600 text-lg">3</span>
                    ) : (
                      index + 1
                    )}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-base">
                  <Link
                    href={`/songs/${song.slug}`}
                    className="text-gray-800 font-bold hover:text-pink-600 transition-colors"
                  >
                    {song.title}
                  </Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-base">
                  <Link
                    href={`/artist/${song.artist_slug}`}
                    className="text-pink-600 hover:text-gray-800 transition-colors"
                  >
                    {song.artist}
                  </Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-base">
                  <Link
                    href={`/year/${song.year}`}
                    className="text-cyan-600 hover:text-pink-600 transition-colors"
                  >
                    {song.year}
                  </Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-base">
                  <span className="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold px-3 py-1 rounded-full">
                    {song.average_user_score}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-6">
        <Link
          href="/songs?sort_by=average_user_score&order=desc"
          className="inline-block px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-full shadow-md hover:from-pink-600 hover:to-pink-700 transition-all hover:text-white duration-300 transform"
        >
          All rated songs
        </Link>
      </div>
    </section>
  );
}
