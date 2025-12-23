'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function RootPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'authenticated' && session?.user) {
      // Redirect based on role
      const redirectUrl = session.user.role === 'admin' ? '/beranda' : '/transaksi'
      router.replace(redirectUrl)
    } else {
      // Redirect to login if not authenticated
      router.replace('/login')
    }
  }, [status, session, router])

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-primary-500 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-white text-lg">Mengalihkan...</p>
      </div>
    </div>
  )
}