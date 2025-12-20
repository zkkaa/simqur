import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlass, User, CheckCircle, XCircle } from '@phosphor-icons/react'
import { usePenabung } from '@/lib/hooks/use-penabung'
import { formatCurrency } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import type { Penabung } from '@/types/database'

interface PenabungAutocompleteProps {
  value: Penabung | null
  onChange: (penabung: Penabung | null) => void
  error?: string
  disabled?: boolean
}

export default function PenabungAutocomplete({
  value,
  onChange,
  error,
  disabled,
}: PenabungAutocompleteProps) {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: penabungList, isLoading } = usePenabung(search, 'all')

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (penabung: Penabung) => {
    onChange(penabung)
    setSearch('')
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange(null)
    setSearch('')
    inputRef.current?.focus()
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Pilih Penabung <span className="text-error">*</span>
      </label>

      {/* Selected Penabung */}
      {value ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-primary-50 border-2 border-primary-500 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <User weight="duotone" className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900">{value.nama}</h4>
                <p className="text-sm text-gray-600">
                  Saldo: {formatCurrency(parseFloat(value.totalSaldo))}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {value.statusLunas ? (
                    <>
                      <CheckCircle
                        weight="fill"
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-xs text-green-600 font-medium">
                        Lunas
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle weight="fill" className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600">Belum Lunas</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="px-3 py-1.5 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Ganti
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="relative">
          {/* Search Input */}
          <div className="relative">
            <MagnifyingGlass
              weight="bold"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setIsOpen(true)
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Cari nama penabung..."
              disabled={disabled}
              className={cn(
                'w-full pl-10 pr-4 py-3 rounded-xl border transition-colors duration-200 outline-none',
                'focus:ring-2 focus:ring-primary-100',
                error
                  ? 'border-error focus:border-error focus:ring-error/10'
                  : 'border-gray-300 focus:border-primary-500',
                disabled && 'bg-gray-50 cursor-not-allowed opacity-60'
              )}
            />
          </div>

          {/* Dropdown */}
          <AnimatePresence>
            {isOpen && !disabled && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-64 overflow-y-auto"
              >
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    Memuat...
                  </div>
                ) : !penabungList || penabungList.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    Tidak ada penabung ditemukan
                  </div>
                ) : (
                  penabungList.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className="w-full p-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <User
                            weight="duotone"
                            className="w-5 h-5 text-primary-600"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {item.nama}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(parseFloat(item.totalSaldo))}
                          </p>
                        </div>
                        {item.statusLunas && (
                          <CheckCircle
                            weight="fill"
                            className="w-5 h-5 text-green-600 flex-shrink-0"
                          />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-error flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  )
}