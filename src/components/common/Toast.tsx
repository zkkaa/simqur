import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Warning, X, XCircle, Info } from '@phosphor-icons/react'
import { useEffect } from 'react'

interface ToastProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message?: string
  variant?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const variantConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    titleColor: 'text-green-900',
    messageColor: 'text-green-700',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    titleColor: 'text-red-900',
    messageColor: 'text-red-700',
  },
  warning: {
    icon: Warning,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-900',
    messageColor: 'text-yellow-700',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900',
    messageColor: 'text-blue-700',
  },
}

export default function Toast({
  isOpen,
  onClose,
  title,
  message,
  variant = 'info',
  duration = 5000,
}: ToastProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, duration, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-4 right-4 z-50 max-w-md w-full"
        >
          <div
            className={`${config.bgColor} ${config.borderColor} border rounded-xl shadow-lg p-4 flex items-start gap-3`}
          >
            <Icon weight="fill" className={`w-6 h-6 ${config.iconColor} flex-shrink-0`} />
            
            <div className="flex-1 min-w-0">
              <p className={`font-semibold ${config.titleColor}`}>{title}</p>
              {message && (
                <p className={`text-sm ${config.messageColor} mt-1`}>{message}</p>
              )}
            </div>

            <button
              onClick={onClose}
              className={`${config.iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
            >
              <X weight="bold" className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}