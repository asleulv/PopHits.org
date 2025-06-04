"use client";

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSongs } from '@/lib/api';
import SongListPage from '@/components/SongList/SongListPage';

// Helper function to capitalize words
function capitalizeWords(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function ArtistPageWrapper() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [songs, setSongs] = useState([]);
  const [totalSongs, setTotalSongs] = useState(0);
  const [loading, setLoading] = useState(true);
  const artistSlug = params?.slug;
  const artistName = artistSlug ? capitalizeWords(artistSlug) : '';
  
  // Parse search parameters
  const query = searchParams.get('query') || '';
  const filter = searchParams.get('filter') || null;
  const unrated = searchParams.get('unrated') === 'true';
  const decade = searchParams.get('decade') || null;
  const sortBy = searchParams.get('sort_by') || null;
  const order = searchParams.get('order') || null;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('per_page') || '25', 10);
  
  // Determine peak rank filter
  const peakRankFilter = filter === 'number-one' ? '1' : null;

  useEffect(() => {
    async function fetchData() {
      if (artistSlug) {
        try {
          setLoading(true);
          // Fetch songs data for the specific artist with all filters
          const songsData = await getSongs(
            page,
            perPage,
            'artist',
            artistSlug,
            sortBy,
            order === 'desc' ? '-' : '',
            query,
            peakRankFilter,
            unrated,
            decade
          );

          // Extract songs and total count
          setSongs(songsData.results || []);
          setTotalSongs(songsData.count || 0);
        } catch (error) {
          console.error('Error fetching songs:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchData();
  }, [artistSlug, page, perPage, sortBy, order, query, filter, unrated, decade, peakRankFilter]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading songs...</div>;
  }

  return (
    <SongListPage 
      initialSongs={songs} 
      totalSongs={totalSongs} 
      filterType="artist"
      filterValue={artistSlug}
      artistSlug={artistSlug}
      artistName={artistName}
      initialPage={page}
      initialPerPage={perPage}
      initialSortField={sortBy}
      initialSortOrder={order}
      initialNumberOneFilter={filter === 'number-one'}
      initialUnratedFilter={unrated}
      initialDecadeFilter={decade}
      initialSearchQuery={query}
    />
  );
}
