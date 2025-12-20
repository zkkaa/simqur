import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Warning, XCircle, Info } from '@phosphor-icons/react'
import { cn } from '@/lib/utils/cn'

interface InfoCardProps {
  variant?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  children: ReactNode
  icon?: ReactNode
  className?: string
}

const variantConfig = {
  success: {
    defaultIcon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    titleColor: 'text-green-900',
    textColor: 'text-green-700',
  },
  error: {
    defaultIcon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    titleColor: 'text-red-900',
    textColor: 'text-red-700',
  },
  warning: {
    defaultIcon: Warning,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-900',
    textColor: 'text-yellow-700',
  },
  info: {
    defaultIcon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900',
    textColor: 'text-blue-700',
  },
}

export default function InfoCard({
  variant = 'info',
  title,
  children,
  icon,
  className,
}: InfoCardProps) {
  const config = variantConfig[variant]
  const DefaultIcon = config.defaultIcon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-lg border p-4 flex items-start gap-3',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className={cn('flex-shrink-0', config.iconColor)}>
        {icon || <DefaultIcon weight="fill" className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        {title && (
          <p className={cn('font-semibold mb-1', config.titleColor)}>{title}</p>
        )}
        <div className={cn('text-sm', config.textColor)}>{children}</div>
      </div>
    </motion.div>
  )
}