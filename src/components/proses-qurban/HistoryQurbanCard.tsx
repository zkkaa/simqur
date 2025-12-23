'use client'

import { motion } from 'framer-motion'
import { formatCurrency, formatDateWithDay } from '@/lib/utils/format'
import { User, Users, CalendarBlank, CurrencyCircleDollar } from '@phosphor-icons/react'

interface HistoryQurbanCardProps {
  history: any
  delay?: number
}

export default function HistoryQurbanCard({
  history,
  delay = 0,
}: HistoryQurbanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay }}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
          <User weight="duotone" className="w-6 h-6 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">
            {history.penabung?.nama || '-'}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            Tahun {history.tahunPeriode}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Total</p>
          <p className="font-bold text-primary-600">
            {formatCurrency(parseFloat(history.totalPenarikan))}
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Users weight="duotone" className="w-4 h-4" />
            <span>Jumlah Orang</span>
          </div>
          <span className="font-medium text-gray-900">
            {history.jumlahOrang} orang
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <CurrencyCircleDollar weight="duotone" className="w-4 h-4" />
            <span>Per Orang</span>
          </div>
          <span className="font-medium text-gray-900">
            {formatCurrency(parseFloat(history.nominalPerOrang))}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarBlank weight="duotone" className="w-4 h-4" />
            <span>Tanggal Proses</span>
          </div>
          <span className="font-medium text-gray-900">
            {formatDateWithDay(history.tanggalProses)}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Diproses oleh: {history.creator?.namaLengkap || 'Admin'}
        </p>
      </div>
    </motion.div>
  )
}