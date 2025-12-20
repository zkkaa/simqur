'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  House,
  Users,
  CurrencyCircleDollar,
  UserCircle,
  ChartBar,
  DotsThreeOutline,
  UserGear,
} from '@phosphor-icons/react'
import { useIsAdmin } from '@/lib/hooks/use-auth'

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  { name: 'Beranda', href: '/beranda', icon: House, adminOnly: true },
  { name: 'Penabung', href: '/penabung', icon: Users },
  { name: 'Transaksi', href: '/transaksi', icon: CurrencyCircleDollar },
  { name: 'Petugas', href: '/petugas', icon: UserGear, adminOnly: true },
  { name: 'Laporan', href: '/laporan', icon: ChartBar },
  { name: 'Lainnya', href: '/lainnya', icon: DotsThreeOutline },
]

export default function BottomNav() {
  const pathname = usePathname()
  const isAdmin = useIsAdmin()

  // Filter nav items based on role
  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  )

  // Don't show on login page
  if (pathname === '/login') return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center justify-around py-2">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center min-w-[60px] py-2"
              >
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary-50 rounded-xl"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10"
                >
                  <Icon
                    weight={isActive ? 'fill' : 'regular'}
                    className={`w-6 h-6 ${
                      isActive ? 'text-primary-600' : 'text-gray-500'
                    }`}
                  />
                </motion.div>

                {/* Label */}
                <span
                  className={`relative z-10 text-xs mt-1 font-medium ${
                    isActive ? 'text-primary-600' : 'text-gray-500'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}