'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { useLaporan } from '@/lib/hooks/use-laporan'
import { usePenabung } from '@/lib/hooks/use-penabung'
import { usePetugas } from '@/lib/hooks/use-petugas'
import { LoadingPage } from '@/components/common/LoadingSpinner'
import Button from '@/components/common/Button'
import Logo from '@/components/common/Logo'
import Toast from '@/components/common/Toast'
import InfoCard from '@/components/common/InfoCard'
import Input from '@/components/common/Input'
import BottomNav from '@/components/layouts/BottomNav'
import LaporanTypeCard from '@/components/laporan/LaporanTypeCard'
import LaporanSummaryCard from '@/components/laporan/LaporanSummaryCard'
import LaporanResultCard from '@/components/laporan/LaporanResultCard'
import PetugasSelectorLaporan from '@/components/laporan/PetugasSelectorLaporan'
import PenabungSelectorLaporan from '@/components/laporan/PenabungSelectorLaporan'
import {
  FileText,
  FilePdf,
  FileXls,
  MagnifyingGlass,
  CalendarBlank,
  User,
  CurrencyCircleDollar,
  UserGear,
  Funnel,
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  generateLaporanKeseluruhanPDF,
  generateLaporanPerWargaPDF,
  generateLaporanKeuanganPDF,
} from '@/lib/utils/pdf-generator'
import {
  generateLaporanKeseluruhanExcel,
  generateLaporanPerWargaExcel,
  generateLaporanKeuanganExcel,
  generateLaporanPerPetugasExcel,
  downloadExcel,
} from '@/lib/utils/excel-generator'

export default function LaporanPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [selectedType, setSelectedType] = useState('keseluruhan')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [penabungId, setPenabungId] = useState('')
  const [petugasId, setPetugasId] = useState('')
  const [enableQuery, setEnableQuery] = useState(false)
  const [showPresets, setShowPresets] = useState(false)
  const [toast, setToast] = useState<{
    isOpen: boolean
    title: string
    message?: string
    variant: 'success' | 'error'
  }>({
    isOpen: false,
    title: '',
    variant: 'success',
  })

  const { data: penabungList } = usePenabung('', 'all')
  const { data: petugasList } = usePetugas()

  const {
    data: laporanData,
    isLoading: laporanLoading,
    refetch,
  } = useLaporan(
    {
      type: selectedType as any,
      startDate,
      endDate,
      penabungId,
      petugasId,
    },
    enableQuery
  )

  if (authLoading) {
    return <LoadingPage text="Memuat..." />
  }

  const laporanTypes = [
    {
      value: 'keseluruhan',
      icon: <FileText weight="duotone" className="w-6 h-6" />,
      title: 'Laporan Keseluruhan',
      description: 'Semua transaksi per periode',
      adminOnly: false,
    },
    {
      value: 'per-warga',
      icon: <User weight="duotone" className="w-6 h-6" />,
      title: 'Laporan Per Warga',
      description: 'Riwayat transaksi individual',
      adminOnly: false,
    },
    {
      value: 'keuangan',
      icon: <CurrencyCircleDollar weight="duotone" className="w-6 h-6" />,
      title: 'Laporan Keuangan',
      description: 'Ringkasan keuangan harian',
      adminOnly: false,
    },
    {
      value: 'per-petugas',
      icon: <UserGear weight="duotone" className="w-6 h-6" />,
      title: 'Laporan Per Petugas',
      description: 'Performa petugas',
      adminOnly: true,
    },
  ]

  const datePresets = [
    {
      label: 'Hari Ini',
      getValue: () => {
        const today = format(new Date(), 'yyyy-MM-dd')
        return { start: today, end: today }
      },
    },
    {
      label: '7 Hari',
      getValue: () => {
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - 7)
        return {
          start: format(start, 'yyyy-MM-dd'),
          end: format(end, 'yyyy-MM-dd'),
        }
      },
    },
    {
      label: '30 Hari',
      getValue: () => {
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - 30)
        return {
          start: format(start, 'yyyy-MM-dd'),
          end: format(end, 'yyyy-MM-dd'),
        }
      },
    },
    {
      label: 'Bulan Ini',
      getValue: () => {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth(), 1)
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        return {
          start: format(start, 'yyyy-MM-dd'),
          end: format(end, 'yyyy-MM-dd'),
        }
      },
    },
    {
      label: 'Tahun Ini',
      getValue: () => {
        const now = new Date()
        const start = new Date(now.getFullYear(), 0, 1)
        const end = new Date(now.getFullYear(), 11, 31)
        return {
          start: format(start, 'yyyy-MM-dd'),
          end: format(end, 'yyyy-MM-dd'),
        }
      },
    },
  ]

  const availableTypes = laporanTypes.filter(
    (type) => !type.adminOnly || user?.role === 'admin'
  )

  const handlePresetClick = (preset: any) => {
    const { start, end } = preset.getValue()
    setStartDate(start)
    setEndDate(end)
    setShowPresets(false)
  }

  const handleGenerate = () => {
    if (selectedType === 'per-warga' && !penabungId) {
      setToast({
        isOpen: true,
        title: 'Peringatan',
        message: 'Silakan pilih penabung terlebih dahulu',
        variant: 'error',
      })
      return
    }

    if (selectedType === 'per-petugas' && !petugasId) {
      setToast({
        isOpen: true,
        title: 'Peringatan',
        message: 'Silakan pilih petugas terlebih dahulu',
        variant: 'error',
      })
      return
    }

    setEnableQuery(true)
    refetch()
  }

  const getPeriodString = () => {
    if (!startDate && !endDate) return 'Semua Periode'
    if (startDate && !endDate)
      return `Dari ${format(new Date(startDate), 'dd MMMM yyyy', {
        locale: id,
      })}`
    if (!startDate && endDate)
      return `Sampai ${format(new Date(endDate), 'dd MMMM yyyy', {
        locale: id,
      })}`
    return `${format(new Date(startDate), 'dd MMMM yyyy', {
      locale: id,
    })} - ${format(new Date(endDate), 'dd MMMM yyyy', { locale: id })}`
  }

  const handleExportPDF = () => {
    if (!laporanData) return

    try {
      let doc
      const period = getPeriodString()

      switch (selectedType) {
        case 'keseluruhan':
          doc = generateLaporanKeseluruhanPDF(
            laporanData.data,
            laporanData.total,
            period
          )
          doc.save(`Laporan_Keseluruhan_${format(new Date(), 'yyyyMMdd')}.pdf`)
          break

        case 'per-warga':
          doc = generateLaporanPerWargaPDF(
            laporanData.data,
            laporanData.total,
            laporanData.penabung,
            period
          )
          doc.save(
            `Laporan_${laporanData.penabung.nama}_${format(
              new Date(),
              'yyyyMMdd'
            )}.pdf`
          )
          break

        case 'keuangan':
          doc = generateLaporanKeuanganPDF(
            laporanData.data,
            laporanData.grandTotal,
            period
          )
          doc.save(`Laporan_Keuangan_${format(new Date(), 'yyyyMMdd')}.pdf`)
          break

        case 'per-petugas':
          const petugasPDF = generateLaporanPerWargaPDF(
            laporanData.data,
            laporanData.total,
            {
              nama: laporanData.petugas.namaLengkap,
              totalSaldo: laporanData.total,
            },
            period
          )
          petugasPDF.save(
            `Laporan_Petugas_${laporanData.petugas.namaLengkap
            }_${format(new Date(), 'yyyyMMdd')}.pdf`
          )
          break
      }

      setToast({
        isOpen: true,
        title: 'Berhasil',
        message: 'Laporan PDF berhasil diunduh',
        variant: 'success',
      })
    } catch (error) {
      console.error('Error generating PDF:', error)
      setToast({
        isOpen: true,
        title: 'Gagal',
        message: 'Gagal mengunduh laporan PDF',
        variant: 'error',
      })
    }
  }

  const handleExportExcel = () => {
    if (!laporanData) return

    try {
      let workbook
      const period = getPeriodString()

      switch (selectedType) {
        case 'keseluruhan':
          workbook = generateLaporanKeseluruhanExcel(
            laporanData.data,
            laporanData.total,
            period
          )
          downloadExcel(
            workbook,
            `Laporan_Keseluruhan_${format(new Date(), 'yyyyMMdd')}`
          )
          break

        case 'per-warga':
          workbook = generateLaporanPerWargaExcel(
            laporanData.data,
            laporanData.total,
            laporanData.penabung,
            period
          )
          downloadExcel(
            workbook,
            `Laporan_${laporanData.penabung.nama}_${format(
              new Date(),
              'yyyyMMdd'
            )}`
          )
          break

        case 'keuangan':
          workbook = generateLaporanKeuanganExcel(
            laporanData.data,
            laporanData.grandTotal,
            period
          )
          downloadExcel(
            workbook,
            `Laporan_Keuangan_${format(new Date(), 'yyyyMMdd')}`
          )
          break

        case 'per-petugas':
          workbook = generateLaporanPerPetugasExcel(
            laporanData.data,
            laporanData.total,
            laporanData.petugas,
            period
          )
          downloadExcel(
            workbook,
            `Laporan_Petugas_${laporanData.petugas.namaLengkap
            }_${format(new Date(), 'yyyyMMdd')}`
          )
          break
      }

      setToast({
        isOpen: true,
        title: 'Berhasil',
        message: 'Laporan Excel berhasil diunduh',
        variant: 'success',
      })
    } catch (error) {
      console.error('Error generating Excel:', error)
      setToast({
        isOpen: true,
        title: 'Gagal',
        message: 'Gagal mengunduh laporan Excel',
        variant: 'error',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        title={toast.title}
        message={toast.message}
        variant={toast.variant}
      />

      <div className="max-w-sm mx-auto">
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-4 pt-8 pb-6 rounded-b-3xl shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FileText weight="duotone" className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold">Laporan</h1>
                <p className="text-primary-100 text-sm">Generate & Export</p>
              </div>
            </div>
            <Logo size="lg" showText={false} />
          </motion.div>
        </div>

        <div className="px-4 space-y-4 mt-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 px-1">
              Pilih Jenis Laporan
            </h3>
            <div className="space-y-3">
              {availableTypes.map((type, index) => (
                <LaporanTypeCard
                  key={type.value}
                  icon={type.icon}
                  title={type.title}
                  description={type.description}
                  isSelected={selectedType === type.value}
                  onClick={() => {
                    setSelectedType(type.value)
                    setEnableQuery(false)
                    setPenabungId('')
                    setPetugasId('')
                  }}
                  delay={index * 0.05}
                  adminOnly={type.adminOnly}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 px-1">
              Filter & Parameter
            </h3>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700">
                    Periode Tanggal
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPresets(!showPresets)}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                  >
                    <Funnel weight="bold" className="w-4 h-4" />
                    Preset
                  </button>
                </div>

                <AnimatePresence>
                  {showPresets && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl overflow-hidden"
                    >
                      {datePresets.map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => handlePresetClick(preset)}
                          className="px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="date"
                    label="Dari"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    leftIcon={
                      <CalendarBlank weight="duotone" className="w-5 h-5" />
                    }
                  />
                  <Input
                    type="date"
                    label="Sampai"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    leftIcon={
                      <CalendarBlank weight="duotone" className="w-5 h-5" />
                    }
                  />
                </div>
              </div>

              {selectedType === 'per-warga' && (
                <PenabungSelectorLaporan
                  value={penabungId}
                  onChange={setPenabungId}
                  disabled={false}
                />
              )}

              {selectedType === 'per-petugas' && (
                <PetugasSelectorLaporan
                  value={petugasId}
                  onChange={setPetugasId}
                  disabled={false}
                />
              )}
            </div>
          </div>

          <Button
            variant="primary"
            fullWidth
            onClick={handleGenerate}
            leftIcon={<MagnifyingGlass weight="bold" className="w-5 h-5" />}
          >
            Generate Laporan
          </Button>

          {enableQuery && (
            <>
              {laporanLoading ? (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-4">
                      Memuat data...
                    </p>
                  </div>
                </div>
              ) : !laporanData ? (
                <InfoCard variant="info" title="Belum Ada Data">
                  <p className="text-sm">
                    Silakan generate laporan untuk melihat hasil.
                  </p>
                </InfoCard>
              ) : laporanData.data && laporanData.data.length === 0 ? (
                <InfoCard variant="warning" title="Tidak Ada Data">
                  <p className="text-sm">
                    Tidak ada transaksi pada periode yang dipilih.
                  </p>
                </InfoCard>
              ) : (
                <>
                  <LaporanSummaryCard
                    type={selectedType as any}
                    data={laporanData}
                    period={getPeriodString()}
                  />

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 px-1">
                      Detail Transaksi ({laporanData.data.length})
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {laporanData.data.map((item: any, index: number) => (
                        <LaporanResultCard
                          key={item.id || index}
                          data={item}
                          index={index}
                          type={selectedType as any}
                        />
                      ))}
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <h3 className="text-sm font-semibold text-gray-700 px-1">
                      Export Laporan
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="secondary"
                        onClick={handleExportPDF}
                        leftIcon={
                          <FilePdf weight="duotone" className="w-5 h-5" />
                        }
                        className="text-sm"
                      >
                        PDF
                      </Button>
                      <Button
                        variant="success"
                        onClick={handleExportExcel}
                        leftIcon={
                          <FileXls weight="duotone" className="w-5 h-5" />
                        }
                        className="text-sm"
                      >
                        Excel
                      </Button>
                    </div>
                  </motion.div>
                </>
              )}
            </>
          )}

        </div>
      </div>

      <BottomNav />
    </div>
  )
}