import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface PetugasWithStats {
  id: string
  email: string
  namaLengkap: string
  noTelp: string | null
  isActive: boolean
  createdAt: Date
  totalTransaksi: number
  totalNominal: string
}

interface CreatePetugasData {
  namaLengkap: string
  email: string
  password: string
  noTelp?: string
}

interface UpdatePetugasData {
  id: string
  namaLengkap?: string
  email?: string
  noTelp?: string | null
  isActive?: boolean
}

export function usePetugas() {
  return useQuery({
    queryKey: ['petugas'],
    queryFn: async () => {
      const response = await fetch('/api/petugas')
      if (!response.ok) throw new Error('Failed to fetch petugas')
      return response.json() as Promise<PetugasWithStats[]>
    },
  })
}

export function useCreatePetugas() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreatePetugasData) => {
      const response = await fetch('/api/petugas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create petugas')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['petugas'] })
    },
  })
}

export function useUpdatePetugas() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdatePetugasData) => {
      const response = await fetch(`/api/petugas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update petugas')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['petugas'] })
    },
  })
}

export function useDeactivatePetugas() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/petugas/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to deactivate petugas')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['petugas'] })
    },
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async ({ id, newPassword }: { id: string; newPassword: string }) => {
      const response = await fetch(`/api/petugas/${id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to reset password')
      }

      return response.json()
    },
  })
}