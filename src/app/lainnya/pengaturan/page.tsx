'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '@/lib/hooks/use-auth'
import { usePengaturan, useUpdateTarget, useBackupData } from '@/lib/hooks/use-pengaturan'
import { LoadingPage } from '@/components/common/LoadingSpinner'
import Button from '@/components/common/Button'
import Logo from '@/components/common/Logo'
import Toast from '@/components/common/Toast'
import InfoCard from '@/components/common/InfoCard'
import NumericKeypad from '@/components/common/NumericKeypad'
import {
  ArrowLeft,
  CurrencyCircleDollar,
  DownloadSimple,
  CheckCircle,
  Database,
  Info,
} from '@phosphor-icons/react'
import { formatCurrency, formatDate } from '@/lib/utils/format'

export default function PengaturanPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { data: pengaturan, isLoading } = usePengaturan()
  const updateTargetMutation = useUpdateTarget()
  const backupMutation = useBackupData()

  const [showTargetForm, setShowTargetForm] = useState(false)
  const [targetValue, setTargetValue] = useState(0)
  const [showKeypad, setShowKeypad] = useState(false)
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

  if (authLoading || isLoading) {
    return <LoadingPage text="Memuat pengaturan..." />
  }

  if (user?.role !== 'admin') {
    router.push('/lainnya')
    return null
  }

  const handleKeyPress = (key: string) => {
    const currentStr = targetValue.toString()

    if (key === '000') {
      if (targetValue > 0) setTargetValue(targetValue * 1000)
    } else {
      const newValue = currentStr === '0' ? key : currentStr + key
      if (parseInt(newValue) <= 100000000) {
        setTargetValue(parseInt(newValue))
      }
    }
  }

  const handleDelete = () => {
    const str = targetValue.toString()
    if (str.length <= 1) {
      setTargetValue(0)
    } else {
      setTargetValue(parseInt(str.slice(0, -1)))
    }
  }

  const handleUpdateTarget = async () => {
    if (targetValue < 1000) {
      setToast({
        isOpen: true,
        title: 'Validasi Gagal',
        message: 'Target minimal Rp 1.000',
        variant: 'error',
      })
      return
    }

    try {
      await updateTargetMutation.mutateAsync(targetValue)
      setShowTargetForm(false)
      setShowKeypad(false)
      setToast({
        isOpen: true,
        title: 'Berhasil',
        message: 'Target qurban berhasil diperbarui',
        variant: 'success',
      })
    } catch (error: any) {
      setToast({
        isOpen: true,
        title: 'Gagal',
        message: error.message || 'Gagal memperbarui target',
        variant: 'error',
      })
    }
  }

  const handleBackup = async () => {
    try {
      await backupMutation.mutateAsync()
      setToast({
        isOpen: true,
        title: 'Berhasil',
        message: 'Backup data berhasil diunduh',
        variant: 'success',
      })
    } catch (error: any) {
      setToast({
        isOpen: true,
        title: 'Gagal',
        message: error.message || 'Gagal backup data',
        variant: 'error',
      })
    }
  }

  const handleShowForm = () => {
    setTargetValue(pengaturan?.targetQurban || 3600000)
    setShowTargetForm(true)
  }

  const handleCancelForm = () => {
    setShowTargetForm(false)
    setShowKeypad(false)
    setTargetValue(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-8">
      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        title={toast.title}
        message={toast.message}
        variant={toast.variant}
      />

      <div className="max-w-sm mx-auto">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-4 pt-8 pb-6 rounded-b-3xl shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4"
          >
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ArrowLeft weight="bold" className="w-6 h-6" />
            </button>
            <h1 className="text-white text-xl font-bold">Pengaturan</h1>
            <Logo size="md" showText={false} />
          </motion.div>
        </div>

        <div className="px-4 -mt-3 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                <CurrencyCircleDollar
                  weight="duotone"
                  className="w-7 h-7 text-primary-600"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Target Qurban</h3>
                <p className="text-xs text-gray-600">
                  Harga target per penabung
                </p>
              </div>
            </div>

            {!showTargetForm ? (
              <>
                <div className="bg-primary-50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-1">Target Saat Ini</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatCurrency(pengaturan?.targetQurban || 3600000)}
                  </p>
                  {pengaturan?.updatedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Terakhir diubah:{' '}
                      {formatDate(
                        new Date(pengaturan.updatedAt),
                        'dd MMM yyyy HH:mm'
                      )}
                    </p>
                  )}
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleShowForm}
                >
                  Ubah Target
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Target Baru <span className="text-error">*</span>
                  </label>
                  <div
                    onClick={() => setShowKeypad(true)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus-within:border-primary-500 bg-white cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Rp</span>
                      <span className="text-xl font-bold text-gray-900">
                        {targetValue.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {showKeypad && (
                    <motion.div
                      initial={{ y: 400 }}
                      animate={{ y: 0 }}
                      exit={{ y: 400 }}
                      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                      className="fixed bottom-0 left-0 right-0 z-[70] max-w-sm mx-auto"
                    >
                      <div className="bg-white p-3 flex justify-between items-center border-t border-gray-200 shadow-lg">
                        <button
                          onClick={() => setTargetValue(0)}
                          className="text-red-600 font-bold px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => setShowKeypad(false)}
                          className="text-primary-600 font-bold px-4 py-2 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          Selesai
                        </button>
                      </div>
                      <NumericKeypad
                        onPress={handleKeyPress}
                        onDelete={handleDelete}
                        onClear={() => setTargetValue(0)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    fullWidth
                    onClick={handleCancelForm}
                  >
                    Batal
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    fullWidth
                    onClick={handleUpdateTarget}
                    isLoading={updateTargetMutation.isPending}
                    disabled={targetValue < 1000}
                    leftIcon={<CheckCircle weight="bold" className="w-5 h-5" />}
                  >
                    Simpan
                  </Button>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Database weight="duotone" className="w-7 h-7 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Backup Data</h3>
                <p className="text-xs text-gray-600">
                  Export semua data ke Excel
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                Backup akan mengunduh semua data:
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Data penabung & saldo</li>
                <li>• Riwayat transaksi lengkap</li>
                <li>• Data petugas</li>
                <li>• Pengaturan sistem</li>
              </ul>
            </div>

            <Button
              variant="success"
              fullWidth
              onClick={handleBackup}
              isLoading={backupMutation.isPending}
              leftIcon={<DownloadSimple weight="bold" className="w-5 h-5" />}
            >
              {backupMutation.isPending ? 'Memproses...' : 'Backup Sekarang'}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Info weight="duotone" className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Info Sistem</h3>
                <p className="text-xs text-gray-600">Informasi aplikasi</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Versi</span>
                <span className="text-sm font-medium text-gray-900">v1.0.0</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Lokasi</span>
                <span className="text-sm font-medium text-gray-900">
                  Desa Sambong Sawah
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Database</span>
                <span className="text-sm font-medium text-success">
                  Connected
                </span>
              </div>
            </div>
          </motion.div>

          <InfoCard variant="info" title="💡 Tips">
            <ul className="text-sm space-y-1">
              <li>• Backup data secara berkala</li>
              <li>• Target qurban bisa diubah kapan saja</li>
              <li>• Perubahan target tidak mempengaruhi saldo</li>
            </ul>
          </InfoCard>
        </div>
      </div>
    </div>
  )
}