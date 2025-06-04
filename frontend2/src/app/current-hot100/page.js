import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, Calendar, Music, ArrowUp, ArrowDown, Minus, Star } from 'lucide-react';
import { getCurrentHot100 } from '@/lib/api';

export const metadata = {
  title: 'Current Billboard Hot 100 | PopHits.org',
  description: 'View the current Billboard Hot 100 chart. See what songs are trending right now in the music world.',
  keywords: 'current hot 100, billboard hot 100, trending songs, popular music, current hits',
  openGraph: {
    title: 'Current Billboard Hot 100 | PopHits.org',
    description: 'View the current Billboard Hot 100 chart. See what songs are trending right now in the music world.',
    url: 'https://pophits.org/current-hot100',
    siteName: 'PopHits.org',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Current Billboard Hot 100 | PopHits.org',
    description: 'View the current Billboard Hot 100 chart. See what songs are trending right now in the music world.',
  },
  alternates: {
    canonical: 'https://pophits.org/current-hot100',
  },
};

export default async function CurrentHot100Page() {
  // Fetch current Hot 100 data
  const currentHot100Data = await getCurrentHot100();
  const songs = currentHot100Data.songs || [];
  const lastUpdated = currentHot100Data.last_updated || new Date().toISOString();
  
  // Format the last updated date
  const lastUpdatedDate = new Date(lastUpdated);
  const formattedDate = lastUpdatedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center bg-gradient-to-r from-pink-500 via-purple-600 to-purple-900 bg-clip-text text-transparent">
        <div className="flex items-center justify-center gap-2 px-1 py-1">
          <TrendingUp className="w-8 h-8 text-pink-500" />
          <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">
            Current Billboard Hot 100
          </span>
        </div>
      </h1>
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-8 text-center">
        <p className="text-gray-600">
          Last updated: <span className="font-semibold">{formattedDate}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          The Billboard Hot 100 is updated weekly. This data represents the most recent chart.
        </p>
      </div>
      
      <Suspense fallback={<div className="text-center py-12">Loading current Hot 100...</div>}>
        {songs.length > 0 ? (
          <>
            {/* Mobile view - Cards */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {songs.map((song) => (
                <div key={song.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 flex items-center justify-center bg-pink-500 text-white font-bold rounded-full mr-3">
                          {song.current_position}
                        </div>
                        <div>
                          <h2 className="font-bold text-gray-800 hover:text-pink-600 transition-colors">
                            <Link href={`/songs/${song.slug}`}>
                              {song.title}
                            </Link>
                          </h2>
                          <p className="text-pink-600 hover:text-gray-800 transition-colors">
                            <Link href={`/artist/${song.artist_slug}`}>
                              {song.artist}
                            </Link>
                          </p>
                        </div>
                      </div>
                      
                      <div className={`flex items-center ${
                        song.position_change > 0 
                          ? 'text-green-600' 
                          : song.position_change < 0 
                            ? 'text-red-600' 
                            : 'text-gray-500'
                      }`}>
                        {song.position_change > 0 && (
                          <>
                            <span className="text-xs mr-1">▲</span>
                            <span className="text-sm font-medium">{song.position_change}</span>
                          </>
                        )}
                        {song.position_change < 0 && (
                          <>
                            <span className="text-xs mr-1">▼</span>
                            <span className="text-sm font-medium">{Math.abs(song.position_change)}</span>
                          </>
                        )}
                        {song.position_change === 0 && (
                          <span className="text-sm font-medium">-</span>
                        )}
                        {song.position_change === null && (
                          <span className="text-sm font-medium text-blue-500">NEW</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        {song.weeks_on_chart} {song.weeks_on_chart === 1 ? 'week' : 'weeks'} on chart
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Music className="w-4 h-4 mr-1" />
                      <span>
                        Peak position: #{song.peak_rank}
                      </span>
                    </div>
                    
                    {song.spotify_url && (
                      <div className="mt-3">
                        <a 
                          href={song.spotify_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700 transition-colors"
                        >
                          <Image 
                            src="/icons/spotify.png" 
                            alt="Spotify" 
                            width={16} 
                            height={16} 
                          />
                          Listen on Spotify
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Desktop view - Table */}
            <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-16">Position</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-16">Change</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Artist</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24">Last Week</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24">Peak</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-24">Weeks on Chart</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {songs.map((song, index) => (
                      <tr key={song.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="font-bold text-lg">{song.current_position || index + 1}</span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {song.position_change > 0 ? (
                            <span className="flex items-center text-green-500">
                              <ArrowUp className="w-4 h-4 mr-1" />
                              <span>{song.position_change}</span>
                            </span>
                          ) : song.position_change < 0 ? (
                            <span className="flex items-center text-red-500">
                              <ArrowDown className="w-4 h-4 mr-1" />
                              <span>{Math.abs(song.position_change)}</span>
                            </span>
                          ) : song.position_change === 0 ? (
                            <span className="flex items-center text-gray-500">
                              <Minus className="w-4 h-4 mr-1" />
                              <span>-</span>
                            </span>
                          ) : (
                            <span className="flex items-center text-blue-500">
                              <Star className="w-4 h-4 mr-1" />
                              <span>New</span>
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <Link
                              href={`/songs/${song.slug}`}
                              className="text-gray-900 font-medium hover:text-pink-600 transition-colors"
                            >
                              {song.title}
                            </Link>
                            {song.spotify_url && (
                              <a 
                                href={song.spotify_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-block text-xs bg-green-800 hover:text-white hover:bg-green-700 text-green-100 px-2 py-0.5 rounded-full transition-colors mt-1 w-fit"
                              >
                                Listen on Spotify
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <Link
                            href={`/artist/${song.artist_slug}`}
                            className="text-pink-600 hover:text-gray-900 transition-colors"
                          >
                            {song.artist}
                          </Link>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium bg-gray-200 text-black">
                            {song.last_week_position ? `#${song.last_week_position}` : "-"}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium bg-yellow-200 text-black">
                            {song.peak_rank ? `#${song.peak_rank}` : "-"}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium bg-cyan-200 text-black">
                            {song.weeks_on_chart ? `${song.weeks_on_chart}` : "-"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Hot 100 Data Available</h2>
            <p className="text-gray-600">
              The current Billboard Hot 100 data is not available at the moment. Please check back later.
            </p>
          </div>
        )}
      </Suspense>
      
      <div className="mt-8 bg-gray-50 p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">About the Billboard Hot 100</h2>
        <p className="text-gray-600 mb-4">
          The Billboard Hot 100 is the music industry standard record chart in the United States for songs, published weekly by Billboard magazine. Chart rankings are based on sales (physical and digital), radio play, and online streaming in the United States.
        </p>
        <p className="text-gray-600">
          A new chart is compiled and officially released to the public by Billboard on Tuesdays but posted on the web on Mondays. The tracking week for sales and streaming begins on Friday and ends on Thursday, while the radio play tracking week runs from Monday to Sunday.
        </p>
      </div>
    </div>
  );
}
