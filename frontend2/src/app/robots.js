export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/static/admin/',
        ],
      },
      // Block AI and data scrapers specifically
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'Google-Extended', disallow: '/' },
      { userAgent: 'CCbot', disallow: '/' },
      { userAgent: 'Amazonbot', disallow: '/' },
      { userAgent: 'ClaudeBot', disallow: '/' },
      { userAgent: 'anthropic-ai', disallow: '/' },
      { userAgent: 'cypex.ai', disallow: '/' },
      { userAgent: 'HanaleiBot', disallow: '/' },
      { userAgent: 'Dazzle', disallow: '/' },
      { userAgent: 'SlaccaleBot', disallow: '/' },
      { userAgent: 'LivelapBot', disallow: '/' }
      // Add more 'userAgent' blocks here if you see new AI/data bots in future logs
    ],
    sitemap: 'https://pophits.org/static/sitemap.xml',
  };
}
