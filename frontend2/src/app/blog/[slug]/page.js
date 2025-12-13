"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SongPreview from "@/components/Blog/SongPreview";
import YouTubeEmbed from "@/components/Blog/YouTubeEmbed";
import SignupCTA from "@/components/Blog/SignupCTA";

// Add structured data for better SEO
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
    author: {
      "@type": "Organization",
      name: "PopHits.org",
    },
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
  const params = useParams();
  const slug = params.slug;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}/`
          : process.env.NODE_ENV === "development"
          ? `http://localhost:8000/api/blog/${slug}/`
          : `https://pophits.org/api/blog/${slug}/`;

        console.log("Fetching blog post from URL:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Blog post fetched:", data);
        setPost(data);
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchPost();
    }

    const checkAuth = () => {
      const authToken = localStorage.getItem("authToken");
      console.log("Auth token found:", !!authToken);
      setIsAuthenticated(!!authToken);
    };

    checkAuth();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-slate-700">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-lg">
          <h1 className="text-2xl font-bold mb-2">Error Loading Post</h1>
          <p>{error}</p>
          <Link
            href="/blog"
            className="text-amber-700 hover:text-amber-900 font-medium mt-4 inline-block"
          >
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-lg">
          <h1 className="text-2xl font-bold mb-2">Blog Post Not Found</h1>
          <p>
            Sorry, we couldn&rsquo;t find the blog post you&rsquo;re looking
            for.
          </p>
          <Link
            href="/blog"
            className="text-amber-700 hover:text-amber-900 font-medium mt-4 inline-block"
          >
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BlogPostStructuredData post={post} />

      {/* Breadcrumbs */}
      <nav className="text-sm mb-6">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link href="/" className="text-slate-600 hover:text-slate-900">
              Home
            </Link>
            <svg
              className="fill-current w-3 h-3 mx-2 text-slate-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.30c9.373 9.372 9.373 24.568.001 33.941z" />
            </svg>
          </li>
          <li className="flex items-center">
            <Link href="/blog" className="text-slate-600 hover:text-slate-900">
              Blog
            </Link>
            <svg
              className="fill-current w-3 h-3 mx-2 text-slate-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.30c9.373 9.372 9.373 24.568.001 33.941z" />
            </svg>
          </li>
          <li className="flex items-center">
            <span className="text-amber-700 font-medium">{post.title}</span>
          </li>
        </ol>
      </nav>

      <article className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-slate-400">
        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative w-full h-80">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          {/* Title and Date */}
          <h1 className="text-3xl md:text-4xl font-bold mb-2 pb-2 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent font-sansita">
            {post.title}
          </h1>
          <div className="text-sm text-slate-600 mb-8">
            Published on{" "}
            {new Date(post.published_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {/* Blog Content with YouTube Embed Support */}
          <YouTubeEmbed content={post.content} />

          {/* Signup CTA for non-logged-in users */}
          <SignupCTA isLoggedIn={isAuthenticated} />

          {/* Related Songs Section */}
          {post.related_songs && post.related_songs.length > 0 && (
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

      {/* Back to Blog Link */}
      <div className="max-w-4xl mx-auto mt-8 text-center">
        <Link
          href="/blog"
          className="inline-block bg-slate-900 text-white px-6 py-3 rounded-lg shadow-md hover:bg-slate-700 transition-all duration-300 transform hover:scale-105"
        >
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
}
