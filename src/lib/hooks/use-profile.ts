import { useMutation, useQueryClient } from '@tanstack/react-query'

interface UpdateProfileData {
  id: string
  namaLengkap: string
  noTelp: string | null
}

interface ChangePasswordData {
  id: string
  currentPassword: string
  newPassword: string
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await fetch(`/api/user/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          namaLengkap: data.namaLengkap,
          noTelp: data.noTelp,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update profile')
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate auth query to refresh user data
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const response = await fetch(`/api/user/${data.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to change password')
      }

      return response.json()
    },
  })
}