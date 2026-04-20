import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const pathname = url.pathname

  // 1. Case-Insensitive Redirects
  // This helps when mobile devices auto-capitalize URLs (e.g., /Dashboard instead of /dashboard)
  if (pathname !== pathname.toLowerCase()) {
    url.pathname = pathname.toLowerCase()
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// Ensure this only runs on actual page routes, not internal Next.js assets
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
