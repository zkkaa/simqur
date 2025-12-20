'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/hooks/use-auth'
import { useTransaksi, useCreateTransaksi } from '@/lib/hooks/use-transaksi'
import { LoadingPage } from '@/components/common/LoadingSpinner'
import Button from '@/components/common/Button'
import CurrencyInput from '@/components/common/CurrencyInput'
import Toast from '@/components/common/Toast'
import Logo from '@/components/common/Logo'
import BottomNav from '@/components/layouts/BottomNav'
import PenabungAutocomplete from '@/components/transaksi/PenabungAutocomplete'
import NumericKeypad from '@/components/common/NumericKeypad'
import TransaksiConfirmModal from '@/components/transaksi/TransaksiConfirmModal'
import {
  CurrencyCircleDollar,
  Money,
  CreditCard,
  CalendarBlank,
  Clock,
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { formatCurrency, formatDate, formatRelativeDate } from '@/lib/utils/format'
import type { Penabung } from '@/types/database'

export default function TransaksiPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [selectedPenabung, setSelectedPenabung] = useState<Penabung | null>(null)
  const [nominal, setNominal] = useState(0)
  const [metodeBayar, setMetodeBayar] = useState<'tunai' | 'transfer'>('tunai')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isKeypadOpen, setIsKeypadOpen] = useState(false)
  const [toast, setToast] = useState<{
    isOpen: boolean
    title: string
    message?: string
    variant: 'success' | 'error'
  }>({
    isOpen: false,
    title: '',
    variant: 'success',
  })

  const today = new Date().toISOString().split('T')[0]
  const { data: transaksiList } = useTransaksi(today)
  const createMutation = useCreateTransaksi()

  if (authLoading) {
    return <LoadingPage text="Memuat..." />
  }

  const quickAmounts = [10000, 20000, 50000, 100000]

  const handleSubmit = () => {
    // Validation
    if (!selectedPenabung) {
      setToast({
        isOpen: true,
        title: 'Validasi Gagal',
        message: 'Pilih penabung terlebih dahulu',
        variant: 'error',
      })
      return
    }

    if (nominal <= 0) {
      setToast({
        isOpen: true,
        title: 'Validasi Gagal',
        message: 'Nominal harus lebih dari 0',
        variant: 'error',
      })
      return
    }

    setShowConfirmModal(true)
  }

  const handleKeyPress = (key: string) => {
    const currentNominalStr = nominal.toString()

    if (key === '000') {
      // Jika klik 000, kali 1000
      if (nominal > 0) setNominal(nominal * 1000)
    } else {
      // Gabungkan angka (seperti mengetik biasa)
      const newValue = currentNominalStr === '0' ? key : currentNominalStr + key
      // Pastikan tidak melebihi limit saldo (misal 100 juta)
      if (parseInt(newValue) <= 100000000) {
        setNominal(parseInt(newValue))
      }
    }
  }

  const handleDelete = () => {
    const str = nominal.toString()
    if (str.length <= 1) {
      setNominal(0)
    } else {
      setNominal(parseInt(str.slice(0, -1)))
    }
  }

  const handleConfirm = async () => {
    if (!selectedPenabung) return

    try {
      await createMutation.mutateAsync({
        penabungId: selectedPenabung.id,
        nominal,
        metodeBayar,
      })

      setShowConfirmModal(false)
      setToast({
        isOpen: true,
        title: 'Berhasil',
        message: 'Transaksi berhasil disimpan',
        variant: 'success',
      })

      // Reset form
      setSelectedPenabung(null)
      setNominal(0)
      setMetodeBayar('tunai')
    } catch (error: any) {
      setToast({
        isOpen: true,
        title: 'Gagal',
        message: error.message || 'Gagal menyimpan transaksi',
        variant: 'error',
      })
    }
  }

  const saldoLama = selectedPenabung ? parseFloat(selectedPenabung.totalSaldo) : 0
  const saldoBaru = saldoLama + nominal

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        title={toast.title}
        message={toast.message}
        variant={toast.variant}
      />

      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-4 pt-8 pb-6 rounded-b-3xl shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <CurrencyCircleDollar
                  weight="duotone"
                  className="w-7 h-7 text-white"
                />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold">Transaksi</h1>
                <p className="text-primary-100 text-sm">Input setoran</p>
              </div>
            </div>
            <Logo size="sm" showText={false} />
          </motion.div>

          {/* Today's Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <CalendarBlank weight="duotone" className="w-5 h-5" />
              <span>{formatDate(new Date(), 'dd MMM yyyy')}</span>
            </div>
            <div className="text-white text-sm font-semibold">
              {transaksiList?.length || 0} transaksi
            </div>
          </motion.div>
        </div>

        {/* Form */}
        <div className="px-4 -mt-4 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-lg space-y-4"
          >
            {/* Penabung Autocomplete */}
            <PenabungAutocomplete
              value={selectedPenabung}
              onChange={setSelectedPenabung}
            />

            {/* Nominal Input */}
            <div onClick={() => setIsKeypadOpen(true)}>
              <CurrencyInput
                label="Nominal Setoran"
                value={nominal}
                onChange={setNominal}
                readOnly // Penting: Agar keyboard bawaan HP tidak muncul
                required
              />
            </div>

            <AnimatePresence>
              {isKeypadOpen && (
                <motion.div
                  initial={{ y: 300 }}
                  animate={{ y: 0 }}
                  exit={{ y: 300 }}
                  className="fixed bottom-0 left-0 right-0 z-[60] max-w-sm mx-auto"
                >
                  <div className="bg-white p-2 flex justify-end border-t border-gray-100">
                    <button
                      onClick={() => setIsKeypadOpen(false)}
                      className="text-primary-600 font-bold p-2"
                    >
                      Selesai
                    </button>
                  </div>
                  <NumericKeypad
                    onPress={handleKeyPress}
                    onDelete={handleDelete}
                    onClear={() => setNominal(0)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Amount Buttons */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Nominal Cepat:</p>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setNominal(amount)}
                    className="py-2 px-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    {amount >= 1000 ? `${amount / 1000}rb` : amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Metode Bayar */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Metode Bayar <span className="text-error">*</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMetodeBayar('tunai')}
                  className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${metodeBayar === 'tunai'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <Money weight="duotone" className="w-6 h-6" />
                  <span className="font-semibold">Tunai</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMetodeBayar('transfer')}
                  className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${metodeBayar === 'transfer'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <CreditCard weight="duotone" className="w-6 h-6" />
                  <span className="font-semibold">Transfer</span>
                </button>
              </div>
            </div>

            {/* Preview Saldo */}
            {selectedPenabung && nominal > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4"
              >
                <p className="text-sm text-blue-800 font-medium mb-2">
                  Preview Saldo:
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-blue-600">Saldo Lama</p>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(saldoLama)}
                    </p>
                  </div>
                  <div className="text-blue-600 text-xl">→</div>
                  <div>
                    <p className="text-blue-600">Saldo Baru</p>
                    <p className="font-semibold text-primary-600">
                      {formatCurrency(saldoBaru)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={handleSubmit}
              disabled={!selectedPenabung || nominal <= 0}
            >
              Simpan Transaksi
            </Button>
          </motion.div>

          {/* Today's Transactions */}
          {transaksiList && transaksiList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <h3 className="text-sm font-semibold text-gray-700 px-1">
                Transaksi Hari Ini ({transaksiList.length})
              </h3>
              {transaksiList.slice(0, 5).map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">
                      {item.penabung.nama}
                    </p>
                    <p className="font-bold text-primary-600">
                      {formatCurrency(parseFloat(item.nominal))}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock weight="duotone" className="w-4 h-4" />
                      {new Date(item.createdAt).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded-full">
                      {item.metodeBayar === 'tunai' ? 'Tunai' : 'Transfer'}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedPenabung && (
        <TransaksiConfirmModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfirm}
          penabungName={selectedPenabung.nama}
          nominal={nominal}
          metodeBayar={metodeBayar}
          saldoLama={saldoLama}
          saldoBaru={saldoBaru}
          isLoading={createMutation.isPending}
        />
      )}

      <BottomNav />
    </div>
  )
}