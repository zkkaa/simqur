'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
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
  const iconsRef = useRef<(HTMLDivElement | null)[]>([])
  const labelsRef = useRef<(HTMLSpanElement | null)[]>([])

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  )

  useEffect(() => {
    visibleItems.forEach((item, index) => {
      const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
      const icon = iconsRef.current[index]
      const label = labelsRef.current[index]

      if (isActive && icon && label) {
        gsap.fromTo(
          icon,
          { 
            scale: 0.8, 
            rotationY: -180,
            opacity: 0 
          },
          {
            scale: 1.1,
            rotationY: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'back.out(2)',
          }
        )

        gsap.fromTo(
          label,
          { 
            y: 10, 
            opacity: 0 
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            delay: 0.2,
            ease: 'power2.out',
          }
        )
      }
    })
  }, [pathname, visibleItems])

  if (pathname === '/login') return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center justify-around py-2">
          {visibleItems.map((item, index) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center min-w-[60px] py-2"
              >
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary-50 rounded-xl"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                      }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 400, 
                        damping: 25,
                        mass: 0.5
                      }}
                    />
                  )}
                </AnimatePresence>

                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-primary-200 rounded-xl"
                    initial={{ scale: 0.8, opacity: 0.6 }}
                    animate={{ 
                      scale: [1, 1.3, 1.5],
                      opacity: [0.6, 0.3, 0]
                    }}
                    transition={{ 
                      duration: 0.8,
                      ease: 'easeOut'
                    }}
                  />
                )}

                <div
                  ref={(el) => { iconsRef.current[index] = el }}
                  className="relative z-10"
                >
                  <motion.div
                    animate={{
                      y: isActive ? [0, -4, 0] : 0,
                    }}
                    transition={{ 
                      duration: 0.5,
                      ease: 'easeInOut'
                    }}
                  >
                    <Icon
                      weight={isActive ? 'fill' : 'regular'}
                      className={`w-6 h-6 transition-colors duration-300 ${
                        isActive ? 'text-primary-600' : 'text-gray-500'
                      }`}
                    />
                    
                    {isActive && (
                      <>
                        <motion.div
                          className="absolute -top-1 -right-1 w-2 h-2 bg-primary-400 rounded-full"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ 
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0]
                          }}
                          transition={{ 
                            duration: 0.6,
                            delay: 0.3,
                            ease: 'easeOut'
                          }}
                        />
                        <motion.div
                          className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-primary-400 rounded-full"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ 
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0]
                          }}
                          transition={{ 
                            duration: 0.6,
                            delay: 0.4,
                            ease: 'easeOut'
                          }}
                        />
                      </>
                    )}
                  </motion.div>
                </div>

                <motion.span
                  ref={(el) => { labelsRef.current[index] = el }}
                  className={`relative z-10 text-xs mt-1 font-medium transition-colors duration-300 ${
                    isActive ? 'text-primary-600' : 'text-gray-500'
                  }`}
                  animate={{
                    scale: isActive ? 1.05 : 1,
                  }}
                  transition={{ 
                    duration: 0.3,
                    ease: 'easeOut'
                  }}
                >
                  {item.name}
                </motion.span>

                {isActive && (
                  <motion.div
                    className="absolute -bottom-2 left-1/2 w-8 h-1 bg-primary-600 rounded-full"
                    layoutId="bottomIndicator"
                    initial={{ scaleX: 0, x: '-50%' }}
                    animate={{ scaleX: 1, x: '-50%' }}
                    exit={{ scaleX: 0, x: '-50%' }}
                    transition={{ 
                      type: 'spring',
                      stiffness: 400,
                      damping: 30
                    }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}