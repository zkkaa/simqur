import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db, penabung, transaksi, users, pengaturan } from '@/lib/db'
import { desc, eq } from 'drizzle-orm'
import * as XLSX from 'xlsx'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { logActivity, getClientIp } from '@/lib/utils/activity-logger'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [penabungData, transaksiData, usersData, pengaturanData] =
      await Promise.all([
        db.select().from(penabung).orderBy(penabung.nama),
        db
          .select({
            id: transaksi.id,
            tanggal: transaksi.tanggal,
            nominal: transaksi.nominal,
            metodeBayar: transaksi.metodeBayar,
            createdAt: transaksi.createdAt,
            penabung: {
              nama: penabung.nama,
            },
            petugas: {
              nama: users.namaLengkap,
            },
          })
          .from(transaksi)
          .leftJoin(penabung, eq(transaksi.penabungId, penabung.id))
          .leftJoin(users, eq(transaksi.petugasId, users.id))
          .orderBy(desc(transaksi.createdAt)),
        db.select().from(users).orderBy(users.namaLengkap),
        db.select().from(pengaturan),
      ])

    const workbook = XLSX.utils.book_new()

    const penabungSheet = XLSX.utils.aoa_to_sheet([
      ['DATA PENABUNG'],
      [`Backup: ${formatDate(new Date(), 'dd MMMM yyyy HH:mm')}`],
      [],
      ['No', 'Nama', 'Total Saldo', 'Status', 'Dibuat', 'Diupdate'],
      ...penabungData.map((item, index) => [
        index + 1,
        item.nama,
        parseFloat(item.totalSaldo),
        item.statusLunas ? 'Lunas' : 'Belum Lunas',
        formatDate(new Date(item.createdAt), 'dd/MM/yyyy HH:mm'),
        formatDate(new Date(item.updatedAt), 'dd/MM/yyyy HH:mm'),
      ]),
    ])
    penabungSheet['!cols'] = [
      { wch: 5 },
      { wch: 25 },
      { wch: 15 },
      { wch: 12 },
      { wch: 18 },
      { wch: 18 },
    ]
    XLSX.utils.book_append_sheet(workbook, penabungSheet, 'Penabung')

    const transaksiSheet = XLSX.utils.aoa_to_sheet([
      ['DATA TRANSAKSI'],
      [`Backup: ${formatDate(new Date(), 'dd MMMM yyyy HH:mm')}`],
      [],
      ['No', 'Tanggal', 'Penabung', 'Petugas', 'Nominal', 'Metode', 'Waktu Input'],
      ...transaksiData.map((item, index) => [
        index + 1,
        formatDate(new Date(item.tanggal), 'dd/MM/yyyy'),
        item.penabung?.nama || '-',
        item.petugas?.nama || '-',
        parseFloat(item.nominal),
        item.metodeBayar === 'tunai' ? 'Tunai' : 'Transfer',
        formatDate(new Date(item.createdAt), 'dd/MM/yyyy HH:mm'),
      ]),
    ])
    transaksiSheet['!cols'] = [
      { wch: 5 },
      { wch: 12 },
      { wch: 25 },
      { wch: 25 },
      { wch: 15 },
      { wch: 10 },
      { wch: 18 },
    ]
    XLSX.utils.book_append_sheet(workbook, transaksiSheet, 'Transaksi')

    const petugasSheet = XLSX.utils.aoa_to_sheet([
      ['DATA PETUGAS'],
      [`Backup: ${formatDate(new Date(), 'dd MMMM yyyy HH:mm')}`],
      [],
      ['No', 'Nama', 'Email', 'No. Telp', 'Role', 'Status', 'Dibuat'],
      ...usersData.map((item, index) => [
        index + 1,
        item.namaLengkap,
        item.email,
        item.noTelp || '-',
        item.role.toUpperCase(),
        item.isActive ? 'Aktif' : 'Nonaktif',
        formatDate(new Date(item.createdAt), 'dd/MM/yyyy HH:mm'),
      ]),
    ])
    petugasSheet['!cols'] = [
      { wch: 5 },
      { wch: 25 },
      { wch: 25 },
      { wch: 15 },
      { wch: 10 },
      { wch: 10 },
      { wch: 18 },
    ]
    XLSX.utils.book_append_sheet(workbook, petugasSheet, 'Petugas')

    const pengaturanSheet = XLSX.utils.aoa_to_sheet([
      ['PENGATURAN SISTEM'],
      [`Backup: ${formatDate(new Date(), 'dd MMMM yyyy HH:mm')}`],
      [],
      ['Key', 'Value', 'Terakhir Diubah'],
      ...pengaturanData.map((item) => [
        item.key,
        item.value,
        formatDate(new Date(item.updatedAt), 'dd/MM/yyyy HH:mm'),
      ]),
    ])
    pengaturanSheet['!cols'] = [{ wch: 20 }, { wch: 20 }, { wch: 18 }]
    XLSX.utils.book_append_sheet(workbook, pengaturanSheet, 'Pengaturan')

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    await logActivity({
      userId: session.user.id,
      userRole: session.user.role,
      action: 'create',
      tableName: 'backup',
      description: 'Backup semua data sistem',
      ipAddress: getClientIp(request),
    })

    return new NextResponse(buffer, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=SIMQUR_Backup_${
          new Date().toISOString().split('T')[0]
        }.xlsx`,
      },
    })
  } catch (error) {
    console.error('Error creating backup:', error)
    return NextResponse.json(
      { error: 'Failed to create backup' },
      { status: 500 }
    )
  }
}