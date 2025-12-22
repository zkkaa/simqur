import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { hashPassword } from '@/lib/auth/helpers'
import { db, users } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { logActivity, getClientIp } from '@/lib/utils/activity-logger'

// GET - Fetch all petugas (Admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Admin only
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const result = await db
      .select({
        id: users.id,
        email: users.email,
        namaLengkap: users.namaLengkap,
        noTelp: users.noTelp,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(users.namaLengkap)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching petugas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch petugas' },
      { status: 500 }
    )
  }
}

// POST - Create new petugas (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Admin only
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { email, password, namaLengkap, noTelp, role } = body

    // Validation
    if (!email || !password || !namaLengkap || !role) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      )
    }

    if (!['admin', 'petugas'].includes(role)) {
      return NextResponse.json({ error: 'Role tidak valid' }, { status: 400 })
    }

    // Check if email already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        namaLengkap,
        noTelp: noTelp || null,
        role,
        isActive: true,
        createdBy: session.user.id,
      })
      .returning()

    // Log activity
    await logActivity({
      userId: session.user.id,
      userRole: session.user.role,
      action: 'create',
      tableName: 'users',
      recordId: newUser.id,
      description: `Tambah petugas: ${namaLengkap} (${email})`,
      newData: { email, namaLengkap, role },
      ipAddress: getClientIp(request),
    })

    return NextResponse.json(
      {
        id: newUser.id,
        email: newUser.email,
        namaLengkap: newUser.namaLengkap,
        noTelp: newUser.noTelp,
        role: newUser.role,
        isActive: newUser.isActive,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating petugas:', error)
    return NextResponse.json(
      { error: 'Failed to create petugas' },
      { status: 500 }
    )
  }
}