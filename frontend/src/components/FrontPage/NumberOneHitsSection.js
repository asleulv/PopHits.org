import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getNumberOneHits } from "../../services/api";
import { Trophy } from "lucide-react";

const NumberOneHitsSection = () => {
  const [numberOneHits, setNumberOneHits] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNumberOneHits = async () => {
      try {
        const response = await getNumberOneHits();
        setNumberOneHits(response.data || response);
      } catch (err) {
        setError("Error fetching number one hits");
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
    <section className="mb-12 p-6 w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 lg:rounded-xl shadow-xl text-white">
      <h2 className="text-xl md:text-3xl font-cherry font-semibold mb-6 flex items-center justify-center gap-3 text-center text-pink-400">
        <Trophy className="w-7 h-7" />
        The Number Ones
        <Link
          to="/songs?filter=number-one"
          className="ml-3 px-3 py-1 rounded-md bg-pink-600 hover:bg-pink-700 hover:text-pink-100 transition-colors duration-300 text-white font-semibold text-sm"
        >
          Full List
        </Link>
      </h2>

      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {randomNumberOneHits.length > 0 ? (
            randomNumberOneHits.map((song) => (
              <div
                key={song.id}
                className="bg-gray-700 rounded-lg p-5 shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg md:text-xl font-semibold mb-1">
                    <Link
                      to={`/songs/${song.slug}`}
                      className="text-white hover:text-pink-400"
                    >
                      {song.title}
                    </Link>{" "}
                    <Link
                      to={`/year/${song.year}`}
                      className="text-white hover:text-pink-400"
                    >
                      ({song.year})
                    </Link>
                  </h3>
                  <p className="text-md mb-1">
                    by{" "}
                    <Link
                      to={`/artist/${song.artist_slug}`}
                      className="text-pink-300 hover:text-pink-400"
                    >
                      {song.artist}
                    </Link>
                  </p>
                </div>
                <p className="mt-3 text-sm font-bold text-white">
                  Weeks on Chart: {song.weeks_on_chart}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-pink-300">
              No number one hits available.
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default NumberOneHitsSection;
