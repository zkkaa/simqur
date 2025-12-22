'use client'

import { motion } from 'framer-motion'
import { formatDateTime, formatRelativeDate } from '@/lib/utils/format'
import {
  PlusCircle,
  PencilSimple,
  Trash,
  SignIn,
  SignOut,
} from '@phosphor-icons/react'
import Badge from '@/components/common/Badge'

interface ActivityLogCardProps {
  log: any
  delay?: number
}

export default function ActivityLogCard({ log, delay = 0 }: ActivityLogCardProps) {
  const getActionIcon = () => {
    switch (log.action) {
      case 'create':
        return <PlusCircle weight="duotone" className="w-5 h-5 text-green-600" />
      case 'update':
        return <PencilSimple weight="duotone" className="w-5 h-5 text-blue-600" />
      case 'delete':
        return <Trash weight="duotone" className="w-5 h-5 text-red-600" />
      case 'login':
        return <SignIn weight="duotone" className="w-5 h-5 text-primary-600" />
      case 'logout':
        return <SignOut weight="duotone" className="w-5 h-5 text-gray-600" />
      default:
        return null
    }
  }

  const getActionBadgeVariant = () => {
    switch (log.action) {
      case 'create':
        return 'success'
      case 'update':
        return 'info'
      case 'delete':
        return 'error'
      case 'login':
        return 'default'
      case 'logout':
        return 'default'
      default:
        return 'default'
    }
  }

  const getActionLabel = () => {
    switch (log.action) {
      case 'create':
        return 'Create'
      case 'update':
        return 'Update'
      case 'delete':
        return 'Delete'
      case 'login':
        return 'Login'
      case 'logout':
        return 'Logout'
      default:
        return log.action
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          {getActionIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 mb-1">
            {log.description}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant={getActionBadgeVariant() as any} size="sm">
              {getActionLabel()}
            </Badge>
            <span className="text-xs text-gray-500">{log.tableName}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
        <span>{formatDateTime(log.createdAt)}</span>
        <span>{formatRelativeDate(log.createdAt)}</span>
      </div>

      {log.ipAddress && log.ipAddress !== 'unknown' && (
        <p className="text-xs text-gray-400 mt-1">IP: {log.ipAddress}</p>
      )}
    </motion.div>
  )
}