const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token'; // Using implicit grant flow


// Function to get Spotify authorization URL
export const getSpotifyAuthUrl = () => {
  const scopes = [
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-library-read',
  ].join(' ');

  return `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}&response_type=${RESPONSE_TYPE}`;
};

// Function to handle Spotify authentication callback
export const handleAuthCallback = (hash) => {
  const params = new URLSearchParams(hash.replace('#', '?'));
  const accessToken = params.get('access_token');
  
  if (accessToken) {
    localStorage.setItem('spotifyAccessToken', accessToken);
    // Redirect to the playlist generator page or wherever appropriate
    window.location.href = '/playlist-generator'; // Adjust if needed
  }
};

// Function to clear Spotify access token
export const clearAccessToken = () => {
  localStorage.removeItem('spotifyAccessToken');
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('spotifyAccessToken');
};
