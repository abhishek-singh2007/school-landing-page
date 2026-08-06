import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyFirebaseIdToken } from '@/lib/admin-auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for an admin route
  if (pathname.startsWith('/admin')) {
    // EXCEPTION: Allow access to /admin/login without authentication
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // For all other /admin routes, check for a verified admin session token
    const adminSession = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      await verifyFirebaseIdToken(adminSession);
    } catch {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.set(ADMIN_SESSION_COOKIE, '', {
        path: '/',
        maxAge: 0,
      });
      return response;
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: ['/admin/:path*'],
};
