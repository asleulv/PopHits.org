"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { slide as Menu } from "react-burger-menu";
import { FaHouseUser, FaUser, FaDiceD6 } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import { BsMusicPlayerFill, BsListOl } from "react-icons/bs";

import { RiLogoutBoxRFill, RiUserAddLine } from "react-icons/ri";
import { Home, CircleAlert, ListMusic, TrendingUp, Search, BookOpen } from "lucide-react";
import { GiBullseye } from "react-icons/gi";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logoutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/songs?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <nav
        className={`navbar bg-gradient-to-r from-pink-400 via-pink-500 to-purple-700 p-4 ${
          scrolled ? "scrolled" : ""
        }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Site Logo */}
            <Link href="/">
              <Image
                src="/gfx/oldhits_logo.png"
                alt="PopHits.org Logo"
                width={65}
                height={65}
                style={{ width: "auto", height: "auto" }}
                priority
                className="navbar-logo drop-shadow-xl"
              />
            </Link>
          </div>

          {/* Desktop Search Bar - Hidden on Mobile */}
          <div className="hidden md:block md:w-1/3">
            <form
              onSubmit={handleSearch}
              className="flex rounded-full shadow-2xl"
            >
              <input
                type="text"
                placeholder="Artist / Song"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-l-full bg-gray-800 text-white border-0 focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-pink-300"
              />
              <button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-r-full transition-colors"
              >
                <Search size={20} />
              </button>
            </form>
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
                  href="/"
                  className="navbar-menu-link hover:text-gray-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="navbar-menu-icon">
                    <Home />
                  </span>
                  Home
                </Link>
              </li>
              <li className="navbar-menu-item">
                <Link
                  href="/songs"
                  className="navbar-menu-link hover:text-gray-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="navbar-menu-icon">
                    <BsMusicPlayerFill />
                  </span>
                  Database
                </Link>
              </li>

              <li className="navbar-menu-item">
                <Link
                  href="/playlist-generator"
                  className="navbar-menu-link hover:text-gray-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="navbar-menu-icon">
                    <BsListOl />
                  </span>
                  Create Playlist
                </Link>
              </li>

              <li className="navbar-menu-item">
                <Link
                  href="/quiz-generator"
                  className="navbar-menu-link hover:text-gray-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="navbar-menu-icon">
                    <MdQuiz />
                  </span>
                  Create Quiz
                </Link>
              </li>

              <li className="navbar-menu-item">
                <Link
                  href="/current-hot100"
                  className="navbar-menu-link hover:text-gray-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="navbar-menu-icon">
                    <TrendingUp size={18} />
                  </span>
                  Current Hot 100
                </Link>
              </li>

              <li className="navbar-menu-item">
                <Link
                  href="/random"
                  className="navbar-menu-link hover:text-gray-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="navbar-menu-icon">
                    <FaDiceD6 />
                  </span>
                  Random hit
                </Link>
              </li>

              <li className="navbar-menu-item">
                <Link
                  href="/blog"
                  className="navbar-menu-link hover:text-gray-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="navbar-menu-icon">
                    <BookOpen />
                  </span>
                  Blog
                </Link>
              </li>

              <li className="navbar-menu-item">
                <Link
                  href="/about"
                  className="navbar-menu-link hover:text-gray-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="navbar-menu-icon">
                    <CircleAlert />
                  </span>
                  About
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li className="navbar-menu-item">
                    <Link
                      href="/profile"
                      className="navbar-menu-link hover:text-gray-300"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="navbar-menu-icon">
                        <FaHouseUser />
                      </span>
                      Profile
                    </Link>
                  </li>
                  <li className="navbar-menu-item">
                    <button
                      className="navbar-menu-link hover:text-gray-300 focus:outline-none"
                      onClick={handleLogout}
                    >
                      <RiLogoutBoxRFill className="navbar-menu-icon" /> Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="navbar-menu-item">
                    <Link
                      href="/register"
                      className="navbar-menu-link hover:text-gray-300"
                      onClick={() => setMenuOpen(false)}
                    >
                      <RiUserAddLine className="navbar-menu-icon" /> Register
                    </Link>
                  </li>
                  <li className="navbar-menu-item">
                    <Link
                      href="/login"
                      className="navbar-menu-link hover:text-gray-300"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FaUser className="navbar-menu-icon" /> Login
                    </Link>
                  </li>
                </>
              )}
              <hr />
              <li className="navbar-menu-item">
                <Link
                  href="https://hitquiz.me/"
                  className="navbar-menu-link hover:text-gray-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <GiBullseye className="navbar-menu-icon" /> HitQuiz.me
                </Link>
              </li>
            </ul>
          </Menu>
        </div>
      </nav>

      {/* Mobile Search Bar - Only visible on mobile */}
      <div className="bg-gradient-to-r from-gray-700 to-black p-2 md:hidden">
        <div className="container mx-auto">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="ARTIST / SONG"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-l-full bg-gray-800 text-white border-0 focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder-pink-300"
            />
            <button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-r-full transition-colors"
            >
              <Search size={20} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
