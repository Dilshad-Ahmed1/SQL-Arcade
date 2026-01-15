// import { NextRequest, NextResponse } from 'next/server';
// import { verifyToken } from './lib/auth-utils';

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get('authToken')?.value;
//   const pathname = request.nextUrl.pathname;

//   // Public routes
//   const publicRoutes = ['/login', '/signup', '/'];

//   // Protected routes
//   if (pathname.startsWith('/teacher') && !publicRoutes.includes(pathname)) {
//     if (!token || !verifyToken(token)) {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/teacher/:path*', '/api/teacher/:path*', '/api/student/:path*'],
// };


import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenEdge } from './lib/edge-auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const pathname = request.nextUrl.pathname;

  const publicRoutes = ['/login', '/signup', '/'];

  if (pathname.startsWith('/teacher') && !publicRoutes.includes(pathname)) {
    if (!token || !(await verifyTokenEdge(token))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/teacher/:path*'],
};
