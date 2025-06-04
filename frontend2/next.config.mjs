/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure external image domains
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'pophits.org',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        pathname: '/**',
      },
    ],
  },
  // Enable experimental features if needed
  experimental: {
    serverActions: true,
  },
  // Environment variables
  env: {
    API_URL: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8000' 
      : 'https://pophits.org',
  },
};

export default nextConfig;
