import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCurrentHot100 } from "../../services/api";
import { Grid } from "react-loader-spinner";
import { ArrowUp, ArrowDown, Minus, Star, Calendar, Music, TrendingUp } from "lucide-react";
import { Helmet } from "react-helmet";

const CurrentHot100 = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentHot100 = async () => {
      try {
        setLoading(true);
        const data = await getCurrentHot100();
        setChartData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching current Hot 100:", err);
        setError("Failed to load the current Billboard Hot 100 chart. Please try again later.");
        setLoading(false);
      }
    };

    fetchCurrentHot100();
  }, []);

  // Format the chart date for display
  const formatChartDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Render position change indicator
  const renderPositionChange = (positionChange) => {
    if (positionChange === null || positionChange === undefined) {
      return (
        <span className="flex items-center text-gray-500">
          <Star className="w-4 h-4 mr-1" />
          <span>New</span>
        </span>
      );
    } else if (positionChange > 0) {
      return (
        <span className="flex items-center text-green-500">
          <ArrowUp className="w-4 h-4 mr-1" />
          <span>{positionChange}</span>
        </span>
      );
    } else if (positionChange < 0) {
      return (
        <span className="flex items-center text-red-500">
          <ArrowDown className="w-4 h-4 mr-1" />
          <span>{Math.abs(positionChange)}</span>
        </span>
      );
    } else {
      return (
        <span className="flex items-center text-gray-500">
          <Minus className="w-4 h-4 mr-1" />
          <span>-</span>
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Grid
          visible={true}
          height="80"
          width="80"
          ariaLabel="grid-loading"
          wrapperStyle={{}}
          wrapperClass="grid-wrapper"
          color="#f472b6"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (!chartData || !chartData.songs || chartData.songs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">No data available!</strong>
          <span className="block sm:inline"> The current Billboard Hot 100 chart is not available at the moment.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Current Billboard Hot 100 Chart | PopHits.org</title>
        <meta
          name="description"
          content="View the latest Billboard Hot 100 chart with current rankings, position changes, and song details."
        />
      </Helmet>

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-cherry font-bold mb-4   bg-clip-text text-transparent">
          Current Billboard Hot 100
        </h1>
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Calendar className="w-5 h-5 text-pink-500" />
          <p className="text-lg">
            Chart date: <span className="font-semibold">{formatChartDate(chartData.chart_date)}</span>
          </p>
        </div>
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <div className="space-y-4">
          {chartData.songs.map((song, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              {/* First line: Rank number + Arrows up/down or stars */}
              <div className="flex items-center justify-center mb-3">
                <span className="font-bold text-xl mr-2">{song.current_position || index + 1}</span>
                <div>{renderPositionChange(song.position_change)}</div>
              </div>
              
              {/* Second line: Title */}
              <div className="mb-2 text-center">
                <Link
                  to={`/songs/${song.slug}`}
                  className="text-gray-900 font-medium hover:text-pink-600 transition-colors"
                >
                  {song.title}
                </Link>
              </div>
              
              {/* Third line: Artist */}
              <div className="mb-3 text-center">
                <Link
                  to={`/artist/${song.artist_slug}`}
                  className="text-pink-600 hover:text-gray-900 transition-colors"
                >
                  {song.artist}
                </Link>
              </div>
              
              {/* Fourth line: Last week, peak, and number of weeks */}
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                  Last week: {song.last_week_position ? `#${song.last_week_position}` : "-"}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                  Peak: #{song.peak_rank || "-"}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                  Weeks: {song.weeks_on_chart || 0}
                </span>
              </div>
              
              {/* Fifth line: Spotify button */}
              {song.spotify_url && (
                <div className="mt-3 text-center">
                  <a 
                    href={song.spotify_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block text-xs bg-green-800 hover:text-white hover:bg-green-700 text-green-100 px-3 py-1 rounded-full transition-colors"
                  >
                    Listen on Spotify
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Desktop view */}
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
              {chartData.songs.map((song, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-bold text-lg">{song.current_position || index + 1}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {renderPositionChange(song.position_change)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <Link
                        to={`/songs/${song.slug}`}
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
                      to={`/artist/${song.artist_slug}`}
                      className="text-pink-600 hover:text-gray-900 transition-colors"
                    >
                      {song.artist}
                    </Link>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm  font-medium bg-gray-200 text-black">
                      {song.last_week_position ? `#${song.last_week_position}` : "-"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium bg-yellow-200 text-black">
    {song.peak_rank ? `#${song.peak_rank}` : "-"}
  </span>
</td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm  font-medium bg-cyan-200 text-black">
                      {song.weeks_on_chart ? `${song.weeks_on_chart}` : "-"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-pink-500" />
          <span>About the Billboard Hot 100</span>
        </h2>
        <p className="text-gray-700 mb-4">
          The Billboard Hot 100 is the music industry standard record chart in the United States for songs, published weekly by Billboard magazine. Chart rankings are based on sales (physical and digital), radio play, and online streaming in the United States.
        </p>
        <p className="text-gray-700">
          This page shows the current Billboard Hot 100 chart, updated weekly. The chart date shown represents when the chart was officially published by Billboard. Position changes indicate movement from the previous week's chart.
        </p>
      </div>
    </div>
  );
};

export default CurrentHot100;
