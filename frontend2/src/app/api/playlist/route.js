import { API_ENDPOINTS } from '@/lib/api';

export async function GET(request) {
  try {
    // Get the URL parameters from the request
    const { searchParams } = new URL(request.url);
    
    // Extract the parameters we need
    const numberOfSongs = searchParams.get('number_of_songs') || 10;
    const hitSize = searchParams.get('hit_size') || 1;
    const decades = searchParams.getAll('decades');
    
    // Build the URL for the backend API using the API_ENDPOINTS
    const backendUrl = new URL(API_ENDPOINTS.generatePlaylist);
    
    // Add the parameters to the backend URL
    backendUrl.searchParams.append('number_of_songs', numberOfSongs);
    backendUrl.searchParams.append('hit_size', hitSize);
    
    // Add each decade as a separate parameter
    if (decades && decades.length > 0) {
      decades.forEach(decade => {
        backendUrl.searchParams.append('decades', decade);
      });
    }
    
    // Fetch the data from the backend
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    // Parse the response as JSON
    const data = await response.json();
    
    // Return the data as a JSON response
    return Response.json(data);
  } catch (error) {
    console.error('Error in playlist API route:', error);
    
    // Return an error response
    return Response.json(
      { error: 'Failed to generate playlist' },
      { status: 500 }
    );
  }
}
