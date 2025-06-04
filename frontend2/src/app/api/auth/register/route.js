export async function POST(request) {
  try {
    const body = await request.json();
    
    // Build the URL for the backend API
    const backendUrl = new URL(`${process.env.API_URL}/api/register/`);
    
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
        { error: data.message || 'Registration failed' },
        { status: response.status }
      );
    }
    
    // Return the data as a JSON response
    return Response.json(data);
  } catch (error) {
    console.error('Error in register API route:', error);
    
    // Return an error response
    return Response.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
