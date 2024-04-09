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


// Function to get all songs
export const getAllSongs = async () => {
  try {
    const response = await songApi.get('?ordering=?'); // Adjust the ordering parameter based on your API
    return response.data;
  } catch (error) {
    console.error('Error fetching all songs:', error);
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

export const getAllSongsByArtist = async (artist_slug) => {
  try {
    const response = await songApi.get(`/artist/${artist_slug}`);
    return response.data; // Assuming the response contains the list of songs
  } catch (error) {
    // Handle error
    console.error('Error fetching songs by artist:', error);
    throw error;
  }
};

export const getAllSongsByYear = async (year) => {
  try {
    const response = await songApi.get(`/year/${year}`);
    return response.data; // Assuming the response contains the list of songs
  } catch (error) {
    // Handle error
    console.error('Error fetching songs by year:', error);
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
      console.error('Error fetching user rating:', error);
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





