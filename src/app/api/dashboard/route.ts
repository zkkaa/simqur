import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db, penabung, transaksi, users, pengaturan } from '@/lib/db'
import { eq, isNull, sql, and, gte, lte } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admin can access dashboard
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const month = searchParams.get('month') || new Date().getMonth() + 1
    const year = searchParams.get('year') || new Date().getFullYear()

    // 1. Get Statistics
    const [stats] = await db
      .select({
        totalPenabung: sql<number>`count(distinct ${penabung.id})`,
        totalSaldo: sql<string>`coalesce(sum(${penabung.totalSaldo}), 0)`,
        penabungLunas: sql<number>`count(distinct case when ${penabung.statusLunas} = true then ${penabung.id} end)`,
      })
      .from(penabung)
      .where(isNull(penabung.deletedAt))

    // 2. Get Total Petugas
    const [petugasStats] = await db
      .select({
        totalPetugas: sql<number>`count(*)`,
      })
      .from(users)
      .where(eq(users.role, 'petugas'))

    // 3. Get Target Qurban from Settings
    const [targetSetting] = await db
      .select()
      .from(pengaturan)
      .where(eq(pengaturan.key, 'target_qurban'))
      .limit(1)

    const targetQurban = targetSetting ? parseInt(targetSetting.value) : 3600000

    // 4. Get Chart Data - Daily income for selected month
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const endDate = new Date(Number(year), Number(month), 0)
      .toISOString()
      .split('T')[0]

    const chartData = await db
      .select({
        tanggal: transaksi.tanggal,
        total: sql<string>`sum(${transaksi.nominal})`,
        count: sql<number>`count(*)`,
      })
      .from(transaksi)
      .where(
        and(
          gte(transaksi.tanggal, startDate),
          lte(transaksi.tanggal, endDate)
        )
      )
      .groupBy(transaksi.tanggal)
      .orderBy(transaksi.tanggal)

    // 5. Get Recent Penabung Lunas (5 latest)
    const recentLunas = await db
      .select({
        id: penabung.id,
        nama: penabung.nama,
        totalSaldo: penabung.totalSaldo,
        updatedAt: penabung.updatedAt,
      })
      .from(penabung)
      .where(
        and(
          eq(penabung.statusLunas, true),
          isNull(penabung.deletedAt)
        )
      )
      .orderBy(sql`${penabung.updatedAt} desc`)
      .limit(5)

    // 6. Get Recent Transactions (5 latest)
    const recentTransaksi = await db
      .select({
        id: transaksi.id,
        nominal: transaksi.nominal,
        metodeBayar: transaksi.metodeBayar,
        tanggal: transaksi.tanggal,
        createdAt: transaksi.createdAt,
        penabung: {
          id: penabung.id,
          nama: penabung.nama,
        },
        petugas: {
          id: users.id,
          namaLengkap: users.namaLengkap,
        },
      })
      .from(transaksi)
      .leftJoin(penabung, eq(transaksi.penabungId, penabung.id))
      .leftJoin(users, eq(transaksi.petugasId, users.id))
      .orderBy(sql`${transaksi.createdAt} desc`)
      .limit(5)

    return NextResponse.json({
      stats: {
        totalPenabung: Number(stats.totalPenabung),
        totalSaldo: stats.totalSaldo,
        penabungLunas: Number(stats.penabungLunas),
        totalPetugas: Number(petugasStats.totalPetugas),
        targetQurban,
      },
      chartData,
      recentLunas,
      recentTransaksi,
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}