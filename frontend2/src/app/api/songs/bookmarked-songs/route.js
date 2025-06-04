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
    
    console.log('Fetching bookmarked songs...');
    const response = await fetch(`${backendUrl}/api/songs/bookmarked-songs/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch bookmarked songs:', response.status);
      return NextResponse.json(
        { error: 'Failed to fetch bookmarked songs' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('Bookmarked songs fetched successfully:', data.length);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in bookmarked-songs API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
