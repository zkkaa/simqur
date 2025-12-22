import * as XLSX from 'xlsx'
import { formatCurrency, formatDate } from './format'

export function generateLaporanKeseluruhanExcel(
  data: any[],
  total: number,
  period: string
) {
  const worksheetData = [
    ['SIMQUR - LAPORAN TRANSAKSI KESELURUHAN'],
    [`Periode: ${period}`],
    [`Dicetak: ${formatDate(new Date(), 'dd MMMM yyyy HH:mm')}`],
    [],
    ['No', 'Tanggal', 'Penabung', 'Petugas', 'Nominal', 'Metode Bayar'],
    ...data.map((item, index) => [
      index + 1,
      formatDate(new Date(item.tanggal), 'dd/MM/yyyy'),
      item.penabung?.nama || '-',
      item.petugas?.nama || '-',
      parseFloat(item.nominal),
      item.metodeBayar === 'tunai' ? 'Tunai' : 'Transfer',
    ]),
    [],
    ['', '', '', 'TOTAL:', total, ''],
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
  
  // Column widths
  worksheet['!cols'] = [
    { wch: 5 },
    { wch: 12 },
    { wch: 25 },
    { wch: 25 },
    { wch: 15 },
    { wch: 12 },
  ]

  // Format currency column
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
  for (let R = 5; R <= range.e.r - 2; R++) {
    const cellAddress = XLSX.utils.encode_cell({ r: R, c: 4 })
    if (worksheet[cellAddress] && typeof worksheet[cellAddress].v === 'number') {
      worksheet[cellAddress].z = '#,##0'
    }
  }

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Keseluruhan')
  return workbook
}

export function generateLaporanPerWargaExcel(
  data: any[],
  total: number,
  penabung: any,
  period: string
) {
  const worksheetData = [
    ['SIMQUR - LAPORAN TRANSAKSI PER WARGA'],
    [`Nama: ${penabung?.nama || '-'}`],
    [`Saldo Total: ${formatCurrency(parseFloat(penabung?.totalSaldo || 0))}`],
    [`Periode: ${period}`],
    [`Dicetak: ${formatDate(new Date(), 'dd MMMM yyyy HH:mm')}`],
    [],
    ['No', 'Tanggal', 'Petugas', 'Nominal', 'Metode Bayar'],
    ...data.map((item, index) => [
      index + 1,
      formatDate(new Date(item.tanggal), 'dd/MM/yyyy'),
      item.petugas?.nama || '-',
      parseFloat(item.nominal),
      item.metodeBayar === 'tunai' ? 'Tunai' : 'Transfer',
    ]),
    [],
    ['', '', 'TOTAL:', total, ''],
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

  worksheet['!cols'] = [
    { wch: 5 },
    { wch: 12 },
    { wch: 25 },
    { wch: 15 },
    { wch: 12 },
  ]

  // Format currency column
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
  for (let R = 7; R <= range.e.r - 2; R++) {
    const cellAddress = XLSX.utils.encode_cell({ r: R, c: 3 })
    if (worksheet[cellAddress] && typeof worksheet[cellAddress].v === 'number') {
      worksheet[cellAddress].z = '#,##0'
    }
  }

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Per Warga')
  return workbook
}

export function generateLaporanKeuanganExcel(
  data: any[],
  grandTotal: number,
  period: string
) {
  const worksheetData = [
    ['SIMQUR - LAPORAN KEUANGAN'],
    [`Periode: ${period}`],
    [`Dicetak: ${formatDate(new Date(), 'dd MMMM yyyy HH:mm')}`],
    [],
    ['No', 'Tanggal', 'Jumlah Transaksi', 'Total Nominal'],
    ...data.map((item, index) => [
      index + 1,
      formatDate(new Date(item.tanggal), 'dd/MM/yyyy'),
      parseInt(item.jumlahTransaksi),
      parseFloat(item.totalNominal),
    ]),
    [],
    ['', '', 'GRAND TOTAL:', grandTotal],
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

  worksheet['!cols'] = [
    { wch: 5 },
    { wch: 12 },
    { wch: 18 },
    { wch: 15 },
  ]

  // Format currency column
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
  for (let R = 5; R <= range.e.r - 2; R++) {
    const cellAddress = XLSX.utils.encode_cell({ r: R, c: 3 })
    if (worksheet[cellAddress] && typeof worksheet[cellAddress].v === 'number') {
      worksheet[cellAddress].z = '#,##0'
    }
  }

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Keuangan')
  return workbook
}

export function generateLaporanPerPetugasExcel(
  data: any[],
  total: number,
  petugas: any,
  period: string
) {
  const worksheetData = [
    ['SIMQUR - LAPORAN TRANSAKSI PER PETUGAS'],
    [`Nama: ${petugas?.namaLengkap || '-'}`],
    [`Email: ${petugas?.email || '-'}`],
    [`Periode: ${period}`],
    [`Dicetak: ${formatDate(new Date(), 'dd MMMM yyyy HH:mm')}`],
    [],
    ['No', 'Tanggal', 'Penabung', 'Nominal', 'Metode Bayar'],
    ...data.map((item, index) => [
      index + 1,
      formatDate(new Date(item.tanggal), 'dd/MM/yyyy'),
      item.penabung?.nama || '-',
      parseFloat(item.nominal),
      item.metodeBayar === 'tunai' ? 'Tunai' : 'Transfer',
    ]),
    [],
    ['', '', 'TOTAL:', total, ''],
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

  worksheet['!cols'] = [
    { wch: 5 },
    { wch: 12 },
    { wch: 25 },
    { wch: 15 },
    { wch: 12 },
  ]

  // Format currency column
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
  for (let R = 7; R <= range.e.r - 2; R++) {
    const cellAddress = XLSX.utils.encode_cell({ r: R, c: 3 })
    if (worksheet[cellAddress] && typeof worksheet[cellAddress].v === 'number') {
      worksheet[cellAddress].z = '#,##0'
    }
  }

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Per Petugas')
  return workbook
}

export function downloadExcel(workbook: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}