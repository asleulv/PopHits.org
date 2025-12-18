import ArtistPageWrapper from '@/components/ArtistPage/ArtistPageWrapper';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  // Clean up the slug for the title (e.g., drake -> Drake)
  const artistName = slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ');

  return {
    title: `${artistName} Hit Songs & Archive | PopHits.org`,
    description: `Browse every Billboard Hot 100 hit by ${artistName}. View rankings, scores, and community activity.`,
  };
}

export default async function ArtistPage({ params }) {
  const { slug } = await params;

  // Pass the slug to the wrapper so it knows to filter the API call
  return <ArtistPageWrapper artistSlug={slug} />;
}