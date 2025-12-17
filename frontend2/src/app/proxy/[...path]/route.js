// src/app/proxy/[...path]/route.js
import { NextResponse } from "next/server";

async function proxyRequest(request, method) {
  const { pathname, searchParams } = new URL(request.url);
  
  // Extract path after /proxy/
  let apiPath = pathname.replace('/proxy/', '').replace('/proxy', '');
  
  // Django trailing slash handling - ensure it ends with /
  if (!apiPath.endsWith('/')) {
    apiPath += '/';
  }
  
  // Build Django URL
  const DJANGO_URL = process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8000'
    : 'http://127.0.0.1:8080';
  
  const targetUrl = `${DJANGO_URL}/api/${apiPath}${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  
  // Build headers with production fixes
  const headers = {
    'Content-Type': 'application/json',
    'X-Internal-Key': process.env.INTERNAL_API_KEY,
  };
  
  // In production, force localhost to avoid NGINX confusion
  if (process.env.NODE_ENV !== 'development') {
    headers['Host'] = 'localhost';
  }
  
  // Forward user auth token if present
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[PROXY] ${method} ${targetUrl}`);
    console.log(`[PROXY] Key: ${process.env.INTERNAL_API_KEY?.slice(0, 10)}...`);
  }
  
  // Build fetch options
  const options = {
    method,
    headers,
  };
  
  // Add body for non-GET requests
  if (method !== 'GET' && method !== 'HEAD') {
    try {
      const body = await request.json();
      options.body = JSON.stringify(body);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[PROXY] Body:`, body);
      }
    } catch (e) {
      // No body or invalid JSON
    }
  }
  
  try {
    // Make the request
    const response = await fetch(targetUrl, options);
    
    // Handle 204 No Content (DELETE responses)
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }
    
    // Parse and return JSON
    const data = await response.json();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[PROXY] Response status: ${response.status}`);
    }
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error(`[PROXY ERROR] ${method} ${targetUrl}:`, error);
    return NextResponse.json(
      { error: 'Proxy request failed', detail: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  return proxyRequest(request, 'GET');
}

export async function POST(request) {
  return proxyRequest(request, 'POST');
}

export async function PUT(request) {
  return proxyRequest(request, 'PUT');
}

export async function DELETE(request) {
  return proxyRequest(request, 'DELETE');
}

export async function PATCH(request) {
  return proxyRequest(request, 'PATCH');
}
