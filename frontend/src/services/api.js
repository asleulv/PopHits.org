import axios from 'axios';

// Base url
let BASE_URL = 'https://pophits.org'; // Default to production URL

if (process.env.NODE_ENV === 'development') {
  BASE_URL = 'http://localhost:8000'; // Use local URL for development
}

// Create an instance for song-related requests
export const songApi = axios.create({
  baseURL: `${BASE_URL}/api/songs/`,
});

// Create a separate instance for user-related requests
export const userApi = axios.create({
  baseURL: `${BASE_URL}/api/`,
});

// Create a separate instance for playlist-related requests
export const playlistApi = axios.create({
  baseURL: `${BASE_URL}/playlist/`,
});

export const authApi = axios.create({
  baseURL: `${BASE_URL}/`,
});

// Function to get a random song
export const getRandomSong = async () => {
  try {
    const response = await songApi.get('?ordering=?'); // Adjust the ordering parameter based on your API
    const songs = response.data;
    const randomIndex = Math.floor(Math.random() * songs.length);
    return songs[randomIndex];
  } catch (error) {
    console.error('Error fetching random song:', error);
    throw error;
  }
};


// Function to get a random song
export const getRandomHit = async () => {
  try {
    const response = await songApi.get('/random-song/');
    return response.data;
  } catch (error) {
    console.error('Error fetching random song:', error);
    throw error;
  }
};

// Function to get a specific song by ID
export const getSongById = async (id) => {
  try {
    const response = await songApi.get(`${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching song with ID ${id}:`, error);
    throw error;
  }
};


// Function to get all songs
export const getAllSongs = async (page, perPage, sortBy, sortOrder, searchQuery) => {
  try {
    let url = `?page=${page}&page_size=${perPage}`;

    // Append sortBy if provided
    if (sortBy) {
      url += `&sort_by=${sortBy}`;
    }

    // Append sortOrder if provided
    if (sortOrder) {
      url += `&order=${sortOrder === "-" ? "desc" : "asc"}`; // Use "desc" for descending order, "asc" for ascending
    }

    // Append searchQuery if provided
    if (searchQuery) {
      url += `&search=${searchQuery}`;
    }

    const response = await songApi.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching songs:', error);
    throw error;
  }
};

// Function to get all songs or songs by filter
export const getSongs = async (page, perPage, filterType, filterValue, sortBy, sortOrder, searchQuery, peakRankFilter, unratedOnly = false) => {
  try {
    // Initialize URL with pagination parameters
    let url = `?page=${page}&page_size=${perPage}`;

    // Append filterType and filterValue if provided
    if (filterType && filterValue) {
      if (filterType === 'artist' || filterType === 'year') {
        url += `&${filterType}=${filterValue}`;
      }
    }

    // Append peakRankFilter if provided
    if (peakRankFilter) {
      url += `&peak_rank=${peakRankFilter}`;
    }
    
    // Append sortBy if provided
    if (sortBy) {
      url += `&sort_by=${sortBy}`;
    }

    // Append sortOrder if provided
    if (sortOrder) {
      url += `&order=${sortOrder === "-" ? "desc" : "asc"}`; // Use "desc" for descending order, "asc" for ascending
    }

    // Append searchQuery if provided
    if (searchQuery) {
      url += `&search=${searchQuery}`;
    }
    
    // Append unratedOnly filter if true
    if (unratedOnly) {
      url += '&unrated_only=true';
    }
    
    // Add auth token for all requests when user is logged in
    const authToken = localStorage.getItem('authToken');
    const headers = authToken ? { Authorization: `Token ${authToken}` } : {};
    
    // Log the final URL for debugging
    console.log("API request URL:", url);
    console.log("Using auth token:", !!authToken);
    
    // Fetch data from API with auth headers if available
    const response = await songApi.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching songs:', error);
    throw error;
  }
};




// Function to get songs by artist or year
export const getSongsByFilter = async (filterType, filterValue, page, perPage, sortBy, sortOrder, searchQuery) => {
  try {
    let url = `/${filterType}/${filterValue}/?page=${page}&page_size=${perPage}`;

    // Append sortBy if provided
    if (sortBy) {
      url += `&sort_by=${sortBy}`;
    }

    // Append sortOrder if provided
    if (sortOrder) {
      url += `&order=${sortOrder === "-" ? "desc" : "asc"}`; // Use "desc" for descending order, "asc" for ascending
    }

    // Append searchQuery if provided
    if (searchQuery) {
      url += `&search=${searchQuery}`;
    }

    const response = await songApi.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching songs by ${filterType}:`, error);
    throw error;
  }
};

// Function to get a specific song by slug
export const getSongBySlug = async (slug) => {
  try {
    const response = await songApi.get(`${slug}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching song with slug ${slug}:`, error);
    throw error;
  }
};

export const submitUserScore = async (songId, userScore) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await songApi.post(`${songId}/rate/`, {
      rating: userScore,  // Make sure the field name matches what Django expects
    }, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitUserComment = async (songId, commentText) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await songApi.post(`${songId}/comment/`, { comment_text: commentText }, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to delete a user comment
export const deleteUserComment = async (commentId) => {
  try {
    const authToken = localStorage.getItem('authToken');
    await songApi.delete(`${commentId}/comment/`, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

// Function to update a user comment
export const editUserComment = async (songId, commentId, newText) => {
  try {
    const authToken = localStorage.getItem('authToken');
    await songApi.patch(`/${songId}/comment/${commentId}/`, { text: newText }, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

// Function to get user profile
export const getUserProfile = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await userApi.get('profile/', {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await userApi.patch('profile/update/', userData, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to get user rating for a song
export const getUserRatingForSong = async (songId, userId) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await songApi.get(`ratings/${songId}/user/${userId}/`, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Rating not found, return default value
      return 0;
    } else {
      // Handle other errors
      throw error;
    }
  }
};





// Function to toggle bookmark status of a song
export const toggleBookmarkSong = async (songId) => {
  try {
    const authToken = localStorage.getItem("authToken"); // Get the authentication token from localStorage
    // Send a POST request to your backend to toggle the bookmark status
    const response = await songApi.post(
      `/${songId}/bookmark/`, // Use the songApi path to toggle the bookmark status
      null,
      {
        headers: {
          Authorization: `Token ${authToken}`, // Include the authorization token in the request headers
        },
      }
    );
    return response.data; // Return the response data if needed
  } catch (error) {
    throw error; // Throw an error if the request fails
  }
};

export const getBookmarkedSongs = async (authToken) => {
  try {
    const response = await songApi.get('/bookmarked-songs/', {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAllBookmarks = async () => {
  try {
    const authToken = localStorage.getItem("authToken");
    const response = await songApi.delete('/bookmarked-songs/', {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });
    if (response.status === 204) {
      // Bookmarks deleted successfully
      // Optionally, you can update the UI or show a success message
    } else {
      // Handle other status codes if needed
    }
  } catch (error) {
    console.error("Error deleting bookmarks:", error);
    // Handle error
  }
};


// Function to fetch the bookmark status of a song for the current user
export const getBookmarkStatusForSong = async (songId) => {
  try {
     const authToken = localStorage.getItem('authToken');
     const response = await songApi.get(`/${songId}/bookmark-status/`, {
       headers: {
         Authorization: `Token ${authToken}`,
       },
     });
     return response.data;
  } catch (error) {
     throw error;
  }
 };

 export const getCommentStatusForSong = async (songId) => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await songApi.get(`/${songId}/comment-status/`, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to get total number of songs in the database
export const getTotalSongsCount = async () => {
  try {
    const response = await songApi.get('?page=1&page_size=1');
    // The response should include the total count in the pagination info
    return response.data.count;
  } catch (error) {
    console.error('Error fetching total songs count:', error);
    throw error;
  }
};

// Function to get top-rated songs
export const getTopRatedSongs = async () => {
  try {
    const response = await songApi.get('/top-rated-songs/');
    return response.data;
  } catch (error) {
    console.error('Error fetching top-rated songs:', error);
    throw error;
  }
};

// Function to get random hits by decade
export const getRandomHitsByDecade = async () => {
  try {
    const response = await songApi.get('/random-songs-by-decade/');
    return response.data;
  } catch (error) {
    console.error('Error fetching random hits by decade:', error);
    throw error;
  }
};

// Function to get number one hits
export const getNumberOneHits = async () => {
  try {
    const response = await songApi.get('/number-one-songs/');
    return response.data;
  } catch (error) {
    console.error('Error fetching number one hits:', error);
    throw error;
  }
};

// Function to get songs with images
export const getSongsWithImages = async () => {
  try {
    const response = await songApi.get('/songs-with-images/');
    return response.data;
  } catch (error) {
    console.error('Error fetching songs with images:', error);
    throw error;
  }
};

// Function to generate a playlist
export const generatePlaylist = async (numSongs, hitLevel, selectedDecades) => {
  try {
    // Initialize URLSearchParams
    const params = new URLSearchParams({
      number_of_songs: numSongs,
      hit_size: hitLevel
    });
    
    // Append each decade separately
    selectedDecades.forEach(decade => params.append('decades', decade));

    const response = await songApi.get('generate-playlist/', {
      params: params
    });
    return response.data;
  } catch (error) {
    console.error('Error generating playlist:', error);
    throw error;
  }
};

// Function to generate quiz questions
export const generateQuiz = async (numSongs, hitLevel, selectedDecades) => {
  try {
    // Initialize URLSearchParams
    const params = new URLSearchParams({
      number_of_songs: numSongs,
      hit_size: hitLevel
    });
    
    // Append each decade separately
    selectedDecades.forEach(decade => params.append('decades', decade));

    const response = await songApi.get('generate-quiz/', {
      params: params
    });
    return response.data;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};
