import withPWA from 'next-pwa';

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
    serverActions: {},
  },
  // Environment variables
  env: {
    API_URL: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8000' 
      : 'https://pophits.org',
  },
  async rewrites() {
    return process.env.NODE_ENV === 'development'
      ? [
          {
            source: '/api/:path*',
            destination: 'http://localhost:8000/api/:path*',
          },
        ]
      : [];
  },
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);
