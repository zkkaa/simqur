import { useState } from 'react'
import { WarningCircle, Trash } from '@phosphor-icons/react'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

interface DeletePenabungModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  penabungName: string
  isLoading?: boolean
}

export default function DeletePenabungModal({
  isOpen,
  onClose,
  onConfirm,
  penabungName,
  isLoading = false,
}: DeletePenabungModalProps) {
  const [confirmText, setConfirmText] = useState('')
  const [step, setStep] = useState<1 | 2>(1)

  const handleFirstConfirm = () => {
    setStep(2)
  }

  const handleFinalConfirm = () => {
    onConfirm()
    // Reset state after confirmation
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
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <WarningCircle weight="fill" className="w-10 h-10 text-red-600" />
        </div>

        {step === 1 ? (
          <>
            {/* Step 1: First Confirmation */}
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Konfirmasi Hapus Penabung
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus penabung{' '}
              <span className="font-semibold">"{penabungName}"</span>?
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-yellow-800">
                <strong>Peringatan:</strong> Riwayat transaksi penabung ini
                akan tetap ada selama 1 bulan sebelum dihapus permanen.
              </p>
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
            {/* Step 2: Final Confirmation */}
            <h3 className="text-xl font-bold text-red-600 mb-2">
              Konfirmasi Akhir
            </h3>
            <p className="text-gray-600 mb-4">
              Ketik <span className="font-mono font-bold">"HAPUS"</span> untuk
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
                onClick={() => setStep(1)}
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
                Hapus Sekarang
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}