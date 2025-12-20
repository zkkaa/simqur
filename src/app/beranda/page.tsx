'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { LoadingPage } from '@/components/common/LoadingSpinner'
import Button from '@/components/common/Button'
import InfoCard from '@/components/common/InfoCard'
import Logo from '@/components/common/Logo'
import { SignOut, UserCircle, Envelope } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

export default function BerandaPage() {
  const { user, isLoading, signOut } = useAuth()

  if (isLoading) {
    return <LoadingPage text="Memuat dashboard..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <Logo size="sm" showText={false} />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Dashboard SIMQUR
                </h1>
                <p className="text-gray-600 text-sm md:text-base mt-1">
                  Selamat datang, {user?.name}!
                </p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="secondary"
                onClick={signOut}
                leftIcon={<SignOut weight="bold" className="w-5 h-5" />}
              >
                Keluar
              </Button>
            </motion.div>
          </div>

          {/* User Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <InfoCard variant="success" title="✅ Login Berhasil">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <UserCircle weight="duotone" className="w-5 h-5" />
                  <span className="font-medium">Role:</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    {user?.role === 'admin' ? 'Administrator' : 'Petugas'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Envelope weight="duotone" className="w-5 h-5" />
                  <span className="font-medium">Email:</span>
                  <span>{user?.email}</span>
                </div>
              </div>
            </InfoCard>
          </motion.div>

          {/* Development Notice */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <InfoCard variant="info" title="🚧 Dalam Pengembangan">
              <p className="text-sm">
                Dashboard lengkap dengan statistik, grafik, dan fitur manajemen akan segera ditambahkan.
              </p>
              <p className="text-sm mt-2">
                Untuk saat ini, Anda sudah berhasil login dan sistem authentication berjalan dengan baik.
              </p>
            </InfoCard>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-6 border-t border-gray-100 text-center text-xs text-gray-500"
          >
            SIMQUR v1.0.0 • Desa Sambong Sawah
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}