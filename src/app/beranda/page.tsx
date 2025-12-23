'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/hooks/use-auth'
import { useDashboard } from '@/lib/hooks/use-dashboard'
import { LoadingPage } from '@/components/common/LoadingSpinner'
import Button from '@/components/common/Button'
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
  CurrencyCircleDollar,
  FileText,
} from '@phosphor-icons/react'
import { formatCurrency } from '@/lib/utils/format'

export default function BerandaPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const { data: dashboardData, isLoading, error } = useDashboard(
    selectedMonth,
    selectedYear
  )

  if (authLoading) {
    return <LoadingPage text="Memuat..." />
  }

  if (user?.role !== 'admin') {
    router.push('/transaksi')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      <div className="max-w-sm mx-auto">
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
                  Selamat datang {user?.namaLengkap}
                </p>
              </div>
            </div>
            <Logo size="lg" showText={false} />
          </motion.div>
        </div>

        <div className="px-4 -mt-4 space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-gray-600 mt-4">Memuat data...</p>
            </div>
          ) : error ? (
            <InfoCard variant="error" title="Error">
              <p className="text-sm">Gagal memuat data dashboard</p>
            </InfoCard>
          ) : dashboardData ? (
            <>
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

              <PendapatanChart
                data={dashboardData.chartData}
                month={selectedMonth}
                year={selectedYear}
                onMonthChange={setSelectedMonth}
                onYearChange={setSelectedYear}
              />

              <RecentLunasCard data={dashboardData.recentLunas} />

              <RecentTransactions data={dashboardData.recentTransaksi} />
            </>
          ) : null}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}