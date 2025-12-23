import { CircleNotch } from '@phosphor-icons/react'
import { cn } from '@/lib/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  fullScreen?: boolean
  text?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
}

export default function LoadingSpinner({
  size = 'md',
  className,
  fullScreen = false,
  text,
}: LoadingSpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <CircleNotch
        weight="bold"
        className={cn(
          'animate-spin text-primary-600',
          sizeClasses[size],
          className
        )}
      />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}

export function LoadingCard({ text = 'Memuat data...' }: { text?: string }) {
  return (
    <div className="bg-white rounded-xl shadow-card border border-gray-100 p-12">
      <LoadingSpinner size="lg" text={text} />
    </div>
  )
}

export function LoadingPage({ text = 'Memuat...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="xl" text={text} />
    </div>
  )
}