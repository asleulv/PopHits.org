import { getArtists } from '@/lib/api';
import ArtistsListClient from '@/components/Artists/ArtistsListClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Browse Artists | PopHits.org',
  description: 'Browse all artists who have charted on the Billboard Hot 100',
};

export default async function ArtistsPage({ searchParams }) {
  const letter = searchParams?.letter || 'All';
  
  // Only fetch page 1 - infinite scroll handles the rest
  const artistsData = await getArtists({ 
    letter: letter !== 'All' ? letter : undefined,
    page: 1,
    pageSize: 100 
  });

  return (
    <ArtistsListClient 
      initialArtists={artistsData.results}
      totalCount={artistsData.count}
      currentLetter={letter}
    />
  );
}

