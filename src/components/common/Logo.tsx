import { Cow } from '@phosphor-icons/react'
import { cn } from '@/lib/utils/cn'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

const sizeConfig = {
  sm: {
    container: 'w-10 h-10',
    icon: 'w-6 h-6',
    text: 'text-base',
  },
  md: {
    container: 'w-16 h-16',
    icon: 'w-10 h-10',
    text: 'text-2xl',
  },
  lg: {
    container: 'w-20 h-20',
    icon: 'w-12 h-12',
    text: 'text-3xl',
  },
}

export default function Logo({ size = 'md', showText = true, className }: LogoProps) {
  const config = sizeConfig[size]

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div
        className={cn(
          'bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg',
          config.container
        )}
      >
        <Cow weight="fill" className={cn('text-white', config.icon)} />
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