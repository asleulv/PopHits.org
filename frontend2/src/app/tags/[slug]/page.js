import { getSongs, getTag } from "@/lib/api";
import SongListPage from "@/components/SongList/SongListPage";

export const metadata = {
  title: "Tagged Songs | PopHits.org",
};

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
            <img
              src={tagImage}
              alt={tagName}
              className="w-full h-full object-cover opacity-60"
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

      {/* 2. INTERACTIVE LIST (CLIENT HYDRATED) */}
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
        // tagDescription is NOT needed here anymore because we rendered it above
      />
    </div>
  );
}
