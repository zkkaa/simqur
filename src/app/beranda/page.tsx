'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/hooks/use-auth'
import { useDashboard } from '@/lib/hooks/use-dashboard'
import { LoadingPage } from '@/components/common/LoadingSpinner'
import Logo from '@/components/common/Logo'
import InfoCard from '@/components/common/InfoCard'
import BottomNav from '@/components/layouts/BottomNav'
import StatCard from '@/components/beranda/StatCard'
import PendapatanChart from '@/components/beranda/PendapatanChart'
import RecentLunasCard from '@/components/beranda/RecentLunasCard'
import RecentTransactions from '@/components/beranda/RecentTransactions'
import {
  House,
  Users,
  Wallet,
  CheckCircle,
  UserGear,
} from '@phosphor-icons/react'
import { formatCurrency } from '@/lib/utils/format'

export default function BerandaPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [mounted, setMounted] = useState(false)

  const { data: dashboardData, isLoading, error } = useDashboard(
    selectedMonth,
    selectedYear
  )

  // ✅ DEBUG: Log state
  useEffect(() => {
    console.log('🏠 Beranda Page mounted')
    console.log('👤 User:', user)
    console.log('⏳ Auth Loading:', authLoading)
    console.log('📊 Dashboard Data:', dashboardData)
    console.log('❌ Error:', error)
    setMounted(true)
  }, [user, authLoading, dashboardData, error])

  // Show loading while checking auth
  if (authLoading || !mounted) {
    console.log('⏳ Showing loading page...')
    return <LoadingPage text="Memuat..." />
  }

  // Check if user is admin
  if (!user) {
    console.log('❌ No user, redirecting to login...')
    router.push('/login')
    return null
  }

  if (user.role !== 'admin') {
    console.log('❌ Not admin, redirecting to transaksi...')
    router.push('/transaksi')
    return null
  }

  console.log('✅ Rendering beranda content...')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-4 pt-8 pb-6 rounded-b-3xl shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <House weight="duotone" className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold">Beranda</h1>
                <p className="text-primary-100 text-sm">
                  Selamat datang {user?.namaLengkap || user?.name}
                </p>
              </div>
            </div>
            <Logo size="sm" showText={false} />
          </motion.div>
        </div>

        {/* Content */}
        <div className="px-4 -mt-4 space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-gray-600 mt-4">Memuat data...</p>
            </div>
          ) : error ? (
            <InfoCard variant="error" title="Error">
              <p className="text-sm">Gagal memuat data dashboard</p>
              <p className="text-xs mt-2">Error: {error.message || 'Unknown error'}</p>
            </InfoCard>
          ) : dashboardData ? (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  icon={<Users weight="duotone" className="w-6 h-6" />}
                  title="Total Penabung"
                  value={dashboardData.stats.totalPenabung}
                  subtitle="Penabung aktif"
                  color="primary"
                  delay={0.1}
                />
                <StatCard
                  icon={<Wallet weight="duotone" className="w-6 h-6" />}
                  title="Total Saldo"
                  value={formatCurrency(
                    parseFloat(dashboardData.stats.totalSaldo)
                  )}
                  subtitle="Dana terkumpul"
                  color="success"
                  delay={0.15}
                />
                <StatCard
                  icon={<CheckCircle weight="duotone" className="w-6 h-6" />}
                  title="Penabung Lunas"
                  value={dashboardData.stats.penabungLunas}
                  subtitle={`Target: ${formatCurrency(
                    dashboardData.stats.targetQurban
                  )}`}
                  color="warning"
                  delay={0.2}
                />
                <StatCard
                  icon={<UserGear weight="duotone" className="w-6 h-6" />}
                  title="Total Petugas"
                  value={dashboardData.stats.totalPetugas}
                  subtitle="Petugas terdaftar"
                  color="info"
                  delay={0.25}
                />
              </div>

              {/* Pendapatan Chart */}
              <PendapatanChart
                data={dashboardData.chartData}
                month={selectedMonth}
                year={selectedYear}
                onMonthChange={setSelectedMonth}
                onYearChange={setSelectedYear}
              />

              {/* Recent Lunas */}
              <RecentLunasCard data={dashboardData.recentLunas} />

              {/* Recent Transactions */}
              <RecentTransactions data={dashboardData.recentTransaksi} />
            </>
          ) : (
            <InfoCard variant="info" title="Info">
              <p className="text-sm">Tidak ada data untuk ditampilkan</p>
            </InfoCard>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}