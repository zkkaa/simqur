import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface CreateTransaksiData {
  penabungId: string
  nominal: number
  metodeBayar: 'tunai' | 'transfer'
}

interface UpdateTransaksiData {
  id: string
  nominal: number
  metodeBayar: 'tunai' | 'transfer'
}

interface TransaksiWithPenabung {
  id: string
  nominal: string
  metodeBayar: 'tunai' | 'transfer'
  tanggal: string
  createdAt: Date
  penabung: {
    id: string
    nama: string
    totalSaldo: string
  }
}

export function useTransaksi(date?: string, penabungId?: string) {
  return useQuery({
    queryKey: ['transaksi', date, penabungId],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (date) params.append('date', date)
      if (penabungId) params.append('penabungId', penabungId)

      const response = await fetch(`/api/transaksi?${params}`)
      if (!response.ok) throw new Error('Failed to fetch transaksi')
      return response.json() as Promise<TransaksiWithPenabung[]>
    },
  })
}

export function useTransaksiById(id: string) {
  return useQuery({
    queryKey: ['transaksi', id],
    queryFn: async () => {
      const response = await fetch(`/api/transaksi/${id}`)
      if (!response.ok) throw new Error('Failed to fetch transaksi')
      return response.json() as Promise<TransaksiWithPenabung>
    },
    enabled: !!id,
  })
}

export function useCreateTransaksi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateTransaksiData) => {
      const response = await fetch('/api/transaksi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create transaksi')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaksi'] })
      queryClient.invalidateQueries({ queryKey: ['penabung'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUpdateTransaksi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, nominal, metodeBayar }: UpdateTransaksiData) => {
      const response = await fetch(`/api/transaksi/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nominal, metodeBayar }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update transaksi')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaksi'] })
      queryClient.invalidateQueries({ queryKey: ['penabung'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useDeleteTransaksi() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/transaksi/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete transaksi')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transaksi'] })
      queryClient.invalidateQueries({ queryKey: ['penabung'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}