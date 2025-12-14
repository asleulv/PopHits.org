import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { getBlogPosts } from "@/lib/api";

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
    const data = await getBlogPosts(); // <-- use centralized API helper
    blogPosts.results = Array.isArray(data) ? data : data.results || [];
  } catch (err) {
    console.error("Error fetching blog posts:", err);
    error = err.message;
  }

  // Build JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    url: "https://pophits.org/blog",
    name: "PopHits.org Blog",
    description:
      "Explore articles about pop music history, one-hit wonders, Billboard chart history, and more.",
    blogPost: blogPosts.results.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `https://pophits.org/blog/${post.slug}`,
      image:
        post.featured_image ||
        "https://pophits.org/static/media/oldhits_logo.png",
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl text-center font-bold mb-2 pb-2 bg-gradient-to-r from-black to-black bg-clip-text text-transparent font-sansita">
          The Hit Music Blog
        </h1>

        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-700 mb-8 text-center">
            Thoughts on pop music history, one-hit wonders, chart milestones,
            and more.
          </p>

          {blogPosts.results.length > 0 ? (
            <div className="grid gap-8">
              {blogPosts.results.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg"
                >
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 font-sansita">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 mb-4 font-opensans">
                          {post.meta_description}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          {new Date(post.published_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <div className="mt-4">
                          <span className="inline-block bg-amber-400 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
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
              <h3 className="text-xl font-medium text-gray-700">
                No blog posts yet
              </h3>
              {error && <p className="text-red-500 mt-2">{error}</p>}
              <p className="text-gray-500 mt-2">
                Check back soon for new articles!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
