import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function usePengaturan() {
  return useQuery({
    queryKey: ['pengaturan'],
    queryFn: async () => {
      const response = await fetch('/api/pengaturan')
      if (!response.ok) throw new Error('Failed to fetch pengaturan')
      return response.json()
    },
  })
}

export function useUpdateTarget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (targetQurban: number) => {
      const response = await fetch('/api/pengaturan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetQurban }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update target')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pengaturan'] })
      queryClient.invalidateQueries({ queryKey: ['penabung'] })
    },
  })
}

export function useBackupData() {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/backup')
      if (!response.ok) throw new Error('Failed to backup data')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `SIMQUR_Backup_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    },
  })
}