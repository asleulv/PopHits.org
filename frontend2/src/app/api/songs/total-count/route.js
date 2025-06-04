import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Forward the request to the backend API
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8000' 
      : 'https://pophits.org';
    
    // Since there's no direct total-count endpoint in the backend,
    // we'll use the songs endpoint with a small page size to get the count
    const response = await fetch(`${backendUrl}/api/songs/?page=1&page_size=1`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch total songs count' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json({ count: data.count });
  } catch (error) {
    console.error('Error in total-count API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
