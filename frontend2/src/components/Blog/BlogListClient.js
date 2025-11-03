"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts } from '@/lib/api';

export default function BlogListClient() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        console.log('Fetching blog posts from client side using getBlogPosts');
        
        const data = await getBlogPosts();
        console.log('Blog posts fetched from client side:', data);
        
        if (Array.isArray(data)) {
          setBlogPosts(data);
        } else {
          setBlogPosts(data.results || []);
        }
      } catch (err) {
        console.error('Error fetching blog posts from client side:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  return (
    <div className="mt-12 border-t border-slate-300 pt-8">
      <h2 className="text-2xl font-bold mb-4 text-slate-900">Client-Side Rendered Blog Posts</h2>
      <p className="text-slate-700 mb-6">This section fetches blog posts directly from the client side to help debug any server-side rendering issues.</p>
      
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-400"></div>
          <p className="mt-2 text-slate-700">Loading blog posts...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-lg mb-6">
          <h3 className="font-bold">Error Loading Blog Posts</h3>
          <p>{error}</p>
          <div className="mt-2 p-2 bg-white rounded text-sm overflow-auto border border-red-200">
            <p>API URL: {process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api/blog/' : 'https://pophits.org/api/blog/'}</p>
            <p>Try accessing the API directly in your browser to see the response.</p>
          </div>
        </div>
      )}
      
      {!loading && !error && blogPosts.length === 0 && (
        <div className="text-center py-8 bg-yellow-50 rounded-lg border border-slate-300">
          <h3 className="text-xl font-medium text-slate-900">No blog posts found (client-side)</h3>
          <p className="text-slate-700 mt-2">The API returned an empty list of blog posts.</p>
        </div>
      )}
      
      {!loading && !error && blogPosts.length > 0 && (
        <div className="grid gap-6">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm p-4 border border-slate-400 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-slate-900">{post.title}</h3>
              <p className="text-slate-700 text-sm mt-1">{post.meta_description}</p>
              <div className="mt-2">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-amber-700 hover:text-amber-900 text-sm font-medium transition-colors"
                >
                  Read post →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
