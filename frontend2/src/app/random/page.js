import RandomSongClient from '@/components/RandomSong/RandomSongClient';

export const metadata = {
  title: 'Random Hit Song | PopHits.org',
  description: 'Discover a random hit song from the Billboard Hot 100 charts.',
};

export default function RandomSongPage() {
  return <RandomSongClient />;
}
