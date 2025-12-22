'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { useActivityLog } from '@/lib/hooks/use-activity-log'
import { LoadingPage } from '@/components/common/LoadingSpinner'
import SearchInput from '@/components/common/SearchInput'
import Button from '@/components/common/Button'
import Logo from '@/components/common/Logo'
import InfoCard from '@/components/common/InfoCard'
import ActivityLogCard from '@/components/activity-log/ActivityLogCard'
import {
  ClipboardText,
  ArrowLeft,
  Funnel,
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

export default function ActivityLogPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [search, setSearch] = useState('')
  const [action, setAction] = useState<string>('all')
  const [date, setDate] = useState('')

  const { data: logs, isLoading } = useActivityLog(search, action, date)

  if (authLoading) {
    return <LoadingPage text="Memuat..." />
  }

  // Redirect if not admin
  if (user?.role !== 'admin') {
    router.push('/lainnya')
    return null
  }

  const actionFilters = [
    { label: 'Semua', value: 'all' },
    { label: 'Create', value: 'create' },
    { label: 'Update', value: 'update' },
    { label: 'Delete', value: 'delete' },
    { label: 'Login', value: 'login' },
  ]

  const handleClearFilters = () => {
    setSearch('')
    setAction('all')
    setDate('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-8">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-4 pt-8 pb-6 rounded-b-3xl shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4"
          >
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ArrowLeft weight="bold" className="w-6 h-6" />
            </button>
            <h1 className="text-white text-xl font-bold">Activity Log</h1>
            <Logo size="md" showText={false} />
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SearchInput
              placeholder="Cari aktivitas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
            />
          </motion.div>
        </div>

        {/* Filters */}
        <div className="px-4 -mt-3 mb-4 space-y-3">
          {/* Action Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-3">
              <Funnel weight="duotone" className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Filter</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-2 block">
                  Tipe Aksi
                </label>
                <div className="flex flex-wrap gap-2">
                  {actionFilters.map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setAction(filter.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        action === filter.value
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-2 block">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {(search || action !== 'all' || date) && (
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={handleClearFilters}
                >
                  Reset Filter
                </Button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="px-4 space-y-3">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Memuat log...</p>
            </div>
          ) : !logs || logs.length === 0 ? (
            <InfoCard variant="info" title="Belum Ada Log">
              <p className="text-sm">
                {search || action !== 'all' || date
                  ? 'Tidak ada log yang sesuai dengan filter'
                  : 'Belum ada aktivitas tercatat'}
              </p>
            </InfoCard>
          ) : (
            <>
              <div className="flex items-center justify-between px-1 mb-2">
                <p className="text-sm text-gray-600">
                  {logs.length} aktivitas
                </p>
              </div>

              <AnimatePresence mode="popLayout">
                {logs.map((log: any, index: number) => (
                  <ActivityLogCard key={log.id} log={log} delay={index * 0.02} />
                ))}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  )
}