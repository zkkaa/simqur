import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/lib/utils/format'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface ChartData {
  tanggal: string
  total: string
  count: number
}

interface PendapatanChartProps {
  data: ChartData[]
  month: number
  year: number
  onMonthChange: (month: number) => void
  onYearChange: (year: number) => void
}

export default function PendapatanChart({
  data,
  month,
  year,
  onMonthChange,
  onYearChange,
}: PendapatanChartProps) {
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  const chartData = data.map((item) => ({
    tanggal: format(new Date(item.tanggal), 'dd MMM', { locale: id }),
    total: parseFloat(item.total),
    count: item.count,
  }))

  const totalPendapatan = data.reduce(
    (sum, item) => sum + parseFloat(item.total || '0'),
    0
  )
  
  const totalTransaksi = data.reduce(
    (sum, item) => sum + Number(item.count || 0), 
    0
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl p-4 shadow-md border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Grafik Pendapatan</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <select
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {months.map((m, i) => (
            <option key={i} value={i + 1}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-primary-50 rounded-xl p-3">
          <p className="text-xs text-primary-600 mb-1">Total Pendapatan</p>
          <p className="text-lg font-bold text-primary-700">
            {formatCurrency(totalPendapatan)}
          </p>
        </div>
        <div className="bg-green-50 rounded-xl p-3">
          <p className="text-xs text-green-600 mb-1">Total Transaksi</p>
          <p className="text-lg font-bold text-green-700">{totalTransaksi}</p>
        </div>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="tanggal"
              tick={{ fontSize: 10 }}
              stroke="#9ca3af"
            />
            <YAxis
              tick={{ fontSize: 10 }}
              stroke="#9ca3af"
              tickFormatter={(value) =>
                `${(value / 1000).toFixed(0)}k`
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [formatCurrency(value), 'Total']}
              labelFormatter={(label) => `Tanggal: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
          Tidak ada data transaksi bulan ini
        </div>
      )}
    </motion.div>
  )
}