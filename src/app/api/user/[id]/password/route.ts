import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db, users } from '@/lib/db'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { logActivity, getClientIp } from '@/lib/utils/activity-logger'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
    const { currentPassword, newPassword } = body

    if (session.user.id !== id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Password lama dan baru harus diisi' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password baru minimal 6 karakter' },
        { status: 400 }
      )
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)

    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      )
    }

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Password lama tidak sesuai' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))

    await logActivity({
      userId: session.user.id,
      userRole: session.user.role,
      action: 'update',
      tableName: 'users',
      recordId: id,
      description: 'Ubah password',
      ipAddress: getClientIp(request),
    })

    return NextResponse.json({ message: 'Password berhasil diubah' })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    )
  }
}