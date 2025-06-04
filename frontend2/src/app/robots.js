export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/_next/',
        '/static/',
      ],
    },
    sitemap: 'https://pophits.org/sitemap.xml',
  };
}
