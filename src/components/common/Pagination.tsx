import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { cn } from '@/lib/utils/cn'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
  itemsPerPage?: number
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  itemsPerPage = 5,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const canGoPrev = currentPage > 1
  const canGoNext = currentPage < totalPages

  return (
    <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm border border-gray-200">
      <div className="text-sm text-gray-600">
        Menampilkan <span className="font-semibold text-gray-900">{startItem}-{endItem}</span> dari{' '}
        <span className="font-semibold text-gray-900">{totalItems}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrev}
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
            canGoPrev
              ? 'bg-primary-50 text-primary-600 hover:bg-primary-100'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          )}
        >
          <CaretLeft weight="bold" className="w-5 h-5" />
        </button>

        <div className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-semibold min-w-[4rem] text-center">
          {currentPage} / {totalPages}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
            canGoNext
              ? 'bg-primary-50 text-primary-600 hover:bg-primary-100'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          )}
        >
          <CaretRight weight="bold" className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}