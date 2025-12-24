import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const adminRoutes = [
  '/beranda',
  '/petugas',
  '/proses-qurban',
  '/pengaturan',
  '/laporan/keuangan',
  '/laporan/per-petugas',
]

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

  if (pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
    if (token && pathname === '/login') {
      const redirectUrl = token.role === 'admin' ? '/beranda' : '/transaksi'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
    return NextResponse.next()
  }

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))
  if (isAdminRoute && token.role !== 'admin') {
    return NextResponse.redirect(new URL('/transaksi', request.url))
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  
  if (!isProtectedRoute && !isAdminRoute && pathname !== '/') {
    return NextResponse.next()
  }

  if (pathname === '/') {
    const redirectUrl = token.role === 'admin' ? '/beranda' : '/transaksi'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}