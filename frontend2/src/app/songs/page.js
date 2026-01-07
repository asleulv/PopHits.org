import { getSongs } from "@/lib/api";
import SongListPage from "@/components/SongList/SongListPage";

export const metadata = {
  title: "Browse Hit Songs | PopHits.org",
  description:
    "Browse, filter, and search through thousands of hit songs from the Billboard Hot 100 charts. Find songs by year, artist, or ranking.",
  keywords:
    "hit songs, billboard hot 100, music database, song search, music history",
};

export default async function SongsPage({ searchParams }) {
  const sp = await searchParams; // ← important change

  // Extract search parameters
  const page = parseInt(sp.page || "1", 10);
  const perPage = parseInt(sp.per_page || "25", 10);
  const query = sp.query || "";
  const filter = sp.filter || null;
  const unrated = sp.unrated === "true";
  const decade = sp.decade || null;
  const sortBy = sp.sort_by || null;
  const order = sp.order || null;

  const peakRankFilter = filter === "number-one" ? "1" : null;

  const songsData = await getSongs({
    page: page,
    perPage: perPage,
    sortBy: sortBy,
    order: order === "desc" ? "-" : "",
    query: query,
    peakRank: peakRankFilter,
    unrated: unrated,
    decade: decade,
  });

  const songs = songsData.results || [];
  const totalSongs = songsData.count || 0;

  const songListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "PopHits.org Hit Songs",
    description:
      "A curated list of hit songs from the Billboard Hot 100 charts.",
    numberOfItems: songs.length,
    itemListElement: songs.map((song, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://pophits.org/songs/${song.slug}`,
      name: song.title,
      item: {
        "@type": "MusicRecording",
        name: song.title,
        byArtist: {
          "@type": "MusicGroup",
          name: song.artist,
        },
        url: `https://pophits.org/songs/${song.slug}`,
      },
    })),
  };

  return (
    <>
      <SongListPage
        key={query}
        initialSongs={songs}
        totalSongs={totalSongs}
        initialPage={page}
        initialPerPage={perPage}
        initialSortField={sortBy}
        initialSortOrder={order}
        initialNumberOneFilter={filter === "number-one"}
        initialUnratedFilter={unrated}
        initialDecadeFilter={decade}
        initialSearchQuery={query}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(songListSchema) }}
      />
    </>
  );
}
