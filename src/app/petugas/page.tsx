'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import {
  usePetugas,
  useCreatePetugas,
  useUpdatePetugas,
  useDeactivatePetugas,
  useResetPassword,
} from '@/lib/hooks/use-petugas'
import { LoadingPage } from '@/components/common/LoadingSpinner'
import Button from '@/components/common/Button'
import InfoCard from '@/components/common/InfoCard'
import Logo from '@/components/common/Logo'
import Toast from '@/components/common/Toast'
import BottomNav from '@/components/layouts/BottomNav'
import PetugasCard from '@/components/petugas/PetugasCard'
import PetugasFormModal from '@/components/petugas/PetugasFormModal'
import ResetPasswordModal from '@/components/petugas/ResetPasswordModal'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { UserGear, Plus, UserCirclePlus } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PetugasPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [formModal, setFormModal] = useState<{
    isOpen: boolean
    mode: 'create' | 'edit'
    data?: any
  }>({
    isOpen: false,
    mode: 'create',
  })
  const [resetPasswordModal, setResetPasswordModal] = useState<{
    isOpen: boolean
    data?: any
  }>({
    isOpen: false,
  })
  const [deactivateModal, setDeactivateModal] = useState<{
    isOpen: boolean
    data?: any
  }>({
    isOpen: false,
  })
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

  const { data: petugasList, isLoading, error } = usePetugas()
  const createMutation = useCreatePetugas()
  const updateMutation = useUpdatePetugas()
  const deactivateMutation = useDeactivatePetugas()
  const resetPasswordMutation = useResetPassword()

  if (authLoading) {
    return <LoadingPage text="Memuat..." />
  }

  // Redirect if not admin
  if (user?.role !== 'admin') {
    router.push('/transaksi')
    return null
  }

  const handleCreate = async (data: any) => {
    try {
      await createMutation.mutateAsync(data)
      setFormModal({ isOpen: false, mode: 'create' })
      setToast({
        isOpen: true,
        title: 'Berhasil',
        message: 'Petugas berhasil ditambahkan',
        variant: 'success',
      })
    } catch (error: any) {
      setToast({
        isOpen: true,
        title: 'Gagal',
        message: error.message || 'Gagal menambah petugas',
        variant: 'error',
      })
    }
  }

  const handleUpdate = async (data: any) => {
    if (!formModal.data) return

    try {
      await updateMutation.mutateAsync({
        id: formModal.data.id,
        ...data,
      })
      setFormModal({ isOpen: false, mode: 'create' })
      setToast({
        isOpen: true,
        title: 'Berhasil',
        message: 'Data petugas berhasil diubah',
        variant: 'success',
      })
    } catch (error: any) {
      setToast({
        isOpen: true,
        title: 'Gagal',
        message: error.message || 'Gagal mengubah data petugas',
        variant: 'error',
      })
    }
  }

  const handleResetPassword = async (newPassword: string) => {
    if (!resetPasswordModal.data) return

    try {
      await resetPasswordMutation.mutateAsync({
        id: resetPasswordModal.data.id,
        newPassword,
      })
      setResetPasswordModal({ isOpen: false })
      setToast({
        isOpen: true,
        title: 'Berhasil',
        message: 'Password berhasil direset',
        variant: 'success',
      })
    } catch (error: any) {
      setToast({
        isOpen: true,
        title: 'Gagal',
        message: error.message || 'Gagal reset password',
        variant: 'error',
      })
    }
  }

  const handleDeactivate = async () => {
    if (!deactivateModal.data) return

    try {
      await deactivateMutation.mutateAsync(deactivateModal.data.id)
      setDeactivateModal({ isOpen: false })
      setToast({
        isOpen: true,
        title: 'Berhasil',
        message: `Petugas berhasil ${
          deactivateModal.data.isActive ? 'dinonaktifkan' : 'diaktifkan'
        }`,
        variant: 'success',
      })
    } catch (error: any) {
      setToast({
        isOpen: true,
        title: 'Gagal',
        message: error.message || 'Gagal mengubah status petugas',
        variant: 'error',
      })
    }
  }

  const activePetugas = petugasList?.filter((p) => p.isActive) || []
  const inactivePetugas = petugasList?.filter((p) => !p.isActive) || []

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
                <UserGear weight="duotone" className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold">Petugas</h1>
                <p className="text-primary-100 text-sm">
                  {petugasList?.length || 0} petugas
                </p>
              </div>
            </div>
            <Logo size="lg" showText={false} />
          </motion.div>
        </div>

        {/* Add Button */}
        <div className="px-4 -mt-4 mb-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="primary"
              fullWidth
              onClick={() => setFormModal({ isOpen: true, mode: 'create' })}
              leftIcon={<UserCirclePlus weight="bold" className="w-5 h-5" />}
            >
              Tambah Petugas
            </Button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="px-4 space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : error ? (
            <InfoCard variant="error" title="Error">
              <p className="text-sm">Gagal memuat data petugas</p>
            </InfoCard>
          ) : !petugasList || petugasList.length === 0 ? (
            <InfoCard variant="info" title="Belum Ada Petugas">
              <p className="text-sm">
                Belum ada petugas terdaftar. Klik tombol "Tambah Petugas" untuk
                memulai.
              </p>
            </InfoCard>
          ) : (
            <>
              {/* Active Petugas */}
              {activePetugas.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 px-1">
                    Petugas Aktif ({activePetugas.length})
                  </h3>
                  <AnimatePresence mode="popLayout">
                    {activePetugas.map((item, index) => (
                      <PetugasCard
                        key={item.id}
                        petugas={item}
                        delay={index * 0.05}
                        onEdit={() =>
                          setFormModal({
                            isOpen: true,
                            mode: 'edit',
                            data: item,
                          })
                        }
                        onResetPassword={() =>
                          setResetPasswordModal({
                            isOpen: true,
                            data: item,
                          })
                        }
                        onDeactivate={() =>
                          setDeactivateModal({
                            isOpen: true,
                            data: item,
                          })
                        }
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Inactive Petugas */}
              {inactivePetugas.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 px-1">
                    Petugas Nonaktif ({inactivePetugas.length})
                  </h3>
                  <AnimatePresence mode="popLayout">
                    {inactivePetugas.map((item, index) => (
                      <PetugasCard
                        key={item.id}
                        petugas={item}
                        delay={index * 0.05}
                        onEdit={() =>
                          setFormModal({
                            isOpen: true,
                            mode: 'edit',
                            data: item,
                          })
                        }
                        onResetPassword={() =>
                          setResetPasswordModal({
                            isOpen: true,
                            data: item,
                          })
                        }
                        onDeactivate={() =>
                          setDeactivateModal({
                            isOpen: true,
                            data: item,
                          })
                        }
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <PetugasFormModal
        isOpen={formModal.isOpen}
        onClose={() => setFormModal({ isOpen: false, mode: 'create' })}
        onSubmit={formModal.mode === 'create' ? handleCreate : handleUpdate}
        isLoading={createMutation.isPending || updateMutation.isPending}
        mode={formModal.mode}
        initialData={
          formModal.data
            ? {
                namaLengkap: formModal.data.namaLengkap,
                email: formModal.data.email,
                noTelp: formModal.data.noTelp,
              }
            : undefined
        }
      />

      <ResetPasswordModal
        isOpen={resetPasswordModal.isOpen}
        onClose={() => setResetPasswordModal({ isOpen: false })}
        onConfirm={handleResetPassword}
        petugasName={resetPasswordModal.data?.namaLengkap || ''}
        isLoading={resetPasswordMutation.isPending}
      />

      <ConfirmDialog
        isOpen={deactivateModal.isOpen}
        onClose={() => setDeactivateModal({ isOpen: false })}
        onConfirm={handleDeactivate}
        title={
          deactivateModal.data?.isActive
            ? 'Nonaktifkan Petugas'
            : 'Aktifkan Petugas'
        }
        message={`Apakah Anda yakin ingin ${
          deactivateModal.data?.isActive ? 'menonaktifkan' : 'mengaktifkan'
        } petugas ${deactivateModal.data?.namaLengkap}?`}
        confirmText={deactivateModal.data?.isActive ? 'Nonaktifkan' : 'Aktifkan'}
        variant={deactivateModal.data?.isActive ? 'warning' : 'success'}
        isLoading={deactivateMutation.isPending}
      />

      <BottomNav />
    </div>
  )
}