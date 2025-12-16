import { NextResponse } from 'next/server';

// --- Environment Variable Setup ---
// 1. Get the key from the environment variables (e.g., .env.local)
const INTERNAL_KEY = process.env.INTERNAL_API_KEY; 

// 2. Determine the Django backend URL based on the environment
const DJANGO_BACKEND_URL = process.env.NODE_ENV === 'development' 
    // Use the explicit variable first, fall back to localhost if not set
    ? process.env.DJANGO_BACKEND_URL || 'http://127.0.0.1:8000' 
    // Production URL
    : 'https://pophits.org';

export async function GET() {
  
  // 3. Security check: Ensure the key is available on the server
  if (!INTERNAL_KEY) {
    console.error("SERVER CONFIGURATION ERROR: INTERNAL_API_KEY is not set.");
    return NextResponse.json(
      { error: 'Server configuration error: Internal key missing' },
      { status: 500 }
    );
  }

  try {
    // Forward the request to the backend API
    const response = await fetch(`${DJANGO_BACKEND_URL}/api/songs/random-song/`, {
      method: 'GET', // Explicitly define method
      headers: {
        'Content-Type': 'application/json',
        // 4. CRITICAL INJECTION: Send the internal key to satisfy Django's IsInternalServer permission
        'X-Internal-Key': INTERNAL_KEY,
      },
      // Important: Disable Next.js caching so every call gets a new random song
      cache: 'no-store', 
    });
    
    // Check if the secure fetch from Next.js to Django was successful
    if (!response.ok) {
        // If Django returns a 403 (Forbidden) or 404, propagate that status back to the client
        const errorDetail = await response.json().catch(() => ({ detail: 'Unknown error from backend' }));
        return NextResponse.json(
            { 
                error: 'Failed to fetch random song from secure backend.', 
                details: errorDetail.detail || `HTTP Status ${response.status}`
            },
            { status: response.status }
        );
    }
    
    // Success: Return the data to the client component
    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in random song API route:', error);
    return NextResponse.json(
      { error: 'Internal network server error during fetch to Django' },
      { status: 500 }
    );
  }
}