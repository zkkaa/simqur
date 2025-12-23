import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db, pengaturan } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { logActivity, getClientIp } from '@/lib/utils/activity-logger'
import { getIndonesiaDateTime } from '@/lib/utils/timezone'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [targetSetting] = await db
      .select()
      .from(pengaturan)
      .where(eq(pengaturan.key, 'target_qurban'))
      .limit(1)

    const targetQurban = targetSetting
      ? parseInt(targetSetting.value)
      : 3600000 

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

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { targetQurban } = body

    if (!targetQurban || targetQurban < 1000) {
      return NextResponse.json(
        { error: 'Target qurban minimal Rp 1.000' },
        { status: 400 }
      )
    }

    const [oldSetting] = await db
      .select()
      .from(pengaturan)
      .where(eq(pengaturan.key, 'target_qurban'))
      .limit(1)

    const indonesiaTime = getIndonesiaDateTime()

    const [updated] = await db
      .insert(pengaturan)
      .values({
        key: 'target_qurban',
        value: targetQurban.toString(),
        updatedBy: session.user.id,
        updatedAt: indonesiaTime,
      })
      .onConflictDoUpdate({
        target: pengaturan.key,
        set: {
          value: targetQurban.toString(),
          updatedBy: session.user.id,
          updatedAt: indonesiaTime,
        },
      })
      .returning()

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