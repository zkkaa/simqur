import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, hashPassword } from '@/lib/auth/config'
import { db, users, transaksi } from '@/lib/db'
import { eq, sql, and, isNull } from 'drizzle-orm'
import { logActivity, getClientIp } from '@/lib/utils/activity-logger'

// GET - Fetch all petugas with stats
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admin can access
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch petugas with their transaction stats
    const petugasList = await db
      .select({
        id: users.id,
        email: users.email,
        namaLengkap: users.namaLengkap,
        noTelp: users.noTelp,
        isActive: users.isActive,
        createdAt: users.createdAt,
        totalTransaksi: sql<number>`count(${transaksi.id})`,
        totalNominal: sql<string>`coalesce(sum(${transaksi.nominal}), 0)`,
      })
      .from(users)
      .leftJoin(transaksi, eq(users.id, transaksi.petugasId))
      .where(eq(users.role, 'petugas'))
      .groupBy(users.id)
      .orderBy(users.createdAt)

    return NextResponse.json(petugasList)
  } catch (error) {
    console.error('Error fetching petugas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch petugas' },
      { status: 500 }
    )
  }
}

// POST - Create new petugas
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admin can create
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { namaLengkap, email, password, noTelp } = body

    // Validation
    if (!namaLengkap || !email || !password) {
      return NextResponse.json(
        { error: 'Nama, email, dan password harus diisi' },
        { status: 400 }
      )
    }

    // Check duplicate email
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Email sudah digunakan' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    const [newPetugas] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        namaLengkap,
        role: 'petugas',
        noTelp: noTelp || null,
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
      recordId: newPetugas.id,
      description: `Menambahkan petugas baru: ${newPetugas.namaLengkap} (${newPetugas.email})`,
      newData: { ...newPetugas, password: '[HIDDEN]' },
      ipAddress: getClientIp(request),
    })

    return NextResponse.json(
      { ...newPetugas, password: undefined },
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