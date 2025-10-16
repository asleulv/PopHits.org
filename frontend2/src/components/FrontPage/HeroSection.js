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
    <div className="flex flex-col md:flex-row md:space-x-8 mb-12 w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg animate-fadeIn">
      <div className="flex-1 mb-8 md:mb-0">
        <div className="mb-4 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
            <Heart className="w-4 h-4" />
            By a hit music nerd, for hit music nerds
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-cherry font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent leading-normal pb-2 text-center">
          Every Hit Song Ever
        </h1>

        <p className="text-xl md:text-2xl text-gray-700 mb-4 font-medium">
          The complete database of every Billboard Hot 100 hit from 1958 to
          today. Updated weekly with the latest chart data.
        </p>

        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Over{" "}
          <span className="text-purple-700 font-semibold">30,000 songs</span>{" "}
          spanning 67 years of chart history. Create custom playlists, discover
          forgotten gems, test your music knowledge, and explore the definitive
          archive of hit music.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-start gap-3 p-4 bg-white/70 rounded-xl">
            <Sparkles className="w-6 h-6 text-amber-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">
                Create Playlists
              </h3>
              <p className="text-gray-600 text-sm">
                Generate custom playlists from any decade
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white/70 rounded-xl">
            <Zap className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Take Quizzes</h3>
              <p className="text-gray-600 text-sm">Test your chart knowledge</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white/70 rounded-xl">
            <Users className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">
                Rate & Comment
              </h3>
              <p className="text-gray-600 text-sm">
                Free account to rate songs
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center justify-center">
          <Link
            href="/songs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Music className="w-5 h-5" />
            Start Discovering
          </Link>

          <Link
            href="/quiz-generator"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 text-purple-700 font-semibold rounded-full hover:bg-white hover:text-purple-800 transition-all duration-300 shadow-md"
          >
            <Sparkles className="w-5 h-5" />
            Test Your Knowledge
          </Link>
        </div>
      </div>

      {songWithImage && (
        <div className="flex-1 max-w-md mx-auto md:mx-0">
          <div className="bg-gradient-to-br from-black via-gray-700 to-black text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Disc className="w-6 h-6 text-pink-400" />
              <h2 className="text-lg font-semibold">Featured Hit</h2>
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-lg mb-4">
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
                  className="text-pink-300 hover:text-white transition-colors"
                >
                  {songWithImage.artist}
                </Link>
              </div>
              <div className="text-xl">
                <Link
                  href={`/songs/${songWithImage.slug}`}
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  &ldquo;{songWithImage.title}&rdquo;
                </Link>
              </div>
              <div className="text-purple-300 text-sm">
                <Link
                  href={`/year/${songWithImage.year}`}
                  className="text-white hover:text-pink transition-colors"
                >
                  {songWithImage.year}
                </Link>
              </div>

              {songWithImage.average_user_score > 0 && (
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-500/20 text-pink-200 rounded-full text-sm">
                    <Heart className="w-3 h-3 fill-current" />
                    PopHits.org rating:{" "}
                    {songWithImage.average_user_score.toFixed(1)}
                  </span>
                </div>
              )}

              <div className="pt-3">
                <Link
                  href={`/songs/${songWithImage.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white hover:text-white rounded-full font-medium hover:bg-pink-700 transition-colors"
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
