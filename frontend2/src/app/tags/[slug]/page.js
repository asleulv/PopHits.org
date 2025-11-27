import { getSongs } from "@/lib/api";
import SongListPage from "@/components/SongList/SongListPage";

export const metadata = {
  title: "Tagged Songs | PopHits.org",
};

// Helper to format "christmas-hits" -> "Christmas Hits"
function formatTagName(slug) {
  if (!slug) return "";
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function TagSongsPage({ params, searchParams }) {
  const { slug } = params;

  // Unwrap searchParams (Next 15 dynamic API)
  const sp = await searchParams;

  const tagName = formatTagName(slug);

  const page = parseInt(sp.page || "1", 10);
  const perPage = parseInt(sp.per_page || "25", 10);
  const query = sp.query || "";
  const sortBy = sp.sort_by || null;
  const order = sp.order || null;

  const songsData = await getSongs(
    page,
    perPage,
    null,
    null,
    sortBy,
    order === "desc" ? "-" : "",
    query,
    null,
    false,
    null,
    slug
  );

  const songs = songsData.results || [];
  const totalSongs = songsData.count || 0;

  return (
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
    />
  );
}
