'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { usePenabung, useCreatePenabung } from '@/lib/hooks/use-penabung'
import { LoadingPage } from '@/components/common/LoadingSpinner'
import SearchInput from '@/components/common/SearchInput'
import Button from '@/components/common/Button'
import InfoCard from '@/components/common/InfoCard'
import Logo from '@/components/common/Logo'
import Toast from '@/components/common/Toast'
import BottomNav from '@/components/layouts/BottomNav'
import PenabungCard from '@/components/penabung/PenabungCard'
import PenabungFormModal from '@/components/penabung/PenabungFormModal'
import { Users, Plus } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PenabungPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'lunas' | 'belum-lunas'>('all')
  const [formModal, setFormModal] = useState(false)
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

  const { data: penabungList, isLoading, error } = usePenabung(search, filter)
  const createMutation = useCreatePenabung()

  if (authLoading) {
    return <LoadingPage text="Memuat..." />
  }

  const handleCreate = async (data: { nama: string }) => {
    try {
      await createMutation.mutateAsync(data)
      setFormModal(false)
      setToast({
        isOpen: true,
        title: 'Berhasil',
        message: 'Penabung berhasil ditambahkan',
        variant: 'success',
      })
    } catch (error: any) {
      setToast({
        isOpen: true,
        title: 'Gagal',
        message: error.message || 'Gagal menambah penabung',
        variant: 'error',
      })
    }
  }

  const filters = [
    { label: 'Semua', value: 'all' as const },
    { label: 'Lunas', value: 'lunas' as const },
    { label: 'Belum Lunas', value: 'belum-lunas' as const },
  ]

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
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-4 pt-8 pb-6 rounded-b-3xl shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Users weight="duotone" className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold">Penabung</h1>
                <p className="text-primary-100 text-sm">
                  {penabungList?.length || 0} penabung
                </p>
              </div>
            </div>
            <Logo size="lg" showText={false} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SearchInput
              placeholder="Cari nama penabung..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
            />
          </motion.div>
        </div>

        <div className="px-4 -mt-4 mb-4 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 overflow-x-auto pb-2"
          >
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  filter === f.value
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="primary"
              fullWidth
              onClick={() => setFormModal(true)}
              leftIcon={<Plus weight="bold" className="w-5 h-5" />}
            >
              Tambah Penabung
            </Button>
          </motion.div>
        </div>

        <div className="px-4 space-y-3">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : error ? (
            <InfoCard variant="error" title="Error">
              <p className="text-sm">Gagal memuat data penabung</p>
            </InfoCard>
          ) : !penabungList || penabungList.length === 0 ? (
            <InfoCard variant="info" title="Belum Ada Data">
              <p className="text-sm">
                {search
                  ? 'Tidak ada penabung yang sesuai dengan pencarian'
                  : 'Belum ada penabung terdaftar. Klik tombol "Tambah Penabung" untuk memulai.'}
              </p>
            </InfoCard>
          ) : (
            <AnimatePresence mode="popLayout">
              {penabungList.map((item, index) => (
                <PenabungCard
                  key={item.id}
                  penabung={item}
                  delay={index * 0.05}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      <PenabungFormModal
        isOpen={formModal}
        onClose={() => setFormModal(false)}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
        mode="create"
      />

      <BottomNav />
    </div>
  )
}