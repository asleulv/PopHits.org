export const dynamic = 'force-dynamic';

import { getSongs, getBlogPosts } from '@/lib/api';

export default async function sitemap() {
  const baseUrl =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://pophits.org';

  const currentDate = new Date();

  const staticRoutes = [
    { url: `${baseUrl}`, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/songs`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/current-hot100`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
  ];

  const currentYear = new Date().getFullYear();
  const yearRoutes = [];
  for (let year = 1958; year <= currentYear; year++) {
    yearRoutes.push({ url: `${baseUrl}/year/${year}`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 });
  }

  const decadeRoutes = [];
  for (let decade = 1950; decade <= Math.floor(currentYear / 10) * 10; decade += 10) {
    decadeRoutes.push({ url: `${baseUrl}/songs?decade=${decade}`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 });
  }

  // Skip API calls during build in development
  let songRoutes = [];
  let artistRoutes = [];
  let blogPostRoutes = [];

  if (process.env.NODE_ENV !== 'development') {
    try {
      const songsData = await getSongs(1, 1000);
      const songs = songsData.results || [];
      songRoutes = songs.map((song) => ({
        url: `${baseUrl}/songs/${song.slug}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.6,
      }));

      const artistSlugs = [...new Set(songs.map((song) => song.artist_slug))];
      artistRoutes = artistSlugs.map((slug) => ({
        url: `${baseUrl}/artist/${slug}`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.7,
      }));

      const blogPostsData = await getBlogPosts(1, 100);
      const blogPosts = blogPostsData.results || [];
      blogPostRoutes = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_date || post.published_date),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    } catch (err) {
      console.error('Skipping dynamic routes in sitemap due to API error:', err);
    }
  }

  return [...staticRoutes, ...yearRoutes, ...decadeRoutes, ...songRoutes, ...artistRoutes, ...blogPostRoutes];
}
