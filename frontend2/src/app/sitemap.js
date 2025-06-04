import { getSongs, getBlogPosts } from '@/lib/api';

export default async function sitemap() {
  // Base URL for the site
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : 'https://pophits.org';
  
  // Current date for lastModified
  const currentDate = new Date();
  
  // Static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/songs`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/current-hot100`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];
  
  // Generate year routes from 1958 to current year
  const currentYear = new Date().getFullYear();
  const yearRoutes = [];
  
  for (let year = 1958; year <= currentYear; year++) {
    yearRoutes.push({
      url: `${baseUrl}/year/${year}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }
  
  // Generate decade routes
  const decadeRoutes = [];
  const startDecade = 1950;
  const currentDecade = Math.floor(currentYear / 10) * 10;
  
  for (let decade = startDecade; decade <= currentDecade; decade += 10) {
    decadeRoutes.push({
      url: `${baseUrl}/songs?decade=${decade}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }
  
  // Fetch songs for dynamic routes
  // Limit to a reasonable number for the sitemap
  const songsData = await getSongs(1, 1000);
  const songs = songsData.results || [];
  
  // Generate song routes
  const songRoutes = songs.map((song) => ({
    url: `${baseUrl}/songs/${song.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));
  
  // Generate artist routes (unique artists from songs)
  const artistSlugs = [...new Set(songs.map((song) => song.artist_slug))];
  const artistRoutes = artistSlugs.map((slug) => ({
    url: `${baseUrl}/artist/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  
  // Fetch blog posts for dynamic routes
  const blogPostsData = await getBlogPosts(1, 100);
  const blogPosts = blogPostsData.results || [];
  
  // Generate blog post routes
  const blogPostRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_date || post.published_date),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
  
  // Combine all routes
  return [
    ...staticRoutes,
    ...yearRoutes,
    ...decadeRoutes,
    ...songRoutes,
    ...artistRoutes,
    ...blogPostRoutes,
  ];
}
