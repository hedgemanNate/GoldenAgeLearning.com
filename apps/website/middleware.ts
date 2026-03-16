import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Placeholder middleware per Step 15
  if (pathname.startsWith('/account')) {
    // Check for Firebase auth session cookie
    // Redirect to / if not authenticated
  }

  if (pathname.startsWith('/admin')) {
    // Check for Firebase auth session cookie + role claim
    // Redirect to / if not authenticated or not staff/superAdmin
  }

  if (pathname === '/admin/staff') {
    // Redirect to /admin if role is staff (not superAdmin)
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/admin/:path*']
};
