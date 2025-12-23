import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db, users } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { logActivity, getClientIp } from '@/lib/utils/activity-logger'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

    if (!petugas) {
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

    const [oldData] = await db
      .select()
      .from(users)
      .where(eq(users.id, params.id))
      .limit(1)

    if (!oldData) {
      return NextResponse.json({ error: 'Petugas not found' }, { status: 404 })
    }

    if (email && email !== oldData.email) {
      const [existing] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

      if (existing) {
        return NextResponse.json(
          { error: 'Email sudah digunakan' },
          { status: 400 }
        )
      }
    }

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (namaLengkap !== undefined) updateData.namaLengkap = namaLengkap
    if (email !== undefined) updateData.email = email
    if (noTelp !== undefined) updateData.noTelp = noTelp
    if (isActive !== undefined) updateData.isActive = isActive

    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, params.id))
      .returning()

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

    const [petugas] = await db
      .select()
      .from(users)
      .where(eq(users.id, params.id))
      .limit(1)

    if (!petugas) {
      return NextResponse.json({ error: 'Petugas not found' }, { status: 404 })
    }

    const newStatus = !petugas.isActive

    const [updated] = await db
      .update(users)
      .set({
        isActive: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(users.id, params.id))
      .returning()

    await logActivity({
      userId: session.user.id,
      userRole: session.user.role,
      action: 'update',
      tableName: 'users',
      recordId: params.id,
      description: `${newStatus ? 'Mengaktifkan' : 'Menonaktifkan'} petugas: ${petugas.namaLengkap}`,
      oldData: { isActive: petugas.isActive },
      newData: { isActive: newStatus },
      ipAddress: getClientIp(request),
    })

    return NextResponse.json({ success: true, isActive: newStatus })
  } catch (error) {
    console.error('Error toggling petugas status:', error)
    return NextResponse.json(
      { error: 'Failed to toggle petugas status' },
      { status: 500 }
    )
  }
}