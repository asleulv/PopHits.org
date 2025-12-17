import { NextResponse } from 'next/server';

export function middleware(request) {
  const referer = request.headers.get('referer');

  // 1. Allow internal Next.js fetches (SSR) which have no referer
  if (!referer) {
    return NextResponse.next();
  }

  // 2. Only allow requests if they come from your own domains
  const allowedDomains = ['pophits.org', 'beta.pophits.org', 'localhost:3000'];
  const isAllowed = allowedDomains.some(domain => referer.includes(domain));

  if (!isAllowed) {
    return new NextResponse(
      JSON.stringify({ error: 'Direct API access forbidden' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return NextResponse.next();
}

// Only run on API routes and the proxy routes
export const config = {
  matcher: ['/api/:path*', '/proxy/:path*'],
};