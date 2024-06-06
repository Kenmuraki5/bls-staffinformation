
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.get('session');
  if (isAuthenticated) {
    return  NextResponse.next();
  }
  else
    return NextResponse.redirect(new URL('/authentication', request.url));
}
 
export const config = {
  matcher: ['/bualuang/:domain*', '/StaffInformation/:id*'],
}