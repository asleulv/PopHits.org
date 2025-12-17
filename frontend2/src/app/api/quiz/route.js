// src/app/api/quiz/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 1. Extract parameters from the incoming request
    const numberOfSongs = searchParams.get('number_of_songs') || 10;
    const hitSize = searchParams.get('hit_size') || 1;
    const decades = searchParams.getAll('decades');
    
    // 2. Define Internal Backend URL
    // We bypass NGINX/Cloudflare by hitting the internal port directly
    const DJANGO_URL = process.env.NODE_ENV === 'development'
      ? 'http://127.0.0.1:8000'
      : 'http://127.0.0.1:8080';
      
    const backendUrl = new URL(`${DJANGO_URL}/api/songs/generate-quiz/`);
    
    // 3. Append the parameters to the backend URL
    backendUrl.searchParams.append('number_of_songs', numberOfSongs);
    backendUrl.searchParams.append('hit_size', hitSize);
    
    if (decades && decades.length > 0) {
      decades.forEach(decade => {
        backendUrl.searchParams.append('decades', decade);
      });
    }
    
    // 4. Fetch from Django with the Internal Key
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Key': process.env.INTERNAL_API_KEY, // Injecting secret key
      },
    });
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Return the quiz data to the frontend
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in quiz API route:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}