import { useSession, signOut as nextAuthSignOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'
  const user = session?.user

  const signOut = async () => {
    try {
      setIsSigningOut(true)
      await nextAuthSignOut({ redirect: false })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    isSigningOut,
    signOut,
  }
}

export function useRequireAuth() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  if (!isLoading && !isAuthenticated) {
    router.push('/login')
  }

  return { user, isLoading, isAuthenticated }
}

export function useIsAdmin() {
  const { user } = useAuth()
  return user?.role === 'admin'
}

export function useIsPetugas() {
  const { user } = useAuth()
  return user?.role === 'petugas'
}