import { motion } from 'framer-motion'
import { Money, CreditCard, Calendar, User } from '@phosphor-icons/react'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import Badge from '@/components/common/Badge'

interface RecentTransaksi {
  id: string
  nominal: string
  metodeBayar: 'tunai' | 'transfer'
  tanggal: string
  createdAt: Date
  penabung: {
    id: string
    nama: string
  }
  petugas: {
    id: string
    namaLengkap: string
  }
}

interface RecentTransactionsProps {
  data: RecentTransaksi[]
}

export default function RecentTransactions({ data }: RecentTransactionsProps) {
  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Transaksi Terbaru
        </h3>
        <div className="text-center py-8 text-gray-500 text-sm">
          Belum ada transaksi
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Transaksi Terbaru
      </h3>

      <div className="space-y-3">
        {data.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.05 }}
            className="p-3 bg-gray-50 rounded-xl border border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  {item.metodeBayar === 'tunai' ? (
                    <Money weight="duotone" className="w-4 h-4 text-primary-600" />
                  ) : (
                    <CreditCard weight="duotone" className="w-4 h-4 text-primary-600" />
                  )}
                </div>
                <h4 className="font-semibold text-gray-900 truncate">
                  {item.penabung.nama}
                </h4>
              </div>
              <p className="font-bold text-primary-600 text-sm">
                {formatCurrency(parseFloat(item.nominal))}
              </p>
            </div>

            {/* Details */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Calendar weight="duotone" className="w-3 h-3" />
                  <span>{formatDate(new Date(item.tanggal), 'dd MMM yyyy')}</span>
                </div>
                <Badge
                  variant={item.metodeBayar === 'tunai' ? 'success' : 'info'}
                  size="sm"
                >
                  {item.metodeBayar === 'tunai' ? 'Tunai' : 'Transfer'}
                </Badge>
              </div>
            </div>

            {/* Petugas */}
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <User weight="duotone" className="w-3 h-3" />
                <span>Petugas: {item.petugas.namaLengkap}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}