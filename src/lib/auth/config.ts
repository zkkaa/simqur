import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db, users } from '@/lib/db'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password harus diisi')
        }

        // Find user by email
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1)

        if (!user) {
          throw new Error('Email atau password salah')
        }

        // Check if user is active
        if (!user.isActive) {
          throw new Error('Akun Anda telah dinonaktifkan')
        }

        // Verify password
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) {
          throw new Error('Email atau password salah')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.namaLengkap,
          role: user.role,
          noTelp: user.noTelp,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.noTelp = user.noTelp
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.name = token.name
        session.user.role = token.role
        session.user.noTelp = token.noTelp
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, 
  },

  secret: process.env.NEXTAUTH_SECRET,
}