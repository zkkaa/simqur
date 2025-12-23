import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db, penabung } from '@/lib/db'
import { eq, isNull, like, or } from 'drizzle-orm'
import { logActivity, getClientIp } from '@/lib/utils/activity-logger'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const filter = searchParams.get('filter') || 'all' 

    let query = db
      .select()
      .from(penabung)
      .where(isNull(penabung.deletedAt))
      .$dynamic()

    if (search) {
      query = query.where(like(penabung.nama, `%${search}%`))
    }

    if (filter === 'lunas') {
      query = query.where(eq(penabung.statusLunas, true))
    } else if (filter === 'belum-lunas') {
      query = query.where(eq(penabung.statusLunas, false))
    }

    const result = await query

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching penabung:', error)
    return NextResponse.json(
      { error: 'Failed to fetch penabung' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { nama } = body

    if (!nama || nama.trim() === '') {
      return NextResponse.json(
        { error: 'Nama penabung harus diisi' },
        { status: 400 }
      )
    }

    const existing = await db
      .select()
      .from(penabung)
      .where(eq(penabung.nama, nama.trim()))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Nama penabung sudah ada' },
        { status: 400 }
      )
    }

    const [newPenabung] = await db
      .insert(penabung)
      .values({
        nama: nama.trim(),
        createdBy: session.user.id,
        updatedBy: session.user.id,
      })
      .returning()

    await logActivity({
      userId: session.user.id,
      userRole: session.user.role,
      action: 'create',
      tableName: 'penabung',
      recordId: newPenabung.id,
      description: `Menambahkan penabung baru: ${newPenabung.nama}`,
      newData: newPenabung,
      ipAddress: getClientIp(request),
    })

    return NextResponse.json(newPenabung, { status: 201 })
  } catch (error) {
    console.error('Error creating penabung:', error)
    return NextResponse.json(
      { error: 'Failed to create penabung' },
      { status: 500 }
    )
  }
}