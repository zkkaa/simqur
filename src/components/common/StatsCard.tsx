import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, ArrowDown } from '@phosphor-icons/react'
import { cn } from '@/lib/utils/cn'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  subtitle?: string
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  delay?: number
}

const colorConfig = {
  primary: {
    bg: 'bg-primary-50',
    iconBg: 'bg-primary-100',
    iconColor: 'text-primary-600',
    textColor: 'text-primary-600',
  },
  secondary: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-600',
  },
  success: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    textColor: 'text-green-600',
  },
  warning: {
    bg: 'bg-yellow-50',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-600',
  },
  error: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    textColor: 'text-red-600',
  },
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  subtitle,
  color = 'primary',
  delay = 0,
}: StatsCardProps) {
  const colors = colorConfig[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className={cn('rounded-2xl p-4 shadow-lg border border-gray-100', colors.bg)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium mb-2">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-semibold mt-2',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {trend.isPositive ? (
                <ArrowUp weight="bold" className="w-4 h-4" />
              ) : (
                <ArrowDown weight="bold" className="w-4 h-4" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        <div className={cn('p-3 rounded-xl', colors.iconBg)}>
          <div className={colors.iconColor}>{icon}</div>
        </div>
      </div>
    </motion.div>
  )
}