import { SignOut, WarningCircle } from '@phosphor-icons/react'
import Modal from './Modal'
import Button from './Button'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  userName?: string
  isLoading?: boolean
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isLoading = false,
}: LogoutModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      closeOnOverlayClick={!isLoading}
    >
      <div className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
          <WarningCircle weight="fill" className="w-10 h-10 text-yellow-600" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Konfirmasi Keluar
        </h3>

        <p className="text-gray-600 mb-6">
          Apakah Anda yakin ingin keluar dari akun <span className="font-semibold">{userName || 'ini'}</span>?
        </p>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
            leftIcon={<SignOut weight="bold" className="w-5 h-5" />}
          >
            {isLoading ? 'Memproses...' : 'Ya, Keluar'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}