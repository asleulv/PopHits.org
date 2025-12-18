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
  newestUsername,
}) {
  return (
    <div className="relative flex flex-col md:flex-row md:space-x-8 mb-12 bg-yellow-50 p-8 md:rounded-3xl rounded-none md:border-2 border-y-2 border-x-0 border-black md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:w-full w-[100vw] ml-[50%] translate-x-[-50%] animate-fadeIn">
      <div className="flex-1 mb-8 md:mb-0">
        <div className="mb-4 text-center md:text-left">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-black text-yellow-400 rounded-full text-sm font-black uppercase tracking-widest">
            <Heart className="w-4 h-4 fill-current" />
            For the love of hit music
          </span>
        </div>

        {/* Added text-center md:text-left */}
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter italic uppercase text-slate-900 text-center md:text-left">
          THE HIT SONG ARCHIVE
        </h1>

        {/* Added text-center md:text-left */}
        <p className="text-xl md:text-2xl text-slate-800 mb-4 font-bold leading-tight text-center md:text-left">
          The definitive collection of historical hits for true music fans. Rate
          every song, build your ultimate collections, and test your knowledge
          against decades of chart history.
        </p>

        {/* Added text-center md:text-left */}
        <p className="text-lg text-slate-700 mb-8 leading-relaxed text-center md:text-left">
          Dive into a massive library spanning the modern era. Join a community
          of hit-music experts: score your favorite classics, curate
          personalized playlists, and master our deep-dive music trivia.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Hit Songs */}
          <div className="relative flex flex-col items-center p-5 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="hidden md:block absolute -top-7 left-1/2 transform -translate-x-1/2">
              <span className="flex items-center justify-center w-14 h-14 bg-slate-900 border-2 border-black rounded-full shadow-md">
                <Star className="w-7 h-7 text-yellow-400" />
              </span>
            </div>
            <div className="flex md:hidden items-center mb-2 w-full">
              <span className="flex items-center justify-center w-12 h-12 bg-slate-900 border-2 border-black rounded-full shadow mr-4 flex-shrink-0">
                <Star className="w-6 h-6 text-yellow-400" />
              </span>
              <div>
                <div className="font-black text-3xl text-slate-900 mb-0.5">
                  {songCount?.toLocaleString() ?? "?"}
                </div>
                <div className="uppercase text-slate-700 font-black text-[12px] tracking-wide">
                  Hit Songs
                </div>
              </div>
            </div>
            <div className="mt-0 md:mt-7 flex-col items-center w-full hidden md:flex">
              <div className="font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 mb-0.5 leading-none">
                {songCount?.toLocaleString() ?? "?"}
              </div>
              <div className="uppercase text-slate-700 font-black text-[14px] tracking-wide">
                Hit Songs
              </div>
              <div className="text-slate-400 text-[10px] font-bold uppercase italic mt-1">
                that never went away
              </div>
            </div>
          </div>

          {/* Hitmakers */}
          <div className="relative flex flex-col items-center p-5 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="hidden md:block absolute -top-7 left-1/2 transform -translate-x-1/2">
              <span className="flex items-center justify-center w-14 h-14 bg-slate-900 border-2 border-black rounded-full shadow-md">
                <Users className="w-7 h-7 text-yellow-400" />
              </span>
            </div>
            <div className="flex md:hidden items-center mb-2 w-full">
              <span className="flex items-center justify-center w-12 h-12 bg-slate-900 border-2 border-black rounded-full shadow mr-4 flex-shrink-0">
                <Users className="w-6 h-6 text-yellow-400" />
              </span>
              <div>
                <div className="font-black text-3xl text-slate-900 mb-0.5">
                  {artistCount?.toLocaleString() ?? "?"}
                </div>
                <div className="uppercase text-slate-700 font-black text-[12px] tracking-wide">
                  Hitmakers
                </div>
              </div>
            </div>
            <div className="mt-0 md:mt-7 flex-col items-center w-full hidden md:flex">
              <div className="font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 mb-0.5 leading-none">
                {artistCount?.toLocaleString() ?? "?"}
              </div>
              <div className="uppercase text-slate-700 font-black text-[14px] tracking-wide">
                Hitmakers
              </div>
              <div className="text-slate-400 text-[10px] font-bold uppercase italic mt-1">
                who shaped popular music
              </div>
            </div>
          </div>

          {/* User Ratings */}
          <div className="relative flex flex-col items-center p-5 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="hidden md:block absolute -top-7 left-1/2 transform -translate-x-1/2">
              <span className="flex items-center justify-center w-14 h-14 bg-slate-900 border-2 border-black rounded-full shadow-md">
                <ThumbsUp className="w-7 h-7 text-yellow-400" />
              </span>
            </div>
            <div className="flex md:hidden items-center mb-2 w-full">
              <span className="flex items-center justify-center w-12 h-12 bg-slate-900 border-2 border-black rounded-full shadow mr-4 flex-shrink-0">
                <ThumbsUp className="w-6 h-6 text-yellow-400" />
              </span>
              <div>
                <div className="font-black text-3xl text-slate-900 mb-0.5">
                  {userRatingCount?.toLocaleString() ?? "?"}
                </div>
                <div className="uppercase text-slate-700 font-black text-[12px] tracking-wide">
                  User Ratings
                </div>
              </div>
            </div>
            <div className="mt-0 md:mt-7 flex-col items-center w-full hidden md:flex">
              <div className="font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 mb-0.5 leading-none">
                {userRatingCount?.toLocaleString() ?? "?"}
              </div>
              <div className="uppercase text-slate-700 font-black text-[14px] tracking-wide">
                User Ratings
              </div>
              <div className="text-slate-400 text-[10px] font-bold uppercase italic mt-1">
                songs rated by fans
              </div>
            </div>
          </div>
        </div>

        {/* Welcome member - Center flex container on mobile */}
        {newestUsername && (
          <div className="flex justify-center md:justify-start mb-8 mt-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-black text-slate-700 font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <PartyPopper className="w-5 h-5 text-yellow-400" />
              Newest Music Historian:{" "}
              <span className="text-blue-950 underline decoration-2 uppercase font-black">
                {newestUsername}
              </span>
            </span>
          </div>
        )}

        {/* CTA Button - Center flex container on mobile */}
        <div className="flex justify-center md:justify-start">
          <Link
            href="/songs"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-xs border-2 border-black hover:bg-yellow-400 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
          >
            <CirclePlay className="w-5 h-5" />
            Start Discovering →
          </Link>
        </div>
      </div>

      {/* Featured Hit Card */}
      {songWithImage && (
        <div className="w-full md:max-w-md mx-auto md:mx-0">
          <div className="bg-slate-900 text-white p-6 rounded-3xl border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 mb-4 border-b border-white/20 pb-2">
              <Disc className="w-6 h-6 text-yellow-400 animate-spin-slow" />
              <h2 className="text-xs font-black uppercase tracking-widest text-yellow-400">
                Featured Hit
              </h2>
            </div>

            <div className="relative rounded-2xl overflow-hidden border-2 border-black shadow-lg mb-6 aspect-square bg-black">
              <Image
                src={songWithImage.image_upload}
                alt={songWithImage.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="text-center space-y-2">
              <div className="text-sm font-black uppercase tracking-tight">
                <Link
                  href={`/artist/${songWithImage.artist_slug}`}
                  className="text-white hover:text-yellow-400 transition-colors"
                >
                  {songWithImage.artist}
                </Link>
              </div>

              <div className="text-2xl font-black uppercase italic leading-none">
                <Link
                  href={`/songs/${songWithImage.slug}`}
                  className="text-white hover:text-yellow-400 transition-colors"
                >
                  &ldquo;{songWithImage.title}&rdquo;
                </Link>
              </div>

              <div className="text-white font-mono text-xs pt-1 font-bold">
                <Link
                  href={`/year/${songWithImage.year}`}
                  className="text-white hover:text-yellow-400 transition-colors"
                >
                  RECORDED IN {songWithImage.year}
                </Link>
              </div>

              <div className="pt-6">
                <Link
                  href={`/songs/${songWithImage.slug}`}
                  className="inline-flex items-center justify-center gap-2 w-full py-3 bg-white text-black border-2 border-black font-black uppercase text-xs hover:bg-yellow-400 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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