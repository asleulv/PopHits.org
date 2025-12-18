import Link from 'next/link';
import Image from 'next/image';
import { FileText, ArrowRight } from 'lucide-react';

export default function LatestBlogPostSection({ latestBlogPost }) {
  if (!latestBlogPost) return null;

  const formattedDate = new Date(latestBlogPost.published_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section className="mb-12 text-slate-900 w-full bg-yellow-50 rounded-3xl p-4 md:p-10">
      {/* Header matching the Archive style */}
      <div className="flex flex-col items-center mb-8">
        <div className="bg-black text-white px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px] mb-4">
          Editorial
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-center tracking-tighter italic uppercase">
          Latest Research Notes
        </h2>
        <p className="text-sm font-mono mt-2 text-slate-600 text-center">
          Deep dives into the history of the hits
        </p>
      </div>

      {/* Main Post Card: Brutalist Style */}
      <div className="max-w-4xl mx-auto bg-white border-4 border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <Link href={`/blog/${latestBlogPost.slug}`} className="block group">
          <div className="md:flex">
            {latestBlogPost.featured_image && (
              <div className="md:flex-shrink-0 border-b-4 md:border-b-0 md:border-r-4 border-black">
                <Image
                  src={latestBlogPost.featured_image}
                  alt={latestBlogPost.title}
                  width={400}
                  height={300}
                  className="h-56 w-full object-cover md:h-full md:w-64 grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
            )}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase bg-yellow-400 border border-black px-2 py-0.5">
                    Music History
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    {formattedDate}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 uppercase tracking-tighter leading-none group-hover:underline decoration-4">
                  {latestBlogPost.title}
                </h3>
                <p className="text-slate-700 font-medium leading-snug mb-6 line-clamp-3">
                  {latestBlogPost.meta_description}
                </p>
              </div>
              
              <div>
                <span className="inline-flex items-center gap-2 bg-black text-white px-6 py-2 text-sm font-black uppercase tracking-tighter hover:bg-yellow-500 hover:text-black transition-colors">
                  Open File <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
      
      {/* Footer Link */}
      <div className="text-center mt-10">
        <Link 
          href="/blog" 
          className="inline-block px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-xs border-2 border-black hover:bg-yellow-400 transition-all"
        >
          Browse Full Editorial Index
        </Link>
      </div>
    </section>
  );
}