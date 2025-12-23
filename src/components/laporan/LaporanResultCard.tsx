'use client'

import { motion } from 'framer-motion'
import { formatCurrency, formatDateWithDay, formatTime } from '@/lib/utils/format'
import { User, CalendarBlank, Clock } from '@phosphor-icons/react'
import Badge from '@/components/common/Badge'

interface LaporanResultCardProps {
  data: any
  index: number
  type: 'keseluruhan' | 'per-warga' | 'keuangan' | 'per-petugas'
}

export default function LaporanResultCard({
  data,
  index,
  type,
}: LaporanResultCardProps) {
  if (type === 'keuangan') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.02 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CalendarBlank weight="duotone" className="w-5 h-5 text-gray-600" />
            <h4 className="font-semibold text-gray-900">
              {formatDateWithDay(data.tanggal)}
            </h4>
          </div>
          <p className="font-bold text-primary-600">
            {formatCurrency(parseFloat(data.totalNominal))}
          </p>
        </div>
        <p className="text-sm text-gray-600">
          {data.jumlahTransaksi} transaksi
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <User weight="duotone" className="w-4 h-4 text-primary-600" />
          </div>
          <h4 className="font-semibold text-gray-900 truncate">
            {type === 'keseluruhan'
              ? data.penabung?.nama || '-'
              : type === 'per-petugas'
              ? data.penabung?.nama || '-'
              : data.petugas?.nama || '-'}
          </h4>
        </div>
        <p className="font-bold text-primary-600 text-sm">
          {formatCurrency(parseFloat(data.nominal))}
        </p>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
        <div className="flex items-center gap-1">
          <CalendarBlank weight="duotone" className="w-3.5 h-3.5" />
          <span>{formatDateWithDay(data.tanggal)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock weight="duotone" className="w-3.5 h-3.5" />
          <span>{formatTime(data.createdAt)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Badge
          variant={data.metodeBayar === 'tunai' ? 'success' : 'info'}
          size="sm"
        >
          {data.metodeBayar === 'tunai' ? 'Tunai' : 'Transfer'}
        </Badge>

        {type === 'keseluruhan' && data.petugas && (
          <p className="text-xs text-gray-500">
            Petugas: {data.petugas.nama}
          </p>
        )}
      </div>
    </motion.div>
  )
}