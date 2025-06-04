import YearPageWrapper from '@/components/YearPage/YearPageWrapper';

export async function generateMetadata() {
  return {
    title: 'Year Hit Songs | PopHits.org',
    description: 'Browse, filter, and search through hit songs by year. Discover the most popular songs that charted on the Billboard Hot 100.',
    keywords: 'year hits, year songs, year music, billboard hot 100, popular songs by year',
  };
}

export default function YearPage() {
  return <YearPageWrapper />;
}
