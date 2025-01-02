// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { parseJwt } from './app/utils/auth';

export async function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('auth_token');
  const session: string | undefined = sessionCookie?.value;

  if (!session) {
    return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_AUTH_URL}/login`, request.url));
  }

  const decodedToken: any = await parseJwt(session);

  if (!decodedToken || !decodedToken.roles || decodedToken.roles.length === 0) {
    return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_AUTH_URL}/login`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:manage/Management'],
}
