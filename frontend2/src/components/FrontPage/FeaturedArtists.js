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
          <Star className="hidden lg:block w-8 h-8 text-purple-700" />
          <span className="bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent">
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
                  className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-purple-300 group-hover:border-purple-500 transition-colors mx-auto mb-2"
                />
                <h3 className="font-semibold text-center group-hover:text-purple-600 text-l">
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
          className="inline-block px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-full shadow-md hover:from-pink-600 hover:to-pink-700 transition-all hover:text-white duration-300 transform"
        >
          All artists
        </Link>
      </div>
    </div>
  );
}
