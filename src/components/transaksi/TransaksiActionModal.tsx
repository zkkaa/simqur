import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  PencilSimple,
  Trash,
  Money,
  CreditCard,
  WarningCircle,
  CheckCircle,
  User,
  Clock,
  CalendarBlank,
} from '@phosphor-icons/react'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import NumericKeypad from '@/components/common/NumericKeypad'
import { formatCurrency, formatDate, formatTime } from '@/lib/utils/format'

interface TransaksiActionModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: (data: { nominal: number; metodeBayar: 'tunai' | 'transfer' }) => void
  onDelete: () => void
  transaksi: {
    id: string
    nominal: string
    metodeBayar: 'tunai' | 'transfer'
    tanggal: string
    createdAt: Date
    penabung: {
      nama: string
      totalSaldo: string
    }
  }
  canDelete: boolean
  isLoading?: boolean
}

export default function TransaksiActionModal({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  transaksi,
  canDelete,
  isLoading = false,
}: TransaksiActionModalProps) {
  const [mode, setMode] = useState<'view' | 'edit' | 'delete'>('view')
  const [editNominal, setEditNominal] = useState(parseFloat(transaksi.nominal))
  const [editMetode, setEditMetode] = useState<'tunai' | 'transfer'>(transaksi.metodeBayar)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [showKeypad, setShowKeypad] = useState(false)

  const handleClose = () => {
    setMode('view')
    setEditNominal(parseFloat(transaksi.nominal))
    setEditMetode(transaksi.metodeBayar)
    setDeleteConfirm('')
    setShowKeypad(false)
    onClose()
  }

  const handleEditSubmit = () => {
    onEdit({ nominal: editNominal, metodeBayar: editMetode })
  }

  const handleDeleteSubmit = () => {
    onDelete()
    setTimeout(() => {
      setDeleteConfirm('')
    }, 500)
  }

  const handleKeyPress = (key: string) => {
    const currentNominalStr = editNominal.toString()

    if (key === '000') {
      if (editNominal > 0) setEditNominal(editNominal * 1000)
    } else {
      const newValue = currentNominalStr === '0' ? key : currentNominalStr + key
      if (parseInt(newValue) <= 100000000) {
        setEditNominal(parseInt(newValue))
      }
    }
  }

  const handleKeyDelete = () => {
    const str = editNominal.toString()
    if (str.length <= 1) {
      setEditNominal(0)
    } else {
      setEditNominal(parseInt(str.slice(0, -1)))
    }
  }

  const saldoLama = parseFloat(transaksi.penabung.totalSaldo)
  const nominalLama = parseFloat(transaksi.nominal)
  const saldoSetelahHapus = saldoLama - nominalLama

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={handleClose} 
        size="md" 
        closeOnOverlayClick={!isLoading && !showKeypad} 
        showCloseButton={false}
      >
        <div className="relative">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="absolute -top-2 -right-2 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 z-10"
          >
            <X weight="bold" className="w-5 h-5 text-gray-600" />
          </button>

          <AnimatePresence mode="wait">
            {mode === 'view' && (
              <motion.div
                key="view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Detail Transaksi</h3>

                <div className="space-y-3 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <User weight="duotone" className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-600">Penabung</p>
                        <p className="font-semibold text-gray-900">{transaksi.penabung.nama}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Saldo Saat Ini</p>
                      <p className="text-lg font-bold text-primary-600">
                        {formatCurrency(saldoLama)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 bg-primary-50 rounded-xl p-3">
                      <p className="text-xs text-primary-700 mb-1">Nominal</p>
                      <p className="font-bold text-gray-900">{formatCurrency(nominalLama)}</p>
                    </div>
                    <div className="flex-1 bg-blue-50 rounded-xl p-3">
                      <p className="text-xs text-blue-700 mb-1">Metode</p>
                      <div className="flex items-center gap-2">
                        {transaksi.metodeBayar === 'tunai' ? (
                          <>
                            <Money weight="duotone" className="w-5 h-5 text-gray-900" />
                            <p className="font-bold text-gray-900">Tunai</p>
                          </>
                        ) : (
                          <>
                            <CreditCard weight="duotone" className="w-5 h-5 text-gray-900" />
                            <p className="font-bold text-gray-900">Transfer</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <CalendarBlank weight="duotone" className="w-4 h-4" />
                      {formatDate(new Date(transaksi.tanggal), 'dd MMM yyyy')}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock weight="duotone" className="w-4 h-4" />
                      {formatTime(transaksi.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => setMode('edit')}
                    leftIcon={<PencilSimple weight="bold" className="w-5 h-5" />}
                    disabled={isLoading}
                  >
                    Edit
                  </Button>
                  {canDelete && (
                    <Button
                      variant="danger"
                      fullWidth
                      onClick={() => setMode('delete')}
                      leftIcon={<Trash weight="bold" className="w-5 h-5" />}
                      disabled={isLoading}
                    >
                      Hapus
                    </Button>
                  )}
                </div>
              </motion.div>
            )}

            {mode === 'edit' && (
              <motion.div
                key="edit"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Transaksi</h3>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-sm text-gray-600 mb-1">Penabung</p>
                    <p className="font-semibold text-gray-900">{transaksi.penabung.nama}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nominal Baru <span className="text-error">*</span>
                    </label>
                    <div
                      onClick={() => setShowKeypad(true)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus-within:border-primary-500 bg-white cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Rp</span>
                        <span className="text-xl font-bold text-gray-900">
                          {editNominal.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Metode Bayar</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setEditMetode('tunai')}
                        disabled={isLoading}
                        className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                          editMetode === 'tunai'
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 bg-white text-gray-700'
                        }`}
                      >
                        <Money weight="duotone" className="w-6 h-6" />
                        <span className="font-semibold">Tunai</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditMetode('transfer')}
                        disabled={isLoading}
                        className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                          editMetode === 'transfer'
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 bg-white text-gray-700'
                        }`}
                      >
                        <CreditCard weight="duotone" className="w-6 h-6" />
                        <span className="font-semibold">Transfer</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => setMode('view')}
                    disabled={isLoading}
                  >
                    Batal
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleEditSubmit}
                    isLoading={isLoading}
                    disabled={editNominal <= 0}
                    leftIcon={<CheckCircle weight="bold" className="w-5 h-5" />}
                  >
                    Simpan
                  </Button>
                </div>
              </motion.div>
            )}

            {mode === 'delete' && (
              <motion.div
                key="delete"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <WarningCircle weight="fill" className="w-10 h-10 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Transaksi</h3>
                  <p className="text-gray-600">
                    Apakah Anda yakin ingin menghapus transaksi ini?
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-3 text-left">
                    <p className="text-sm text-gray-600">Penabung</p>
                    <p className="font-semibold text-gray-900">{transaksi.penabung.nama}</p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-sm text-red-800 font-medium mb-2">Dampak Penghapusan:</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nominal Transaksi:</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(nominalLama)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Saldo Saat Ini:</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(saldoLama)}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-red-200 flex justify-between">
                        <span className="text-gray-600">Saldo Setelah Hapus:</span>
                        <span className="font-bold text-red-600">
                          {formatCurrency(saldoSetelahHapus)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                    <p className="text-xs text-yellow-800">
                      Ketik <span className="font-mono font-bold">"HAPUS"</span> untuk konfirmasi
                    </p>
                    <input
                      type="text"
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                      placeholder="Ketik: HAPUS"
                      disabled={isLoading}
                      className="w-full mt-2 px-3 py-2 border border-yellow-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => {
                      setMode('view')
                      setDeleteConfirm('')
                    }}
                    disabled={isLoading}
                  >
                    Batal
                  </Button>
                  <Button
                    variant="danger"
                    fullWidth
                    onClick={handleDeleteSubmit}
                    isLoading={isLoading}
                    disabled={deleteConfirm.toLowerCase() !== 'hapus'}
                    leftIcon={<Trash weight="bold" className="w-5 h-5" />}
                  >
                    Hapus Sekarang
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Modal>

      {/* Keypad fixed at bottom */}
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
                onClick={() => setEditNominal(0)}
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
              onDelete={handleKeyDelete}
              onClear={() => setEditNominal(0)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}