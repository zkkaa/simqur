import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatCurrency, formatDateWithDay, formatDateTime } from '@/lib/utils/format'

export function generateLaporanKeseluruhanPDF(
  data: any[],
  total: number,
  period: string
) {
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.text('SIMQUR', 14, 15)
  doc.setFontSize(10)
  doc.text('Desa Sambong Sawah', 14, 22)

  doc.setFontSize(14)
  doc.text('Laporan Transaksi Keseluruhan', 14, 35)
  doc.setFontSize(10)
  doc.text(`Periode: ${period}`, 14, 42)

  autoTable(doc, {
    startY: 50,
    head: [['No', 'Tanggal', 'Penabung', 'Petugas', 'Nominal', 'Metode']],
    body: data.map((item, index) => [
      index + 1,
      formatDateWithDay(item.tanggal),
      item.penabung?.nama || '-',
      item.petugas?.nama || '-',
      formatCurrency(parseFloat(item.nominal)),
      item.metodeBayar === 'tunai' ? 'Tunai' : 'Transfer',
    ]),
    foot: [['', '', '', 'TOTAL:', formatCurrency(total), '']],
    styles: { fontSize: 8 },
    headStyles: {
      fillColor: [22, 163, 74],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    footStyles: {
      fillColor: [21, 128, 61],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'right',
    },
  })

  const pageCount = (doc as any).internal.getNumberOfPages()
  doc.setFontSize(8)
  doc.text(
    `Dicetak: ${formatDateTime(new Date())}`,
    14,
    doc.internal.pageSize.height - 10
  )
  doc.text(
    `Halaman ${pageCount}`,
    doc.internal.pageSize.width - 30,
    doc.internal.pageSize.height - 10
  )

  return doc
}

export function generateLaporanPerWargaPDF(
  data: any[],
  total: number,
  penabung: any,
  period: string
) {
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.text('SIMQUR', 14, 15)
  doc.setFontSize(10)
  doc.text('Desa Sambong Sawah', 14, 22)

  doc.setFontSize(14)
  doc.text('Laporan Transaksi Per Warga', 14, 35)
  doc.setFontSize(10)
  doc.text(`Nama: ${penabung?.nama || '-'}`, 14, 42)
  doc.text(`Periode: ${period}`, 14, 48)
  doc.text(
    `Saldo Total: ${formatCurrency(parseFloat(penabung?.totalSaldo || 0))}`,
    14,
    54
  )

  autoTable(doc, {
    startY: 62,
    head: [['No', 'Tanggal', 'Petugas', 'Nominal', 'Metode']],
    body: data.map((item, index) => [
      index + 1,
      formatDateWithDay(item.tanggal),
      item.petugas?.nama || '-',
      formatCurrency(parseFloat(item.nominal)),
      item.metodeBayar === 'tunai' ? 'Tunai' : 'Transfer',
    ]),
    foot: [['', '', 'TOTAL:', formatCurrency(total), '']],
    styles: { fontSize: 9 },
    headStyles: {
      fillColor: [22, 163, 74],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    footStyles: {
      fillColor: [21, 128, 61],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'right',
    },
  })

  const pageCount = (doc as any).internal.getNumberOfPages()
  doc.setFontSize(8)
  doc.text(
    `Dicetak: ${formatDateTime(new Date())}`,
    14,
    doc.internal.pageSize.height - 10
  )
  doc.text(
    `Halaman ${pageCount}`,
    doc.internal.pageSize.width - 30,
    doc.internal.pageSize.height - 10
  )

  return doc
}

export function generateLaporanKeuanganPDF(
  data: any[],
  grandTotal: number,
  period: string
) {
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.text('SIMQUR', 14, 15)
  doc.setFontSize(10)
  doc.text('Desa Sambong Sawah', 14, 22)

  doc.setFontSize(14)
  doc.text('Laporan Keuangan', 14, 35)
  doc.setFontSize(10)
  doc.text(`Periode: ${period}`, 14, 42)

  autoTable(doc, {
    startY: 50,
    head: [['No', 'Tanggal', 'Jumlah Transaksi', 'Total Nominal']],
    body: data.map((item, index) => [
      index + 1,
      formatDateWithDay(item.tanggal),
      item.jumlahTransaksi,
      formatCurrency(parseFloat(item.totalNominal)),
    ]),
    foot: [['', '', 'GRAND TOTAL:', formatCurrency(grandTotal)]],
    styles: { fontSize: 9 },
    headStyles: {
      fillColor: [22, 163, 74],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    footStyles: {
      fillColor: [21, 128, 61],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'right',
    },
  })

  const pageCount = (doc as any).internal.getNumberOfPages()
  doc.setFontSize(8)
  doc.text(
    `Dicetak: ${formatDateTime(new Date())}`,
    14,
    doc.internal.pageSize.height - 10
  )
  doc.text(
    `Halaman ${pageCount}`,
    doc.internal.pageSize.width - 30,
    doc.internal.pageSize.height - 10
  )

  return doc
}

export function generateLaporanPerPetugasPDF(
  data: any[],
  total: number,
  petugas: any,
  period: string
) {
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.text('SIMQUR', 14, 15)
  doc.setFontSize(10)
  doc.text('Desa Sambong Sawah', 14, 22)

  doc.setFontSize(14)
  doc.text('Laporan Transaksi Per Petugas', 14, 35)
  doc.setFontSize(10)
  doc.text(`Nama: ${petugas?.namaLengkap || '-'}`, 14, 42)
  doc.text(`Email: ${petugas?.email || '-'}`, 14, 48)
  doc.text(`Periode: ${period}`, 14, 54)

  autoTable(doc, {
    startY: 62,
    head: [['No', 'Tanggal', 'Penabung', 'Nominal', 'Metode']],
    body: data.map((item, index) => [
      index + 1,
      formatDateWithDay(item.tanggal),
      item.penabung?.nama || '-',
      formatCurrency(parseFloat(item.nominal)),
      item.metodeBayar === 'tunai' ? 'Tunai' : 'Transfer',
    ]),
    foot: [['', '', 'TOTAL:', formatCurrency(total), '']],
    styles: { fontSize: 9 },
    headStyles: {
      fillColor: [22, 163, 74],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    footStyles: {
      fillColor: [21, 128, 61],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'right',
    },
  })

  const pageCount = (doc as any).internal.getNumberOfPages()
  doc.setFontSize(8)
  doc.text(
    `Dicetak: ${formatDateTime(new Date())}`,
    14,
    doc.internal.pageSize.height - 10
  )
  doc.text(
    `Halaman ${pageCount}`,
    doc.internal.pageSize.width - 30,
    doc.internal.pageSize.height - 10
  )

  return doc
}