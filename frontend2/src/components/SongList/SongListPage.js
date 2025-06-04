"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Music, 
  Star, 
  Award 
} from 'lucide-react';
import SongListClient from '@/components/SongList/SongListClient';

export default function SongListPage({ 
  initialSongs, 
  totalSongs, 
  filterType = null,
  filterValue = null,
  yearFilter = null,
  artistSlug = null,
  artistName = null
}) {
  const searchParams = useSearchParams();
  
  // Parse search parameters
  const query = searchParams.get('query') || '';
  const filter = searchParams.get('filter') || null;
  const unrated = searchParams.get('unrated') === 'true';
  const decade = searchParams.get('decade') || null;
  const sortBy = searchParams.get('sort_by') || null;
  const order = searchParams.get('order') || null;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('per_page') || '25', 10);
  
  // Generate page title based on filters
  let pageTitle = 'All Hit Songs';
  
  if (artistName) {
    pageTitle = `${artistName} Hits`;
    if (query) pageTitle = `${artistName}: Search Results for "${query}"`;
    if (filter === 'number-one') pageTitle = `${artistName}: #1 Hits Only`;
    if (unrated) pageTitle = `${artistName}: Unrated Songs`;
    if (decade) pageTitle = `${artistName}: ${decade}s Hits`;
    if (unrated && filter === 'number-one') pageTitle = `${artistName}: Unrated #1 Hits`;
  } else if (yearFilter) {
    pageTitle = `${yearFilter} Hits`;
    if (query) pageTitle = `${yearFilter}: Search Results for "${query}"`;
    if (filter === 'number-one') pageTitle = `${yearFilter}: #1 Hits Only`;
    if (unrated) pageTitle = `${yearFilter}: Unrated Songs`;
    if (unrated && filter === 'number-one') pageTitle = `${yearFilter}: Unrated #1 Hits`;
  } else {
    if (query) pageTitle = `Search Results for "${query}"`;
    if (filter === 'number-one') pageTitle = '#1 Hits Only';
    if (unrated) pageTitle = 'Unrated Songs';
    if (decade) pageTitle = `${decade}s Hits`;
    if (unrated && filter === 'number-one') pageTitle = 'Unrated #1 Hits';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center bg-gradient-to-r from-pink-500 via-purple-600 to-purple-900 bg-clip-text text-transparent">
        <div className="flex items-center justify-center gap-2 px-1 py-1">
          {unrated ? (
            <Star className="w-8 h-8 text-pink-500" />
          ) : filter === 'number-one' ? (
            <Award className="w-8 h-8 text-pink-500" />
          ) : query ? (
            <Search className="w-8 h-8 text-pink-500" />
          ) : decade ? (
            <Calendar className="w-8 h-8 text-pink-500" />
          ) : artistName ? (
            <Music className="w-8 h-8 text-pink-500" />
          ) : (
            <Filter className="w-8 h-8 text-pink-500" />
          )}
          <span className="bg-gradient-to-r from-pink-500 to-purple-700 bg-clip-text text-transparent">
            {pageTitle}
          </span>
        </div>
      </h1>

      <Suspense fallback={<div className="text-center py-12">Loading songs...</div>}>
        <SongListClient 
          initialSongs={initialSongs}
          totalSongs={totalSongs}
          initialPage={page}
          initialPerPage={perPage}
          initialSortField={sortBy}
          initialSortOrder={order}
          initialNumberOneFilter={filter === 'number-one'}
          initialUnratedFilter={unrated}
          initialDecadeFilter={decade}
          initialSearchQuery={query}
          yearFilter={yearFilter}
          artistSlug={artistSlug}
          artistName={artistName}
        />
      </Suspense>
    </div>
  );
}
