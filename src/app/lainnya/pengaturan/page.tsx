'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { usePengaturan, useUpdateTarget, useBackupData } from '@/lib/hooks/use-pengaturan'
import { LoadingPage } from '@/components/common/LoadingSpinner'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Logo from '@/components/common/Logo'
import Toast from '@/components/common/Toast'
import InfoCard from '@/components/common/InfoCard'
import {
  Gear,
  ArrowLeft,
  CurrencyCircleDollar,
  DownloadSimple,
  CheckCircle,
  Database,
  Info,
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const targetSchema = z.object({
  targetQurban: z.number().min(1000, 'Target minimal Rp 1.000'),
})

type TargetFormData = z.infer<typeof targetSchema>

export default function PengaturanPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { data: pengaturan, isLoading } = usePengaturan()
  const updateTargetMutation = useUpdateTarget()
  const backupMutation = useBackupData()

  const [showTargetForm, setShowTargetForm] = useState(false)
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TargetFormData>({
    resolver: zodResolver(targetSchema),
    defaultValues: {
      targetQurban: pengaturan?.targetQurban || 3600000,
    },
  })

  if (authLoading || isLoading) {
    return <LoadingPage text="Memuat pengaturan..." />
  }

  if (user?.role !== 'admin') {
    router.push('/lainnya')
    return null
  }

  const handleUpdateTarget = async (data: TargetFormData) => {
    try {
      await updateTargetMutation.mutateAsync(data.targetQurban)
      setShowTargetForm(false)
      reset({ targetQurban: data.targetQurban })
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
                  onClick={() => setShowTargetForm(true)}
                >
                  Ubah Target
                </Button>
              </>
            ) : (
              <form onSubmit={handleSubmit(handleUpdateTarget)} className="space-y-4">
                <Input
                  {...register('targetQurban', { valueAsNumber: true })}
                  type="number"
                  label="Target Baru"
                  placeholder="3600000"
                  error={errors.targetQurban?.message}
                  leftIcon={
                    <CurrencyCircleDollar
                      weight="duotone"
                      className="w-5 h-5"
                    />
                  }
                  required
                />

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    fullWidth
                    onClick={() => {
                      setShowTargetForm(false)
                      reset({ targetQurban: pengaturan?.targetQurban || 3600000 })
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={updateTargetMutation.isPending}
                    leftIcon={<CheckCircle weight="bold" className="w-5 h-5" />}
                  >
                    Simpan
                  </Button>
                </div>
              </form>
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