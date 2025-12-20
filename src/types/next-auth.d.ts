import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name: string
    role: 'admin' | 'petugas'
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: 'admin' | 'petugas'
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'admin' | 'petugas'
  }
}