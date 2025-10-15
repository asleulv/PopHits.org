// lib/bluesky.js
export async function getBlueskyPosts() {
  try {
    // Bluesky's public API endpoint
    const response = await fetch('https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=pophits.bsky.social&limit=3', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Bluesky API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the Bluesky data into our format
    const posts = data.feed?.map(item => {
      const post = item.post;
      const record = post.record;
      
      // Extract image from embeds if available
      let image = null;
      if (post.embed?.images?.[0]?.fullsize) {
        image = post.embed.images[0].fullsize;
      } else if (post.embed?.external?.thumb) {
        image = post.embed.external.thumb;
      }

      // Create Bluesky URL
      const postId = post.uri.split('/').pop();
      const blueskyUrl = `https://bsky.app/profile/pophits.bsky.social/post/${postId}`;

      return {
        text: record.text,
        image: image,
        createdAt: record.createdAt,
        blueskyUrl: blueskyUrl,
        uri: post.uri
      };
    }) || [];

    return posts;

  } catch (error) {
    console.error('Error fetching Bluesky posts:', error);
    return []; // Return empty array on error so site doesn't break
  }
}
