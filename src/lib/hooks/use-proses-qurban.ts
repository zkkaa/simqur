import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface CreateProsesQurbanData {
  penabungId: string
  jumlahOrang: number
  nominalPerOrang: number
}

export function useProsesQurban() {
  return useQuery({
    queryKey: ['proses-qurban'],
    queryFn: async () => {
      const response = await fetch('/api/proses-qurban')
      if (!response.ok) throw new Error('Failed to fetch proses qurban')
      return response.json()
    },
  })
}

export function useCreateProsesQurban() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateProsesQurbanData) => {
      const response = await fetch('/api/proses-qurban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create proses qurban')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proses-qurban'] })
      queryClient.invalidateQueries({ queryKey: ['penabung'] })
    },
  })
}