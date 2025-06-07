import { getSongs } from '@/lib/api';
import SongListPage from '@/components/SongList/SongListPage';

export const metadata = {
  title: 'Browse Hit Songs | PopHits.org',
  description: 'Browse, filter, and search through thousands of hit songs from the Billboard Hot 100 charts. Find songs by year, artist, or ranking.',
  keywords: 'hit songs, billboard hot 100, music database, song search, music history',
};

export default async function SongsPage({ searchParams }) {
  // Extract search parameters
  const page = parseInt(searchParams.page || '1', 10);
  const perPage = parseInt(searchParams.per_page || '25', 10);
  const query = searchParams.query || '';
  const filter = searchParams.filter || null;
  const unrated = searchParams.unrated === 'true';
  const decade = searchParams.decade || null;
  const sortBy = searchParams.sort_by || null;
  const order = searchParams.order || null;
  
  // Determine peak rank filter
  const peakRankFilter = filter === 'number-one' ? '1' : null;
  
  // Fetch songs data with filters
  const songsData = await getSongs(
    page,
    perPage,
    null,
    null,
    sortBy,
    order === 'desc' ? '-' : '',
    query,
    peakRankFilter,
    unrated,
    decade
  );

  // Extract songs and total count
  const songs = songsData.results || [];
  const totalSongs = songsData.count || 0;

  // Prepare JSON-LD for song list
  const songListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "PopHits.org Hit Songs",
    "description": "A curated list of hit songs from the Billboard Hot 100 charts.",
    "numberOfItems": songs.length,
    "itemListElement": songs.map((song, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://pophits.org/songs/${song.slug}`,  // <-- using slug here
      "name": song.title,
      "item": {
        "@type": "MusicRecording",
        "name": song.title,
        "byArtist": {
          "@type": "MusicGroup",
          "name": song.artist
        },
        "url": `https://pophits.org/songs/${song.slug}`
      }
    })),
  };

  return (
    <>
      <SongListPage 
        initialSongs={songs} 
        totalSongs={totalSongs}
        initialPage={page}
        initialPerPage={perPage}
        initialSortField={sortBy}
        initialSortOrder={order}
        initialNumberOneFilter={filter === 'number-one'}
        initialUnratedFilter={unrated}
        initialDecadeFilter={decade}
        initialSearchQuery={query}
      />
      <script
        type="application/ld+json"
        // JSON.stringify here converts the object to a string for the script tag
        dangerouslySetInnerHTML={{ __html: JSON.stringify(songListSchema) }}
      />
    </>
  );
}