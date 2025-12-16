import { NextResponse } from 'next/server';

const INTERNAL_KEY = process.env.INTERNAL_API_KEY;
const DJANGO_BACKEND_URL = 
  process.env.NODE_ENV === 'development' 
    ? 'http://127.0.0.1:8000'
    : 'https://pophits.org';

export async function GET(request) {
  if (!INTERNAL_KEY) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  // Extract all query parameters
  const { searchParams } = new URL(request.url);
  
  // Get user's auth token from request headers (sent from client)
  const userAuthToken = request.headers.get('authorization');

  try {
    // Build Django URL with all query params
    const djangoUrl = `${DJANGO_BACKEND_URL}/api/songs/?${searchParams.toString()}`;
    
    // Build headers object (plain JavaScript object, no type annotation)
    const headers = {
      'Content-Type': 'application/json',
      'X-Internal-Key': INTERNAL_KEY,
    };
    
    // Forward user's auth token if present
    if (userAuthToken) {
      headers['Authorization'] = userAuthToken;
    }

    const response = await fetch(djangoUrl, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorDetail = await response.json().catch(() => ({ detail: 'Unknown error' }));
      return NextResponse.json(
        { error: 'Failed to fetch songs', details: errorDetail },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in songs API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
