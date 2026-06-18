import { NextResponse } from 'next/server';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Define protected routes
  const isProtected = path.startsWith('/mypage') || path.startsWith('/admin');

  // Next.js middleware is run on the edge. To check Supabase auth securely, we would use:
  // supabase.auth.getSession() via createMiddlewareClient
  // For the initial template, we provide a placeholder edge check. 
  // Real secure session check should read cookies.sb-access-token.
  
  const hasSessionCookie = request.cookies.has('sb-access-token') || 
                            request.cookies.has('supabase-auth-token');

  if (isProtected && !hasSessionCookie) {
    // Client-side authentication checks in the page.js files will handle redirect
    // as a fallback if cookies are not set yet.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/mypage/:path*', '/admin/:path*'],
};
