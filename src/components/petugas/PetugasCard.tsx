'use client'

import { motion } from 'framer-motion'
import {
  User,
  DotsThree,
  PencilSimple,
  LockKey,
  Power,
  Envelope,
  Phone,
  CurrencyCircleDollar,
  Receipt,
} from '@phosphor-icons/react'
import { formatCurrencyShort, formatRelativeDate } from '@/lib/utils/format'
import { useState } from 'react'
import type { PetugasWithStats } from '@/types/database'

interface PetugasCardProps {
  petugas: PetugasWithStats
  delay?: number
  onEdit: () => void
  onResetPassword: () => void
  onDeactivate: () => void
}

export default function PetugasCard({
  petugas,
  delay = 0,
  onEdit,
  onResetPassword,
  onDeactivate,
}: PetugasCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay }}
      className={`relative bg-white rounded-2xl p-4 shadow-md border transition-all ${
        petugas.isActive
          ? 'border-gray-200 hover:shadow-lg'
          : 'border-gray-300 bg-gray-50 opacity-75'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              petugas.isActive
                ? 'bg-primary-100'
                : 'bg-gray-200'
            }`}
          >
            <User
              weight="duotone"
              className={`w-6 h-6 ${
                petugas.isActive ? 'text-primary-600' : 'text-gray-500'
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">
              {petugas.namaLengkap}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  petugas.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {petugas.isActive ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
          </div>
        </div>

        {/* Menu Button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <DotsThree weight="bold" className="w-5 h-5 text-gray-600" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20"
              >
                <button
                  onClick={() => {
                    onEdit()
                    setShowMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <PencilSimple weight="duotone" className="w-4 h-4" />
                  Edit Data
                </button>
                <button
                  onClick={() => {
                    onResetPassword()
                    setShowMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <LockKey weight="duotone" className="w-4 h-4" />
                  Reset Password
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={() => {
                    onDeactivate()
                    setShowMenu(false)
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
                    petugas.isActive ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  <Power weight="duotone" className="w-4 h-4" />
                  {petugas.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Envelope weight="duotone" className="w-4 h-4" />
          <span className="truncate">{petugas.email}</span>
        </div>
        {petugas.noTelp && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone weight="duotone" className="w-4 h-4" />
            <span>{petugas.noTelp}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
        <div className="bg-primary-50 rounded-lg p-2">
          <div className="flex items-center gap-1 text-xs text-primary-600 mb-1">
            <Receipt weight="duotone" className="w-3.5 h-3.5" />
            <span>Transaksi</span>
          </div>
          <p className="text-lg font-bold text-primary-700">
            {petugas.totalTransaksi || 0}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-2">
          <div className="flex items-center gap-1 text-xs text-green-600 mb-1">
            <CurrencyCircleDollar weight="duotone" className="w-3.5 h-3.5" />
            <span>Total</span>
          </div>
          <p className="text-sm font-bold text-green-700">
            {formatCurrencyShort(parseFloat(petugas.totalNominal || '0'))}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Terdaftar {formatRelativeDate(petugas.createdAt)}
        </p>
      </div>
    </motion.div>
  )
}