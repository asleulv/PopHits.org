import withPWA from "next-pwa";

const nextConfig = {
  // Configure external image domains
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/media/**",
      },
      {
        protocol: 'http',           
        hostname: '127.0.0.1',      
        port: '8080',               
        pathname: '/media/**',      
      }, 
      {
        protocol: "https",
        hostname: "pophits.org",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.bsky.app",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Enable experimental features if needed
  experimental: {
    serverActions: {},
  },
  // Environment variables
  env: {
    API_URL:
      process.env.NODE_ENV === "development"
        ? "http://localhost:8000"
        : "http://127.0.0.1:8080",
  },
  async rewrites() {
    return process.env.NODE_ENV === "development"
      ? [
          {
            source: "/api/:path*",
            destination: "http://localhost:8000/api/:path*",
          },
          {
            source: "/media/:path*", // ← ADD THIS
            destination: "http://localhost:8000/media/:path*", // ← ADD THIS
          },
        ]
      : [];
  },
  // Add the headers function for caching
  async headers() {
    return [
      {
        // Cache JavaScript files
        source: "/:path*.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache CSS files
        source: "/:path*.css",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache image files
        source: "/:path*.(png|jpg|jpeg|gif|ico|svg|webp)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache font files
        source: "/:path*.(woff|woff2|eot|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache your static folder specifically
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache API responses for shorter time
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300", // 5 minutes
          },
        ],
      },
    ];
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
