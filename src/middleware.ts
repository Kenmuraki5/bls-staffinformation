import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function base64Decode(str: string) {
  return Buffer.from(str, 'base64').toString('utf8');
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = base64Decode(base64);
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session');
  const session: string | undefined = sessionCookie?.value;

  if (session) {
    const decodedToken = parseJwt(session);
    
    if (decodedToken) {
      const role = decodedToken.role;
      const url = request.nextUrl.pathname;

      // Check if the role is 'admin' for restricted paths
      if ((url.startsWith('/BLS/employee/Management') || url.startsWith('/BLS/organization/Management')) && role != 'admin') {
        return  NextResponse.redirect(new URL('/not-found', request.url));
      }

      // Check if the role is allowed for other paths
      if (role === 'user') { // Replace 'desiredRole' with the role you want to check for other paths
        return NextResponse.next();
      }
    }
  }
  else {
    return NextResponse.redirect(new URL('/authentication', request.url));
  }
  
}

export const config = {
  matcher: ['/bualuang/:domain*', '/StaffInformation/:id*', '/:domain/:manage/Management'],
}
