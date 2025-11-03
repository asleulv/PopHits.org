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
    <section className="mb-8 text-slate-900 p-6 w-full bg-yellow-50 rounded-xl shadow-sm">
      <h2 className="text-xl md:text-3xl font-cherry font-semibold mb-6 text-center flex items-center justify-center gap-2">
        <FileText className="hidden lg:block w-8 h-8 text-amber-600" />
        <span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent">Latest Music Posts and Billboard Updates</span>
      </h2>
      
      <div className="max-w-4xl mx-auto bg-white border border-slate-400 rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg">
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
              <h3 className="text-2xl font-bold text-slate-900 mb-2 font-cherry">{latestBlogPost.title}</h3>
              <p className="text-slate-700 mb-4 font-cherry">{latestBlogPost.meta_description}</p>
              <div className="flex text-sm text-slate-600">
                <span>{formattedDate}</span>
              </div>
              <div className="mt-4">
                <span className="inline-block bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-sm font-semibold hover:bg-amber-200 transition-colors">
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
          className="inline-block px-6 py-2 bg-slate-900 text-gray-200 hover:text-white font-cherry font-semibold rounded-full shadow-md hover:bg-slate-700 transition-all duration-300"
        >
          View All Blog Posts
        </Link>
      </div>
    </section>
  );
}
