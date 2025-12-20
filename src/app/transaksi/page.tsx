'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { LoadingPage } from '@/components/common/LoadingSpinner'
import InfoCard from '@/components/common/InfoCard'
import Logo from '@/components/common/Logo'
import BottomNav from '@/components/layouts/BottomNav'
import { CurrencyCircleDollar } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

export default function TransaksiPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingPage text="Memuat..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      {/* Mobile-First Container */}
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-4 pt-8 pb-6 rounded-b-3xl shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <CurrencyCircleDollar
                  weight="duotone"
                  className="w-7 h-7 text-white"
                />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold">Transaksi</h1>
                <p className="text-primary-100 text-sm">Input setoran</p>
              </div>
            </div>
            <Logo size="sm" showText={false} />
          </motion.div>
        </div>

        {/* Content */}
        <div className="px-4 mt-6 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <InfoCard variant="info" title="🚧 Dalam Pengembangan">
              <p className="text-sm">
                Fitur input transaksi/setoran dengan autocomplete search
                penabung akan segera ditambahkan.
              </p>
            </InfoCard>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="px-4 mt-8 text-center text-xs text-gray-500"
        >
          <p>SIMQUR v1.0.0</p>
          <p className="mt-1">Desa Sambong Sawah</p>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}