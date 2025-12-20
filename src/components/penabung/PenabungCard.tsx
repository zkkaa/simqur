import { motion } from 'framer-motion'
import { User, DotsThreeVertical, CheckCircle, XCircle } from '@phosphor-icons/react'
import { formatCurrency } from '@/lib/utils/format'
import type { Penabung } from '@/types/database'
import Badge from '@/components/common/Badge'

interface PenabungCardProps {
  penabung: Penabung
  onEdit: () => void
  onDelete: () => void
  delay?: number
}

export default function PenabungCard({
  penabung,
  onEdit,
  onDelete,
  delay = 0,
}: PenabungCardProps) {
  const saldo = parseFloat(penabung.totalSaldo)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <User weight="duotone" className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {penabung.nama}
            </h3>
            <p className="text-sm text-gray-500">
              {formatCurrency(saldo)}
            </p>
          </div>
        </div>

        {/* Action Menu */}
        <div className="flex items-center gap-2">
          <Badge variant={penabung.statusLunas ? 'success' : 'default'} size="sm">
            {penabung.statusLunas ? (
              <>
                <CheckCircle weight="fill" className="w-3 h-3" />
                Lunas
              </>
            ) : (
              <>
                <XCircle weight="fill" className="w-3 h-3" />
                Belum
              </>
            )}
          </Badge>

          <div className="relative group">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <DotsThreeVertical weight="bold" className="w-5 h-5 text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <button
                onClick={onEdit}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}