export async function POST(request) {
  try {
    // Get the authorization header from the request
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return Response.json(
        { message: 'Logout successful' },
        { status: 200 }
      );
    }
    
    // Build the URL for the backend API
    const backendUrl = new URL(`${process.env.API_URL}/api/logout/`);
    
    // Forward the request to the backend
    const response = await fetch(backendUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });
    
    // Return a success response even if the backend fails
    // This ensures the user is logged out on the client side
    return Response.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in logout API route:', error);
    
    // Still return a success response to ensure the user is logged out on the client side
    return Response.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
  }
}
