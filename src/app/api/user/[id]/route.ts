import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db, users } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { logActivity, getClientIp } from '@/lib/utils/activity-logger'

// PUT - Update user profile
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { namaLengkap, noTelp } = body

    // Check permission: user can only update their own profile
    if (session.user.id !== id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Validation
    if (!namaLengkap || namaLengkap.length < 3) {
      return NextResponse.json(
        { error: 'Nama lengkap minimal 3 karakter' },
        { status: 400 }
      )
    }

    // Get old data for logging
    const [oldData] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    if (!oldData) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    // Update user
    const [updated] = await db
      .update(users)
      .set({
        namaLengkap,
        noTelp: noTelp || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning()

    // Log activity
    await logActivity({
      userId: session.user.id,
      userRole: session.user.role,
      action: 'update',
      tableName: 'users',
      recordId: id,
      description: `Update profil: ${namaLengkap}`,
      oldData: { namaLengkap: oldData.namaLengkap, noTelp: oldData.noTelp },
      newData: { namaLengkap, noTelp },
      ipAddress: getClientIp(request),
    })

    return NextResponse.json({
      id: updated.id,
      namaLengkap: updated.namaLengkap,
      email: updated.email,
      noTelp: updated.noTelp,
      role: updated.role,
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}