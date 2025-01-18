// src/containers/App.js
import React, { useEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import About from "../components/About/About";
import FrontPage from "../components/FrontPage/FrontPage";
import SongList from "../components/SongList/SongList";
import SongDetail from "../components/SongDetail/SongDetail";
import PlaylistGenerator from "../components/PlaylistGenerator/PlaylistGenerator";
import QuizGenerator from "../components/QuizGenerator/QuizGenerator";
import CookiePolicy from "../components/CookiePolicy/CookiePolicy";
import Register from "../components/users/Register";
import Login from "../components/users/Login";
import Profile from "../components/users/Profile";
import ProfileUpdate from "../components/users/ProfileUpdate";
import ResetPassword from "../components/users/ResetPassword";
import ConfirmPasswordReset from "../components/users/ConfirmResetPassword";
import { useAuth } from "../services/auth";
import { getRandomHit } from "../services/api";
import { ThreeDots } from "react-loader-spinner";
import CookieConsent from 'react-cookie-consent'; // Import CookieConsent
import usePageTracking from "../hooks/usePageTracking"; // Import your custom hook

const queryClient = new QueryClient();

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
  usePageTracking(); // Ensure this is inside a Router context
  const { isAuthenticated } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>

        <Navbar isAuthenticated={isAuthenticated} />
        <div className="app-container">
          {/* Cookie Consent Banner */}
          <CookieConsent
            location="bottom"
            buttonText="I accept"
            cookieName="myAwesomeCookie"
            style={{ background: "#2B373B", color: "#fff", padding: "10px" }}
            buttonStyle={{ color: "#4e503b", fontSize: "13px", background: "#FFD700" }}
            expires={150}
          >
            This website uses cookies to enhance the user experience.{" "}
            <a href="/privacy-policy" style={{ color: "#FFD700" }}>Learn more</a>
          </CookieConsent>

          <Routes>
            <Route path="/" element={<FrontPage />} />
            <Route path="/search" element={<SongList />} />
            <Route path="/random" element={<RandomSongRedirect />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<CookiePolicy />} />
            <Route path="/songs" element={<SongList />} />
            <Route path="/playlist-generator" element={<PlaylistGenerator />} />
            <Route path="/quiz-generator" element={<QuizGenerator />} />
            <Route path="/songs/:slug" element={<SongDetail />} />
            <Route path="/artist/:artist_slug" element={<SongList />} />
            <Route path="/year/:year" element={<SongList />} />
            <Route path="/artist/:artist_slug/year/:year" element={<SongList />} />
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

    </QueryClientProvider>
  );
};

export default App;
