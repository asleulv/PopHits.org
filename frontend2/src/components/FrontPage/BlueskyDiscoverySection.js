import { MessageCircleHeart, ExternalLink } from "lucide-react";
import Image from "next/image";

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};

// Helper function to make URLs and hashtags clickable
const linkifyText = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+?)(?=[.!?;,]?\s|[.!?;,]?$)/g;
  const hashtagRegex = /(#\w+)/g;

  let processedText = text.replace(urlRegex, (url) => {
    const cleanUrl = url.replace(/[.!?;,]+$/, "");
    return `<URL>${cleanUrl}</URL>`;
  });

  processedText = processedText.replace(hashtagRegex, "<HASHTAG>$1</HASHTAG>");

  const parts = processedText.split(
    /(<URL>.*?<\/URL>|<HASHTAG>.*?<\/HASHTAG>)/
  );

  return parts.map((part, index) => {
    if (part.startsWith("<URL>") && part.endsWith("</URL>")) {
      const url = part.slice(5, -6);
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline break-all"
        >
          {url}
        </a>
      );
    } else if (part.startsWith("<HASHTAG>") && part.endsWith("</HASHTAG>")) {
      const hashtag = part.slice(9, -10);
      return (
        <span key={index} className="text-pink-600 font-medium">
          {hashtag}
        </span>
      );
    }
    return part;
  });
};

export default function BlueskyDiscoverySection({ posts }) {
  if (!posts || posts.length === 0) {
    return null;
  }

  // Show different amounts based on screen size
  const postsToShow = posts.slice(0, 3);

  return (
    <section className="mb-8 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl md:text-3xl font-cherry font-semibold mb-6 text-center flex items-center justify-center gap-2">
          <MessageCircleHeart className="hidden lg:block w-8 h-8 text-blue-600" />
          <span className="bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
            From our Bluesky Feed
          </span>
        </h2>
      </div>

      {/* Mobile: Show only 1 post */}
      <div className="grid gap-4 grid-cols-1 md:hidden">
        {postsToShow.slice(0, 1).map((post, index) => (
          <div
            key={post.uri || index}
            className="bg-white p-4 rounded-xl shadow-sm relative"
          >
            {post.image && (
              <div className="mb-3">
                <Image
                  src={post.image}
                  alt="Album cover"
                  width={400}
                  height={400}
                  className="w-full rounded-lg shadow-md object-cover" // Remove h-32
                />
              </div>
            )}
            <p className="text-sm text-gray-700 mb-6 leading-relaxed">
              {linkifyText(post.text)}
            </p>
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              Posted {formatDate(post.createdAt)}
            </div>
          </div>
        ))}
      </div>

      {/* Tablet and Desktop: Show 2-3 posts */}
      <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {postsToShow.map((post, index) => (
          <div
            key={post.uri || index}
            className="bg-white p-4 rounded-xl shadow-sm relative"
          >
            {post.image && (
              <div className="mb-3">
                <Image
                  src={post.image}
                  alt="Album cover"
                  width={400}
                  height={400}
                  className="w-full rounded-lg shadow-md object-cover"
                />
              </div>
            )}
            <p className="text-sm text-gray-700 mb-6 leading-relaxed">
              {linkifyText(post.text)}
            </p>
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              Posted {formatDate(post.createdAt)}
            </div>
          </div>
        ))}
      </div>

      {posts.length > 1 && (
        <div className="text-center mt-6">
          <a
            href="https://bsky.app/profile/pophits.bsky.social"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            View more on Bluesky <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </section>
  );
}
