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
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200 border-collapse">
          <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
            <tr className="hidden md:table-row">
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
                className="flex flex-col md:table-row md:w-full text-center md:text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="flex md:table-cell px-4 py-3 whitespace-nowrap text-black text-xl md:text-base items-center justify-center md:justify-start">
                  <span className="block md:hidden font-medium text-gray-500">
                    #{index + 1}
                  </span>
                  <span className="hidden md:block font-semibold">
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

                <td className="flex flex-col md:table-cell px-4 py-3 whitespace-nowrap text-sm md:text-base">
                  <span className="block md:hidden text-gray-700 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 p-1 rounded-lg shadow-sm">
                    <Link
                      href={`/songs/${song.slug}`}
                      className="text-gray-700 font-bold text-lg hover:text-pink-600 transition-colors break-words whitespace-normal"
                    >
                      {song.title}
                    </Link>
                    <br className="block md:hidden" />{" "}
                    <Link
                      href={`/artist/${song.artist_slug}`}
                      className="text-pink-600 text-lg hover:text-gray-800 transition-colors"
                    >
                      {song.artist}
                    </Link>
                    <br className="block md:hidden" />{" "}
                    <Link
                      href={`/year/${song.year}`}
                      className="text-cyan-500 hover:text-pink-600 font-semibold transition-colors"
                    >
                      {song.year}
                    </Link>
                    <br className="block md:hidden" />{" "}
                    <span className="block md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full text-lg font-medium bg-pink-500 text-white">
                      {song.average_user_score}
                    </span>
                  </span>

                  <span className="hidden md:block">
                    <Link
                      href={`/songs/${song.slug}`}
                      className="text-gray-800 font-bold hover:text-pink-600 transition-colors"
                    >
                      {song.title}
                    </Link>
                  </span>
                </td>

                <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-sm md:text-base">
                  <Link
                    href={`/artist/${song.artist_slug}`}
                    className="text-pink-600 hover:text-gray-800 transition-colors"
                  >
                    {song.artist}
                  </Link>
                </td>
                <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-sm md:text-base">
                  <Link
                    href={`/year/${song.year}`}
                    className="text-cyan-600 hover:text-pink-600 transition-colors"
                  >
                    {song.year}
                  </Link>
                </td>
                <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-sm md:text-base">
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
