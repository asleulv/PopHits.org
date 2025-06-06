export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/_next/',
        '/static/admin/',
      ],
    },
    sitemap: 'https://pophits.org/static/sitemap.xml',
  };
}
