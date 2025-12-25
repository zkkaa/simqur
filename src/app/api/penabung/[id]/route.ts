import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db, penabung, transaksi } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { logActivity, getClientIp } from '@/lib/utils/activity-logger'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
      .select()
      .from(penabung)
      .where(eq(penabung.id, params.id))
      .limit(1)

    if (!result) {
      return NextResponse.json({ error: 'Penabung not found' }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching penabung:', error)
    return NextResponse.json(
      { error: 'Failed to fetch penabung' },
      { status: 500 }
    )
  }
}

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
    const { nama } = body

    if (!nama || nama.trim() === '') {
      return NextResponse.json(
        { error: 'Nama penabung harus diisi' },
        { status: 400 }
      )
    }

    const [oldData] = await db
      .select()
      .from(penabung)
      .where(eq(penabung.id, params.id))
      .limit(1)

    if (!oldData) {
      return NextResponse.json({ error: 'Penabung not found' }, { status: 404 })
    }

    const existing = await db
      .select()
      .from(penabung)
      .where(eq(penabung.nama, nama.trim()))
      .limit(1)

    if (existing.length > 0 && existing[0].id !== params.id) {
      return NextResponse.json(
        { error: 'Nama penabung sudah ada' },
        { status: 400 }
      )
    }

    const [updated] = await db
      .update(penabung)
      .set({
        nama: nama.trim(),
        updatedBy: session.user.id,
        updatedAt: new Date(),
      })
      .where(eq(penabung.id, params.id))
      .returning()

    await logActivity({
      userId: session.user.id,
      userRole: session.user.role,
      action: 'update',
      tableName: 'penabung',
      recordId: params.id,
      description: `Mengubah data penabung: ${oldData.nama} → ${updated.nama}`,
      oldData,
      newData: updated,
      ipAddress: getClientIp(request),
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating penabung:', error)
    return NextResponse.json(
      { error: 'Failed to update penabung' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get penabung data for logging
    const [penabungData] = await db
      .select()
      .from(penabung)
      .where(eq(penabung.id, params.id))
      .limit(1)

    if (!penabungData) {
      return NextResponse.json({ error: 'Penabung not found' }, { status: 404 })
    }

    // Get transaction count for logging
    const transaksiList = await db
      .select()
      .from(transaksi)
      .where(eq(transaksi.penabungId, params.id))

    const transaksiCount = transaksiList.length
    const totalNominal = transaksiList.reduce(
      (sum, t) => sum + parseFloat(t.nominal),
      0
    )

    // CASCADE DELETE: Delete all transactions first
    await db
      .delete(transaksi)
      .where(eq(transaksi.penabungId, params.id))

    // Then delete the penabung
    await db
      .delete(penabung)
      .where(eq(penabung.id, params.id))

    // Log activity with detailed information
    await logActivity({
      userId: session.user.id,
      userRole: session.user.role,
      action: 'delete',
      tableName: 'penabung',
      recordId: params.id,
      description: `Menghapus penabung secara permanen: ${penabungData.nama} | Saldo: Rp ${parseFloat(penabungData.totalSaldo).toLocaleString('id-ID')} | ${transaksiCount} transaksi (Total: Rp ${totalNominal.toLocaleString('id-ID')})`,
      oldData: {
        penabung: penabungData,
        deletedTransactions: transaksiCount,
        totalNominal: totalNominal,
      },
      ipAddress: getClientIp(request),
    })

    return NextResponse.json({ 
      success: true,
      message: 'Penabung dan semua riwayat transaksi berhasil dihapus',
      deletedTransactions: transaksiCount,
    })
  } catch (error) {
    console.error('Error deleting penabung:', error)
    return NextResponse.json(
      { error: 'Failed to delete penabung' },
      { status: 500 }
    )
  }
}