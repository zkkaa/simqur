'use client'

import { motion } from 'framer-motion'
import { formatCurrency, formatDate } from '@/lib/utils/format'
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
  // Render untuk Laporan Keseluruhan
  if (type === 'keseluruhan') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.02 }}
        className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">
              {data.penabung?.nama}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Petugas: {data.petugas?.nama}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-primary-600 text-lg">
              {formatCurrency(parseFloat(data.nominal))}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(new Date(data.tanggal), 'dd/MM/yyyy')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={data.metodeBayar === 'tunai' ? 'success' : 'info'}
            size="sm"
          >
            {data.metodeBayar === 'tunai' ? '💵 Tunai' : '🏦 Transfer'}
          </Badge>
        </div>
      </motion.div>
    )
  }

  // Render untuk Laporan Per Warga
  if (type === 'per-warga') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.02 }}
        className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-700">
              {formatDate(new Date(data.tanggal), 'dd MMMM yyyy')}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Petugas: {data.petugas?.nama}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-primary-600 text-lg">
              {formatCurrency(parseFloat(data.nominal))}
            </p>
            <Badge
              variant={data.metodeBayar === 'tunai' ? 'success' : 'info'}
              size="sm"
              className="mt-1"
            >
              {data.metodeBayar === 'tunai' ? '💵' : '🏦'}
            </Badge>
          </div>
        </div>
      </motion.div>
    )
  }

  // Render untuk Laporan Keuangan
  if (type === 'keuangan') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.02 }}
        className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-900">
              {formatDate(new Date(data.tanggal), 'dd MMMM yyyy')}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {data.jumlahTransaksi} transaksi
            </p>
          </div>
          <p className="font-bold text-primary-600 text-xl">
            {formatCurrency(parseFloat(data.totalNominal))}
          </p>
        </div>
      </motion.div>
    )
  }

  // Render untuk Laporan Per Petugas
  if (type === 'per-petugas') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.02 }}
        className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">
              {data.penabung?.nama}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {formatDate(new Date(data.tanggal), 'dd/MM/yyyy')}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-primary-600 text-lg">
              {formatCurrency(parseFloat(data.nominal))}
            </p>
            <Badge
              variant={data.metodeBayar === 'tunai' ? 'success' : 'info'}
              size="sm"
              className="mt-1"
            >
              {data.metodeBayar === 'tunai' ? '💵' : '🏦'}
            </Badge>
          </div>
        </div>
      </motion.div>
    )
  }

  return null
}