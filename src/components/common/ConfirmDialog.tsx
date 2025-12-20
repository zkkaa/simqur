import { WarningCircle, CheckCircle, Info, XCircle } from '@phosphor-icons/react'
import Modal from './Modal'
import Button from './Button'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info' | 'success'
  isLoading?: boolean
}

const variantConfig = {
  danger: {
    icon: XCircle,
    iconColor: 'text-red-600',
    iconBg: 'bg-red-100',
    buttonVariant: 'danger' as const,
  },
  warning: {
    icon: WarningCircle,
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
    buttonVariant: 'primary' as const,
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    buttonVariant: 'primary' as const,
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
    buttonVariant: 'success' as const,
  },
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  variant = 'warning',
  isLoading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  const handleConfirm = async () => {
    await onConfirm()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      closeOnOverlayClick={!isLoading}
    >
      <div className="text-center">
        {/* Icon */}
        <div className={`mx-auto w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center mb-4`}>
          <Icon weight="fill" className={`w-6 h-6 ${config.iconColor}`} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

        {/* Message */}
        <p className="text-sm text-gray-600 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.buttonVariant}
            fullWidth
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}