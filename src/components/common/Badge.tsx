import { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-primary-100 text-primary-800',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode
  className?: string
  icon?: ReactNode
}

export default function Badge({
  children,
  variant,
  size,
  className,
  icon,
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)}>
      {icon && icon}
      {children}
    </span>
  )
}