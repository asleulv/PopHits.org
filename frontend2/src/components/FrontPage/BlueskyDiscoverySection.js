import { MessageCircleHeart, ExternalLink, Clock } from "lucide-react";
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
          className="text-blue-950 hover:text-black underline break-all font-bold"
        >
          {url}
        </a>
      );
    } else if (part.startsWith("<HASHTAG>") && part.endsWith("</HASHTAG>")) {
      const hashtag = part.slice(9, -10);
      return (
        <span key={index} className="text-blue-900 font-bold">
          {hashtag}
        </span>
      );
    }
    return part;
  });
};

export default function BlueskyDiscoverySection({ posts }) {
  if (!posts || posts.length === 0) return null;

  const postsToShow = posts.slice(0, 3);

  return (
    <section className="mb-12 w-full bg-yellow-50 p-4 md:p-10 rounded-3xl">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-10">
        <div className="bg-blue-950 text-white px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px] mb-4">
          Community Choice
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-center tracking-tighter italic uppercase text-slate-900">
          From our <span className="text-blue-950">Bluesky Feed</span>
        </h2>
        <p className="text-sm font-mono mt-2 text-slate-600 text-center">
          Live feed of community research and ratings
        </p>
      </div>

      {/* Responsive Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {postsToShow.map((post, index) => (
          <div
            key={post.uri || index}
            className={`bg-white border-4 border-black p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative flex flex-col ${
              index === 1 ? "hidden md:flex" : index === 2 ? "hidden lg:flex" : "flex"
            }`}
          >
            {post.image && (
              <div className="mb-4 border-2 border-black">
                <Image
                  src={post.image}
                  alt="Archive visual"
                  width={400}
                  height={400}
                  className="w-full object-cover aspect-square"
                />
              </div>
            )}
            
            {/* Post Text - Natural casing, legible size */}
            <div className="text-base text-slate-900 mb-10 leading-relaxed font-medium">
              {linkifyText(post.text)}
            </div>

            {/* Bottom Meta */}
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400">
                <Clock size={12} />
                <span>{formatDate(post.createdAt)}</span>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA - Matching your other section exactly */}
      <div className="text-center mt-10">
        <a
          href="https://bsky.app/profile/pophits.bsky.social"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-xs border-2 border-black hover:bg-yellow-400 transition-all"
        >
          View More on Bluesky
        </a>
      </div>
    </section>
  );
}