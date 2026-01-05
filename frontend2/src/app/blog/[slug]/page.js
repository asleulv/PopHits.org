"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SongPreview from "@/components/Blog/SongPreview";
import YouTubeEmbed from "@/components/Blog/YouTubeEmbed";
import SignupCTA from "@/components/Blog/SignupCTA";
import { getBlogPostBySlug } from "@/lib/api";
import { Loader2, ArrowLeft, Newspaper, History, Tag } from "lucide-react";

// Structured data for SEO (remains the same)
function BlogPostStructuredData({ post }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.featured_image || "https://pophits.org/static/media/oldhits_logo.png",
    datePublished: post.published_date,
    dateModified: post.updated_date,
    author: { "@type": "Organization", name: "PopHits.org" },
    publisher: {
      "@type": "Organization",
      name: "PopHits.org",
      logo: {
        "@type": "ImageObject",
        url: "https://pophits.org/static/media/oldhits_logo.png",
      },
    },
    description: post.meta_description,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function fetchPost() {
      try {
        const data = await getBlogPostBySlug(slug);
        if (data && data.featured_image) {
          data.featured_image = data.featured_image.replace('http://127.0.0.1:8000', 'https://pophits.org');
        }
        setPost(data);
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();

    const authToken = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;
    setIsAuthenticated(!!authToken);
  }, [slug]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-black" />
      <p className="font-black uppercase italic tracking-widest text-xs">Retrieving Dispatch...</p>
    </div>
  );
  
  if (error || !post)
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="border-2 border-black bg-red-600 text-white p-8">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-4">
            {error ? "System Error" : "Entry Not Found"}
          </h1>
          <p className="font-bold mb-6 text-sm uppercase">{error || "The requested dispatch does not exist in our records."}</p>
          <Link href="/blog" className="inline-block bg-white text-black px-6 py-2 font-black italic uppercase text-xs border-2 border-black hover:bg-yellow-400 transition-colors">
            Return to Index
          </Link>
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      <BlogPostStructuredData post={post} />

      {/* Breadcrumbs - Architectural Style */}
      <nav className="flex items-center gap-2 mb-10 text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span className="opacity-20">-</span>
        <Link href="/blog" className="hover:text-black transition-colors">Blog</Link>
        <span className="opacity-20">-</span>
        <span className="text-black truncate max-w-[150px] md:max-w-none">{post.title}</span>
      </nav>

      <article className="border-2 border-black bg-white overflow-hidden">
        {/* Featured Image - Static Grayscale-to-Color logic */}
        {post.featured_image && (
          <div className="relative w-full h-64 md:h-96 border-b-2 border-black overflow-hidden group">
            <Image 
              src={post.featured_image} 
              alt={post.title} 
              fill 
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              unoptimized={true} 
            />
          </div>
        )}

        <div className="p-6 md:p-12 space-y-8">
          {/* Headline Section */}
          <header className="space-y-4">
            <div className="flex items-center gap-2 bg-black text-white px-3 py-1 w-fit">
              <Newspaper size={12} />
              <span className="text-[10px] font-black italic uppercase tracking-widest">Editorial Record</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-black leading-[0.9]">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 border-t-2 border-black/5 pt-4 text-[10px] font-black uppercase tracking-widest text-black/40 italic">
              <div className="flex items-center gap-1">
                <History size={12} />
                <span>Published: {new Date(post.published_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="prose prose-slate max-w-none 
            prose-headings:font-black prose-headings:italic prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-black
            prose-p:text-black/80 prose-p:font-bold prose-p:leading-relaxed
            prose-strong:text-black prose-strong:font-black
            prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:italic prose-blockquote:bg-yellow-50 prose-blockquote:p-4">
            <YouTubeEmbed content={post.content} />
          </div>

          <div className="pt-8 border-t-2 border-black/10">
            <SignupCTA isLoggedIn={isAuthenticated} />
          </div>

          {/* Related Songs Section */}
          {post.related_songs?.length > 0 && (
            <section className="mt-16 space-y-6">
              <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                <Tag className="w-5 h-5" />
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-black">
                  Referenced Hits
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {post.related_songs.map((song) => (
                  <SongPreview key={song.id} song={song} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      {/* Back to Index Navigation */}
      <div className="mt-12 text-center">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 border-2 border-black px-8 py-4 bg-black text-white font-black italic uppercase text-lg tracking-tighter hover:bg-amber-500 hover:text-black transition-all"
        >
          <ArrowLeft size={20} />
          Return to Archive
        </Link>
      </div>
      
      <div className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.4em] text-black/20 italic">
        Dispatch Record // PopHits.org Editorial Division
      </div>
    </div>
  );
}