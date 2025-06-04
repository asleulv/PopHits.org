import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts } from '@/lib/api';

export const metadata = {
  title: 'Blog | PopHits.org',
  description: 'Explore articles about pop music history, one-hit wonders, Billboard chart history, and more.',
  openGraph: {
    title: 'PopHits.org Blog',
    description: 'Explore articles about pop music history, one-hit wonders, Billboard chart history, and more.',
    url: 'https://pophits.org/blog',
    siteName: 'PopHits.org',
    images: [
      {
        url: 'https://pophits.org/static/media/oldhits_logo.png',
        width: 800,
        height: 600,
        alt: 'PopHits.org Blog',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default async function BlogPage() {
  let blogPosts;
  let error = null;
  
  try {
    console.log('Fetching blog posts...');
    const response = await getBlogPosts();
    console.log('Blog posts fetched:', response);
    
    // Handle both formats: array or {results: array}
    if (Array.isArray(response)) {
      blogPosts = { results: response };
    } else {
      blogPosts = response;
      if (!blogPosts.results) {
        blogPosts.results = [];
      }
    }
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    error = err.message;
    blogPosts = { results: [] };
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-pink-500 via-purple-600 to-purple-900 bg-clip-text text-transparent">
        PopHits.org Blog
      </h1>
      
      <div className="max-w-4xl mx-auto">
        <p className="text-lg text-gray-700 mb-8 text-center">
          Explore articles about pop music history, one-hit wonders, Billboard chart history, and more.
        </p>
        
        
        {blogPosts.results && blogPosts.results.length > 0 ? (
          <div className="grid gap-8">
            {blogPosts.results.map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg font-sansita">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="md:flex">
                    {post.featured_image && (
                      <div className="md:flex-shrink-0">
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          width={300}
                          height={200}
                          className="h-48 w-full object-cover md:h-full md:w-48"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
                      <p className="text-gray-600 mb-4">{post.meta_description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{new Date(post.published_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <div className="mt-4">
                        <span className="inline-block bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-semibold">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-gray-700">No blog posts yet</h3>
            <p className="text-gray-500 mt-2">Check back soon for new articles!</p>
          </div>
        )}
        
      </div>
    </div>
  );
}
