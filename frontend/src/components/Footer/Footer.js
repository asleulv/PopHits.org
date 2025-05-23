import React from "react";
import { useAuth } from "../../services/auth";
import { Link } from "react-router-dom";
import oldhitsLogo from "../Navbar/oldhits_logo.png";
import { Heart, Music, Home, Info, List, HelpCircle } from "lucide-react";

const Footer = () => {
  const { isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-10 mt-16 shadow-lg">
      <div className="container mx-auto">
        {/* Top section with logo and description */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={oldhitsLogo}
            alt="PopHits.org Logo"
            className="w-16 h-16 object-contain mb-4 animate-pulse"
          />
          <h3 className="text-xl font-cherry font-bold mb-2 bg-gradient-to-r from-white to-white bg-clip-text text-transparent">
            PopHits.org
          </h3>
          <p className="text-center text-gray-400 max-w-lg mx-auto px-4 text-sm md:text-base">
            A website made by a hit music nerd while listening to Brian Eno, for other hit music nerds who love discovering and enjoying great hits.
          </p>
        </div>

        {/* Middle section with navigation links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8 px-4">
          <div className="flex flex-col items-center">
            <Home className="w-5 h-5 text-pink-400 mb-2" />
            <Link to="/" className="text-gray-300 hover:text-pink-300 transition-colors text-sm md:text-base">
              Home
            </Link>
          </div>
          
          <div className="flex flex-col items-center">
            <Music className="w-5 h-5 text-blue-400 mb-2" />
            <Link to="/songs" className="text-gray-300 hover:text-blue-300 transition-colors text-sm md:text-base">
              Songs Database
            </Link>
          </div>
          
          <div className="flex flex-col items-center">
            <List className="w-5 h-5 text-green-400 mb-2" />
            <Link to="/playlist-generator" className="text-gray-300 hover:text-green-300 transition-colors text-sm md:text-base">
              Playlist Generator
            </Link>
          </div>
          
          <div className="flex flex-col items-center">
            <HelpCircle className="w-5 h-5 text-yellow-400 mb-2" />
            <Link to="/quiz-generator" className="text-gray-300 hover:text-yellow-300 transition-colors text-sm md:text-base">
              Quiz Generator
            </Link>
          </div>
          
          <div className="flex flex-col items-center">
            <Info className="w-5 h-5 text-purple-400 mb-2" />
            <Link to="/about" className="text-gray-300 hover:text-purple-300 transition-colors text-sm md:text-base">
              About
            </Link>
          </div>
          
          {isAuthenticated && (
            <div className="flex flex-col items-center">
              <Heart className="w-5 h-5 text-red-400 mb-2" />
              <a
                href="mailto:contact@pophits.org"
                className="text-gray-300 hover:text-red-300 transition-colors text-sm md:text-base"
              >
                Contact Us
              </a>
            </div>
          )}
        </div>

        {/* Bottom section with copyright */}
        <div className="border-t border-gray-700 pt-6 text-center px-4">
          <p className="text-sm text-gray-500">
            © {currentYear} PopHits.org by Asle. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-4">

            <Link to="/privacy-policy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Cookie Policy
            </Link>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
