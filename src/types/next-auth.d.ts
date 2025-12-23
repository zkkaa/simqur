import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      namaLengkap: string
      role: 'admin' | 'petugas'
      noTelp?: string | null
    }
  }

  interface User {
    id: string
    email: string
    name: string
    namaLengkap: string
    role: 'admin' | 'petugas'
    noTelp?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    name: string
    namaLengkap: string
    role: 'admin' | 'petugas'
    noTelp?: string | null
  }
}