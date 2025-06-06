import Link from 'next/link';
import Image from 'next/image';
import { FileText } from 'lucide-react';

export default function LatestBlogPostSection({ latestBlogPost }) {
  if (!latestBlogPost) {
    console.log('No latest blog post available');
    return null;
  }
  
  console.log('Rendering latest blog post:', latestBlogPost);

  // Format the date
  const formattedDate = new Date(latestBlogPost.published_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section className="mb-8 text-black p-6 w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm">
      <h2 className="text-xl md:text-3xl font-cherry font-semibold mb-6 text-center flex items-center justify-center gap-2">
        <FileText className="w-8 h-8 text-pink-500" />
        <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">Latest from the Blog</span>
      </h2>
      
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg">
        <Link href={`/blog/${latestBlogPost.slug}`} className="block">
          <div className="md:flex">
            {latestBlogPost.featured_image && (
              <div className="md:flex-shrink-0">
                <Image
                  src={latestBlogPost.featured_image}
                  alt={latestBlogPost.title}
                  width={300}
                  height={200}
                  className="h-48 w-full object-cover md:h-full md:w-48"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 font-sansita">{latestBlogPost.title}</h3>
              <p className="text-gray-600 mb-4 font-opensans">{latestBlogPost.meta_description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>{formattedDate}</span>
              </div>
              <div className="mt-4">
                <span className="inline-block bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Read More →
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
      
      <div className="text-center mt-6">
        <Link 
          href="/blog" 
          className="inline-block px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-full shadow-md hover:from-pink-600 hover:to-pink-700 transition-all hover:text-white duration-300 transform"
        >
          View All Blog Posts
        </Link>
      </div>
    </section>
  );
}
