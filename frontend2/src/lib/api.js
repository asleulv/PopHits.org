/**
 * API Configuration and Helper Functions
 * Centralized API client for all backend communication
 */

// ============================================================================
// BASE URL CONFIGURATION
// ============================================================================

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace("/api", "")
  : process.env.NODE_ENV === "development"
  ? "http://localhost:8000"
  : "https://pophits.org";

// ============================================================================
// BLOG URL CONFIGURATION
// ============================================================================

export const BLOG_API_ENDPOINTS = {
  blogPosts: `${BASE_URL}/api/blog/`,
  blogPostBySlug: (slug) => `${BASE_URL}/api/blog/${slug}/`,
  latestBlogPost: `${BASE_URL}/api/blog/?page=1&page_size=1`,
};

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ENDPOINTS = {
  // Song endpoints
  topRatedSongs: `${BASE_URL}/api/songs/top-rated-songs/`,
  randomHitsByDecade: `${BASE_URL}/api/songs/random-songs-by-decade/`,
  numberOneHits: `${BASE_URL}/api/songs/number-one-songs/`,
  currentHot100: `${BASE_URL}/api/songs/current-hot100/`,
  randomByArtist: (artistSlug) =>
    `${BASE_URL}/api/songs/random-by-artist/?artist_slug=${artistSlug}`,
  songBySlug: (slug) => `${BASE_URL}/api/songs/${slug}/`,
  songTimelineBySlug: (slug) => `${BASE_URL}/api/songs/slug/${slug}/timeline/`,
  songs: `${BASE_URL}/api/songs/`, 
  submitUserScore: (songId) => `${BASE_URL}/api/songs/${songId}/rate/`,
  submitUserComment: (songId) => `${BASE_URL}/api/songs/${songId}/comment/`,
  deleteUserComment: (commentId) =>
    `${BASE_URL}/api/songs/${commentId}/comment/`,
  editUserComment: (songId, commentId) =>
    `${BASE_URL}/api/songs/${songId}/comment/${commentId}/`,
  toggleBookmark: (songId) => `${BASE_URL}/api/songs/${songId}/bookmark/`,
  generateQuiz: `${BASE_URL}/api/songs/generate-quiz/`,
  generatePlaylist: `${BASE_URL}/api/songs/generate-playlist/`,

  // Historic charts
  chartDates: `${BASE_URL}/api/songs/charts/dates/`,
  chartByDate: (date) => `${BASE_URL}/api/songs/charts/hot-100/${date}/`,

  // Artist endpoints
  artistBySlug: (slug) => `${BASE_URL}/api/artists/${slug}/`,
  artists: `${BASE_URL}/api/artists/`,
  featuredArtists: `${BASE_URL}/api/songs/featured-artists/`,

  // User endpoints
  userProfile: `${BASE_URL}/api/profile/`,

  // Website stats endpoints
  websiteStats: `${BASE_URL}/api/songs/website-stats/`,

  // Blog endpoints
  blogPosts: `${BASE_URL}/api/blog/`,
  blogPostBySlug: (slug) => `${BASE_URL}/api/blog/${slug}/`,
  latestBlogPost: `${BASE_URL}/api/blog/?page=1&page_size=1`,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generic fetch wrapper with error handling
 * @param {string} url - The URL to fetch from
 * @param {object} options - Fetch options (headers, method, body, etc.)
 * @returns {Promise<object>} - Parsed JSON response
 */
async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      next: options.next || undefined,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Handle 204 No Content responses
    if (options.method === "DELETE" && response.status === 204) {
      return {};
    }

    // Parse and return JSON
    try {
      return await response.json();
    } catch (e) {
      if (response.status === 204) {
        return {};
      }

      // Handle HTML responses (error pages)
      if (e.message?.includes("Unexpected token '<'")) {
        console.warn(`Received HTML instead of JSON from ${url}`);
        return { results: [] };
      }

      throw e;
    }
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
}
// Blog helper function
export async function fetchBlogData(url, options = {}) {
  try {
    const res = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
      next: options.next || undefined,
    });

    if (!res.ok) throw new Error(`Blog API error ${res.status} for ${url}`);

    return res.json();
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    return null;
  }
}

// ============================================================================
// SERVER-SIDE API FUNCTIONS (for use in server components)
// ============================================================================

/**
 * Fetch top-rated songs
 */
export async function getTopRatedSongs(limit = 10) {
  const url = `${API_ENDPOINTS.topRatedSongs}?limit=${limit}`;
  return fetchData(url);
}

/**
 * Fetch random songs grouped by decade
 */
export async function getRandomHitsByDecade() {
  return fetchData(API_ENDPOINTS.randomHitsByDecade);
}

/**
 * Fetch number one hits
 */
export async function getNumberOneHits() {
  return fetchData(API_ENDPOINTS.numberOneHits);
}

/**
 * Fetch current Hot 100 chart
 */
export async function getCurrentHot100() {
  return fetchData(API_ENDPOINTS.currentHot100, {
    next: { tags: ["hot100"] },
  });
}

/**
 * Fetch featured artists with images
 */
export async function getFeaturedArtists() {
  return fetchData(API_ENDPOINTS.featuredArtists);
}

/**
 * Fetch a random song by artist slug (optimized endpoint)
 */
export async function getRandomSongByArtist(artistSlug) {
  return fetchData(API_ENDPOINTS.randomByArtist(artistSlug));
}

/**
 * Fetch song by slug
 */
export async function getSongBySlug(slug) {
  return fetchData(API_ENDPOINTS.songBySlug(slug));
}

/**
 * Fetch songTimeline by slug
 */
export async function getSongTimelineBySlug(slug) {
  return fetchData(API_ENDPOINTS.songTimelineBySlug(slug));
}

/**
 * Fetch artist by slug with full details
 */
export async function getArtistBySlug(slug) {
  return fetchData(API_ENDPOINTS.artistBySlug(slug));
}

/**
 * Fetch artists with optional filters
 * @param {object} options - Filter options (letter, page, pageSize)
 */
export async function getArtists(options = {}) {
  const { letter, page = 1, pageSize = 100 } = options;

  const url = new URL(API_ENDPOINTS.artists);
  url.searchParams.append("page", page);
  url.searchParams.append("page_size", pageSize);

  if (letter && letter !== "All") {
    url.searchParams.append("letter", letter);
  }

  return fetchData(url.toString());
}

// ============================================================================
// COMPLEX QUERY FUNCTIONS
// ============================================================================

/**
 * Fetch songs with advanced filtering and sorting
 */
/**
 * Fetch songs with advanced filtering and sorting
 * Works in both client and server contexts
 */
export async function getSongs(
  page = 1,
  perPage = 25,
  filterType = null,
  filterValue = null,
  sortField = null,
  sortOrder = "",
  query = "",
  peakRankFilter = null,
  unratedOnly = false,
  decade = null,
  tagSlug = null,
  authToken = null
) {
  // Build query params
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("page_size", perPage);

  if (filterType && filterValue) params.append(filterType, filterValue);
  if (sortField) {
    params.append("sort_by", sortField);
    params.append("order", sortOrder === "-" ? "desc" : "asc");
  }
  if (query) params.append("search", query);
  if (peakRankFilter) params.append("peak_rank", peakRankFilter);
  if (unratedOnly) params.append("unrated_only", "true");
  if (decade) params.append("decade", decade);
  if (tagSlug) params.append("tag", tagSlug);

  // Determine if we're on server or client
  const isServer = typeof window === "undefined";
  
  if (isServer) {
    // SERVER: Call Django directly with internal key (bypass Next.js API route)
    const DJANGO_BACKEND_URL = process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:8000"
      : "http://127.0.0.1:8080";  // Internal nginx in production
    
    const headers = {
      "Content-Type": "application/json",
      "X-Internal-Key": process.env.INTERNAL_API_KEY,
    };
    
    if (authToken) {
      headers["Authorization"] = `Token ${authToken}`;
    }
    
    const response = await fetch(`${DJANGO_BACKEND_URL}/api/songs/?${params.toString()}`, {
      headers,
      cache: "no-store",
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
    
  } else {
    // CLIENT: Call Next.js API route which adds the internal key
    const headers = {
      "Content-Type": "application/json",
    };
    
    if (authToken) {
      headers["Authorization"] = `Token ${authToken}`;
    }
    
    const response = await fetch(`/api/songs?${params.toString()}`, {
      headers,
      cache: "no-store",
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  }
}



/**
 * Generate quiz questions based on criteria
 */
export async function generateQuiz(numSongs, hitLevel, selectedDecades) {
  const url = new URL(API_ENDPOINTS.generateQuiz);

  url.searchParams.append("number_of_songs", numSongs);
  url.searchParams.append("hit_size", hitLevel);

  if (selectedDecades?.length > 0) {
    selectedDecades.forEach((decade) => {
      url.searchParams.append("decades", decade);
    });
  }

  return fetchData(url.toString());
}

/**
 * Generate playlist based on criteria
 */
export async function generatePlaylist(numSongs, hitLevel, selectedDecades) {
  const url = new URL(API_ENDPOINTS.generatePlaylist);

  url.searchParams.append("number_of_songs", numSongs);
  url.searchParams.append("hit_size", hitLevel);

  if (selectedDecades?.length > 0) {
    selectedDecades.forEach((decade) => {
      url.searchParams.append("decades", decade);
    });
  }

  return fetchData(url.toString());
}

// ============================================================================
// CLIENT-SIDE API FUNCTIONS (requires 'use client' directive)
// ============================================================================

/**
 * Submit user rating for a song
 */
export async function submitUserScore(songId, userScore, authToken) {
  return fetchData(API_ENDPOINTS.submitUserScore(songId), {
    method: "POST",
    headers: { Authorization: `Token ${authToken}` },
    body: JSON.stringify({ rating: userScore }),
  });
}

/**
 * Submit user comment on a song
 */
export async function submitUserComment(songId, commentText, authToken) {
  return fetchData(API_ENDPOINTS.submitUserComment(songId), {
    method: "POST",
    headers: { Authorization: `Token ${authToken}` },
    body: JSON.stringify({ comment_text: commentText }),
  });
}

/**
 * Delete a user comment
 */
export async function deleteUserComment(commentId, authToken) {
  return fetchData(API_ENDPOINTS.deleteUserComment(commentId), {
    method: "DELETE",
    headers: { Authorization: `Token ${authToken}` },
  });
}

/**
 * Edit a user comment
 */
export async function editUserComment(songId, commentId, newText, authToken) {
  return fetchData(API_ENDPOINTS.editUserComment(songId, commentId), {
    method: "PUT",
    headers: { Authorization: `Token ${authToken}` },
    body: JSON.stringify({ comment_text: newText }),
  });
}

/**
 * Toggle bookmark for a song
 */
export async function toggleBookmarkSong(songId, authToken) {
  return fetchData(API_ENDPOINTS.toggleBookmark(songId), {
    method: "POST",
    headers: { Authorization: `Token ${authToken}` },
  });
}

/**
 * Fetch user profile
 */
export async function getUserProfile(authToken) {
  return fetchData(API_ENDPOINTS.userProfile, {
    headers: { Authorization: `Token ${authToken}` },
  });
}

// ============================================================================
// HISTORIC CHARTS ENDPOINTS
// ============================================================================

/**
 * Fetch all available chart dates
 */
export async function getChartDates() {
  return fetchData(API_ENDPOINTS.chartDates);
}

/**
 * Fetch Billboard Hot 100 chart for a specific date
 */
export async function getChartByDate(date) {
  return fetchData(API_ENDPOINTS.chartByDate(date), {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
}

// ============================================================================
// BLOG API FUNCTIONS
// ============================================================================

/**
 * Fetch blog posts with pagination and search
 */
export async function getBlogPosts(page = 1, perPage = 10, search = "") {
  const url = new URL(API_ENDPOINTS.blogPosts);

  url.searchParams.append("page", page);
  url.searchParams.append("page_size", perPage);

  if (search) {
    url.searchParams.append("search", search);
  }

  return fetchData(url.toString());
}

/**
 * Fetch single blog post by slug
 */
export async function getBlogPostBySlug(slug) {
  return fetchData(API_ENDPOINTS.blogPostBySlug(slug));
}

/**
 * Fetch the latest blog post
 */
export async function getLatestBlogPost() {
  try {
    const response = await fetchData(API_ENDPOINTS.latestBlogPost);

    if (Array.isArray(response)) {
      return response.length > 0 ? response[0] : null;
    } else if (response.results?.length > 0) {
      return response.results[0];
    }

    return null;
  } catch (error) {
    console.error("Error fetching latest blog post:", error);
    return null;
  }
}

// ============================================================================
// WEBSITE STATS  API FUNCTIONS
// ============================================================================

export async function getWebsiteStats() {
  return fetchData(API_ENDPOINTS.websiteStats, { cache: "no-store" });
}

// ============================================================================
// SERVER-SIDE API FUNCTIONS (for use in server components)
// ============================================================================

export async function internalFetch(path, options = {}) {
  if (typeof window !== "undefined") {
    throw new Error("internalFetch is a server-only function.");
  }

  const internalBaseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8000"      // Django dev
      : "http://127.0.0.1:8080";     // Nginx internal server in prod

  const headers = {
    ...options.headers,
    "X-Internal-Key": process.env.INTERNAL_API_KEY,
  };

  const response = await fetch(`${internalBaseUrl}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Internal API error: ${response.status} ${response.statusText} from ${path}`
    );
  }

  return response;
}


