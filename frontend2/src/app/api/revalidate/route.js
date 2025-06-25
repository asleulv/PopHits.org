import { revalidateTag } from 'next/cache';

export async function POST(request) {
  const secret = request.nextUrl.searchParams.get('secret');
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: 'Invalid secret' }, { status: 401 });
  }

  revalidateTag('hot100');
  return Response.json({ revalidated: true, now: Date.now() });
}
