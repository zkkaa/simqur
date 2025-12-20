import { CheckCircle, ArrowRight } from '@phosphor-icons/react'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import { formatCurrency } from '@/lib/utils/format'
import Badge from '@/components/common/Badge'

interface TransaksiConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    penabungName: string
    nominal: number
    metodeBayar: 'tunai' | 'transfer'
    saldoLama: number
    saldoBaru: number
    isLoading?: boolean
}

export default function TransaksiConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    penabungName,
    nominal,
    metodeBayar,
    saldoLama,
    saldoBaru,
    isLoading = false,
}: TransaksiConfirmModalProps) {
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
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle weight="fill" className="w-10 h-10 text-green-600" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Konfirmasi Setoran
                </h3>

                {/* Details */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6 text-left">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Penabung</span>
                        <span className="font-semibold text-gray-900">{penabungName}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Nominal</span>
                        <span className="font-bold text-primary-600 text-lg">
                            {formatCurrency(nominal)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Metode</span>
                        <Badge
                            // Ganti 'secondary' menjadi 'info' atau 'default'
                            variant={metodeBayar === 'tunai' ? 'success' : 'info'}
                            size="sm"
                        >
                            {metodeBayar === 'tunai' ? 'Tunai' : 'Transfer'}
                        </Badge>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                            <div className="text-center">
                                <p className="text-gray-500 mb-1">Saldo Lama</p>
                                <p className="font-semibold text-gray-700">
                                    {formatCurrency(saldoLama)}
                                </p>
                            </div>

                            <ArrowRight weight="bold" className="w-5 h-5 text-gray-400" />

                            <div className="text-center">
                                <p className="text-gray-500 mb-1">Saldo Baru</p>
                                <p className="font-semibold text-primary-600">
                                    {formatCurrency(saldoBaru)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
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
                        variant="primary"
                        fullWidth
                        onClick={onConfirm}
                        isLoading={isLoading}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Menyimpan...' : 'Ya, Simpan'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}