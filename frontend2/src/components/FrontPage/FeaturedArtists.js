import Image from "next/image";
import Link from "next/link";  
import { Star, ArrowRight } from "lucide-react";

export default function FeaturedArtists({ artists }) {
  if (!artists || artists.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-3xl font-cherry font-semibold flex items-center gap-2">
          <Star className="hidden lg:block w-8 h-8 text-amber-600" />
          <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent">
            Featured artists
          </span>
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {artists.map((artist, index) => {
          // Hide artists beyond 10 on mobile, beyond 25 on desktop
          const hiddenOnMobile = index >= 10 ? 'hidden md:block' : '';
          
          return (
            <Link 
              key={artist.id}
              href={`/artist/${artist.slug}`}
              className={`group text-center ${hiddenOnMobile}`}
            >
              <div>
                <Image
                  src={artist.image}
                  alt={artist.name}
                  width={160}
                  height={160}
                  className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-amber-400 group-hover:border-amber-600 transition-colors mx-auto mb-2"
                />
                <h3 className="font-semibold text-center group-hover:text-amber-700 text-l text-slate-900">
                  {artist.name}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="text-center mt-6">
        <Link
          href="/artists"
          className="inline-block px-6 py-2 bg-slate-900 text-gray-200 hover:text-white font-cherry rounded-full shadow-md hover:bg-slate-700 transition-all duration-300"
        >
          All artists
        </Link>
      </div>
    </div>
  );
}
