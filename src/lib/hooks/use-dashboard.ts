import { useQuery } from '@tanstack/react-query'

interface DashboardStats {
  totalPenabung: number
  totalSaldo: string
  penabungLunas: number
  totalPetugas: number
  targetQurban: number
}

interface ChartData {
  tanggal: string
  total: string
  count: number
}

interface RecentLunas {
  id: string
  nama: string
  totalSaldo: string
  updatedAt: Date
}

interface RecentTransaksi {
  id: string
  nominal: string
  metodeBayar: 'tunai' | 'transfer'
  tanggal: string
  createdAt: Date
  penabung: {
    id: string
    nama: string
  }
  petugas: {
    id: string
    namaLengkap: string
  }
}

interface DashboardData {
  stats: DashboardStats
  chartData: ChartData[]
  recentLunas: RecentLunas[]
  recentTransaksi: RecentTransaksi[]
}

export function useDashboard(month?: number, year?: number) {
  return useQuery<DashboardData>({
    queryKey: ['dashboard', month, year],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (month) params.append('month', month.toString())
      if (year) params.append('year', year.toString())

      const res = await fetch(`/api/dashboard?${params.toString()}`)
      if (!res.ok) {
        throw new Error('Failed to fetch dashboard data')
      }
      return res.json()
    },
    staleTime: 1000 * 60 * 5,
  })
}