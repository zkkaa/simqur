import { useQuery } from '@tanstack/react-query'

interface LaporanParams {
  type: 'keseluruhan' | 'per-warga' | 'keuangan' | 'per-petugas'
  startDate?: string
  endDate?: string
  penabungId?: string
  petugasId?: string
}

export function useLaporan(params: LaporanParams, enableQuery: boolean) {
  return useQuery({
    queryKey: ['laporan', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      searchParams.append('type', params.type)
      if (params.startDate) searchParams.append('startDate', params.startDate)
      if (params.endDate) searchParams.append('endDate', params.endDate)
      if (params.penabungId) searchParams.append('penabungId', params.penabungId)
      if (params.petugasId) searchParams.append('petugasId', params.petugasId)

      const response = await fetch(`/api/laporan?${searchParams}`)
      if (!response.ok) throw new Error('Failed to fetch laporan')
      return response.json()
    },
    enabled: false, // Don't auto-fetch, wait for user to generate
  })
}