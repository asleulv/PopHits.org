// src/lib/api.js - BULLETPROOF VERSION

const PROXY_BASE = "/proxy";

// Generic fetch wrapper with server-side support
// Generic fetch wrapper with server-side support
async function proxyFetch(path, options = {}) {
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  const isServer = typeof window === "undefined";
  let url;

  if (isServer) {
    /**
     * BUILD-TIME / SERVER-SIDE LOGIC
     * Bypass the local proxy (port 3000) and hit Django (port 8000) directly.
     * This prevents ECONNREFUSED during 'npm run build'.
     */
    const DJANGO_INTERNAL =
      process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    url = `${DJANGO_INTERNAL}/api${path}`;

    // Manually inject the Internal Key since we are bypassing the proxy route
    options.headers = {
      ...options.headers,
      "X-Internal-Key": process.env.INTERNAL_API_KEY,
    };
  } else {
    /**
     * CLIENT-SIDE LOGIC
     * Use the relative /proxy route which NGINX/Next.js handles.
     */
    url = `${PROXY_BASE}${path}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    if (response.status === 204) {
      return {};
    }

    return await response.json();
  } catch (error) {
    console.error(`[proxyFetch] Error fetching ${url}:`, error.message);

    // If it's a server-side fetch during build, return empty data to prevent a crash
    if (isServer) {
      if (path.includes("dates")) return [];
      return { results: [] };
    }

    throw error;
  }
}

// ============================================================================
// SONG ENDPOINTS
// ============================================================================

// src/lib/api.js

// src/lib/api.js

// src/lib/api.js

export async function getSongs(options = {}) {
  // 1. Detect if the user passed 10 arguments (like in your SongsPage)
  const isLegacyCall = typeof options !== 'object';
  
  // 2. Extract values based on position OR name
  const page = isLegacyCall ? arguments[0] : (options.page || 1);
  const perPage = isLegacyCall ? arguments[1] : (options.perPage || 25);
  const type = isLegacyCall ? arguments[2] : options.type;
  const slugOrYear = isLegacyCall ? arguments[3] : (options.slug || options.year);
  const sortBy = isLegacyCall ? arguments[4] : options.sortBy;
  const order = isLegacyCall ? arguments[5] : options.order;
  const query = isLegacyCall ? arguments[6] : options.query;
  const peakRank = isLegacyCall ? arguments[7] : options.peakRank;
  const unrated = isLegacyCall ? arguments[8] : options.unrated;
  const decade = isLegacyCall ? arguments[9] : options.decade;

  const params = new URLSearchParams({
    page: String(page),
    page_size: String(perPage),
  });

  // ARTIST/YEAR HANDSHAKE: Ensure Django gets the 'artist' or 'year' keys
  if (type === 'artist' && slugOrYear) params.append('artist', slugOrYear);
  if (type === 'year' && slugOrYear) params.append('year', String(slugOrYear));

  // GLOBAL FILTERS: Map these to the keys Django expects
  if (sortBy) params.append('sort_by', sortBy);
  if (order) params.append('order', order);
  
  // Django looks for 'search' for text queries
  if (query) params.append('search', query);
  
  if (decade) params.append('decade', decade);
  
  if (peakRank) {
    // Normalize 'number-one' to 'number_one' for Django's filter
    const rankValue = (peakRank === 'number-one' || peakRank === '1') ? 'number_one' : peakRank;
    params.append('peak_rank', rankValue);
  }
  
  if (unrated) params.append('unrated_only', 'true');

  const finalPath = `/songs/?${params.toString()}`;
  console.log("🚀 API CALLING:", finalPath); 

  return proxyFetch(finalPath);
}

export async function getSongBySlug(slug) {
  return proxyFetch(`/songs/${slug}/`);
}

export async function getSongTimelineBySlug(slug) {
  return proxyFetch(`/songs/slug/${slug}/timeline/`);
}

export async function getTopRatedSongs(limit = 10) {
  return proxyFetch(`/songs/top-rated-songs/?limit=${limit}`);
}

export async function getRandomHitsByDecade() {
  return proxyFetch(`/songs/random-songs-by-decade/`);
}

export async function getNumberOneHits() {
  return proxyFetch(`/songs/number-one-songs/`);
}

export async function getCurrentHot100() {
  return proxyFetch(`/songs/current-hot100/`);
}

export async function getRandomSongByArtist(artistSlug) {
  return proxyFetch(`/songs/random-by-artist/?artist_slug=${artistSlug}`);
}

export async function getTrendingArchive(limit = 5) {
  return proxyFetch(`/songs/trending-archive/?limit=${limit}`);
}

export async function submitUserScore(songId, userScore, authToken) {
  return proxyFetch(`/songs/${songId}/rate/`, {
    method: "POST",
    headers: { Authorization: `Token ${authToken}` },
    body: JSON.stringify({ rating: userScore }),
  });
}

export async function submitUserComment(songId, commentText, authToken) {
  return proxyFetch(`/songs/${songId}/comment/`, {
    method: "POST",
    headers: { Authorization: `Token ${authToken}` },
    body: JSON.stringify({ comment_text: commentText }),
  });
}

export async function deleteUserComment(commentId, authToken) {
  return proxyFetch(`/songs/${commentId}/comment/`, {
    method: "DELETE",
    headers: { Authorization: `Token ${authToken}` },
  });
}

export async function editUserComment(songId, commentId, newText, authToken) {
  return proxyFetch(`/songs/${songId}/comment/${commentId}/`, {
    method: "PUT",
    headers: { Authorization: `Token ${authToken}` },
    body: JSON.stringify({ comment_text: newText }),
  });
}

export async function toggleBookmarkSong(songId, authToken) {
  return proxyFetch(`/songs/${songId}/bookmark/`, {
    method: "POST",
    headers: { Authorization: `Token ${authToken}` },
  });
}

export async function generateQuiz(numSongs, hitLevel, selectedDecades = []) {
  const params = new URLSearchParams({
    number_of_songs: String(numSongs),
    hit_size: String(hitLevel),
  });

  if (Array.isArray(selectedDecades)) {
    selectedDecades.forEach((decade) =>
      params.append("decades", String(decade))
    );
  }

  return proxyFetch(`/songs/generate-quiz/?${params.toString()}`);
}

export async function generatePlaylist(
  numSongs,
  hitLevel,
  selectedDecades = []
) {
  const params = new URLSearchParams({
    number_of_songs: String(numSongs),
    hit_size: String(hitLevel),
  });

  if (Array.isArray(selectedDecades)) {
    selectedDecades.forEach((decade) =>
      params.append("decades", String(decade))
    );
  }

  return proxyFetch(`/songs/generate-playlist/?${params.toString()}`);
}

// ============================================================================
// ARTIST ENDPOINTS
// ============================================================================

export async function getArtistBySlug(slug) {
  return proxyFetch(`/artists/${slug}/`);
}

export async function getArtists(options = {}) {
  const { letter, page = 1, pageSize = 100 } = options || {};

  const params = new URLSearchParams({
    page: String(page || 1),
    page_size: String(pageSize || 100),
  });

  if (letter && letter !== "All") {
    params.append("letter", letter);
  }

  return proxyFetch(`/artists/?${params.toString()}`);
}

export async function getFeaturedArtists() {
  try {
    return await proxyFetch(`/songs/featured-artists/`);
  } catch (error) {
    console.error("Error fetching featured artists:", error);
    return [];
  }
}

// ============================================================================
// CHART ENDPOINTS
// ============================================================================

export async function getChartDates() {
  return proxyFetch(`/songs/charts/dates/`);
}

export async function getChartByDate(date) {
  return proxyFetch(`/songs/charts/hot-100/${date}/`);
}

// ============================================================================
// USER ENDPOINTS
// ============================================================================

export async function getUserProfile(authToken) {
  return proxyFetch(`/profile/`, {
    headers: { Authorization: `Token ${authToken}` },
  });
}

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

export async function loginUser(username, password) {
  // Get CSRF token first
  const csrfResponse = await fetch("http://localhost:8000/api/csrf/", {
    credentials: "include",
  });
  const { csrfToken } = await csrfResponse.json();

  // Then login
  const response = await fetch("http://localhost:8000/api/login/", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return await response.json();
}

export async function registerUser(username, email, password) {
  // Similar pattern with CSRF token
  const csrfResponse = await fetch("http://localhost:8000/api/csrf/", {
    credentials: "include",
  });
  const { csrfToken } = await csrfResponse.json();

  const response = await fetch("http://localhost:8000/api/register/", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return await response.json();
}

export async function logoutUser(authToken) {
  return fetch("http://localhost:8000/api/logout/", {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Token ${authToken}`,
    },
  });
}

export async function resetPassword(email) {
  const csrfResponse = await fetch("http://localhost:8000/api/csrf/", {
    credentials: "include",
  });
  const { csrfToken } = await csrfResponse.json();

  const response = await fetch("http://localhost:8000/api/reset-password/", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error("Password reset failed");
  }

  return await response.json();
}

// ============================================================================
// BLOG ENDPOINTS
// ============================================================================

export async function getBlogPosts(page = 1, perPage = 10, search = "") {
  const params = new URLSearchParams({
    page: String(page || 1),
    page_size: String(perPage || 10),
  });

  if (search) {
    params.append("search", String(search));
  }

  return proxyFetch(`/blog/?${params.toString()}`);
}

export async function getBlogPostBySlug(slug) {
  return proxyFetch(`/blog/${slug}/`);
}

export async function getLatestBlogPost() {
  try {
    const response = await proxyFetch(`/blog/?page=1&page_size=1`);
    return response.results?.[0] || response[0] || null;
  } catch (error) {
    console.error("Error fetching latest blog post:", error);
    return null;
  }
}

// ============================================================================
// STATS ENDPOINTS
// ============================================================================

export async function getWebsiteStats() {
  return proxyFetch(`/songs/website-stats/`);
}
