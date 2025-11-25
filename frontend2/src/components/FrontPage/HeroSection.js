import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Headphones,
  Disc,
  Users,
  Star,
  ThumbsUp,
  PartyPopper,
  CirclePlay,
} from "lucide-react";

export default function HeroSection({
  songWithImage,
  songCount,
  artistCount,
  userRatingCount,
  newestUsername, // Pass this prop from your API
}) {
  return (
    <div className="flex flex-col md:flex-row md:space-x-8 mb-12 w-full bg-yellow-50 p-8 rounded-2xl shadow-lg animate-fadeIn">
      <div className="flex-1 mb-8 md:mb-0">
        <div className="mb-4 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-black text-yellow-400 rounded-full text-sm font-medium">
            <Heart className="w-4 h-4" />
            For the love of hit music
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-cherry font-bold mb-6 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-900 bg-clip-text text-transparent leading-normal pb-2 text-center">
          Every Hit Song Ever
        </h1>

        <p className="text-xl md:text-2xl text-slate-800 mb-4 font-medium">
          The complete database of every Billboard Hot 100 hit from 1958 to
          today. Updated weekly with the latest chart data.
        </p>

        <p className="text-lg text-slate-700 mb-8 leading-relaxed">
          Explore tens of thousands of songs spanning 67 years of chart history.
          Discover forgotten gems, dive into chart stories, and become a true
          hit-music expert.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Hit Songs */}
          <div className="relative flex flex-col items-center p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
            {/* Icon: above on md+, inline left on mobile */}
            <div className="hidden md:block absolute -top-7 left-1/2 transform -translate-x-1/2">
              <span className="flex items-center justify-center w-14 h-14 bg-slate-700 rounded-full shadow">
                <Star className="w-7 h-7 text-amber-400" />
              </span>
            </div>
            <div className="flex md:hidden items-center mb-2 w-full">
              <span className="flex items-center justify-center w-12 h-12 bg-slate-700 rounded-full shadow mr-4 flex-shrink-0">
                <Star className="w-6 h-6 text-amber-400" />
              </span>
              <div>
                <div className="font-cherry font-black text-3xl text-slate-900 mb-0.5">
                  {songCount?.toLocaleString() ?? "?"}
                </div>
                <div className="uppercase text-slate-700 font-semibold text-[14px] tracking-wide mb-0.5">
                  Hit Songs
                </div>
                <div className="text-slate-400 text-xs">
                  All Hot 100 singles since 1958
                </div>
              </div>
            </div>
            <div className="mt-0 md:mt-7 flex-col items-center w-full hidden md:flex">
              <div className="font-cherry font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 mb-0.5">
                {songCount?.toLocaleString() ?? "?"}
              </div>
              <div className="uppercase text-slate-700 font-semibold text-[15px] tracking-wide mb-0.5">
                Hit Songs
              </div>
              <div className="text-slate-400 text-xs">
                All Hot 100 singles since 1958
              </div>
            </div>
          </div>
          {/* Hitmakers */}
          <div className="relative flex flex-col items-center p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="hidden md:block absolute -top-7 left-1/2 transform -translate-x-1/2">
              <span className="flex items-center justify-center w-14 h-14 bg-slate-700 rounded-full shadow">
                <Users className="w-7 h-7 text-amber-400" />
              </span>
            </div>
            <div className="flex md:hidden items-center mb-2 w-full">
              <span className="flex items-center justify-center w-12 h-12 bg-slate-700 rounded-full shadow mr-4 flex-shrink-0">
                <Users className="w-6 h-6 text-amber-400" />
              </span>
              <div>
                <div className="font-cherry font-black text-3xl text-slate-900 mb-0.5">
                  {artistCount?.toLocaleString() ?? "?"}
                </div>
                <div className="uppercase text-slate-700 font-semibold text-[14px] tracking-wide mb-0.5">
                  Hitmakers
                </div>
                <div className="text-slate-400 text-xs">
                  Artists who made the charts
                </div>
              </div>
            </div>
            <div className="mt-0 md:mt-7 flex-col items-center w-full hidden md:flex">
              <div className="font-cherry font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 mb-0.5">
                {artistCount?.toLocaleString() ?? "?"}
              </div>
              <div className="uppercase text-slate-700 font-semibold text-[15px] tracking-wide mb-0.5">
                Hitmakers
              </div>
              <div className="text-slate-400 text-xs">
                Artists who made the charts
              </div>
            </div>
          </div>
          {/* User Ratings */}
          <div className="relative flex flex-col items-center p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="hidden md:block absolute -top-7 left-1/2 transform -translate-x-1/2">
              <span className="flex items-center justify-center w-14 h-14 bg-slate-700 rounded-full shadow">
                <ThumbsUp className="w-7 h-7 text-amber-400" />
              </span>
            </div>
            <div className="flex md:hidden items-center mb-2 w-full">
              <span className="flex items-center justify-center w-12 h-12 bg-slate-700 rounded-full shadow mr-4 flex-shrink-0">
                <ThumbsUp className="w-6 h-6 text-amber-400" />
              </span>
              <div>
                <div className="font-cherry font-black text-3xl text-slate-900 mb-0.5">
                  {userRatingCount?.toLocaleString() ?? "?"}
                </div>
                <div className="uppercase text-slate-700 font-semibold text-[14px] tracking-wide mb-0.5">
                  User Ratings
                </div>
                <div className="text-slate-400 text-xs">
                  Songs rated by music fans
                </div>
              </div>
            </div>
            <div className="mt-0 md:mt-7 flex-col items-center w-full hidden md:flex">
              <div className="font-cherry font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 mb-0.5">
                {userRatingCount?.toLocaleString() ?? "?"}
              </div>
              <div className="uppercase text-slate-700 font-semibold text-[15px] tracking-wide mb-0.5">
                User Ratings
              </div>
              <div className="text-slate-400 text-xs">
                Songs rated by music fans
              </div>
            </div>
          </div>
        </div>

        {/* Welcome newest member */}
        {newestUsername && (
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-100 text-slate-700 font-semibold shadow-sm">
              <PartyPopper className="w-5 h-5 text-amber-400" />
              Welcome to our newest member:{" "}
              <span className="font-monoline underline text-amber-600">
                {newestUsername}
              </span>
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-3 items-center justify-center">
          <Link
            href="/songs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-gray-200 hover:text-white font-semibold rounded-full hover:bg-slate-700 transition-all duration-300 shadow-lg"
          >
            <CirclePlay className="w-5 h-5" />
            Start Discovering
          </Link>
        </div>
      </div>

      {songWithImage && (
        <div className="flex-1 max-w-md mx-auto md:mx-0">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <Disc className="w-6 h-6 text-amber-400" />
              <h2 className="text-lg font-cherry font-semibold">
                Featured Hit
              </h2>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-lg mb-4 border border-slate-600">
              <Image
                src={songWithImage.image_upload}
                alt={`${songWithImage.title} by ${songWithImage.artist} - Album cover from ${songWithImage.year}`}
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center space-y-2">
              <div className="text-xl font-bold">
                <Link
                  href={`/artist/${songWithImage.artist_slug}`}
                  className="text-amber-400 hover:text-amber-300 transition-colors"
                >
                  {songWithImage.artist}
                </Link>
              </div>
              <div className="text-xl">
                <Link
                  href={`/songs/${songWithImage.slug}`}
                  className="text-white hover:text-amber-400 transition-colors"
                >
                  &ldquo;{songWithImage.title}&rdquo;
                </Link>
              </div>
              <div className="text-slate-300 text-sm">
                <Link
                  href={`/year/${songWithImage.year}`}
                  className="text-slate-200 hover:text-amber-400 transition-colors"
                >
                  {songWithImage.year}
                </Link>
              </div>
              {songWithImage.average_user_score > 0 && (
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm border border-amber-400/30">
                    <Heart className="w-3 h-3 fill-current" />
                    PopHits.org rating:{" "}
                    {songWithImage.average_user_score.toFixed(1)}
                  </span>
                </div>
              )}
              <div className="pt-3">
                <Link
                  href={`/songs/${songWithImage.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 text-slate-900 hover:bg-amber-300 rounded-full font-medium transition-colors"
                >
                  <Headphones className="w-4 h-4" />
                  Listen Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
