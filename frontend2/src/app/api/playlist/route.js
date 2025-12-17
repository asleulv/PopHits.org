// src/app/api/playlist/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 1. Extract parameters
    const numberOfSongs = searchParams.get('number_of_songs') || 10;
    const hitSize = searchParams.get('hit_size') || 1;
    const decades = searchParams.getAll('decades');
    
    // 2. Define Internal Backend URL (Directly to Django port 8080)
    const DJANGO_URL = process.env.NODE_ENV === 'development'
      ? 'http://127.0.0.1:8000'
      : 'http://127.0.0.1:8080';
      
    const backendUrl = new URL(`${DJANGO_URL}/api/songs/generate-playlist/`);
    
    // 3. Append params
    backendUrl.searchParams.append('number_of_songs', numberOfSongs);
    backendUrl.searchParams.append('hit_size', hitSize);
    if (decades && decades.length > 0) {
      decades.forEach(decade => backendUrl.searchParams.append('decades', decade));
    }
    
    // 4. Fetch with Internal Key
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Key': process.env.INTERNAL_API_KEY, // Essential for security
      },
    });
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in playlist API route:', error);
    return NextResponse.json(
      { error: 'Failed to generate playlist' },
      { status: 500 }
    );
  }
}