import React, { useEffect, useRef, useState } from "react";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  useNavigate,
} from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import About from "../components/About/About";
import SongList from "../components/SongList/SongList";
import SongDetail from "../components/SongDetail/SongDetail";
import Register from "../components/users/Register";
import Login from "../components/users/Login";
import Profile from "../components/users/Profile";
import ProfileUpdate from "../components/users/ProfileUpdate";
import ResetPassword from "../components/users/ResetPassword";
import ConfirmPasswordReset from "../components/users/ConfirmResetPassword";
import { useAuth } from "../services/auth";
import { getRandomHit } from "../services/api";
import { ThreeDots } from "react-loader-spinner";

const RandomSongRedirect = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!hasRedirected.current) {
      const fetchAndRedirect = async () => {
        try {
          const song = await getRandomHit(); // Updated function call
          navigate(`/songs/${song.slug}`);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false); // Set loading to false when fetch completes
        }
      };

      fetchAndRedirect();

      hasRedirected.current = true;
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ThreeDots
          visible={loading} // Show spinner only when loading is true
          height="80"
          width="80"
          color="#0d458b"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  return null;
};

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<RandomSongRedirect />} />
          <Route path="/about" element={<About />} />
          <Route path="/songs" element={<SongList />} />
          <Route path="/songs/:slug" element={<SongDetail />} />
          <Route path="/artist/:artist_slug" element={<SongList />} />
          <Route path="/year/:year" element={<SongList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/update" element={<ProfileUpdate />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/confirm-reset-password/:uid/:token"
            element={<ConfirmPasswordReset />}
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
