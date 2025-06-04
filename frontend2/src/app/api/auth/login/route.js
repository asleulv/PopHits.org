export async function POST(request) {
  try {
    const body = await request.json();
    
    // Build the URL for the backend API
    const backendUrl = new URL(`${process.env.API_URL}/api/login/`);
    
    // Get cookies from the request to forward CSRF token
    const cookies = request.headers.get('cookie') || '';
    
    // Extract CSRF token from cookies if present
    let csrfToken = '';
    const csrfCookie = cookies.split(';').find(c => c.trim().startsWith('csrftoken='));
    if (csrfCookie) {
      csrfToken = csrfCookie.split('=')[1];
    }
    
    // Get CSRF token from headers if present (client might have set it)
    const headerCsrfToken = request.headers.get('x-csrftoken') || request.headers.get('X-CSRFToken');
    if (headerCsrfToken) {
      csrfToken = headerCsrfToken;
    }
    
    // Create headers for the backend request
    const headers = {
      'Content-Type': 'application/json',
      'Cookie': cookies, // Forward cookies for CSRF token
      'X-Requested-With': 'XMLHttpRequest', // This helps Django identify AJAX requests
    };
    
    // Add CSRF token to headers if available
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
      console.log('Using CSRF token:', csrfToken);
    } else {
      console.warn('No CSRF token found for login request');
    }
    
    // Forward the request to the backend
    const response = await fetch(backendUrl.toString(), {
      method: 'POST',
      headers,
      credentials: 'include', // Include credentials (cookies)
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
