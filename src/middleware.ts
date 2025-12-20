import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Routes yang hanya bisa diakses admin
const adminRoutes = [
  '/beranda',
  '/petugas',
  '/proses-qurban',
  '/pengaturan',
  '/laporan/keuangan',
  '/laporan/per-petugas',
]

// Routes yang bisa diakses admin & petugas
const protectedRoutes = [
  '/penabung',
  '/transaksi',
  '/laporan',
  '/profil',
]

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = request.nextUrl

  // Allow access to login page and api routes
  if (pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
    // Redirect to beranda if already logged in
    if (token && pathname === '/login') {
      const redirectUrl = token.role === 'admin' ? '/beranda' : '/transaksi'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check admin-only routes
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))
  if (isAdminRoute && token.role !== 'admin') {
    // Redirect petugas ke halaman transaksi
    return NextResponse.redirect(new URL('/transaksi', request.url))
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  
  if (!isProtectedRoute && !isAdminRoute && pathname !== '/') {
    // Allow access to unprotected routes
    return NextResponse.next()
  }

  // Redirect root to appropriate page based on role
  if (pathname === '/') {
    const redirectUrl = token.role === 'admin' ? '/beranda' : '/transaksi'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}