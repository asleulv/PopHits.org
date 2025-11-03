import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Headphones,
  Sparkles,
  Music,
  Disc,
  Users,
  Zap,
} from "lucide-react";

export default function HeroSection({ songWithImage }) {
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
          Over{" "}
          <span className="text-slate-900 font-semibold">30,000 songs</span>{" "}
          spanning 67 years of chart history. Create custom playlists, discover
          forgotten gems, test your music knowledge, and explore the definitive
          archive of hit music.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-start gap-3 p-4 bg-white/70 border border-slate-400 rounded-xl">
            <Sparkles className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-cherry font-semibold text-slate-900 mb-1">
                Create Playlists
              </h3>
              <p className="text-slate-700 text-sm">
                Generate custom playlists from any decade
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white/70 border border-slate-400 rounded-xl">
            <Zap className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-cherry font-semibold text-slate-900 mb-1">Take Quizzes</h3>
              <p className="text-slate-700 text-sm">Test your chart knowledge</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white/70 border border-slate-400 rounded-xl">
            <Users className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-cherry font-semibold text-slate-900 mb-1">
                Rate & Comment
              </h3>
              <p className="text-slate-700 text-sm">
                Free account to rate songs
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-center">
          <Link
            href="/songs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-gray-200 hover:text-white font-semibold rounded-full hover:bg-slate-700 transition-all duration-300 shadow-lg"
          >
            <Music className="w-5 h-5" />
            Start Discovering
          </Link>

          <Link
            href="/quiz-generator"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 text-slate-900 font-semibold rounded-full hover:bg-white hover:text-slate-800 transition-all duration-300 shadow-md border border-slate-400"
          >
            <Sparkles className="w-5 h-5" />
            Test Your Knowledge
          </Link>
        </div>
      </div>

      {songWithImage && (
        <div className="flex-1 max-w-md mx-auto md:mx-0">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-700">

            <div className="flex items-center gap-2 mb-4">
              <Disc className="w-6 h-6 text-amber-400" />
              <h2 className="text-lg font-cherry font-semibold">Featured Hit</h2>
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
