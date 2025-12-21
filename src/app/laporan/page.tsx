import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db, transaksi, penabung, users } from '@/lib/db'
import { eq, and, gte, lte, sql } from 'drizzle-orm'

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

    // Laporan Keseluruhan Warga
    if (type === 'keseluruhan') {
      let query = db
        .select({
          id: transaksi.id,
          tanggal: transaksi.tanggal,
          nominal: transaksi.nominal,
          metodeBayar: transaksi.metodeBayar,
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
        .orderBy(transaksi.tanggal)
        .$dynamic()

      if (startDate) {
        query = query.where(gte(transaksi.tanggal, startDate))
      }
      if (endDate) {
        query = query.where(lte(transaksi.tanggal, endDate))
      }

      const result = await query
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

      let query = db
        .select({
          id: transaksi.id,
          tanggal: transaksi.tanggal,
          nominal: transaksi.nominal,
          metodeBayar: transaksi.metodeBayar,
          petugas: {
            nama: users.namaLengkap,
          },
        })
        .from(transaksi)
        .leftJoin(users, eq(transaksi.petugasId, users.id))
        .where(eq(transaksi.penabungId, penabungId))
        .orderBy(transaksi.tanggal)
        .$dynamic()

      if (startDate) {
        query = query.where(
          and(
            eq(transaksi.penabungId, penabungId),
            gte(transaksi.tanggal, startDate)
          )
        )
      }
      if (endDate) {
        query = query.where(
          and(
            eq(transaksi.penabungId, penabungId),
            lte(transaksi.tanggal, endDate)
          )
        )
      }

      const result = await query
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
      let query = db
        .select({
          tanggal: transaksi.tanggal,
          jumlahTransaksi: sql<number>`count(*)`,
          totalNominal: sql<string>`sum(${transaksi.nominal})`,
        })
        .from(transaksi)
        .groupBy(transaksi.tanggal)
        .orderBy(transaksi.tanggal)
        .$dynamic()

      if (startDate) {
        query = query.where(gte(transaksi.tanggal, startDate))
      }
      if (endDate) {
        query = query.where(lte(transaksi.tanggal, endDate))
      }

      const result = await query
      const grandTotal = result.reduce(
        (sum, item) => sum + parseFloat(item.totalNominal),
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

      let query = db
        .select({
          id: transaksi.id,
          tanggal: transaksi.tanggal,
          nominal: transaksi.nominal,
          metodeBayar: transaksi.metodeBayar,
          penabung: {
            nama: penabung.nama,
          },
        })
        .from(transaksi)
        .leftJoin(penabung, eq(transaksi.penabungId, penabung.id))
        .where(eq(transaksi.petugasId, petugasId))
        .orderBy(transaksi.tanggal)
        .$dynamic()

      if (startDate) {
        query = query.where(
          and(
            eq(transaksi.petugasId, petugasId),
            gte(transaksi.tanggal, startDate)
          )
        )
      }
      if (endDate) {
        query = query.where(
          and(
            eq(transaksi.petugasId, petugasId),
            lte(transaksi.tanggal, endDate)
          )
        )
      }

      const result = await query
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