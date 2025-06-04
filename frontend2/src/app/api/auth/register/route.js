export async function POST(request) {
  try {
    const body = await request.json();
    
    // Build the URL for the backend API
    const backendUrl = new URL(`${process.env.API_URL}/api/register/`);
    
    // Get cookies from the request to forward CSRF token
    const cookies = request.headers.get('cookie') || '';
    
    // Extract CSRF token from cookies if present
    let csrfToken = '';
    const csrfCookie = cookies.split(';').find(c => c.trim().startsWith('csrftoken='));
    if (csrfCookie) {
      csrfToken = csrfCookie.split('=')[1];
    }
    
    // Forward the request to the backend
    const response = await fetch(backendUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies, // Forward cookies for CSRF token
        'X-Requested-With': 'XMLHttpRequest', // This helps Django identify AJAX requests
        'X-CSRFToken': csrfToken, // Include CSRF token in header
      },
      credentials: 'include', // Include credentials (cookies)
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
