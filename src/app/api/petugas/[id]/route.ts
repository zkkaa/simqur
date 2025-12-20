import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, hashPassword } from '@/lib/auth/config'
import { db, users } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { logActivity, getClientIp } from '@/lib/utils/activity-logger'

// GET - Fetch single petugas
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [petugas] = await db
      .select()
      .from(users)
      .where(eq(users.id, params.id))
      .limit(1)

    if (!petugas || petugas.role !== 'petugas') {
      return NextResponse.json({ error: 'Petugas not found' }, { status: 404 })
    }

    return NextResponse.json({ ...petugas, password: undefined })
  } catch (error) {
    console.error('Error fetching petugas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch petugas' },
      { status: 500 }
    )
  }
}

// PATCH - Update petugas
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { namaLengkap, email, noTelp, isActive } = body

    // Get old data
    const [oldData] = await db
      .select()
      .from(users)
      .where(eq(users.id, params.id))
      .limit(1)

    if (!oldData || oldData.role !== 'petugas') {
      return NextResponse.json({ error: 'Petugas not found' }, { status: 404 })
    }

    // Check duplicate email (exclude current)
    if (email && email !== oldData.email) {
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
    }

    const [updated] = await db
      .update(users)
      .set({
        namaLengkap: namaLengkap || oldData.namaLengkap,
        email: email || oldData.email,
        noTelp: noTelp !== undefined ? noTelp : oldData.noTelp,
        isActive: isActive !== undefined ? isActive : oldData.isActive,
        updatedAt: new Date(),
      })
      .where(eq(users.id, params.id))
      .returning()

    // Log activity
    await logActivity({
      userId: session.user.id,
      userRole: session.user.role,
      action: 'update',
      tableName: 'users',
      recordId: params.id,
      description: `Mengubah data petugas: ${updated.namaLengkap}`,
      oldData: { ...oldData, password: '[HIDDEN]' },
      newData: { ...updated, password: '[HIDDEN]' },
      ipAddress: getClientIp(request),
    })

    return NextResponse.json({ ...updated, password: undefined })
  } catch (error) {
    console.error('Error updating petugas:', error)
    return NextResponse.json(
      { error: 'Failed to update petugas' },
      { status: 500 }
    )
  }
}

// DELETE - Deactivate petugas (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get data
    const [petugas] = await db
      .select()
      .from(users)
      .where(eq(users.id, params.id))
      .limit(1)

    if (!petugas || petugas.role !== 'petugas') {
      return NextResponse.json({ error: 'Petugas not found' }, { status: 404 })
    }

    // Deactivate
    await db
      .update(users)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, params.id))

    // Log activity
    await logActivity({
      userId: session.user.id,
      userRole: session.user.role,
      action: 'update',
      tableName: 'users',
      recordId: params.id,
      description: `Menonaktifkan petugas: ${petugas.namaLengkap}`,
      oldData: { ...petugas, password: '[HIDDEN]' },
      ipAddress: getClientIp(request),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deactivating petugas:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate petugas' },
      { status: 500 }
    )
  }
}