import { useState } from 'react'
import { WarningCircle, Trash, Receipt } from '@phosphor-icons/react'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { formatCurrency } from '@/lib/utils/format'

interface DeletePenabungModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  penabungName: string
  penabungSaldo?: number
  totalTransaksi?: number
  isLoading?: boolean
}

export default function DeletePenabungModal({
  isOpen,
  onClose,
  onConfirm,
  penabungName,
  penabungSaldo = 0,
  totalTransaksi = 0,
  isLoading = false,
}: DeletePenabungModalProps) {
  const [confirmText, setConfirmText] = useState('')
  const [step, setStep] = useState<1 | 2>(1)

  const handleFirstConfirm = () => {
    setStep(2)
  }

  const handleFinalConfirm = () => {
    onConfirm()
    setTimeout(() => {
      setStep(1)
      setConfirmText('')
    }, 500)
  }

  const handleClose = () => {
    setStep(1)
    setConfirmText('')
    onClose()
  }

  const isConfirmValid = confirmText.toLowerCase() === 'hapus'

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="sm"
      showCloseButton={false}
      closeOnOverlayClick={!isLoading}
    >
      <div className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <WarningCircle weight="fill" className="w-10 h-10 text-red-600" />
        </div>

        {step === 1 ? (
          <>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Konfirmasi Hapus Penabung
            </h3>
            <p className="text-gray-600 mb-4">
              Apakah Anda yakin ingin menghapus penabung{' '}
              <span className="font-semibold">"{penabungName}"</span>?
            </p>

            {/* Info Data yang Akan Dihapus */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Data yang akan dihapus:
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Saldo Penabung:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(penabungSaldo)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Receipt weight="duotone" className="w-4 h-4" />
                    Riwayat Transaksi:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {totalTransaksi} transaksi
                  </span>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-red-800 font-semibold mb-2">
                ⚠️ PERINGATAN PENTING:
              </p>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Data penabung akan dihapus <strong>PERMANEN</strong></li>
                <li>• <strong>{totalTransaksi} transaksi</strong> akan ikut terhapus</li>
                <li>• Saldo <strong>{formatCurrency(penabungSaldo)}</strong> akan hilang</li>
                <li>• Aksi ini <strong>TIDAK DAPAT DIBATALKAN</strong></li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={handleClose}>
                Batal
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={handleFirstConfirm}
                leftIcon={<Trash weight="bold" className="w-5 h-5" />}
              >
                Lanjutkan
              </Button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold text-red-600 mb-2">
              Konfirmasi Akhir
            </h3>
            <p className="text-gray-600 mb-2">
              Penabung dan <strong className="text-red-600">{totalTransaksi} transaksi</strong> akan dihapus <strong>PERMANEN</strong>.
            </p>
            <p className="text-gray-600 mb-4">
              Ketik <span className="font-mono font-bold text-red-600">"HAPUS"</span> untuk
              melanjutkan penghapusan.
            </p>
            <Input
              type="text"
              placeholder="Ketik: HAPUS"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={isLoading}
              className="mb-6"
              autoFocus
            />
            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => {
                  setStep(1)
                  setConfirmText('')
                }}
                disabled={isLoading}
              >
                Kembali
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={handleFinalConfirm}
                disabled={!isConfirmValid || isLoading}
                isLoading={isLoading}
                leftIcon={<Trash weight="bold" className="w-5 h-5" />}
              >
                Hapus Permanen
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}