'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { LoadingPage } from '@/components/common/LoadingSpinner'
import StatsCard from '@/components/common/StatsCard'
import InfoCard from '@/components/common/InfoCard'
import Logo from '@/components/common/Logo'
import BottomNav from '@/components/layouts/BottomNav'
import {
  Users,
  CurrencyCircleDollar,
  CheckCircle,
  TrendUp,
  CalendarBlank,
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { formatCurrency, formatDate } from '@/lib/utils/format'

export default function BerandaPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingPage text="Memuat dashboard..." />
  }

  // TODO: Fetch real data from API
  const stats = {
    totalPenabung: 150,
    totalSaldo: 540000000,
    penabungLunas: 45,
    transaksiHariIni: 12,
  }

  const today = new Date()

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
            className="flex items-center justify-between mb-6"
          >
            <div>
              <p className="text-primary-100 text-sm font-medium">
                Selamat datang,
              </p>
              <h1 className="text-white text-2xl font-bold mt-1">
                {user?.name}
              </h1>
            </div>
            <Logo size="sm" showText={false} />
          </motion.div>

          {/* Date & Time */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-white/90 text-sm"
          >
            <CalendarBlank weight="duotone" className="w-5 h-5" />
            <span>{formatDate(today, 'EEEE, dd MMMM yyyy')}</span>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="px-4 -mt-6 space-y-3">
          <StatsCard
            title="Total Penabung"
            value={stats.totalPenabung}
            subtitle="Penabung aktif"
            icon={<Users weight="duotone" className="w-7 h-7" />}
            color="primary"
            trend={{ value: 5, isPositive: true }}
            delay={0.1}
          />

          <StatsCard
            title="Total Saldo"
            value={formatCurrency(stats.totalSaldo)}
            subtitle="Saldo terkumpul"
            icon={<CurrencyCircleDollar weight="duotone" className="w-7 h-7" />}
            color="success"
            trend={{ value: 12, isPositive: true }}
            delay={0.2}
          />

          <StatsCard
            title="Penabung Lunas"
            value={stats.penabungLunas}
            subtitle={`${Math.round(
              (stats.penabungLunas / stats.totalPenabung) * 100
            )}% dari total`}
            icon={<CheckCircle weight="duotone" className="w-7 h-7" />}
            color="secondary"
            delay={0.3}
          />

          <StatsCard
            title="Transaksi Hari Ini"
            value={stats.transaksiHariIni}
            subtitle="Setoran masuk"
            icon={<TrendUp weight="duotone" className="w-7 h-7" />}
            color="warning"
            delay={0.4}
          />
        </div>

        {/* Info Section */}
        <div className="px-4 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <InfoCard variant="info" title="💡 Tips">
              <p className="text-sm">
                Pastikan untuk selalu konfirmasi nominal setoran sebelum
                menyimpan transaksi.
              </p>
            </InfoCard>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="px-4 mt-8 mb-4 text-center text-xs text-gray-500"
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