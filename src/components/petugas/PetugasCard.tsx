import { motion } from 'framer-motion'
import {
  UserGear,
  DotsThreeVertical,
  CheckCircle,
  XCircle,
  Envelope,
  Phone,
  ChartBar,
} from '@phosphor-icons/react'
import { formatCurrency, formatRelativeDate } from '@/lib/utils/format'
import Badge from '@/components/common/Badge'

interface PetugasCardProps {
  petugas: {
    id: string
    namaLengkap: string
    email: string
    noTelp: string | null
    isActive: boolean
    createdAt: Date
    totalTransaksi: number
    totalNominal: string
  }
  onEdit: () => void
  onResetPassword: () => void
  onDeactivate: () => void
  delay?: number
}

export default function PetugasCard({
  petugas,
  onEdit,
  onResetPassword,
  onDeactivate,
  delay = 0,
}: PetugasCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <UserGear weight="duotone" className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {petugas.namaLengkap}
            </h3>
            <Badge
              variant={petugas.isActive ? 'success' : 'error'}
              size="sm"
              className="mt-1"
            >
              {petugas.isActive ? (
                <>
                  <CheckCircle weight="fill" className="w-3 h-3" />
                  Aktif
                </>
              ) : (
                <>
                  <XCircle weight="fill" className="w-3 h-3" />
                  Nonaktif
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* Action Menu */}
        <div className="relative group">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <DotsThreeVertical weight="bold" className="w-5 h-5 text-gray-600" />
          </button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            <button
              onClick={onEdit}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Edit Data
            </button>
            <button
              onClick={onResetPassword}
              className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Reset Password
            </button>
            <button
              onClick={onDeactivate}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                petugas.isActive
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-green-600 hover:bg-green-50'
              }`}
            >
              {petugas.isActive ? 'Nonaktifkan' : 'Aktifkan'}
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Envelope weight="duotone" className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{petugas.email}</span>
        </div>
        {petugas.noTelp && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone weight="duotone" className="w-4 h-4 flex-shrink-0" />
            <span>{petugas.noTelp}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <ChartBar weight="duotone" className="w-4 h-4 text-primary-600" />
            <p className="text-xs text-gray-500">Transaksi</p>
          </div>
          <p className="text-lg font-bold text-gray-900">{petugas.totalTransaksi}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Total Nominal</p>
          <p className="text-sm font-bold text-primary-600">
            {formatCurrency(parseFloat(petugas.totalNominal))}
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 text-center mt-3">
        Bergabung {formatRelativeDate(petugas.createdAt)}
      </p>
    </motion.div>
  )
}