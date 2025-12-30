import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tag, Star, Music2, ArrowRight } from "lucide-react";

export default function TagSection({ tags }) {
  const featuredTag = useMemo(() => {
    const featuredPool = tags.filter((t) => t.is_featured);
    const pool = featuredPool.length > 0 ? featuredPool : tags;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [tags]);

  const standardTags = tags
    .filter((t) => t.slug !== featuredTag?.slug)
    .slice(0, 4);

  if (!tags || tags.length === 0) return null;

  return (
    <section className="mb-12 w-full">
      {/* Header Section with Intro Text */}
      <div className="flex flex-col items-center mb-10 px-4 md:px-0">
        <div className="bg-yellow-400 text-black border-2 border-black px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px] mb-4 flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Tag size={14} fill="currentColor" /> Curated Collections
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-center tracking-tighter italic uppercase text-slate-900 leading-none mb-6">
          The{" "}
          <span className="text-blue-950 underline decoration-8 decoration-yellow-400">
            Themes
          </span>
        </h2>
        <p className="max-w-2xl text-center text-lg md:text-xl text-slate-700 font-bold leading-tight">
          Beyond the charts: discover music curated by lyrical themes,
          historical events, and iconic cultural references. Because it is fun!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FEATURED TAG - Responsive Rounding implemented */}
        {featuredTag && (
          <div className="lg:col-span-7 group">
            <Link href={`/tags/${featuredTag.slug}`}>
              <div className="relative h-[350px] md:h-[500px] bg-blue-950 md:rounded-3xl rounded-none border-y-4 md:border-4 border-black shadow-none overflow-hidden">
                <Image
                  src={featuredTag.image || "/placeholder.jpg"}
                  alt={featuredTag.name}
                  fill
                  className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black via-black/20 to-transparent">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400 text-black border-2 border-black text-[10px] font-black uppercase mb-4 w-fit shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Star size={12} fill="black" /> Featured:{" "}
                    {featuredTag.song_count} Hits
                  </div>
                  <h3 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-2 leading-none">
                    {featuredTag.name}
                  </h3>
                  <p className="text-white font-bold text-sm md:text-lg max-w-md leading-tight opacity-90 line-clamp-2">
                    {featuredTag.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-yellow-400 font-black uppercase text-xs tracking-widest group-hover:translate-x-2 transition-transform">
                    Explore Theme <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* STANDARD TILES - Padding added for mobile grid */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4 md:gap-6 px-4 md:px-0">
          {standardTags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tags/${tag.slug}`}
              className="group relative"
            >
              <div className="relative aspect-square bg-white border-4 border-black rounded-2xl overflow-hidden transition-all">
                {tag.image ? (
                  <Image
                    src={tag.image}
                    alt={tag.name}
                    fill
                    className="object-cover opacity-20 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-yellow-50">
                    <Music2 className="text-slate-300 w-12 h-12" />
                  </div>
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <span
                    className="text-center font-black text-sm md:text-xl uppercase italic tracking-tighter 
                   text-slate-900 transition-colors duration-300
                   group-hover:text-white group-hover:[text-shadow:2px_2px_0px_rgba(0,0,0,1)] 
                   leading-none"
                  >
                    {tag.name}
                  </span>
                  <span className="mt-2 px-2 py-0.5 bg-black text-yellow-400 text-[10px] font-black rounded border border-black">
                    {tag.song_count} SONGS
                  </span>
                </div>
              </div>
            </Link>
          ))}

          <Link href="/tags" className="col-span-2">
            <div className="bg-black hover:bg-white text-white hover:text-black px-8 py-4 font-black uppercase tracking-tighter flex items-center gap-3 border-2 border-black group-hover:bg-white group-hover:text-black transition-colors shrink-0">
              <Music2 size={18} /> View All Theme Archives
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
