'use client'

import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils/format'
import Button from '@/components/common/Button'
import { User, CheckCircle, CurrencyCircleDollar } from '@phosphor-icons/react'
import type { Penabung } from '@/types/database'

interface PenabungLunasCardProps {
  penabung: Penabung
  delay?: number
  onProses: () => void
}

export default function PenabungLunasCard({
  penabung,
  delay = 0,
  onProses,
}: PenabungLunasCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay }}
      className="bg-white rounded-xl p-4 shadow-sm border-2 border-success/20 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
          <User weight="duotone" className="w-6 h-6 text-success" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-gray-900 truncate">
              {penabung.nama}
            </h4>
            <CheckCircle weight="fill" className="w-5 h-5 text-success flex-shrink-0" />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <CurrencyCircleDollar
              weight="duotone"
              className="w-4 h-4 text-gray-400"
            />
            <span className="text-sm text-gray-600">
              Saldo: {formatCurrency(parseFloat(penabung.totalSaldo))}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-success/10 rounded-md mt-2">
            <CheckCircle weight="fill" className="w-3.5 h-3.5 text-success" />
            <span className="text-xs font-medium text-success">Lunas</span>
          </div>
        </div>
      </div>

      <Button
        variant="success"
        size="sm"
        fullWidth
        onClick={onProses}
        leftIcon={<CurrencyCircleDollar weight="bold" className="w-4 h-4" />}
      >
        Proses Qurban
      </Button>
    </motion.div>
  )
}