'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LoadingPage } from '@/components/common/LoadingSpinner'
import Logo from '@/components/common/Logo'
import BottomNav from '@/components/layouts/BottomNav'
import {
  DotsThreeOutline,
  Gear,
  CurrencyCircleDollar,
  ClipboardText,
  User,
  SignOut,
  ShieldCheck,
  Calendar,
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import ConfirmDialog from '@/components/common/ConfirmDialog'

export default function LainnyaPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  if (isLoading) {
    return <LoadingPage text="Memuat..." />
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await signOut({ callbackUrl: '/login' })
  }

  const adminMenus = [
    {
      icon: <CurrencyCircleDollar weight="duotone" className="w-6 h-6" />,
      title: 'Proses Qurban',
      description: 'Kelola penarikan qurban',
      href: '/lainnya/proses-qurban',
      color: 'bg-green-500',
    },
    {
      icon: <Gear weight="duotone" className="w-6 h-6" />,
      title: 'Pengaturan',
      description: 'Konfigurasi sistem',
      href: '/lainnya/pengaturan',
      color: 'bg-blue-500',
    },
    {
      icon: <ClipboardText weight="duotone" className="w-6 h-6" />,
      title: 'Activity Log',
      description: 'Riwayat aktivitas sistem',
      href: '/lainnya/activity-log',
      color: 'bg-purple-500',
    },
  ]

  const commonMenus = [
    {
      icon: <User weight="duotone" className="w-6 h-6" />,
      title: 'Profil',
      description: 'Lihat & edit profil',
      href: '/lainnya/profil',
      color: 'bg-primary-500',
    },
  ]

  const menus = user?.role === 'admin' ? [...adminMenus, ...commonMenus] : commonMenus

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar dari aplikasi?"
        confirmText="Ya, Keluar"
        variant="warning"
        isLoading={isLoggingOut}
      />

      <div className="max-w-sm mx-auto">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-4 pt-8 pb-6 rounded-b-3xl shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <DotsThreeOutline
                  weight="duotone"
                  className="w-7 h-7 text-white"
                />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold">Lainnya</h1>
                <p className="text-primary-100 text-sm">
                  {user?.role === 'admin' ? 'Admin Panel' : 'Menu Tambahan'}
                </p>
              </div>
            </div>
            <Logo size="lg" showText={false} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <User weight="duotone" className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold truncate">
                  {user?.name}
                </h3>
                <p className="text-primary-100 text-sm">{user?.email}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <ShieldCheck weight="fill" className="w-4 h-4 text-warning" />
                  <span className="text-xs text-warning font-medium uppercase">
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="px-4 mt-6 space-y-3">
          {menus.map((menu, index) => (
            <motion.button
              key={menu.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => router.push(menu.href)}
              className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all active:scale-98"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${menu.color} rounded-xl flex items-center justify-center text-white`}>
                  {menu.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">{menu.title}</h3>
                  <p className="text-sm text-gray-600">{menu.description}</p>
                </div>
              </div>
            </motion.button>
          ))}

          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + menus.length * 0.05 }}
            onClick={() => setShowLogoutDialog(true)}
            className="w-full bg-white rounded-xl p-4 shadow-sm border-2 border-error/20 hover:border-error hover:shadow-md transition-all active:scale-98"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-error/10 rounded-xl flex items-center justify-center text-error">
                <SignOut weight="duotone" className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-error">Keluar</h3>
                <p className="text-sm text-gray-600">Logout dari aplikasi</p>
              </div>
            </div>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="px-4 mt-8 text-center text-xs text-gray-500"
        >
          <p>SIMQUR v1.0.0</p>
          <p className="mt-1">Desa Sambong Sawah</p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  )
}