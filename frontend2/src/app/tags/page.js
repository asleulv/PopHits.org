import { Suspense } from "react";
import { getTags } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { Tag, Music2, Search } from "lucide-react";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Music Themes & Collections Archive | PopHits.org",
  description: "Explore our curated music archives by theme. From songs about cities and cars to names and colors, find your favorite hits categorized by topic.",
};

async function TagGrid() {
  const tags = await getTags();
  const tagsArray = Array.isArray(tags) ? tags : (tags.results || []);

  // Helper to force absolute URLs for production
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    // Prepend the production domain
    return `https://pophits.org${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  if (tagsArray.length === 0) return (
    <div className="text-center py-20 font-black uppercase italic text-slate-400">
      No themes found. Check back soon!
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
      {tagsArray.map((tag) => (
        <Link key={tag.slug} href={`/tags/${tag.slug}`} className="group">
          <div className="relative aspect-square bg-white border-4 border-black rounded-3xl group-hover:shadow-none transition-all overflow-hidden">
            {tag.image ? (
              <Image
                src={getImageUrl(tag.image)} // <--- FIXED HERE
                alt={tag.name}
                fill
                className="object-cover opacity-30 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 bg-yellow-50 flex items-center justify-center">
                <Music2 className="w-12 h-12 text-slate-300" />
              </div>
            )}
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <h3 className="text-center font-black text-xl md:text-2xl uppercase italic tracking-tighter text-slate-900 group-hover:text-white transition-colors duration-300 group-hover:[text-shadow:2px_2px_0px_rgba(0,0,0,1)] leading-none mb-2">
                {tag.name}
              </h3>
              <div className="bg-black text-yellow-400 px-3 py-1 text-[10px] md:text-xs font-black uppercase rounded border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {tag.song_count} Hits
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function TagsDirectoryPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Directory Header */}
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-yellow-400 rounded-full text-sm font-black uppercase tracking-widest mb-6">
            <Tag className="w-4 h-4" />
            The Archive Directory
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter italic uppercase text-slate-900">
            EXPLORE <span className="text-blue-950">THEMES</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 font-bold max-w-3xl mx-auto leading-tight italic">
            Dive deep into the hit song archive. Every track categorized by 
            cultural themes, lyrical topics, and historical significance.
          </p>
        </header>

        {/* Tag Grid */}
        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-slate-200 animate-pulse rounded-3xl border-4 border-black" />
            ))}
          </div>
        }>
          <TagGrid />
        </Suspense>

        {/* Footer CTA */}
        <footer className="mt-20 border-t-4 border-black pt-10 text-center">
          <p className="font-black uppercase tracking-widest text-slate-400 text-sm mb-4">Missing a theme?</p>
          <Link href="/contact" className="inline-block px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-xs border-2 border-black hover:bg-yellow-400 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
            Suggest a New Collection
          </Link>
        </footer>
      </div>
    </main>
  );
}