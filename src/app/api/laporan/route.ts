import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db, transaksi, penabung, users } from '@/lib/db'
import { eq, and, gte, lte, sql, desc } from 'drizzle-orm'
import { formatDateForDB } from '@/lib/utils/timezone'

// GET - Generate laporan based on type
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // keseluruhan | per-warga | keuangan | per-petugas
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

    // ✅ FIX: Format dates to ensure they're in YYYY-MM-DD format
    const formattedStartDate = startDate ? formatDateForDB(startDate) : null
    const formattedEndDate = endDate ? formatDateForDB(endDate) : null

    // Laporan Keseluruhan Warga
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

    // Laporan Per Warga
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

      // Get penabung info
      const [penabungInfo] = await db
        .select()
        .from(penabung)
        .where(eq(penabung.id, penabungId))
        .limit(1)

      return NextResponse.json({ data: result, total, penabung: penabungInfo })
    }

    // Laporan Keuangan
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

    // Laporan Per Petugas (Admin Only)
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

      // Get petugas info
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