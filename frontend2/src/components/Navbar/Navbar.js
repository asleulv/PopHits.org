"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { slide as Menu } from "react-burger-menu";
import { FaHouseUser, FaUser, FaDiceD6 } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import { BsMusicPlayerFill, BsListOl } from "react-icons/bs";
import { RiLogoutBoxRFill, RiUserAddLine } from "react-icons/ri";
import { Home, CircleAlert, Search, BookOpen, Loader2 } from "lucide-react";
import { GiBullseye } from "react-icons/gi";

export default function Navbar() {
  const [isPending, startTransition] = useTransition();
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
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery) {
      // This is the part that triggers the "Searching Database..." overlay
      startTransition(() => {
        router.push(`/songs?query=${encodeURIComponent(trimmedQuery)}`);
        router.refresh();
      });

      setSearchQuery("");
    }
  };

  return (
    <>
      {/* --- ADD THIS: Loading Overlay --- */}
      {isPending && (
        <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-300">
            <div className="relative">
              <Loader2
                className="w-20 h-20 animate-spin text-black"
                strokeWidth={2.5}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="inline-block bg-black text-white px-4 py-1 text-xs font-black italic uppercase tracking-[0.2em]">
                Status: Filtering Archive
              </h2>
              <p className="text-3xl font-black italic uppercase tracking-tighter text-black">
                Searching Database...
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Main Navigation Bar */}
      <nav
        className={`navbar bg-black border-amber-400 ${
          scrolled ? "scrolled shadow-2xl" : ""
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-3 md:gap-4 py-2 md:py-2">
            {/* Logo - Left Aligned */}
            <div className="flex-shrink-0 flex items-start -mt-4">
              <Logo className="text-2xl md:text-4xl" />
            </div>

            {/* Desktop Search Bar - Center/Flex Grow with spacing */}
            <div className="hidden md:flex flex-1 mx-6 min-w-0 items-center mr-4">
              <form
                onSubmit={handleSearch}
                className="w-full max-w-2xl flex rounded-full shadow-2xl overflow-hidden"
              >
                <input
                  type="text"
                  placeholder="Madonna, Like A Virgin, etc."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-5 py-3 bg-gray-800 text-white border-0 focus:outline-none placeholder-amber-300 text-sm"
                />
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-900 px-5 py-3 transition-colors font-medium"
                >
                  <Search size={20} />
                </button>
              </form>
            </div>

            {/* Hamburger Menu Icon - Right Aligned */}
            <div className="flex-shrink-0 flex items-start pt-1 md:pt-0">
              <Menu
                right
                isOpen={menuOpen}
                onStateChange={(state) => setMenuOpen(state.isOpen)}
              >
                <ul className="flex flex-col space-y-4 text-white">
                  <li className="navbar-menu-item">
                    <Link
                      href="/"
                      className="navbar-menu-link hover:text-amber-300"
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
                      className="navbar-menu-link hover:text-amber-300"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="navbar-menu-icon">
                        <BsMusicPlayerFill />
                      </span>
                      Song Database
                    </Link>
                  </li>

                  <li className="navbar-menu-item">
                    <Link
                      href="/artists"
                      className="navbar-menu-link hover:text-amber-300"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="navbar-menu-icon">
                        <FaUser />
                      </span>
                      Artist Database
                    </Link>
                  </li>

                  <li className="navbar-menu-item">
                    <Link
                      href="/playlist-generator"
                      className="navbar-menu-link hover:text-amber-300"
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
                      className="navbar-menu-link hover:text-amber-300"
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
                      href="/random"
                      className="navbar-menu-link hover:text-amber-300"
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
                      className="navbar-menu-link hover:text-amber-300"
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
                      className="navbar-menu-link hover:text-amber-300"
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
                          className="navbar-menu-link hover:text-amber-300"
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
                          className="navbar-menu-link hover:text-amber-300 focus:outline-none"
                          onClick={handleLogout}
                        >
                          <RiLogoutBoxRFill className="navbar-menu-icon" />{" "}
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="navbar-menu-item">
                        <Link
                          href="/register"
                          className="navbar-menu-link hover:text-amber-300"
                          onClick={() => setMenuOpen(false)}
                        >
                          <RiUserAddLine className="navbar-menu-icon" />{" "}
                          Register
                        </Link>
                      </li>
                      <li className="navbar-menu-item">
                        <Link
                          href="/login"
                          className="navbar-menu-link hover:text-amber-300"
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
                      className="navbar-menu-link hover:text-amber-300"
                      onClick={() => setMenuOpen(false)}
                    >
                      <GiBullseye className="navbar-menu-icon" /> HitQuiz.me
                    </Link>
                  </li>
                </ul>
              </Menu>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar - Only visible on mobile */}
      <div className="md:hidden bg-black border-b border-slate-700 p-3">
        <div className="container mx-auto">
          <form
            onSubmit={handleSearch}
            className="flex rounded-full overflow-hidden"
          >
            <input
              type="text"
              placeholder="Madonna, Like A Virgin, etc."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-900 text-white border-0 focus:outline-none placeholder-amber-300 text-sm"
            />
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-300 text-slate-900 px-4 py-2 transition-colors"
            >
              <Search size={20} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
