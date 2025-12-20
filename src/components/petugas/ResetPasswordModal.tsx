import { useState } from 'react'
import { Key, Eye, EyeSlash } from '@phosphor-icons/react'
import Modal from '@/components/common/Modal'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import InfoCard from '@/components/common/InfoCard'

interface ResetPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (newPassword: string) => void
  petugasName: string
  isLoading?: boolean
}

export default function ResetPasswordModal({
  isOpen,
  onClose,
  onConfirm,
  petugasName,
  isLoading = false,
}: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setNewPassword(password)
    setError('')
  }

  const handleSubmit = () => {
    if (newPassword.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }
    onConfirm(newPassword)
    setNewPassword('')
    setError('')
  }

  const handleClose = () => {
    setNewPassword('')
    setError('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reset Password Petugas"
      size="sm"
      closeOnOverlayClick={!isLoading}
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Reset password untuk petugas <span className="font-semibold">{petugasName}</span>
        </p>

        <div className="relative">
          <Input
            label="Password Baru"
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value)
              setError('')
            }}
            placeholder="Minimal 6 karakter"
            error={error}
            disabled={isLoading}
            leftIcon={<Key weight="duotone" className="w-5 h-5" />}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeSlash weight="duotone" className="w-5 h-5" />
            ) : (
              <Eye weight="duotone" className="w-5 h-5" />
            )}
          </button>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          fullWidth
          onClick={generatePassword}
          disabled={isLoading}
        >
          Generate Password Otomatis
        </Button>

        {newPassword && (
          <InfoCard variant="warning" title="⚠️ Penting:">
            <p className="text-sm">
              Password baru: <span className="font-mono font-bold">{newPassword}</span>
            </p>
            <p className="text-sm mt-2">
              Simpan password ini dan berikan ke petugas yang bersangkutan!
            </p>
          </InfoCard>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            variant="secondary"
            fullWidth
            onClick={handleClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={isLoading || !newPassword}
          >
            Reset Password
          </Button>
        </div>
      </div>
    </Modal>
  )
}