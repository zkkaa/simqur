import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '@/components/common/Modal'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { User } from '@phosphor-icons/react'

const penabungSchema = z.object({
  nama: z
    .string()
    .min(1, 'Nama harus diisi')
    .min(3, 'Nama minimal 3 karakter')
    .max(255, 'Nama maksimal 255 karakter'),
})

type PenabungFormData = z.infer<typeof penabungSchema>

interface PenabungFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: PenabungFormData) => void
  isLoading?: boolean
  initialData?: { nama: string }
  mode: 'create' | 'edit'
}

export default function PenabungFormModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialData,
  mode,
}: PenabungFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PenabungFormData>({
    resolver: zodResolver(penabungSchema),
    defaultValues: initialData,
  })

  useEffect(() => {
    if (isOpen && initialData) {
      reset(initialData)
    } else if (!isOpen) {
      reset({ nama: '' })
    }
  }, [isOpen, initialData, reset])

  const handleFormSubmit = (data: PenabungFormData) => {
    onSubmit(data)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Tambah Penabung Baru' : 'Edit Penabung'}
      description={
        mode === 'create'
          ? 'Masukkan nama penabung yang ingin didaftarkan'
          : 'Ubah nama penabung'
      }
      size="sm"
      closeOnOverlayClick={!isLoading}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          {...register('nama')}
          id="nama"
          type="text"
          label="Nama Lengkap"
          placeholder="Contoh: Ahmad Subagyo"
          error={errors.nama?.message}
          disabled={isLoading}
          leftIcon={<User weight="duotone" className="w-5 h-5" />}
          required
          autoFocus
        />

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