import React from "react";
import { useAuth } from "../../services/auth";
import { Link } from "react-router-dom";
import oldhitsLogo from "../Navbar/oldhits_logo.png";

const Footer = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-12">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-4">
        {/* Left side: logo, site info, and description */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-x-0 md:space-x-3 text-sm md:text-base text-center md:text-left max-w-md">
          <img
            src={oldhitsLogo}
            alt="old.hits"
            className="w-12 h-12 object-contain mb-2 md:mb-0"
          />
          <div>
            <p>© {new Date().getFullYear()} PopHits.org by Asle</p>
            {isAuthenticated && (
              <p>
                <a
                  href="mailto:contact@pophits.org"
                  className="inline-block mt-1 text-blue-500 hover:underline"
                >
                  📧 Contact Us
                </a>
              </p>
            )}
            <p className="mt-2 text-gray-400 leading-relaxed max-w-xs">
              PopHits.org is a website made by a hit music nerd while listening to Brian Eno, for other hit music nerds who love discovering and enjoying great hits.
            </p>
          </div>
        </div>

        {/* Right side: nav links */}
        <nav className="flex space-x-6 text-sm md:text-base">
          <Link to="/" className="hover:text-blue-500 hover:underline text-blue-400">
            Home
          </Link>
          <Link to="/songs" className="hover:text-blue-500 hover:underline text-blue-400">
            Songs
          </Link>
          <Link
            to="/playlist-generator"
            className="hover:text-blue-500 hover:underline text-blue-400"
          >
            Playlist Generator
          </Link>
          <Link
            to="/quiz-generator"
            className="hover:text-blue-500 hover:underline text-blue-400"
          >
            Quiz Generator
          </Link>
          <Link to="/about" className="hover:text-blue-500 hover:underline text-blue-400">
            About
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
