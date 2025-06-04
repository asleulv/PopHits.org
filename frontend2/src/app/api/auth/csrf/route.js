export async function GET() {
  try {
    // Build the URL for the backend API
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8000' 
      : 'https://pophits.org';
    
    // Make a GET request to Django to get the CSRF cookie
    const response = await fetch(`${backendUrl}/api/csrf/`, {
      method: 'GET',
      credentials: 'include',
    });
    
    // Get all cookies from the response
    const cookies = response.headers.get('set-cookie');
    
    // Create a response with the cookies
    const nextResponse = new Response(null, {
      status: 200,
      statusText: 'OK',
    });
    
    // Forward the cookies to the client
    if (cookies) {
      nextResponse.headers.set('set-cookie', cookies);
    }
    
    return nextResponse;
  } catch (error) {
    console.error('Error in CSRF API route:', error);
    
    // Return an error response
    return Response.json(
      { error: 'Failed to get CSRF token' },
      { status: 500 }
    );
  }
}
