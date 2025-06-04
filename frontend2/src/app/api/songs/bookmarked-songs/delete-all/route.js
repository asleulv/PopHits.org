import { NextResponse } from 'next/server';

export async function DELETE(request) {
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
    
    // Get all bookmarked songs first
    const bookmarksResponse = await fetch(`${backendUrl}/api/songs/bookmarked-songs/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!bookmarksResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch bookmarked songs' },
        { status: bookmarksResponse.status }
      );
    }
    
    const bookmarkedSongs = await bookmarksResponse.json();
    
    // Delete each bookmark individually
    for (const song of bookmarkedSongs) {
      const deleteResponse = await fetch(`${backendUrl}/api/songs/${song.id}/bookmark/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!deleteResponse.ok) {
        console.error(`Failed to delete bookmark for song ${song.id}`);
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in delete-all-bookmarks API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
