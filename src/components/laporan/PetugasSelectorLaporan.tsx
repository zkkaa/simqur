'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlass, UserGear, X, CheckCircle } from '@phosphor-icons/react'
import { usePetugas } from '@/lib/hooks/use-petugas'
import { formatCurrencyShort } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

interface PetugasSelectorLaporanProps {
  value: string
  onChange: (id: string) => void
  error?: string
  disabled?: boolean
}

export default function PetugasSelectorLaporan({
  value,
  onChange,
  error,
  disabled,
}: PetugasSelectorLaporanProps) {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: petugasList, isLoading } = usePetugas()

  // Filter petugas berdasarkan search
  const filteredPetugas = petugasList?.filter((p) =>
    p.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  )

  // Get selected petugas
  const selectedPetugas = petugasList?.find((p) => p.id === value)

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

  const handleSelect = (id: string) => {
    onChange(id)
    setSearch('')
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange('')
    setSearch('')
    inputRef.current?.focus()
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Pilih Petugas <span className="text-error">*</span>
      </label>

      {/* Selected Petugas */}
      {selectedPetugas ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-50 border-2 border-blue-500 rounded-xl p-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <UserGear weight="duotone" className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">
                  {selectedPetugas.namaLengkap}
                </h4>
                <p className="text-xs text-gray-600 truncate">
                  {selectedPetugas.email}
                </p>
                {selectedPetugas.totalTransaksi !== undefined && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-600">
                      {selectedPetugas.totalTransaksi} transaksi
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-green-600 font-medium">
                      {formatCurrencyShort(
                        parseFloat(selectedPetugas.totalNominal || '0')
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="ml-2 w-8 h-8 rounded-lg bg-white hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-50"
              title="Hapus pilihan"
            >
              <X weight="bold" className="w-4 h-4 text-gray-600" />
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
              placeholder="Cari nama atau email petugas..."
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
                ) : !filteredPetugas || filteredPetugas.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    {search
                      ? 'Tidak ada petugas ditemukan'
                      : 'Belum ada petugas terdaftar'}
                  </div>
                ) : (
                  filteredPetugas.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item.id)}
                      className="w-full p-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <UserGear
                            weight="duotone"
                            className="w-5 h-5 text-blue-600"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {item.namaLengkap}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {item.email}
                          </p>
                          {item.totalTransaksi !== undefined && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-600">
                                {item.totalTransaksi} transaksi
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-green-600">
                                {formatCurrencyShort(
                                  parseFloat(item.totalNominal || '0')
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                        {item.isActive && (
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