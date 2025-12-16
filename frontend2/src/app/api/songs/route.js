// app/api/songs/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  // 1) Read query params from the incoming request
  const { searchParams } = new URL(request.url);

  // 2) Build the Django URL (local in dev)
  const djangoBase =
    process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:8000"
      : "https://pophits.org";

  const djangoUrl = new URL("/api/songs/", djangoBase);

  // 3) Forward all query params to Django
  searchParams.forEach((value, key) => {
    djangoUrl.searchParams.append(key, value);
  });

  // 4) Call Django with the internal key
  const djangoResponse = await fetch(djangoUrl.toString(), {
    headers: {
      "X-Internal-Key": process.env.INTERNAL_API_KEY,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await djangoResponse.json();

  return NextResponse.json(data, { status: djangoResponse.status });
}
