// src/services/spotifyPlaylist.js
import { clearAccessToken } from "./spotifyAuth"; // Adjust the import path if necessary

export const getSpotifyUserId = async (accessToken) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 401) {
        clearAccessToken();
        return null;
      }
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error("Error fetching Spotify user ID:", error);
      return null;
    }
  };
  
  export const createPlaylist = async (accessToken, userId, playlistName) => {
    const response = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: playlistName }),
      }
    );
    const data = await response.json();
    return data.id;
  };
  
  export const addTracksToPlaylist = async (accessToken, playlistId, trackUris) => {
    const trackUriArray = trackUris
      .split(",")
      .map((url) => {
        const match = url.match(/spotify\.com\/track\/([^?]+)/);
        return match ? `spotify:track:${match[1]}` : null;
      })
      .filter((uri) => uri !== null);
  
    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris: trackUriArray }),
    });
  };
  