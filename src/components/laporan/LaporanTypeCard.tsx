'use client'

import { motion } from 'framer-motion'
import { CheckCircle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils/cn'

interface LaporanTypeCardProps {
  icon: React.ReactNode
  title: string
  description: string
  isSelected: boolean
  onClick: () => void
  delay?: number
  adminOnly?: boolean
}

export default function LaporanTypeCard({
  icon,
  title,
  description,
  isSelected,
  onClick,
  delay = 0,
  adminOnly = false,
}: LaporanTypeCardProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={cn(
        'relative w-full p-4 rounded-xl border-2 transition-all text-left',
        'hover:shadow-md active:scale-98',
        isSelected
          ? 'border-primary-500 bg-primary-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-primary-300'
      )}
    >
      {adminOnly && (
        <div className="absolute top-2 right-2">
          
        </div>
      )}

      <div className="flex items-start gap-3">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
            isSelected
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-600'
          )}
        >
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={cn(
                'font-semibold transition-colors',
                isSelected ? 'text-primary-700' : 'text-gray-800'
              )}
            >
              {title}
            </h4>
            {isSelected && (
              <CheckCircle
                weight="fill"
                className="w-5 h-5 text-primary-600 flex-shrink-0"
              />
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </motion.button>
  )
}