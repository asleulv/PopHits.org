import Image from "next/image";
import Link from "next/link";  
import { Star } from "lucide-react";

export default function FeaturedArtists({ songsWithImages }) {
  if (!songsWithImages || songsWithImages.length === 0) {
    return null;
  }

  // Pick songs ensuring no duplicate artists
  const shuffled = [...songsWithImages].sort(() => 0.5 - Math.random());
  const seenArtists = new Set();
  const featuredSongs = [];

  // Get up to 25 unique artists for desktop, we'll limit display with CSS
  for (const song of shuffled) {
    if (!seenArtists.has(song.artist_slug) && featuredSongs.length < 25) {
      seenArtists.add(song.artist_slug);
      featuredSongs.push(song);
    }
  }

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl md:text-3xl font-cherry font-semibold mb-6 text-center flex items-center justify-center gap-2">
          <Star className="hidden lg:block w-8 h-8 text-purple-700" />
          <span className="bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent">
            Featured artists
          </span>
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {featuredSongs.map((song, index) => {
          // Hide artists beyond 10 on mobile, beyond 25 on desktop
          const hiddenOnMobile = index >= 10 ? 'hidden md:block' : '';
          
          return (
            <Link 
              key={song.id}
              href={`/artist/${song.artist_slug}`}
              className={`group text-center ${hiddenOnMobile}`}
            >
              <div>
                <Image
                  src={song.image_upload}
                  alt={song.artist}
                  width={160}
                  height={160}
                  className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-purple-300 group-hover:border-purple-500 transition-colors mx-auto mb-2"
                />
                <h3 className="font-semibold text-center group-hover:text-purple-600 text-l">
                  {song.artist}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
