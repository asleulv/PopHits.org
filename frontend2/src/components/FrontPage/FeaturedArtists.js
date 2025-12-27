import Image from "next/image";
import Link from "next/link";  
import { Star } from "lucide-react";

export default function FeaturedArtists({ artists }) {
  if (!artists || artists.length === 0) {
    return null;
  }

  return (
    <div className="mb-12 w-full bg-yellow-50 p-6 md:p-10 rounded-3xl">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-10">
        <div className="bg-blue-950 text-white px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px] mb-4 flex items-center gap-2">
          <Star size={14} fill="currentColor" /> Spotlight
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-center tracking-tighter italic uppercase text-slate-900 leading-none">
          The <span className="text-blue-950 decoration-8 decoration-black">Artists</span>
        </h2>
      </div>
      
      {/* Grid: Using a 2-column mobile and 5-column desktop layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
        {artists.map((artist, index) => {
          // Keep your existing hiding logic if needed, but let's make it look like a "grid"
          const hiddenOnMobile = index >= 6 ? 'hidden md:block' : '';
          
          return (
            <Link 
              key={artist.id}
              href={`/artist/${artist.slug}`}
              className={`group flex flex-col items-center ${hiddenOnMobile}`}
            >
              {/* Photo Frame: Square with Offset Shadow */}
              <div className="relative mb-4 w-32 h-32 md:w-40 md:h-40">
                <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                <div className="absolute inset-0 border-4 border-black overflow-hidden bg-white">
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Artist Name: Bold and Unfiltered */}
              <h3 className="font-black text-center text-xs md:text-sm uppercase tracking-tighter text-slate-900 group-hover:text-blue-950 leading-tight max-w-[140px]">
                {artist.name}
              </h3>
            </Link>
          );
        })}
      </div>

      {/* Footer CTA: Matching the white/yellow style */}
      <div className="text-center mt-12">
        <Link
          href="/artists"
          className="inline-block px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-xs border-2 border-black hover:bg-yellow-400 active:shadow-none transition-all"
        >
          Browse All Artists
        </Link>
      </div>
    </div>
  );
}