import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { getBlogPosts } from "@/lib/api";
import { Newspaper } from "lucide-react";

export const metadata = {
  title: "Blog | PopHits.org",
  description:
    "Explore articles about pop music history, one-hit wonders, Billboard chart history, and more.",
  openGraph: {
    title: "PopHits.org Blog",
    description:
      "Explore articles about pop music history, one-hit wonders, Billboard chart history, and more.",
    url: "https://pophits.org/blog",
    siteName: "PopHits.org",
    images: [
      {
        url: "https://pophits.org/static/media/oldhits_logo.png",
        width: 800,
        height: 600,
        alt: "PopHits.org Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export const revalidate = 0;

export default async function BlogPage() {
  let blogPosts = { results: [] };
  let error = null;

  try {
    const data = await getBlogPosts();
    blogPosts.results = Array.isArray(data) ? data : data.results || [];
  } catch (err) {
    console.error("Error fetching blog posts:", err);
    error = err.message;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    url: "https://pophits.org/blog",
    name: "PopHits.org Blog",
    description: "Explore articles about pop music history, one-hit wonders, Billboard chart history, and more.",
    blogPost: blogPosts.results.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `https://pophits.org/blog/${post.slug}`,
      image: post.featured_image || "https://pophits.org/static/media/oldhits_logo.png",
      datePublished: post.published_date,
      description: post.meta_description,
    })),
  };

  return (
    <>
      <Script
        id="blog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen space-y-12">
        
        {/* 1. Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-1">
            <Newspaper className="w-4 h-4" />
            <h2 className="text-xs font-black italic uppercase tracking-[0.3em]">
              Editorial // Cultural Commentary
            </h2>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-black leading-none">
            The Music Blog
          </h1>

          <div className="max-w-2xl mx-auto pt-4 border-t-2 border-black/10">
            <p className="text-lg md:text-xl font-bold text-black/60 uppercase tracking-tight leading-tight italic">
              Dispatches from the history of pop. Chart milestones, era-defining icons, 
              and the stories behind the data.
            </p>
          </div>
        </div>

        {/* 2. Blog Feed */}
        <div className="max-w-4xl mx-auto">
          {blogPosts.results.length > 0 ? (
            <div className="grid gap-12">
              {blogPosts.results.map((post) => (
                <article
                  key={post.id}
                  className="bg-white border-2 border-black transition-colors group hover:bg-[#fdfbf7]"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="md:flex items-stretch">
                      {post.featured_image && (
                        <div className="md:w-64 md:flex-shrink-0 relative overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-black">
                          <Image
                            src={post.featured_image}
                            alt={post.title}
                            width={400}
                            height={300}
                            className="h-64 w-full object-cover md:h-full grayscale group-hover:grayscale-0 transition-all duration-500"
                          />
                        </div>
                      )}
                      <div className="p-8 flex flex-col justify-center space-y-4">
                        <div className="text-[10px] font-black uppercase tracking-widest text-black/40">
                          {new Date(post.published_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-black leading-none group-hover:text-amber-600 transition-colors">
                          {post.title}
                        </h2>
                        
                        <p className="text-black/70 font-bold leading-snug">
                          {post.meta_description}
                        </p>
                        
                        <div className="pt-2">
                          <span className="inline-block bg-black text-white px-4 py-2 text-xs font-black italic uppercase tracking-widest group-hover:bg-amber-500 group-hover:text-black transition-all">
                            Read Entry →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-black/20">
              <h3 className="text-xl font-black uppercase italic tracking-tighter text-black/40">
                No articles found in the archive
              </h3>
              {error && <p className="text-red-600 font-bold mt-2 uppercase text-xs">{error}</p>}
            </div>
          )}
        </div>
        
        {/* Footer Branding */}
        <div className="pt-12 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 italic">
            PopHits.org Editorial Division // Est. 2024
          </p>
        </div>
      </div>
    </>
  );
}