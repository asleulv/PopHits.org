import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/auth";
import { slide as Menu } from "react-burger-menu";
import oldhitsLogo from "./oldhits_logo.png";
import { FaHome, FaHouseUser, FaUser, FaDiceD6 } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import { BsMusicPlayerFill, BsListOl } from "react-icons/bs";
import { FaCircleInfo } from "react-icons/fa6";
import { RiLogoutBoxRFill, RiUserAddLine } from "react-icons/ri";
import { GiBullseye } from "react-icons/gi";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Search } = Input;

const Navbar = ({ isAuthenticated }) => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
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
      await logoutUser();
      navigate("/");
    } catch (error) {
      // Handle logout error
    }
  };

  const handleSearch = (value) => {
    console.log("Search value:", value); // Debugging line
    if (value) {
      navigate(`/search?query=${value}`);
    }
  };

  return (
    <>
      <nav className={`navbar bg-gray-800 p-4 ${isScrolled ? "scrolled" : ""}`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Site Logo */}
            <Link to="/">
              <img src={oldhitsLogo} alt="old.hits" className="navbar-logo" />
            </Link>
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
                  <span className="navbar-menu-icon">
                    <FaHome />
                  </span>
                  Home
                </Link>
              </li>
              <li className="navbar-menu-item">
                <Link
                  to="/songs"
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
                  to="/playlist-generator"
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
                  to="/quiz-generator"
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
                  to="/random"
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
                  to="/about"
                  className="navbar-menu-link hover:text-gray-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="navbar-menu-icon">
                    <FaCircleInfo />
                  </span>
                  About
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li className="navbar-menu-item">
                    <Link
                      to="/profile"
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
                      to="/register"
                      className="navbar-menu-link hover:text-gray-300"
                      onClick={() => setMenuOpen(false)}
                    >
                      <RiUserAddLine className="navbar-menu-icon" /> Register
                    </Link>
                  </li>
                  <li className="navbar-menu-item">
                    <Link
                      to="/login"
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
                  to="https://hitquiz.me/"
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

      {/* Search Bar below the Navbar */}
      <div className="bg-gray-800 p-2">
        <div className="container mx-auto flex justify-end">
          <div style={{ width: "60%", marginTop: 0, marginBottom: 0 }}>
            <Search
              placeholder="ARTIST / SONG"
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
              allowClear
              style={{ width: "100%", borderRadius: 0 }} // Remove rounded corners
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
