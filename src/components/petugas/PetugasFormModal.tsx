import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '@/components/common/Modal'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import InfoCard from '@/components/common/InfoCard'
import { User, Envelope, Phone, Key, Eye, EyeSlash } from '@phosphor-icons/react'

const petugasSchema = z.object({
  namaLengkap: z.string().min(1, 'Nama harus diisi').min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter').optional(),
  noTelp: z.string().optional(),
})

type PetugasFormData = z.infer<typeof petugasSchema>

interface PetugasFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: PetugasFormData) => void
  isLoading?: boolean
  initialData?: Partial<PetugasFormData>
  mode: 'create' | 'edit'
}

export default function PetugasFormModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialData,
  mode,
}: PetugasFormModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PetugasFormData>({
    resolver: zodResolver(petugasSchema),
    defaultValues: initialData,
  })

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData)
      } else {
        reset({ namaLengkap: '', email: '', password: '', noTelp: '' })
        setGeneratedPassword('')
      }
    }
  }, [isOpen, initialData, reset])

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setGeneratedPassword(password)
    setValue('password', password)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Tambah Petugas Baru' : 'Edit Petugas'}
      size="sm"
      closeOnOverlayClick={!isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('namaLengkap')}
          label="Nama Lengkap"
          placeholder="Contoh: Budi Santoso"
          error={errors.namaLengkap?.message}
          disabled={isLoading}
          leftIcon={<User weight="duotone" className="w-5 h-5" />}
          required
        />

        <Input
          {...register('email')}
          label="Email"
          type="email"
          placeholder="contoh@email.com"
          error={errors.email?.message}
          disabled={isLoading || mode === 'edit'}
          leftIcon={<Envelope weight="duotone" className="w-5 h-5" />}
          required
          helperText={mode === 'edit' ? 'Email tidak bisa diubah' : undefined}
        />

        <Input
          {...register('noTelp')}
          label="No. Telepon"
          type="tel"
          placeholder="08123456789"
          error={errors.noTelp?.message}
          disabled={isLoading}
          leftIcon={<Phone weight="duotone" className="w-5 h-5" />}
        />

        {mode === 'create' && (
          <>
            <div className="relative">
              <Input
                {...register('password')}
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimal 6 karakter"
                error={errors.password?.message}
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

            {generatedPassword && (
              <InfoCard variant="success" title="Password Ter-generate:">
                <div className="font-mono text-sm bg-white rounded-lg p-2 border border-green-200">
                  {generatedPassword}
                </div>
                <p className="text-xs mt-2">
                  ⚠️ Simpan password ini! Berikan ke petugas yang bersangkutan.
                </p>
              </InfoCard>
            )}
          </>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            {mode === 'create' ? 'Tambah' : 'Simpan'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}