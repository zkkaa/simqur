'use client'

import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils/format'
import {
  Receipt,
  CurrencyCircleDollar,
  TrendUp,
  CalendarBlank,
} from '@phosphor-icons/react'

interface LaporanSummaryCardProps {
  type: 'keseluruhan' | 'per-warga' | 'keuangan' | 'per-petugas'
  data: any
  period: string
}

export default function LaporanSummaryCard({
  type,
  data,
  period,
}: LaporanSummaryCardProps) {
  if (!data) return null

  const totalTransaksi = data.data?.length || 0
  const totalNominal = data.total || data.grandTotal || 0

  let additionalInfo = null

  if (type === 'per-warga' && data.penabung) {
    additionalInfo = (
      <div className="mt-3 pt-3 border-t border-primary-200">
        <p className="text-sm text-primary-100 mb-1">Penabung</p>
        <p className="font-semibold text-white">{data.penabung.nama}</p>
        <p className="text-xs text-primary-100 mt-1">
          Saldo Total: {formatCurrency(parseFloat(data.penabung.totalSaldo))}
        </p>
      </div>
    )
  }

  if (type === 'per-petugas' && data.petugas) {
    additionalInfo = (
      <div className="mt-3 pt-3 border-t border-primary-200">
        <p className="text-sm text-primary-100 mb-1">Petugas</p>
        <p className="font-semibold text-white">{data.petugas.namaLengkap}</p>
        <p className="text-xs text-primary-100 mt-1">{data.petugas.email}</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-5 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-4">
        <Receipt weight="duotone" className="w-6 h-6 text-white" />
        <h3 className="text-white font-bold text-lg">Ringkasan Laporan</h3>
      </div>

      <div className="flex items-center gap-2 mb-4 text-primary-100">
        <CalendarBlank weight="duotone" className="w-4 h-4" />
        <p className="text-sm">{period}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendUp weight="duotone" className="w-5 h-5 text-white" />
            <p className="text-primary-100 text-xs">Total Transaksi</p>
          </div>
          <p className="text-white text-2xl font-bold">{totalTransaksi}</p>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <CurrencyCircleDollar weight="duotone" className="w-5 h-5 text-white" />
            <p className="text-primary-100 text-xs">Total Nominal</p>
          </div>
          <p className="text-white text-xl font-bold">
            {formatCurrency(totalNominal)}
          </p>
        </div>
      </div>

      {additionalInfo}
    </motion.div>
  )
}