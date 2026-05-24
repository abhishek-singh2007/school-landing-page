import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for an admin route
  if (pathname.startsWith('/admin')) {
    // EXCEPTION: Allow access to /admin/login without authentication
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // For all other /admin routes, check for admin_session cookie
    const adminSession = request.cookies.get('admin_session')?.value;

    // If no session cookie exists, redirect to login
    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: ['/admin/:path*'],
};
