"use client";

import Link from "next/link";
import Image from "next/image";
import { Music, TrendingUp, BarChart3 } from "lucide-react";

const SignupCTA = ({ isLoggedIn }) => {
  // Don't render anything if user is logged in
  if (isLoggedIn) return null;

  return (
    <div className="mb-8 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 text-white p-8 w-full lg:rounded-xl shadow-lg">
      <div className="flex flex-col items-center md:flex-row md:justify-center gap-4 mb-6">
        <h3 className="text-xl md:text-3xl font-cherry font-semibold flex items-center gap-3 text-white">
          <Music className="hidden lg:block w-8 h-8 text-pink-500" />
          <span className="bg-gradient-to-r from-pink-500 via-pink-300 to-pink-400 bg-clip-text text-transparent">
            Start Your Hit Song Journey
          </span>
        </h3>
      </div>

      <div className="text-center mb-6">
        <p className="text-gray-300 text-lg">
          Rate your favorite songs and discover your music taste patterns with
          detailed analytics that go beyond what you just read.
        </p>
      </div>

      {/* Screenshots Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="relative">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden border border-white/20 shadow-lg group cursor-pointer">
            <Image
              src="/screenshots/screenshot1.png"
              alt="Song rating page showing detailed song information and rating interface"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-150"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 bg-white/20 backdrop-blur-sm rounded-full p-2 transition-opacity duration-300">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="mt-3 text-center">
            <h4 className="font-semibold text-white mb-1">
              Rate & Review Songs
            </h4>
            <p className="text-sm text-gray-300">
              Give your personal ratings to chart hits
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden border border-white/20 shadow-lg group cursor-pointer">
            <Image
              src="/screenshots/screenshot2.png"
              alt="Song rating page showing detailed song information and rating interface"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-150"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 bg-white/20 backdrop-blur-sm rounded-full p-2 transition-opacity duration-300">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="mt-3 text-center">
            <h4 className="font-semibold text-white mb-1">
              Personal Music Stats
            </h4>
            <p className="text-sm text-gray-300">
              See your rating patterns by decade
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/register"
          className="bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:text-white px-8 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 text-center font-medium"
        >
          Join Free Today
        </Link>
        <Link
          href="/about"
          className="border border-pink-400 text-pink-400 px-8 py-3 rounded-lg hover:bg-pink-400/10 transition-all duration-300 text-center font-medium"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default SignupCTA;
