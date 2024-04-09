// Navbar.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/auth";
import { slide as Menu } from "react-burger-menu";
import oldhitsLogo from './oldhits_logo.png';

const Navbar = ({ isAuthenticated }) => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // This effect will run whenever isAuthenticated changes
  }, [isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled beyond a certain threshold
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // Call your logout API function (auth service)
      await logoutUser();

      // Redirect to the home page after successful logout
      navigate("/");
    } catch (error) {
      // Handle logout error (show error message, etc.)
    }
  };

  return (
    <nav className={`navbar bg-gray-800 p-4 ${isScrolled ? "scrolled" : ""}`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Site Logo */}
          <img src={oldhitsLogo} alt="old.hits" className="navbar-logo" />
        </div>
        {/* Hamburger Menu Icon */}
        <Menu
          right
          isOpen={menuOpen}
          onStateChange={(state) => setMenuOpen(state.isOpen)}
        >
          <ul className="flex flex-col space-y-4 text-white">
            <li className="navbar-menu-item">
              <Link
                to="/"
                className="navbar-menu-link hover:text-gray-300"
                onClick={() => setMenuOpen(false)}
              >
                🙃 Random hit
              </Link>
            </li>
            <li className="navbar-menu-item">
              <Link
                to="/songs"
                className="navbar-menu-link hover:text-gray-300"
                onClick={() => setMenuOpen(false)}
              >
                😱 All hits
              </Link>
            </li>

            <li className="navbar-menu-item">
              <Link
                to="/about"
                className="navbar-menu-link hover:text-gray-300"
                onClick={() => setMenuOpen(false)}
              >
                😴 About
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                {/* Render these links if the user is authenticated */}
                <li className="navbar-menu-item">
                  <Link
                    to="/profile"
                    className="navbar-menu-link hover:text-gray-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    🧐 Profile
                  </Link>
                </li>
                <li className="navbar-menu-item">
                  <button
                    className="navbar-menu-link hover:text-gray-300 focus:outline-none"
                    onClick={handleLogout}
                  >
                    🤬 Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Render these links if the user is not authenticated */}
                <li className="navbar-menu-item">
                  <Link
                    to="/register"
                    className="navbar-menu-link hover:text-gray-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    ✏️ Register
                  </Link>
                </li>
                <li className="navbar-menu-item">
                  <Link
                    to="/login"
                    className="navbar-menu-link hover:text-gray-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    🎉 Login
                  </Link>
                </li>
              </>
            )}
            <hr />
            <li className="navbar-menu-item">
              <Link
                to="https://hitquiz.me/"
                className="navbar-menu-link hover:text-gray-300"
                onClick={() => setMenuOpen(false)}
              >
                🎯 HitQuiz.me
              </Link>
            </li>
          </ul>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
