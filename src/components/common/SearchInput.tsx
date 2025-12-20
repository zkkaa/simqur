import { InputHTMLAttributes, forwardRef } from 'react'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils/cn'

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void
  containerClassName?: string
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, containerClassName, ...props }, ref) => {
    return (
      <div className={cn('relative', containerClassName)}>
        <MagnifyingGlass
          weight="bold"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        />
        <input
          ref={ref}
          type="search"
          className={cn(
            'w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-100',
            'transition-colors duration-200 outline-none',
            'placeholder:text-gray-400',
            className
          )}
          {...props}
        />
        {props.value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X weight="bold" className="w-5 h-5" />
          </button>
        )}
      </div>
    )
  }
)

SearchInput.displayName = 'SearchInput'

export default SearchInput