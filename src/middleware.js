import { NextResponse } from 'next/server'

export function middleware(request) {
  const isLoginPage = request.nextUrl.pathname === '/admin/login'
  const session = request.cookies.get('admin_session')?.value

  if (isLoginPage) {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (session !== process.env.ADMIN_PASSWORD) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}