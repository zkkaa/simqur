'use client'

import { motion } from 'framer-motion'
import { formatDate } from '@/lib/utils/format'
import Badge from '@/components/common/Badge'
import {
  PlusCircle,
  PencilSimple,
  Trash,
  SignIn,
  SignOut,
  User,
  ShieldCheck,
} from '@phosphor-icons/react'

interface ActivityLogCardProps {
  log: any
  delay?: number
}

export default function ActivityLogCard({ log, delay = 0 }: ActivityLogCardProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <PlusCircle weight="duotone" className="w-5 h-5" />
      case 'update':
        return <PencilSimple weight="duotone" className="w-5 h-5" />
      case 'delete':
        return <Trash weight="duotone" className="w-5 h-5" />
      case 'login':
        return <SignIn weight="duotone" className="w-5 h-5" />
      case 'logout':
        return <SignOut weight="duotone" className="w-5 h-5" />
      default:
        return <User weight="duotone" className="w-5 h-5" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-success/10 text-success'
      case 'update':
        return 'bg-blue-100 text-blue-600'
      case 'delete':
        return 'bg-error/10 text-error'
      case 'login':
        return 'bg-green-100 text-green-600'
      case 'logout':
        return 'bg-gray-100 text-gray-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
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
        return action
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay }}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActionColor(
            log.action
          )}`}
        >
          {getActionIcon(log.action)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-medium text-gray-900 line-clamp-2">
              {log.description}
            </p>
            <Badge variant="default" size="sm">
              {getActionLabel(log.action)}
            </Badge>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <User weight="fill" className="w-3.5 h-3.5" />
              <span>{log.userId || 'System'}</span>
            </div>
            {log.userRole && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <ShieldCheck weight="fill" className="w-3.5 h-3.5" />
                  <span className="uppercase">{log.userRole}</span>
                </div>
              </>
            )}
          </div>

          {/* Table Info */}
          {log.tableName && (
            <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md mb-2">
              <span className="text-xs text-gray-500">Table:</span>
              <span className="text-xs font-medium text-gray-700">
                {log.tableName}
              </span>
            </div>
          )}

          {/* Timestamp */}
          <p className="text-xs text-gray-500">
            {formatDate(new Date(log.createdAt), 'dd MMM yyyy, HH:mm:ss')}
          </p>

          {/* IP Address */}
          {log.ipAddress && (
            <p className="text-xs text-gray-400 mt-1">IP: {log.ipAddress}</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}