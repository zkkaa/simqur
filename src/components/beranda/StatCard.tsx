import { motion } from 'framer-motion'
import { IconProps } from '@phosphor-icons/react'

interface StatCardProps {
  icon: React.ReactElement<IconProps>
  title: string
  value: string | number
  subtitle?: string
  color: 'primary' | 'success' | 'warning' | 'info'
  delay?: number
}

const colorClasses = {
  primary: 'from-primary-500 to-primary-600',
  success: 'from-green-500 to-green-600',
  warning: 'from-amber-500 to-amber-600',
  info: 'from-blue-500 to-blue-600',
}

export default function StatCard({
  icon,
  title,
  value,
  subtitle,
  color,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}
        >
          <div className="text-white">{icon}</div>
        </div>
      </div>

      <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && (
        <p className="text-xs text-gray-500">{subtitle}</p>
      )}
    </motion.div>
  )
}