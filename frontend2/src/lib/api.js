// Base URL configuration
const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8000' 
  : 'https://pophits.org';

// API endpoints
const API_ENDPOINTS = {
  topRatedSongs: `${BASE_URL}/api/songs/top-rated-songs/`,
  randomHitsByDecade: `${BASE_URL}/api/songs/random-songs-by-decade/`,
  songsWithImages: `${BASE_URL}/api/songs/songs-with-images/`,
  numberOneHits: `${BASE_URL}/api/songs/number-one-songs/`,
  currentHot100: `${BASE_URL}/api/songs/current-hot100/`,
  songBySlug: (slug) => `${BASE_URL}/api/songs/${slug}/`,
  songs: `${BASE_URL}/api/songs/`,
  generateQuiz: `${BASE_URL}/api/songs/generate-quiz/`,
  generatePlaylist: `${BASE_URL}/api/songs/generate-playlist/`,
  submitUserScore: (songId) => `${BASE_URL}/api/songs/${songId}/rate/`,
  submitUserComment: (songId) => `${BASE_URL}/api/songs/${songId}/comment/`,
  deleteUserComment: (commentId) => `${BASE_URL}/api/songs/${commentId}/comment/`,
  editUserComment: (songId, commentId) => `${BASE_URL}/api/songs/${songId}/comment/${commentId}/`,
  toggleBookmark: (songId) => `${BASE_URL}/api/songs/${songId}/bookmark/`,
  userProfile: `${BASE_URL}/api/profile/`,
};

// Helper function to fetch data
async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // For DELETE requests that return 204 No Content, return an empty object
    if (options.method === 'DELETE' && response.status === 204) {
      return {};
    }

    // For all other requests, try to parse JSON
    try {
      return await response.json();
    } catch (e) {
      // If there's no JSON content, return an empty object
      if (response.status === 204) {
        return {};
      }
      throw e;
    }
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
}

// Server-side API functions (for use in server components)
export async function getTopRatedSongs(limit = 10) {
  const url = `${API_ENDPOINTS.topRatedSongs}?limit=${limit}`;
  return fetchData(url);
}

export async function getRandomHitsByDecade() {
  return fetchData(API_ENDPOINTS.randomHitsByDecade);
}

export async function getSongsWithImages() {
  return fetchData(API_ENDPOINTS.songsWithImages);
}

export async function getNumberOneHits() {
  return fetchData(API_ENDPOINTS.numberOneHits);
}

export async function getCurrentHot100() {
  return fetchData(API_ENDPOINTS.currentHot100);
}

export async function getSongBySlug(slug) {
  return fetchData(API_ENDPOINTS.songBySlug(slug));
}

export async function getSongs(
  page = 1,
  perPage = 25,
  filterType = null,
  filterValue = null,
  sortField = null,
  sortOrder = '',
  query = '',
  peakRankFilter = null,
  unratedOnly = false,
  decade = null
) {
  // Build the URL with query parameters
  let url = new URL(API_ENDPOINTS.songs);
  
  // Add pagination parameters
  url.searchParams.append('page', page);
  url.searchParams.append('page_size', perPage);
  
  // Add filter parameters if provided
  if (filterType && filterValue) {
    url.searchParams.append(filterType, filterValue);
  }
  
  // Add sorting parameters if provided
  if (sortField) {
    // Add sort_by parameter
    url.searchParams.append('sort_by', sortField);
    
    // Add order parameter (asc or desc)
    if (sortOrder === '-') {
      url.searchParams.append('order', 'desc');
    } else {
      url.searchParams.append('order', 'asc');
    }
    
    console.log('Sorting with parameters:', {
      sort_by: sortField,
      order: sortOrder === '-' ? 'desc' : 'asc'
    });
  }
  
  // Add search query if provided
  if (query) {
    url.searchParams.append('search', query);
  }
  
  // Add peak rank filter if provided
  if (peakRankFilter) {
    url.searchParams.append('peak_rank', peakRankFilter);
  }
  
  // Add unrated filter if true
  if (unratedOnly) {
    url.searchParams.append('unrated_only', 'true');
  }
  
  // Add decade filter if provided
  if (decade) {
    url.searchParams.append('decade', decade);
  }
  
  // Get auth token if available (needed for unrated filter)
  const options = {};
  if (typeof window !== 'undefined') {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      options.headers = {
        'Authorization': `Token ${authToken}`
      };
      
      // Log for debugging
      if (unratedOnly) {
        console.log('Sending request with auth token for unrated songs');
      }
    } else if (unratedOnly) {
      console.log('Warning: Requesting unrated songs but no auth token available');
    }
  }
  
  // Log the full URL for debugging
  console.log('Fetching songs with URL:', url.toString());
  
  const result = await fetchData(url.toString(), options);
  console.log('API response received:', result);
  return result;
}

export async function generateQuiz(numSongs, hitLevel, selectedDecades) {
  // Build the URL with query parameters
  let url = new URL(API_ENDPOINTS.generateQuiz);
  
  // Add parameters
  url.searchParams.append('number_of_songs', numSongs);
  url.searchParams.append('hit_size', hitLevel);
  
  // Add selected decades as a comma-separated string
  if (selectedDecades && selectedDecades.length > 0) {
    selectedDecades.forEach(decade => {
      url.searchParams.append('decades', decade);
    });
  }
  
  return fetchData(url.toString());
}

export async function generatePlaylist(numSongs, hitLevel, selectedDecades) {
  // Build the URL with query parameters
  let url = new URL(API_ENDPOINTS.generatePlaylist);
  
  // Add parameters
  url.searchParams.append('number_of_songs', numSongs);
  url.searchParams.append('hit_size', hitLevel);
  
  // Add selected decades as a comma-separated string
  if (selectedDecades && selectedDecades.length > 0) {
    selectedDecades.forEach(decade => {
      url.searchParams.append('decades', decade);
    });
  }
  
  return fetchData(url.toString());
}

// Client-side API functions (to be used with 'use client' directive)
export async function submitUserScore(songId, userScore, authToken) {
  const url = API_ENDPOINTS.submitUserScore(songId);
  return fetchData(url, {
    method: 'POST',
    headers: {
      Authorization: `Token ${authToken}`,
    },
    body: JSON.stringify({ rating: userScore }),
  });
}

export async function submitUserComment(songId, commentText, authToken) {
  const url = API_ENDPOINTS.submitUserComment(songId);
  return fetchData(url, {
    method: 'POST',
    headers: {
      Authorization: `Token ${authToken}`,
    },
    body: JSON.stringify({ comment_text: commentText }),
  });
}

export async function deleteUserComment(commentId, authToken) {
  // In the original React frontend, the endpoint is ${commentId}/comment/
  const url = `${BASE_URL}/api/songs/${commentId}/comment/`;
  return fetchData(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${authToken}`,
    },
  });
}

export async function editUserComment(songId, commentId, newText, authToken) {
  // Let's try a different approach with PUT instead of PATCH
  // and use comment_text instead of text
  const url = `${BASE_URL}/api/songs/${songId}/comment/${commentId}/`;
  
  console.log('Editing comment with URL:', url);
  console.log('Comment data:', { songId, commentId, newText });
  
  return fetchData(url, {
    method: 'PUT',
    headers: {
      Authorization: `Token ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ comment_text: newText }),
  });
}

export async function toggleBookmarkSong(songId, authToken) {
  const url = API_ENDPOINTS.toggleBookmark(songId);
  return fetchData(url, {
    method: 'POST',
    headers: {
      Authorization: `Token ${authToken}`,
    },
  });
}

export async function getUserProfile(authToken) {
  return fetchData(API_ENDPOINTS.userProfile, {
    headers: {
      Authorization: `Token ${authToken}`,
    },
  });
}
