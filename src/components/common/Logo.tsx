"use client"
import { cn } from '@/lib/utils/cn'
import { Cow } from '@phosphor-icons/react'
import { useState } from 'react'

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

export default function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const config = sizeConfig[size]
  const [imageError, setImageError] = useState(false)

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div
        className={cn(
          'bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg',
          config.container
        )}
      >
        {!imageError ? (
          <img 
            src="/logo.png" 
            alt="SIMQUR Logo" 
            width={config.iconSize} 
            height={config.iconSize}
            className="object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          // Fallback ke icon jika gambar gagal load
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