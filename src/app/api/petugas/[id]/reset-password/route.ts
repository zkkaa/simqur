import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { hashPassword } from '@/lib/auth/helpers'
import { db, users } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { logActivity, getClientIp } from '@/lib/utils/activity-logger'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(
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
    const { newPassword } = body

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      )
    }

    const [petugas] = await db
      .select()
      .from(users)
      .where(eq(users.id, params.id))
      .limit(1)

    if (!petugas) {
      return NextResponse.json({ error: 'Petugas not found' }, { status: 404 })
    }

    const hashedPassword = await hashPassword(newPassword)

    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, params.id))

    await logActivity({
      userId: session.user.id,
      userRole: session.user.role,
      action: 'update',
      tableName: 'users',
      recordId: params.id,
      description: `Reset password petugas: ${petugas.namaLengkap}`,
      ipAddress: getClientIp(request),
    })

    return NextResponse.json({
      success: true,
      message: 'Password berhasil direset',
    })
  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}