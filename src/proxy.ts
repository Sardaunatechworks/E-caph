import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get('ecaph_admin_session')?.value;
    const supabaseToken =
      request.cookies.get('sb-access-token')?.value ||
      request.cookies.get('sb-auth-token')?.value ||
      request.cookies.get('sb-localhost-auth-token')?.value;

    if (!sessionCookie && !supabaseToken) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', pathname + search);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is already authenticated and tries to access /admin/login, redirect to dashboard
  if (pathname === '/admin/login') {
    const sessionCookie = request.cookies.get('ecaph_admin_session')?.value;
    const supabaseToken =
      request.cookies.get('sb-access-token')?.value ||
      request.cookies.get('sb-auth-token')?.value;

    if (sessionCookie || supabaseToken) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
