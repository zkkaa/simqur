'use client'

import { useState, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/hooks/use-auth'
import { usePenabungById, useUpdatePenabung, useDeletePenabung } from '@/lib/hooks/use-penabung'
import { useTransaksi } from '@/lib/hooks/use-transaksi'
import { LoadingPage } from '@/components/common/LoadingSpinner'
import Button from '@/components/common/Button'
import Logo from '@/components/common/Logo'
import Toast from '@/components/common/Toast'
import InfoCard from '@/components/common/InfoCard'
import Pagination from '@/components/common/Pagination'
import PenabungFormModal from '@/components/penabung/PenabungFormModal'
import DeletePenabungModal from '@/components/penabung/DeletePenabungModal'
import {
  ArrowLeft,
  User,
  Wallet,
  CheckCircle,
  XCircle,
  PencilSimple,
  Trash,
  Clock,
  CalendarBlank,
  Money,
  CreditCard,
  Receipt,
} from '@phosphor-icons/react'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils/format'

const ITEMS_PER_PAGE = 10

export default function PenabungDetailPage() {
  const router = useRouter()
  const params = useParams()
  const penabungId = params.id as string
  
  const { user, isLoading: authLoading } = useAuth()
  const { data: penabung, isLoading: penabungLoading } = usePenabungById(penabungId)
  const { data: transaksiList, isLoading: transaksiLoading } = useTransaksi(undefined, penabungId)
  const updateMutation = useUpdatePenabung()
  const deleteMutation = useDeletePenabung()

  const [currentPage, setCurrentPage] = useState(1)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
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

  // Pagination logic
  const { paginatedData, totalPages } = useMemo(() => {
    if (!transaksiList) return { paginatedData: [], totalPages: 0 }
    
    const total = Math.ceil(transaksiList.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginated = transaksiList.slice(startIndex, endIndex)
    
    return { paginatedData: paginated, totalPages: total }
  }, [transaksiList, currentPage])

  if (authLoading || penabungLoading) {
    return <LoadingPage text="Memuat data penabung..." />
  }

  if (!penabung) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <InfoCard variant="error" title="Penabung Tidak Ditemukan">
          <p className="text-sm mb-4">Data penabung tidak ditemukan atau telah dihapus.</p>
          <Button variant="primary" onClick={() => router.push('/penabung')}>
            Kembali ke Daftar Penabung
          </Button>
        </InfoCard>
      </div>
    )
  }

  const handleUpdate = async (data: { nama: string }) => {
    try {
      await updateMutation.mutateAsync({
        id: penabungId,
        nama: data.nama,
      })
      setShowEditModal(false)
      setToast({
        isOpen: true,
        title: 'Berhasil',
        message: 'Data penabung berhasil diubah',
        variant: 'success',
      })
    } catch (error: any) {
      setToast({
        isOpen: true,
        title: 'Gagal',
        message: error.message || 'Gagal mengubah data penabung',
        variant: 'error',
      })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(penabungId)
      setShowDeleteModal(false)
      setToast({
        isOpen: true,
        title: 'Berhasil',
        message: 'Penabung berhasil dihapus',
        variant: 'success',
      })
      setTimeout(() => {
        router.push('/penabung')
      }, 1000)
    } catch (error: any) {
      setToast({
        isOpen: true,
        title: 'Gagal',
        message: error.message || 'Gagal menghapus penabung',
        variant: 'error',
      })
    }
  }

  const saldo = parseFloat(penabung.totalSaldo)
  const totalTransaksi = transaksiList?.length || 0

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
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-4 pt-8 pb-20 rounded-b-3xl shadow-lg relative">
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
            <h1 className="text-white text-xl font-bold">Detail Penabung</h1>
            <Logo size="md" showText={false} />
          </motion.div>

          {/* Avatar & Name */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute left-1/2 -translate-x-1/2 -bottom-12"
          >
            <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white">
              <User weight="duotone" className="w-12 h-12 text-primary-600" />
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="px-4 mt-16 space-y-4">
          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200"
          >
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {penabung.nama}
              </h2>
              <div className="flex items-center justify-center gap-2">
                {penabung.statusLunas ? (
                  <>
                    <CheckCircle weight="fill" className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Lunas</span>
                  </>
                ) : (
                  <>
                    <XCircle weight="fill" className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Belum Lunas</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-primary-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet weight="duotone" className="w-5 h-5 text-primary-600" />
                <p className="text-sm text-primary-700 font-medium">Total Saldo</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(saldo)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Target: {formatCurrency(3600000)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Receipt weight="duotone" className="w-4 h-4 text-gray-600" />
                  <p className="text-xs text-gray-600">Total Transaksi</p>
                </div>
                <p className="text-xl font-bold text-gray-900">{totalTransaksi}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarBlank weight="duotone" className="w-4 h-4 text-gray-600" />
                  <p className="text-xs text-gray-600">Terdaftar</p>
                </div>
                <p className="text-xs font-semibold text-gray-900">
                  {formatDate(penabung.createdAt, 'dd MMM yyyy')}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowEditModal(true)}
                leftIcon={<PencilSimple weight="bold" className="w-5 h-5" />}
              >
                Edit
              </Button>
              {user?.role === 'admin' && (
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => setShowDeleteModal(true)}
                  leftIcon={<Trash weight="bold" className="w-5 h-5" />}
                >
                  Hapus
                </Button>
              )}
            </div>
          </motion.div>

          {/* Riwayat Transaksi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-semibold text-gray-700 px-1">
              Riwayat Transaksi ({totalTransaksi})
            </h3>

            {transaksiLoading ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <p className="text-gray-500">Memuat riwayat...</p>
              </div>
            ) : !transaksiList || transaksiList.length === 0 ? (
              <InfoCard variant="info" title="Belum Ada Transaksi">
                <p className="text-sm">Belum ada riwayat transaksi untuk penabung ini.</p>
              </InfoCard>
            ) : (
              <>
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {paginatedData.map((item: any, index: number) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.03 }}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {item.metodeBayar === 'tunai' ? (
                              <Money weight="duotone" className="w-5 h-5 text-gray-600" />
                            ) : (
                              <CreditCard weight="duotone" className="w-5 h-5 text-gray-600" />
                            )}
                            <span className="text-xs text-gray-600">
                              {item.metodeBayar === 'tunai' ? 'Tunai' : 'Transfer'}
                            </span>
                          </div>
                          <p className="font-bold text-primary-600">
                            {formatCurrency(parseFloat(item.nominal))}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <CalendarBlank weight="duotone" className="w-4 h-4" />
                            {formatDate(new Date(item.tanggal), 'dd MMM yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock weight="duotone" className="w-4 h-4" />
                            {formatTime(item.createdAt)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={transaksiList.length}
                    onPageChange={setCurrentPage}
                    itemsPerPage={ITEMS_PER_PAGE}
                  />
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <PenabungFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdate}
        isLoading={updateMutation.isPending}
        mode="edit"
        initialData={{ nama: penabung.nama }}
      />

      <DeletePenabungModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        penabungName={penabung.nama}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}