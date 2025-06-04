"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogListClient() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const apiUrl = process.env.NODE_ENV === 'development' 
          ? 'http://localhost:8000/api/blog/' 
          : 'https://pophits.org/api/blog/';
        
        console.log('Fetching blog posts from client side:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Blog posts fetched from client side:', data);
        
        // Handle both formats: array or {results: array}
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
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-4">Client-Side Rendered Blog Posts</h2>
      <p className="text-gray-600 mb-6">This section fetches blog posts directly from the client side to help debug any server-side rendering issues.</p>
      
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
          <p className="mt-2 text-gray-600">Loading blog posts...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
          <h3 className="font-bold">Error Loading Blog Posts</h3>
          <p>{error}</p>
          <div className="mt-2 p-2 bg-white rounded text-sm overflow-auto">
            <p>API URL: {process.env.NODE_ENV === 'development' ? 'http://localhost:8000/api/blog/' : 'https://pophits.org/api/blog/'}</p>
            <p>Try accessing the API directly in your browser to see the response.</p>
          </div>
        </div>
      )}
      
      {!loading && !error && blogPosts.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-700">No blog posts found (client-side)</h3>
          <p className="text-gray-500 mt-2">The API returned an empty list of blog posts.</p>
        </div>
      )}
      
      {!loading && !error && blogPosts.length > 0 && (
        <div className="grid gap-6">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <h3 className="font-bold text-lg">{post.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{post.meta_description}</p>
              <div className="mt-2">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-pink-600 hover:text-pink-800 text-sm font-medium"
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
