'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { formatCurrency } from '@/lib/utils/format'
import { Users, CurrencyCircleDollar, CheckCircle } from '@phosphor-icons/react'
import type { Penabung } from '@/types/database'

const prosesSchema = z.object({
  jumlahOrang: z.number().min(1, 'Minimal 1 orang').max(10, 'Maksimal 10 orang'),
  nominalPerOrang: z.number().min(1000, 'Nominal minimal Rp 1.000'),
})

type ProsesFormData = z.infer<typeof prosesSchema>

interface ProsesQurbanModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: { jumlahOrang: number; nominalPerOrang: number }) => void
  penabung: Penabung | null
  isLoading?: boolean
}

export default function ProsesQurbanModal({
  isOpen,
  onClose,
  onConfirm,
  penabung,
  isLoading = false,
}: ProsesQurbanModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProsesFormData>({
    resolver: zodResolver(prosesSchema),
    defaultValues: {
      jumlahOrang: 1,
      nominalPerOrang: 3600000, // Default harga qurban
    },
  })

  const jumlahOrang = watch('jumlahOrang') || 1
  const nominalPerOrang = watch('nominalPerOrang') || 0
  const totalPenarikan = jumlahOrang * nominalPerOrang
  const saldoSekarang = penabung ? parseFloat(penabung.totalSaldo) : 0
  const saldoSisa = saldoSekarang - totalPenarikan

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleConfirm = (data: ProsesFormData) => {
    onConfirm(data)
    reset()
  }

  if (!penabung) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Proses Qurban"
      size="sm"
    >
      <form onSubmit={handleSubmit(handleConfirm)} className="space-y-4">
        {/* Penabung Info */}
        <div className="bg-primary-50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <Users weight="duotone" className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Penabung</p>
              <p className="font-semibold text-gray-900">{penabung.nama}</p>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-primary-100">
            <span className="text-sm text-gray-600">Saldo Saat Ini</span>
            <span className="font-bold text-primary-600">
              {formatCurrency(saldoSekarang)}
            </span>
          </div>
        </div>

        {/* Form Inputs */}
        <Input
          {...register('jumlahOrang', { valueAsNumber: true })}
          type="number"
          label="Jumlah Orang"
          placeholder="1"
          min={1}
          max={10}
          error={errors.jumlahOrang?.message}
          leftIcon={<Users weight="duotone" className="w-5 h-5" />}
          required
        />

        <Input
          {...register('nominalPerOrang', { valueAsNumber: true })}
          type="number"
          label="Nominal Per Orang"
          placeholder="3600000"
          min={1000}
          error={errors.nominalPerOrang?.message}
          leftIcon={<CurrencyCircleDollar weight="duotone" className="w-5 h-5" />}
          required
        />

        {/* Calculation Summary */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Penarikan</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(totalPenarikan)}
            </span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
            <span className="text-gray-600">Saldo Setelah Proses</span>
            <span
              className={`font-bold ${
                saldoSisa < 0 ? 'text-error' : 'text-success'
              }`}
            >
              {formatCurrency(saldoSisa)}
            </span>
          </div>
        </div>

        {/* Warning if insufficient */}
        {saldoSisa < 0 && (
          <div className="bg-error/10 border border-error/20 rounded-xl p-3">
            <p className="text-sm text-error font-medium">
              ⚠️ Saldo tidak mencukupi untuk proses ini!
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={handleClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="success"
            fullWidth
            disabled={saldoSisa < 0 || isLoading}
            isLoading={isLoading}
            leftIcon={<CheckCircle weight="bold" className="w-5 h-5" />}
          >
            Proses
          </Button>
        </div>
      </form>
    </Modal>
  )
}