"use client"
import { cn } from '@/lib/utils/cn'
import { Cow } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

const sizeConfig = {
  sm: {
    container: 'w-10 h-10',
    iconClass: 'w-6 h-6',
    iconSize: 24,
    text: 'text-base',
  },
  md: {
    container: 'w-16 h-16',
    iconClass: 'w-10 h-10',
    iconSize: 40,
    text: 'text-2xl',
  },
  lg: {
    container: 'w-20 h-20',
    iconClass: 'w-12 h-12',
    iconSize: 48,
    text: 'text-3xl',
  },
}

export default function Logo({ size = 'lg', showText = true, className }: LogoProps) {
  const config = sizeConfig[size]
  const [imageError, setImageError] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // ✅ FIX: Pastikan hanya render di client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // ✅ FIX: Coba beberapa path alternatif
  const logoPath = '/logooo.png'

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div
        className={cn(
          'bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg',
          config.container
        )}
      >
        {!imageError && isClient ? (
          <Image 
            src={logoPath}
            alt="SIMQUR Logo" 
            width={config.iconSize} 
            height={config.iconSize}
            className="object-contain"
            onError={() => {
              console.error('Logo image failed to load:', logoPath)
              setImageError(true)
            }}
            priority
            unoptimized
          />
        ) : (
          // Fallback ke icon jika gambar gagal load atau masih server-side
          <Cow weight="fill" className={cn('text-white', config.iconClass)} />
        )}
      </div>
      {showText && (
        <div className="text-center">
          <h1 className={cn('font-bold text-gray-900', config.text)}>SIMQUR</h1>
          <p className="text-xs text-gray-600 font-medium">Sambong Sawah</p>
        </div>
      )}
    </div>
  )
}