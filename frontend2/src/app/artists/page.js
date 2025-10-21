import { getArtists } from '@/lib/api';
import ArtistsListClient from '@/components/Artists/ArtistsListClient';

export const metadata = {
  title: 'Browse Artists | PopHits.org',
  description: 'Browse all artists who have charted on the Billboard Hot 100',
};

export default async function ArtistsPage() {
  const artists = await getArtists();

  return <ArtistsListClient artists={artists} />;
}
