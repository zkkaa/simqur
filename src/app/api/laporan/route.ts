import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db, transaksi, penabung, users } from '@/lib/db'
import { eq, and, gte, lte, sql, desc } from 'drizzle-orm'
import { formatDateForDB } from '@/lib/utils/timezone'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') 
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const penabungId = searchParams.get('penabungId')
    const petugasId = searchParams.get('petugasId')

    if (!type) {
      return NextResponse.json(
        { error: 'Type parameter required' },
        { status: 400 }
      )
    }

    const formattedStartDate = startDate ? formatDateForDB(startDate) : null
    const formattedEndDate = endDate ? formatDateForDB(endDate) : null

    if (type === 'keseluruhan') {
      let conditions: any[] = []

      if (formattedStartDate) {
        conditions.push(gte(transaksi.tanggal, formattedStartDate))
      }
      if (formattedEndDate) {
        conditions.push(lte(transaksi.tanggal, formattedEndDate))
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      const result = await db
        .select({
          id: transaksi.id,
          tanggal: transaksi.tanggal,
          nominal: transaksi.nominal,
          metodeBayar: transaksi.metodeBayar,
          createdAt: transaksi.createdAt,
          penabung: {
            id: penabung.id,
            nama: penabung.nama,
          },
          petugas: {
            id: users.id,
            nama: users.namaLengkap,
          },
        })
        .from(transaksi)
        .leftJoin(penabung, eq(transaksi.penabungId, penabung.id))
        .leftJoin(users, eq(transaksi.petugasId, users.id))
        .where(whereClause)
        .orderBy(desc(transaksi.tanggal), desc(transaksi.createdAt))

      const total = result.reduce(
        (sum, item) => sum + parseFloat(item.nominal),
        0
      )

      return NextResponse.json({ data: result, total })
    }

    if (type === 'per-warga') {
      if (!penabungId) {
        return NextResponse.json(
          { error: 'penabungId required' },
          { status: 400 }
        )
      }

      let conditions: any[] = [eq(transaksi.penabungId, penabungId)]

      if (formattedStartDate) {
        conditions.push(gte(transaksi.tanggal, formattedStartDate))
      }
      if (formattedEndDate) {
        conditions.push(lte(transaksi.tanggal, formattedEndDate))
      }

      const result = await db
        .select({
          id: transaksi.id,
          tanggal: transaksi.tanggal,
          nominal: transaksi.nominal,
          metodeBayar: transaksi.metodeBayar,
          createdAt: transaksi.createdAt,
          petugas: {
            nama: users.namaLengkap,
          },
        })
        .from(transaksi)
        .leftJoin(users, eq(transaksi.petugasId, users.id))
        .where(and(...conditions))
        .orderBy(desc(transaksi.tanggal), desc(transaksi.createdAt))

      const total = result.reduce(
        (sum, item) => sum + parseFloat(item.nominal),
        0
      )

      const [penabungInfo] = await db
        .select()
        .from(penabung)
        .where(eq(penabung.id, penabungId))
        .limit(1)

      return NextResponse.json({ data: result, total, penabung: penabungInfo })
    }

    if (type === 'keuangan') {
      let conditions: any[] = []

      if (formattedStartDate) {
        conditions.push(gte(transaksi.tanggal, formattedStartDate))
      }
      if (formattedEndDate) {
        conditions.push(lte(transaksi.tanggal, formattedEndDate))
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined

      const result = await db
        .select({
          tanggal: transaksi.tanggal,
          jumlahTransaksi: sql<number>`cast(count(*) as integer)`,
          totalNominal: sql<string>`cast(sum(cast(${transaksi.nominal} as decimal)) as text)`,
        })
        .from(transaksi)
        .where(whereClause)
        .groupBy(transaksi.tanggal)
        .orderBy(desc(transaksi.tanggal))

      const grandTotal = result.reduce(
        (sum, item) => sum + parseFloat(item.totalNominal || '0'),
        0
      )

      return NextResponse.json({ data: result, grandTotal })
    }

    if (type === 'per-petugas') {
      if (session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      if (!petugasId) {
        return NextResponse.json(
          { error: 'petugasId required' },
          { status: 400 }
        )
      }

      let conditions: any[] = [eq(transaksi.petugasId, petugasId)]

      if (formattedStartDate) {
        conditions.push(gte(transaksi.tanggal, formattedStartDate))
      }
      if (formattedEndDate) {
        conditions.push(lte(transaksi.tanggal, formattedEndDate))
      }

      const result = await db
        .select({
          id: transaksi.id,
          tanggal: transaksi.tanggal,
          nominal: transaksi.nominal,
          metodeBayar: transaksi.metodeBayar,
          createdAt: transaksi.createdAt,
          penabung: {
            nama: penabung.nama,
          },
        })
        .from(transaksi)
        .leftJoin(penabung, eq(transaksi.penabungId, penabung.id))
        .where(and(...conditions))
        .orderBy(desc(transaksi.tanggal), desc(transaksi.createdAt))

      const total = result.reduce(
        (sum, item) => sum + parseFloat(item.nominal),
        0
      )

      const [petugasInfo] = await db
        .select()
        .from(users)
        .where(eq(users.id, petugasId))
        .limit(1)

      return NextResponse.json({ data: result, total, petugas: petugasInfo })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Error generating laporan:', error)
    return NextResponse.json(
      { error: 'Failed to generate laporan' },
      { status: 500 }
    )
  }
}