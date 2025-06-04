import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Forward the request to the backend API
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8000' 
      : 'https://pophits.org';
    
    const response = await fetch(`${backendUrl}/api/songs/random-song/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch random song' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in random song API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
