export async function POST(request) {
  try {
    const body = await request.json();
    
    // Build the URL for the backend API
    const backendUrl = new URL(`${process.env.API_URL}/api/login/`);
    
    // Forward the request to the backend
    const response = await fetch(backendUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    // Get the response data
    const data = await response.json();
    
    // Check if the response is OK
    if (!response.ok) {
      return Response.json(
        { error: data.message || 'Login failed' },
        { status: response.status }
      );
    }
    
    // Return the data as a JSON response
    return Response.json(data);
  } catch (error) {
    console.error('Error in login API route:', error);
    
    // Return an error response
    return Response.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
