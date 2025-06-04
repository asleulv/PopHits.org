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
    
    // Forward the request to the backend API
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8000' 
      : 'https://pophits.org';
    
    // Get user profile data directly from the profile endpoint
    const profileResponse = await fetch(`${backendUrl}/api/profile/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
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
