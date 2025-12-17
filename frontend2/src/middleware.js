import { NextResponse } from "next/server";

export function middleware(request) {
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");
  const userAgent = request.headers.get("user-agent");

  // 1. ALLOW INTERNAL SERVER TALK (SSR)
  if (!referer) {
    // If it's localhost/127.0.0.1 AND it's not a browser (Mozilla)
    if (host?.includes("localhost") || host?.includes("127.0.0.1")) {
      if (userAgent && userAgent.includes("Mozilla")) {
        return new NextResponse(
          JSON.stringify({ error: "Direct browser access forbidden" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
      return NextResponse.next();
    }

    return new NextResponse(
      JSON.stringify({ error: "Direct access forbidden" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  // 2. ALLOW YOUR DOMAINS
  const allowedDomains = ["pophits.org", "beta.pophits.org", "localhost:3000"];
  const isAllowed = allowedDomains.some((domain) => referer.includes(domain));

  if (isAllowed) {
    return NextResponse.next();
  }

  return new NextResponse(JSON.stringify({ error: "Forbidden source" }), {
    status: 403,
    headers: { "Content-Type": "application/json" },
  });
}

export const config = {
  matcher: ["/api/:path*", "/proxy/:path*"],
};