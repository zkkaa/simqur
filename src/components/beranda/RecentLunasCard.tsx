import { motion } from 'framer-motion'
import { CheckCircle, Calendar } from '@phosphor-icons/react'
import { formatCurrency, formatRelativeDate } from '@/lib/utils/format'

interface RecentLunas {
  id: string
  nama: string
  totalSaldo: string
  updatedAt: Date
}

interface RecentLunasCardProps {
  data: RecentLunas[]
}

export default function RecentLunasCard({ data }: RecentLunasCardProps) {
  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Penabung Baru Lunas
        </h3>
        <div className="text-center py-8 text-gray-500 text-sm">
          Belum ada penabung yang lunas
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Penabung Baru Lunas
      </h3>

      <div className="space-y-3">
        {data.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle
                  weight="fill"
                  className="w-6 h-6 text-green-600"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">
                  {item.nama}
                </h4>
                <p className="text-sm text-green-600">
                  {formatCurrency(parseFloat(item.totalSaldo))}
                </p>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <Calendar weight="duotone" className="w-3 h-3" />
                  <span>{formatRelativeDate(new Date(item.updatedAt))}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}