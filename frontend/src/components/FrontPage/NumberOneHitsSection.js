import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getNumberOneHits } from "../../services/api";
import { Trophy, Music, Calendar, Clock } from "lucide-react";
import { Grid } from "react-loader-spinner";

const NumberOneHitsSection = () => {
  const [numberOneHits, setNumberOneHits] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNumberOneHits = async () => {
      try {
        setLoading(true);
        const response = await getNumberOneHits();
        setNumberOneHits(response.data || response);
        setLoading(false);
      } catch (err) {
        setError("Error fetching number one hits");
        setLoading(false);
      }
    };

    fetchNumberOneHits();
  }, []);

  // Function to get 10 random number one hits
  const getRandomNumberOneHits = () => {
    if (numberOneHits.length > 0) {
      return numberOneHits.sort(() => Math.random() - 0.5).slice(0, 8);
    }
    return [];
  };

  const randomNumberOneHits = getRandomNumberOneHits();

  return (
    <section className="mb-12 p-8 w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 lg:rounded-xl shadow-xl text-white">
      <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-8">
        <h2 className="text-xl md:text-3xl font-cherry font-semibold flex items-center gap-3 text-center">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">The Number Ones</span>
        </h2>
        <Link
          to="/songs?filter=number-one"
          className="ml-3 px-4 py-2 rounded-md bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-semibold text-sm shadow-md transform transition-all duration-300 hover:scale-105"
        >
          View Full List
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Grid
            visible={true}
            height="60"
            width="60"
            ariaLabel="grid-loading"
            color="#f472b6"
          />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center p-6 bg-gray-800 rounded-lg">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {randomNumberOneHits.length > 0 ? (
            randomNumberOneHits.map((song) => (
              <div
                key={song.id}
                className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:from-gray-700 hover:to-gray-750"
              >
                <div className="text-center">
                  <h3 className="text-lg md:text-xl font-semibold mb-2">
                    <Link
                      to={`/songs/${song.slug}`}
                      className="text-white hover:text-pink-400 transition-colors"
                    >
                      {song.title}
                    </Link>
                  </h3>
                  
                  <p className="text-md mb-3">
                    <span className="text-gray-300">by</span>{" "}
                    <Link
                      to={`/artist/${song.artist_slug}`}
                      className="text-pink-300 hover:text-pink-200 transition-colors font-medium"
                    >
                      {song.artist}
                    </Link>
                  </p>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <Link
                      to={`/year/${song.year}`}
                      className="text-cyan-300 hover:text-cyan-200 transition-colors"
                    >
                      {song.year}
                    </Link>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-600 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  <p className="text-sm font-medium text-gray-200">
                    <span className="text-green-400 font-bold">{song.weeks_on_chart}</span> weeks on chart
                  </p>
                </div>
                
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
            ))
          ) : (
            <p className="text-center text-pink-300 col-span-4 p-6 bg-gray-800 rounded-lg">
              No number one hits available.
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default NumberOneHitsSection;
