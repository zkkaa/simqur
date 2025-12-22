import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db, pengaturan } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { logActivity, getClientIp } from '@/lib/utils/activity-logger'

// GET - Get pengaturan
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get target qurban setting
    const [targetSetting] = await db
      .select()
      .from(pengaturan)
      .where(eq(pengaturan.key, 'target_qurban'))
      .limit(1)

    const targetQurban = targetSetting
      ? parseInt(targetSetting.value)
      : 3600000 // Default 3.6 juta

    return NextResponse.json({
      targetQurban,
      updatedAt: targetSetting?.updatedAt || null,
      updatedBy: targetSetting?.updatedBy || null,
    })
  } catch (error) {
    console.error('Error fetching pengaturan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pengaturan' },
      { status: 500 }
    )
  }
}

// PUT - Update pengaturan
export async function PUT(request: NextRequest) {
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
    const { targetQurban } = body

    // Validation
    if (!targetQurban || targetQurban < 1000) {
      return NextResponse.json(
        { error: 'Target qurban minimal Rp 1.000' },
        { status: 400 }
      )
    }

    // Get old value for logging
    const [oldSetting] = await db
      .select()
      .from(pengaturan)
      .where(eq(pengaturan.key, 'target_qurban'))
      .limit(1)

    // Upsert setting
    const [updated] = await db
      .insert(pengaturan)
      .values({
        key: 'target_qurban',
        value: targetQurban.toString(),
        updatedBy: session.user.id,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: pengaturan.key,
        set: {
          value: targetQurban.toString(),
          updatedBy: session.user.id,
          updatedAt: new Date(),
        },
      })
      .returning()

    // Log activity
    await logActivity({
      userId: session.user.id,
      userRole: session.user.role,
      action: 'update',
      tableName: 'pengaturan',
      recordId: updated.id,
      description: `Ubah target qurban dari ${oldSetting?.value || '0'} ke ${targetQurban}`,
      oldData: { targetQurban: oldSetting?.value },
      newData: { targetQurban: targetQurban.toString() },
      ipAddress: getClientIp(request),
    })

    return NextResponse.json({
      targetQurban,
      updatedAt: updated.updatedAt,
    })
  } catch (error) {
    console.error('Error updating pengaturan:', error)
    return NextResponse.json(
      { error: 'Failed to update pengaturan' },
      { status: 500 }
    )
  }
}