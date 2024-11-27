// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { parseJwt } from './app/utils/auth';


export function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('auth_token');
  const session: string | undefined = sessionCookie?.value;

  if (session) {
    const decodedToken:any = parseJwt(session);
      
    if (decodedToken) {
      const roles = decodedToken.roles;
      if (Array.isArray(roles) && roles.length > 0) {
        if (roles.includes("ReadTest")) {
          return NextResponse.next();
        }
      }
    }    
  }
  else {
    return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_AUTH_URL}/login`, request.url));
  }
  
}

export const config = {
  matcher: ['/bualuang/:domain*', '/:domain/StaffInformation/:id*', '/:domain/:manage/Management'],
}