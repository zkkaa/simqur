'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { LoadingPage } from '@/components/common/LoadingSpinner'
import InfoCard from '@/components/common/InfoCard'
import PageHeader from '@/components/common/PageHeader'
import Logo from '@/components/common/Logo'
import { CurrencyCircleDollar, UserCircle, Envelope } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

export default function TransaksiPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingPage text="Memuat..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {/* Mobile-First Container: max-w-sm */}
      <div className="max-w-sm mx-auto space-y-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center pt-4"
        >
          <Logo size="md" />
        </motion.div>

        {/* Page Header */}
        <PageHeader
          title="Transaksi"
          subtitle={`Selamat datang, ${user?.name}!`}
          icon={<CurrencyCircleDollar weight="duotone" className="w-7 h-7 text-primary-600" />}
        />

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
                <span className="truncate">{user?.email}</span>
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
              Fitur input transaksi/setoran dengan autocomplete search penabung akan segera ditambahkan.
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
          className="pt-6 text-center text-xs text-gray-500"
        >
          <p>SIMQUR v1.0.0</p>
          <p className="mt-1">Desa Sambong Sawah</p>
        </motion.div>
      </div>
    </div>
  )
}