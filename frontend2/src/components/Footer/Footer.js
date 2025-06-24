"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollText, Music, Home, Info, List, HelpCircle } from "lucide-react";

export default function Footer() {
  const { isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-gray-300 py-10 mt-16 shadow-lg">
      <div className="container mx-auto">
        {/* Top section with logo and description */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/gfx/oldhits_logo.png"
            alt="PopHits.org Logo"
            width={64}
            height={64}
            className="object-contain mb-4 animate-pulse drop-shadow-[0_0_8px_white]"
          />
          <h3 className="text-xl font-cherry mb-2 bg-gradient-to-r from-white to-white bg-clip-text text-transparent">
            PopHits.org
          </h3>
          <p className="text-center text-gray-400 max-w-lg mx-auto px-4 text-sm md:text-base">
            A website made by a hit music nerd while listening to Brian Eno, for
            other hit music nerds who love discovering and enjoying great hits.
          </p>
        </div>

        {/* Middle section with navigation links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6 mb-8 px-4">
          <div className="flex flex-col items-center">
            <Home className="w-5 h-5 text-pink-400 mb-2" />
            <Link
              href="/"
              className="text-gray-300 hover:text-pink-300 transition-colors text-sm md:text-base"
            >
              Home
            </Link>
          </div>

          <div className="flex flex-col items-center">
            <Music className="w-5 h-5 text-blue-400 mb-2" />
            <Link
              href="/songs"
              className="text-gray-300 hover:text-blue-300 transition-colors text-sm md:text-base"
            >
              Songs Database
            </Link>
          </div>

          <div className="flex flex-col items-center">
            <List className="w-5 h-5 text-green-400 mb-2" />
            <Link
              href="/playlist-generator"
              className="text-gray-300 hover:text-green-300 transition-colors text-sm md:text-base"
            >
              Playlist Generator
            </Link>
          </div>

          <div className="flex flex-col items-center">
            <HelpCircle className="w-5 h-5 text-yellow-400 mb-2" />
            <Link
              href="/quiz-generator"
              className="text-gray-300 hover:text-yellow-300 transition-colors text-sm md:text-base"
            >
              Quiz Generator
            </Link>
          </div>

          <div className="flex flex-col items-center">
            <Info className="w-5 h-5 text-purple-400 mb-2" />
            <Link
              href="/about"
              className="text-gray-300 hover:text-purple-300 transition-colors text-sm md:text-base"
            >
              About
            </Link>
          </div>

          <div className="flex flex-col items-center">
            <ScrollText className="w-5 h-5 text-red-400 mb-2" />
            <Link
              href="/blog"
              className="text-gray-300 hover:text-red-300 transition-colors text-sm md:text-base"
            >
              Blog
            </Link>
          </div>

          {/* Add Bluesky as the 7th item - same level as the others */}
          <div className="flex flex-col items-center">
            <svg
              className="w-5 h-5 text-cyan-400 mb-2"
              viewBox="0 0 568 501"
              fill="currentColor"
            >
              <path d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.209C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.86 122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631 7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.76-33.889-129.52 80.986-149.07-65.72 11.185-139.6-7.295-159.875-79.748C9.945 203.66 0 75.293 0 57.947 0-28.906 76.134-1.611 123.121 33.664z" />
            </svg>
            <a
              href="https://bsky.app/profile/pophits.bsky.social"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-cyan-300 transition-colors text-sm md:text-base"
            >
              Bluesky
            </a>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="border-t border-gray-700 pt-6 text-center px-4">
          <p className="text-sm text-gray-500">
            © {currentYear} PopHits.org by Asle. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <Link
              href="/privacy-policy"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
