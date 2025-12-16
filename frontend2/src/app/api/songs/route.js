// app/api/songs/route.js
import { NextResponse } from "next/server";

const INTERNAL_KEY = process.env.INTERNAL_API_KEY;

const DJANGO_BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? process.env.DJANGO_BACKEND_URL || "http://127.0.0.1:8000"
    : "https://pophits.org";  // ⬅ PRODUCTION: same as random-song

export async function GET(request) {
  if (!INTERNAL_KEY) {
    console.error("SERVER CONFIG ERROR: INTERNAL_API_KEY is not set.");
    return NextResponse.json(
      { error: "Server configuration error: Internal key missing" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);

  const djangoUrl = new URL("/api/songs/", DJANGO_BACKEND_URL);
  searchParams.forEach((value, key) => {
    djangoUrl.searchParams.append(key, value);
  });

  try {
    const response = await fetch(djangoUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Key": INTERNAL_KEY,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorDetail = await response
        .json()
        .catch(() => ({ detail: "Unknown error from backend" }));
      return NextResponse.json(
        {
          error: "Failed to fetch songs from secure backend.",
          details: errorDetail.detail || `HTTP Status ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in songs API route:", error);
    return NextResponse.json(
      { error: "Internal network server error during fetch to Django" },
      { status: 500 }
    );
  }
}
