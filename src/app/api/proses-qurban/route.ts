import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db, penarikanQurban, penabung, users } from '@/lib/db'
import { eq, desc } from 'drizzle-orm'
import { logActivity, getClientIp } from '@/lib/utils/activity-logger'
import { getIndonesiaDate } from '@/lib/utils/timezone'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const result = await db
      .select({
        id: penarikanQurban.id,
        tahunPeriode: penarikanQurban.tahunPeriode,
        jumlahOrang: penarikanQurban.jumlahOrang,
        nominalPerOrang: penarikanQurban.nominalPerOrang,
        totalPenarikan: penarikanQurban.totalPenarikan,
        tanggalProses: penarikanQurban.tanggalProses,
        createdAt: penarikanQurban.createdAt,
        penabung: {
          id: penabung.id,
          nama: penabung.nama,
        },
        creator: {
          namaLengkap: users.namaLengkap,
        },
      })
      .from(penarikanQurban)
      .leftJoin(penabung, eq(penarikanQurban.penabungId, penabung.id))
      .leftJoin(users, eq(penarikanQurban.createdBy, users.id))
      .orderBy(desc(penarikanQurban.createdAt))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching proses qurban:', error)
    return NextResponse.json(
      { error: 'Failed to fetch proses qurban' },
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

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { penabungId, jumlahOrang, nominalPerOrang } = body

    if (!penabungId || !jumlahOrang || !nominalPerOrang) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    if (jumlahOrang < 1 || jumlahOrang > 10) {
      return NextResponse.json(
        { error: 'Jumlah orang harus 1-10' },
        { status: 400 }
      )
    }

    if (nominalPerOrang < 1000) {
      return NextResponse.json(
        { error: 'Nominal per orang minimal Rp 1.000' },
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

    const totalPenarikan = jumlahOrang * nominalPerOrang
    const saldoSekarang = parseFloat(penabungData.totalSaldo)

    if (saldoSekarang < totalPenarikan) {
      return NextResponse.json(
        { error: 'Saldo tidak mencukupi' },
        { status: 400 }
      )
    }

    const tahunPeriode = new Date().getFullYear()
    const tanggalProses = getIndonesiaDate()

    const [newPenarikan] = await db
      .insert(penarikanQurban)
      .values({
        penabungId,
        tahunPeriode,
        jumlahOrang,
        nominalPerOrang: nominalPerOrang.toString(),
        totalPenarikan: totalPenarikan.toString(),
        tanggalProses,
        createdBy: session.user.id,
      })
      .returning()

    const newSaldo = saldoSekarang - totalPenarikan
    const statusLunas = newSaldo >= 3600000 

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
      tableName: 'penarikan_qurban',
      recordId: newPenarikan.id,
      description: `Proses qurban ${penabungData.nama}: ${jumlahOrang} orang x Rp ${nominalPerOrang.toLocaleString('id-ID')}`,
      newData: {
        penabungId,
        jumlahOrang,
        nominalPerOrang,
        totalPenarikan,
      },
      ipAddress: getClientIp(request),
    })

    return NextResponse.json(newPenarikan, { status: 201 })
  } catch (error) {
    console.error('Error creating proses qurban:', error)
    return NextResponse.json(
      { error: 'Failed to create proses qurban' },
      { status: 500 }
    )
  }
}