import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, CheckCircle, XCircle } from '@phosphor-icons/react'
import { formatCurrency } from '@/lib/utils/format'
import type { Penabung } from '@/types/database'
import Badge from '@/components/common/Badge'

interface PenabungCardProps {
  penabung: Penabung
  onEdit?: () => void
  onDelete?: () => void
  delay?: number
}

export default function PenabungCard({
  penabung,
  onEdit,
  onDelete,
  delay = 0,
}: PenabungCardProps) {
  const router = useRouter()
  const saldo = parseFloat(penabung.totalSaldo)

  const handleCardClick = () => {
    router.push(`/penabung/${penabung.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 cursor-pointer hover:shadow-lg hover:border-primary-200 transition-all"
    >
      <div className="flex items-start justify-between">
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
      </div>
    </motion.div>
  )
}