import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Token ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    // Get cookies from the request to forward CSRF token
    const cookies = request.headers.get('cookie') || '';
    
    // Extract CSRF token from cookies if present
    let csrfToken = '';
    const csrfCookie = cookies.split(';').find(c => c.trim().startsWith('csrftoken='));
    if (csrfCookie) {
      csrfToken = csrfCookie.split('=')[1];
    }
    
    // Forward the request to the backend API
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8000' 
      : 'https://pophits.org';
    
    // Get user profile data directly from the profile endpoint
    const profileResponse = await fetch(`${backendUrl}/api/profile/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
        'Cookie': cookies, // Forward cookies for CSRF token
        'X-Requested-With': 'XMLHttpRequest', // This helps Django identify AJAX requests
        'X-CSRFToken': csrfToken, // Include CSRF token in header
      },
      credentials: 'include', // Include credentials (cookies)
    });
    
    if (!profileResponse.ok) {
      console.error('Failed to fetch profile data:', profileResponse.status);
      return NextResponse.json(
        { error: 'Failed to fetch profile data' },
        { status: profileResponse.status }
      );
    }
    
    const profileData = await profileResponse.json();
    console.log('Profile data fetched successfully:', profileData);
    
    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error in profile API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
