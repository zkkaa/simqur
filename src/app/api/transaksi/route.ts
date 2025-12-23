import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db, transaksi, penabung } from '@/lib/db'
import { eq, desc } from 'drizzle-orm'
import { logActivity, getClientIp } from '@/lib/utils/activity-logger'
import { getIndonesiaDate } from '@/lib/utils/timezone'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date')
    const penabungId = searchParams.get('penabungId')

    let query = db
      .select({
        id: transaksi.id,
        nominal: transaksi.nominal,
        metodeBayar: transaksi.metodeBayar,
        tanggal: transaksi.tanggal,
        createdAt: transaksi.createdAt,
        penabung: {
          id: penabung.id,
          nama: penabung.nama,
          totalSaldo: penabung.totalSaldo,
        },
      })
      .from(transaksi)
      .leftJoin(penabung, eq(transaksi.penabungId, penabung.id))
      .orderBy(desc(transaksi.createdAt))
      .$dynamic()

    const filterDate = date || getIndonesiaDate()
    query = query.where(eq(transaksi.tanggal, filterDate))

    if (penabungId) {
      query = query.where(eq(transaksi.penabungId, penabungId))
    }

    const result = await query

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching transaksi:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transaksi' },
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
    const { penabungId, nominal, metodeBayar } = body

    if (!penabungId || !nominal || !metodeBayar) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    if (nominal <= 0) {
      return NextResponse.json(
        { error: 'Nominal harus lebih dari 0' },
        { status: 400 }
      )
    }

    if (!['tunai', 'transfer'].includes(metodeBayar)) {
      return NextResponse.json(
        { error: 'Metode bayar tidak valid' },
        { status: 400 }
      )
    }

    const [penabungData] = await db
      .select()
      .from(penabung)
      .where(eq(penabung.id, penabungId))
      .limit(1)

    if (!penabungData) {
      return NextResponse.json(
        { error: 'Penabung tidak ditemukan' },
        { status: 404 }
      )
    }

    const todayIndonesia = getIndonesiaDate()

    const [newTransaksi] = await db
      .insert(transaksi)
      .values({
        penabungId,
        nominal: nominal.toString(),
        metodeBayar,
        tanggal: todayIndonesia,
        petugasId: session.user.id,
      })
      .returning()

    const newSaldo = parseFloat(penabungData.totalSaldo) + parseFloat(nominal)
    
    const targetQurban = 3600000 
    const statusLunas = newSaldo >= targetQurban

    await db
      .update(penabung)
      .set({
        totalSaldo: newSaldo.toString(),
        statusLunas,
        updatedBy: session.user.id,
        updatedAt: new Date(),
      })
      .where(eq(penabung.id, penabungId))

    await logActivity({
      userId: session.user.id,
      userRole: session.user.role,
      action: 'create',
      tableName: 'transaksi',
      recordId: newTransaksi.id,
      description: `Input setoran ${metodeBayar} Rp ${nominal.toLocaleString('id-ID')} dari ${penabungData.nama}`,
      newData: newTransaksi,
      ipAddress: getClientIp(request),
    })

    return NextResponse.json(newTransaksi, { status: 201 })
  } catch (error) {
    console.error('Error creating transaksi:', error)
    return NextResponse.json(
      { error: 'Failed to create transaksi' },
      { status: 500 }
    )
  }
}