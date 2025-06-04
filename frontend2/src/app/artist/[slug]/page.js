import ArtistPageWrapper from '@/components/ArtistPage/ArtistPageWrapper';

export async function generateMetadata() {
  return {
    title: 'Artist Songs | PopHits.org',
    description: 'Browse, filter, and search through hit songs by artist. Discover the most popular songs that charted on the Billboard Hot 100.',
    keywords: 'artist songs, artist hits, artist music, billboard hot 100, popular songs by artist',
  };
}

export default function ArtistPage() {
  return <ArtistPageWrapper />;
}
