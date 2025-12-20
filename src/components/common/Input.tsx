import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { WarningCircle } from '@phosphor-icons/react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  containerClassName?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      containerClassName,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-2.5 rounded-lg border transition-colors duration-200 outline-none',
              'focus:ring-2 focus:ring-primary-100',
              error
                ? 'border-error focus:border-error focus:ring-error/10'
                : 'border-gray-300 focus:border-primary-500',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
              className
            )}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />

          {rightIcon && !error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}

          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-error">
              <WarningCircle weight="fill" className="w-5 h-5" />
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${props.id}-error`}
            className="mt-1.5 text-sm text-error flex items-center gap-1"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input