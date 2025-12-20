import { useSession, signOut as nextAuthSignOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const isLoading = status === 'loading'
  const isAuthenticated = status === 'authenticated'
  const user = session?.user

  const signOut = async () => {
    await nextAuthSignOut({ redirect: false })
    router.push('/login')
  }

  return {
    user,
    isLoading,
    isAuthenticated,
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