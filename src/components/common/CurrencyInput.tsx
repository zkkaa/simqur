import { forwardRef, ChangeEvent } from 'react'
import { cn } from '@/lib/utils/cn'
import { formatNumber, parseCurrency } from '@/lib/utils/format'

interface CurrencyInputProps {
  value: number
  onChange: (value: number) => void
  label?: string
  error?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      value,
      onChange,
      label,
      error,
      placeholder = '0',
      disabled,
      required,
      className,
    },
    ref
  ) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const numericValue = parseCurrency(rawValue)
      onChange(numericValue)
    }

    const displayValue = value > 0 ? formatNumber(value) : ''

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            Rp
          </span>
          <input
            ref={ref}
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'w-full pl-12 pr-4 py-3 rounded-xl border transition-colors duration-200 outline-none text-right font-semibold text-lg',
              'focus:ring-2 focus:ring-primary-100',
              error
                ? 'border-error focus:border-error focus:ring-error/10'
                : 'border-gray-300 focus:border-primary-500',
              disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
              className
            )}
          />
        </div>

        {error && (
          <p className="mt-1.5 text-sm text-error flex items-center gap-1">
            {error}
          </p>
        )}
      </div>
    )
  }
)

CurrencyInput.displayName = 'CurrencyInput'

export default CurrencyInput