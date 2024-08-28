import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('electo_u_tok');
  const path = request.nextUrl.pathname;

  const clonedUrl = request.nextUrl.clone();

  const authRoutes = [
    '/sign-in',
    '/sign-in-phone',
    // '/sign-up',
    // '/about-you',
    // '/interests',
    // '/license-verification',
    // '/voter-registration-status',
  ];

  const tempRoutes = ['/sign-in', '/sign-up', '/sign-in-phone', '/about-you'];

  if (token && authRoutes.includes(path)) {
    return NextResponse.redirect(new URL('/bills', request.url));
  }

  if (!token && !tempRoutes.includes(request.nextUrl.pathname)) {
    const redirectTo = `${clonedUrl.pathname}${clonedUrl.search}`;
    clonedUrl.pathname = '/sign-in';
    clonedUrl.searchParams.set('redirect', redirectTo);
    return NextResponse.redirect(clonedUrl);
    // return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
