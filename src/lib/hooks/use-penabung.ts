import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Penabung } from '@/types/database'

interface CreatePenabungData {
  nama: string
}

interface UpdatePenabungData {
  id: string
  nama: string
}

export function usePenabung(search?: string, filter?: string) {
  return useQuery({
    queryKey: ['penabung', search, filter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (filter) params.append('filter', filter)

      const response = await fetch(`/api/penabung?${params}`)
      if (!response.ok) throw new Error('Failed to fetch penabung')
      return response.json() as Promise<Penabung[]>
    },
  })
}

export function usePenabungById(id: string) {
  return useQuery({
    queryKey: ['penabung', id],
    queryFn: async () => {
      const response = await fetch(`/api/penabung/${id}`)
      if (!response.ok) throw new Error('Failed to fetch penabung')
      return response.json() as Promise<Penabung>
    },
    enabled: !!id,
  })
}

export function useCreatePenabung() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreatePenabungData) => {
      const response = await fetch('/api/penabung', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create penabung')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['penabung'] })
    },
  })
}

export function useUpdatePenabung() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, nama }: UpdatePenabungData) => {
      const response = await fetch(`/api/penabung/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update penabung')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['penabung'] })
    },
  })
}

export function useDeletePenabung() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/penabung/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete penabung')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['penabung'] })
    },
  })
}