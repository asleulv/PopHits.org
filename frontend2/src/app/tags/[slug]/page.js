import { getSongs, getTag } from "@/lib/api";
import SongListPage from "@/components/SongList/SongListPage";
import Image from "next/image";

// --- DYNAMIC SEO SECTION ---
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tagData = await getTag(slug).catch(() => null);

  const tagName = tagData?.name || slug.charAt(0).toUpperCase() + slug.slice(1);
  const description =
    tagData?.description ||
    `Explore the best ${tagName} songs and chart history on PopHits.org.`;

  // Base keywords + dynamic tag keywords
  const baseKeywords =
    "pop hits, greatest pop songs, chart-topping hits, music history, Billboard Hot 100";
  const dynamicKeywords = `${tagName} music, best ${tagName} songs, ${tagName} chart history, ${
    tagData?.category || ""
  }`;
  const keywords = `${baseKeywords}, ${dynamicKeywords}`;

  const siteUrl = "https://pophits.org";
  const imageUrl = tagData?.image
    ? tagData.image.startsWith("http")
      ? tagData.image
      : `${siteUrl}${tagData.image}`
    : `${siteUrl}/default-og-image.jpg`;

  return {
    title: `${tagName} Songs - Chart History | PopHits.org`,
    description: description,
    keywords: keywords, // This adds the dynamic keywords to the meta tags
    openGraph: {
      title: `${tagName} Music Archive`,
      description: description,
      url: `${siteUrl}/tags/${slug}`,
      siteName: "PopHits.org",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${tagName} background`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tagName} Songs on PopHits`,
      description: description,
      images: [imageUrl],
    },
  };
}
// ---------------------------

function formatTagName(slug) {
  if (!slug) return "";
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function TagSongsPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;

  const tagName = formatTagName(slug);
  const page = parseInt(sp.page || "1", 10);
  const perPage = parseInt(sp.per_page || "25", 10);
  const query = sp.query || "";
  const sortBy = sp.sort_by || null;
  const order = sp.order || null;

  const [songsData, tagData] = await Promise.all([
    getSongs({
      page,
      perPage,
      type: "tag",
      slug: slug,
      sortBy,
      order: order === "desc" ? "-" : "",
      query,
    }),
    getTag(slug).catch((err) => {
      console.error("Tag detail fetch failed:", err);
      return null;
    }),
  ]);

  const songs = songsData.results || [];
  const totalSongs = songsData.count || 0;
  const tagImage = tagData?.image || null;
  const tagDescription = tagData?.description || null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 1. COOL HERO SECTION */}
      <div className="relative mb-0 overflow-hidden border-[3px] border-[#0F172A] bg-[#0F172A]">
        {tagImage ? (
          <div className="h-48 md:h-64 w-full relative">
            <Image
              src={tagImage}
              alt={tagName}
              fill
              priority // Tells Next.js to load this immediately for better SEO
              className="object-cover opacity-60"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent"></div>
          </div>
        ) : (
          <div className="h-32 bg-[#0F172A]"></div>
        )}

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase text-[#FFD700] leading-none tracking-tighter drop-shadow-md">
            {tagName}
          </h1>

          {tagDescription && (
            <p className="mt-4 max-w-2xl text-white/90 text-sm md:text-base font-medium italic leading-relaxed">
              {tagDescription}
            </p>
          )}
        </div>
      </div>

      {/* 2. INTERACTIVE LIST */}
      <SongListPage
        initialSongs={songs}
        totalSongs={totalSongs}
        initialPage={page}
        initialPerPage={perPage}
        initialSortField={sortBy}
        initialSortOrder={order}
        initialNumberOneFilter={false}
        initialUnratedFilter={false}
        initialDecadeFilter={null}
        initialSearchQuery={query}
        tagSlug={slug}
        tagName={tagName}
        hideTitle={true}
      />
    </div>
  );
}
