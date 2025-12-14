"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SongPreview from "@/components/Blog/SongPreview";
import YouTubeEmbed from "@/components/Blog/YouTubeEmbed";
import SignupCTA from "@/components/Blog/SignupCTA";
import { fetchBlogData, BLOG_API_ENDPOINTS } from "@/lib/api";

// Structured data for SEO
function BlogPostStructuredData({ post }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image:
      post.featured_image ||
      "https://pophits.org/static/media/oldhits_logo.png",
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
        const data = await fetchBlogData(BLOG_API_ENDPOINTS.blogPostBySlug(slug));
        setPost(data);
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();

    const authToken = localStorage.getItem("authToken");
    setIsAuthenticated(!!authToken);
  }, [slug]);

  if (loading) return <div className="text-center py-16 text-slate-700">Loading...</div>;
  if (error)
    return (
      <div className="container mx-auto px-4 py-8 bg-red-50 border border-red-300 text-red-800 p-4 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Error Loading Post</h1>
        <p>{error}</p>
        <Link href="/blog" className="text-amber-700 hover:text-amber-900 font-medium mt-4 inline-block">
          Return to Blog
        </Link>
      </div>
    );
  if (!post)
    return (
      <div className="container mx-auto px-4 py-8 bg-red-50 border border-red-300 text-red-800 p-4 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Blog Post Not Found</h1>
        <p>Sorry, we couldn’t find the blog post you’re looking for.</p>
        <Link href="/blog" className="text-amber-700 hover:text-amber-900 font-medium mt-4 inline-block">
          Return to Blog
        </Link>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <BlogPostStructuredData post={post} />

      {/* Breadcrumbs */}
      <nav className="text-sm mb-6">
        <ol className="list-none p-0 inline-flex">
          <li>
            <Link href="/" className="text-slate-600 hover:text-slate-900">Home</Link> →
          </li>
          <li className="mx-2">
            <Link href="/blog" className="text-slate-600 hover:text-slate-900">Blog</Link> →
          </li>
          <li className="text-amber-700 font-medium">{post.title}</li>
        </ol>
      </nav>

      <article className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-slate-400">
        {post.featured_image && (
          <div className="relative w-full h-80">
            <Image src={post.featured_image} alt={post.title} fill className="object-cover" />
          </div>
        )}

        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 pb-2 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent font-sansita">
            {post.title}
          </h1>
          <div className="text-sm text-slate-600 mb-8">
            Published on {new Date(post.published_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>

          <YouTubeEmbed content={post.content} />
          <SignupCTA isLoggedIn={isAuthenticated} />

          {post.related_songs?.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-300">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent font-sansita">
                Related Hits
              </h2>
              <div className="grid gap-4">
                {post.related_songs.map((song) => (
                  <SongPreview key={song.id} song={song} />
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <div className="max-w-4xl mx-auto mt-8 text-center">
        <Link href="/blog" className="inline-block bg-slate-900 text-white px-6 py-3 rounded-lg shadow-md hover:bg-slate-700 transition-all duration-300 transform hover:scale-105">
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
}
