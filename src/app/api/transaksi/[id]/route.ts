import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db, transaksi, penabung } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { logActivity, getClientIp } from '@/lib/utils/activity-logger'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET single transaksi
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [result] = await db
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
      .where(eq(transaksi.id, params.id))
      .limit(1)

    if (!result) {
      return NextResponse.json({ error: 'Transaksi not found' }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching transaksi:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transaksi' },
      { status: 500 }
    )
  }
}

// PATCH - Edit transaksi (NO DATE RESTRICTION)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { nominal, metodeBayar } = body

    if (!nominal || !metodeBayar) {
      return NextResponse.json(
        { error: 'Nominal dan metode bayar harus diisi' },
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

    // Get old transaksi data
    const [oldTransaksi] = await db
      .select({
        id: transaksi.id,
        nominal: transaksi.nominal,
        metodeBayar: transaksi.metodeBayar,
        tanggal: transaksi.tanggal,
        penabungId: transaksi.penabungId,
      })
      .from(transaksi)
      .where(eq(transaksi.id, params.id))
      .limit(1)

    if (!oldTransaksi) {
      return NextResponse.json({ error: 'Transaksi not found' }, { status: 404 })
    }

    // Get penabung data
    const [penabungData] = await db
      .select()
      .from(penabung)
      .where(eq(penabung.id, oldTransaksi.penabungId))
      .limit(1)

    if (!penabungData) {
      return NextResponse.json(
        { error: 'Penabung tidak ditemukan' },
        { status: 404 }
      )
    }

    // Calculate new saldo
    const oldNominal = parseFloat(oldTransaksi.nominal)
    const newNominal = parseFloat(nominal)
    const currentSaldo = parseFloat(penabungData.totalSaldo)
    const selisihNominal = newNominal - oldNominal
    const newSaldo = currentSaldo + selisihNominal

    // Get target qurban from settings (default 3.6jt)
    const targetQurban = 3600000
    const statusLunas = newSaldo >= targetQurban

    // Update transaksi
    const [updated] = await db
      .update(transaksi)
      .set({
        nominal: nominal.toString(),
        metodeBayar,
      })
      .where(eq(transaksi.id, params.id))
      .returning()

    // Update penabung saldo
    await db
      .update(penabung)
      .set({
        totalSaldo: newSaldo.toString(),
        statusLunas,
        updatedBy: session.user.id,
        updatedAt: new Date(),
      })
      .where(eq(penabung.id, oldTransaksi.penabungId))

    // Log activity
    await logActivity({
      userId: session.user.id,
      userRole: session.user.role,
      action: 'update',
      tableName: 'transaksi',
      recordId: params.id,
      description: `Mengedit transaksi ${penabungData.nama} (${oldTransaksi.tanggal}): ${oldNominal.toLocaleString('id-ID')} → ${newNominal.toLocaleString('id-ID')}`,
      oldData: oldTransaksi,
      newData: updated,
      ipAddress: getClientIp(request),
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating transaksi:', error)
    return NextResponse.json(
      { error: 'Failed to update transaksi' },
      { status: 500 }
    )
  }
}

// DELETE transaksi (NO DATE RESTRICTION - admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Hanya admin yang bisa menghapus transaksi' },
        { status: 403 }
      )
    }

    // Get transaksi data
    const [transaksiData] = await db
      .select({
        id: transaksi.id,
        nominal: transaksi.nominal,
        metodeBayar: transaksi.metodeBayar,
        tanggal: transaksi.tanggal,
        penabungId: transaksi.penabungId,
      })
      .from(transaksi)
      .where(eq(transaksi.id, params.id))
      .limit(1)

    if (!transaksiData) {
      return NextResponse.json({ error: 'Transaksi not found' }, { status: 404 })
    }

    // Get penabung data
    const [penabungData] = await db
      .select()
      .from(penabung)
      .where(eq(penabung.id, transaksiData.penabungId))
      .limit(1)

    if (!penabungData) {
      return NextResponse.json(
        { error: 'Penabung tidak ditemukan' },
        { status: 404 }
      )
    }

    // Calculate new saldo
    const nominalTransaksi = parseFloat(transaksiData.nominal)
    const currentSaldo = parseFloat(penabungData.totalSaldo)
    const newSaldo = currentSaldo - nominalTransaksi

    // Get target qurban from settings
    const targetQurban = 3600000
    const statusLunas = newSaldo >= targetQurban

    // Delete transaksi
    await db.delete(transaksi).where(eq(transaksi.id, params.id))

    // Update penabung saldo
    await db
      .update(penabung)
      .set({
        totalSaldo: newSaldo.toString(),
        statusLunas,
        updatedBy: session.user.id,
        updatedAt: new Date(),
      })
      .where(eq(penabung.id, transaksiData.penabungId))

    // Log activity
    await logActivity({
      userId: session.user.id,
      userRole: session.user.role,
      action: 'delete',
      tableName: 'transaksi',
      recordId: params.id,
      description: `Menghapus transaksi ${penabungData.nama} (${transaksiData.tanggal}): ${nominalTransaksi.toLocaleString('id-ID')}`,
      oldData: transaksiData,
      ipAddress: getClientIp(request),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting transaksi:', error)
    return NextResponse.json(
      { error: 'Failed to delete transaksi' },
      { status: 500 }
    )
  }
}