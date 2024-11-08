import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNumberOneHits } from '../../services/api';

const NumberOneHitsSection = () => {
  const [numberOneHits, setNumberOneHits] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNumberOneHits = async () => {
      try {
        const response = await getNumberOneHits();
        setNumberOneHits(response.data || response);
      } catch (err) {
        setError('Error fetching number one hits');
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
    <section className="mb-12 text-black p-6 w-full">
      <h2 className="text-xl md:text-2xl font-cherry font-semibold mb-4 text-center">
        🔥 The number ones{' '}
        <Link to="/songs?filter=number-one" className="text-blue-500 hover:underline">
          (full list)
        </Link>
      </h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {randomNumberOneHits.length > 0 ? (
            randomNumberOneHits.map((song) => (
              <div
                key={song.id}
                className="bg-gray-800 p-6 shadow-lg text-center hover:shadow-2xl transition-shadow ease-in-out duration-300 text-white"
              >
                <h3 className="text-xl font-semibold mb-2">
                  <Link to={`/songs/${song.slug}`} className="text-blue-200 hover:underline">
                    {song.title}
                  </Link>
                </h3>
                <p className="text-sm mb-2">
                  by{' '}
                  <Link to={`/artist/${song.artist_slug}`} className="text-blue-200 hover:underline">
                    {song.artist}
                  </Link>
                </p>
                <p className="text-xs text-gray-400">
                  <Link to={`/year/${song.year}`} className="text-blue-200 hover:underline">
                    {song.year}
                  </Link>
                </p>
                <p className="mt-2 text-sm font-bold">
                  Weeks on Chart: {song.weeks_on_chart}
                </p>
              </div>
            ))
          ) : (
            <p>No number one hits available.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default NumberOneHitsSection;