'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { usePenabung } from '@/lib/hooks/use-penabung'
import { useProsesQurban, useCreateProsesQurban } from '@/lib/hooks/use-proses-qurban'
import { LoadingPage } from '@/components/common/LoadingSpinner'
import Button from '@/components/common/Button'
import Logo from '@/components/common/Logo'
import Toast from '@/components/common/Toast'
import InfoCard from '@/components/common/InfoCard'
import PenabungLunasCard from '@/components/proses-qurban/PenabungLunasCard'
import ProsesQurbanModal from '@/components/proses-qurban/ProsesQurbanModal'
import HistoryQurbanCard from '@/components/proses-qurban/HistoryQurbanCard'
import {
  CurrencyCircleDollar,
  ArrowLeft,
  CheckCircle,
  ClockCounterClockwise,
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Penabung } from '@/types/database'

export default function ProsesQurbanPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { data: penabungList, isLoading: penabungLoading } = usePenabung('', 'lunas')
  const { data: historyList, isLoading: historyLoading } = useProsesQurban()
  const createMutation = useCreateProsesQurban()

  const [selectedPenabung, setSelectedPenabung] = useState<Penabung | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
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

  if (authLoading || penabungLoading) {
    return <LoadingPage text="Memuat data..." />
  }

  // Redirect if not admin
  if (user?.role !== 'admin') {
    router.push('/lainnya')
    return null
  }

  const handleSelectPenabung = (penabung: Penabung) => {
    setSelectedPenabung(penabung)
    setShowModal(true)
  }

  const handleProses = async (data: {
    jumlahOrang: number
    nominalPerOrang: number
  }) => {
    if (!selectedPenabung) return

    try {
      await createMutation.mutateAsync({
        penabungId: selectedPenabung.id,
        jumlahOrang: data.jumlahOrang,
        nominalPerOrang: data.nominalPerOrang,
      })
      setShowModal(false)
      setSelectedPenabung(null)
      setToast({
        isOpen: true,
        title: 'Berhasil',
        message: `Proses qurban untuk ${selectedPenabung.nama} berhasil`,
        variant: 'success',
      })
    } catch (error: any) {
      setToast({
        isOpen: true,
        title: 'Gagal',
        message: error.message || 'Gagal memproses qurban',
        variant: 'error',
      })
    }
  }

  const lunasCount = penabungList?.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-8">
      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        title={toast.title}
        message={toast.message}
        variant={toast.variant}
      />

      <ProsesQurbanModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedPenabung(null)
        }}
        onConfirm={handleProses}
        penabung={selectedPenabung}
        isLoading={createMutation.isPending}
      />

      <div className="max-w-sm mx-auto">
        {/* Header */}
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
            <h1 className="text-white text-xl font-bold">Proses Qurban</h1>
            <Logo size="md" showText={false} />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                <CheckCircle weight="fill" className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-primary-100 text-sm">Penabung Lunas</p>
                <p className="text-white text-3xl font-bold">{lunasCount}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Toggle View */}
        <div className="px-4 -mt-3 mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setShowHistory(false)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                !showHistory
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              Penabung Lunas
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                showHistory
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              <ClockCounterClockwise weight="duotone" className="w-5 h-5" />
              History
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 space-y-3">
          {!showHistory ? (
            <>
              {/* Penabung Lunas List */}
              {!penabungList || penabungList.length === 0 ? (
                <InfoCard variant="info" title="Belum Ada Penabung Lunas">
                  <p className="text-sm">
                    Belum ada penabung yang mencapai target qurban.
                  </p>
                </InfoCard>
              ) : (
                <AnimatePresence mode="popLayout">
                  {penabungList.map((penabung, index) => (
                    <PenabungLunasCard
                      key={penabung.id}
                      penabung={penabung}
                      delay={index * 0.05}
                      onProses={() => handleSelectPenabung(penabung)}
                    />
                  ))}
                </AnimatePresence>
              )}
            </>
          ) : (
            <>
              {/* History List */}
              {historyLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Memuat history...</p>
                </div>
              ) : !historyList || historyList.length === 0 ? (
                <InfoCard variant="info" title="Belum Ada History">
                  <p className="text-sm">
                    Belum ada proses qurban yang tercatat.
                  </p>
                </InfoCard>
              ) : (
                <AnimatePresence mode="popLayout">
                  {historyList.map((history: any, index: number) => (
                    <HistoryQurbanCard
                      key={history.id}
                      history={history}
                      delay={index * 0.05}
                    />
                  ))}
                </AnimatePresence>
              )}
            </>
          )}

          {/* Info */}
          <InfoCard variant="info" title="💡 Info">
            <ul className="text-sm space-y-1">
              <li>• Proses qurban hanya untuk penabung lunas</li>
              <li>• Saldo akan dikurangi sesuai jumlah orang</li>
              <li>• History tercatat untuk audit</li>
            </ul>
          </InfoCard>
        </div>
      </div>
    </div>
  )
}