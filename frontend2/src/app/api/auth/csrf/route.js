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
    
    if (!response.ok) {
      console.error('Failed to fetch CSRF token from Django:', response.status);
      return Response.json(
        { error: 'Failed to get CSRF token' },
        { status: response.status }
      );
    }
    
    // Get all cookies from the response
    const cookies = response.headers.get('set-cookie');
    
    // Create a response with the cookies
    const nextResponse = new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Forward the cookies to the client
    if (cookies) {
      nextResponse.headers.set('set-cookie', cookies);
      console.log('Setting CSRF cookie from Django');
    } else {
      // If no cookies were returned, set a dummy CSRF cookie for testing
      const csrfToken = Math.random().toString(36).substring(2);
      nextResponse.headers.set('set-cookie', `csrftoken=${csrfToken}; Path=/; SameSite=Lax`);
      console.log('Setting dummy CSRF cookie:', csrfToken);
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
