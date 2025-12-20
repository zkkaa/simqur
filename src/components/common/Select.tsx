import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { ChevronDown, AlertCircle } from 'lucide-react'

export interface SelectOption {
  label: string
  value: string | number
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
  containerClassName?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      placeholder,
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
          <select
            ref={ref}
            className={cn(
              'w-full px-4 py-2.5 pr-10 rounded-lg border transition-colors duration-200 outline-none appearance-none bg-white',
              'focus:ring-2 focus:ring-primary-100',
              error
                ? 'border-error focus:border-error focus:ring-error/10'
                : 'border-gray-300 focus:border-primary-500',
              disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
              className
            )}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {error ? (
              <AlertCircle className="w-5 h-5 text-error" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
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

Select.displayName = 'Select'

export default Select