import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRandomSongWithSpotifyURL } from "../../services/api";
import { MagnifyingGlass } from "react-loader-spinner";

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [randomSong, setRandomSong] = useState(null);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    console.log("HomePage mounted");

    const fetchRandomSong = async () => {
      try {
        const song = await getRandomSongWithSpotifyURL();
        setRandomSong(song);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching random song:", error);
        setIsLoading(false);
      }
    };

    fetchRandomSong();

    return () => {
      console.log("HomePage unmounted");
    };
  }, []);

  useEffect(() => {
    if (!isLoading && randomSong && !hasNavigated) {
      console.log("Navigating to song:", randomSong.slug);
      navigate(`/songs/${randomSong.slug}`);
      setHasNavigated(true);
    }
  }, [isLoading, randomSong, navigate, hasNavigated]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <MagnifyingGlass
          visible={true}
          height="80"
          width="80"
          ariaLabel="magnifying-glass-loading"
          wrapperStyle={{}}
          wrapperClass="magnifying-glass-wrapper"
          glassColor="#c0efff"
          color="#e15b64"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="homepage-header">
        <h1 className="homepage-header-title">Just a random hit</h1>
        <p className="homepage-header-text">Have you heard this one before?</p>
      </div>

      {randomSong && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="artist-title">{randomSong.title}</h2>
          <h2 className="song-title">
            by{" "}
            <a href={`/artist/${randomSong.artist_slug}`}>
              {randomSong.artist}
            </a>
          </h2>
        </div>
      )}
    </div>
  );
};

export default HomePage;
