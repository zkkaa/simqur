import { useQuery } from '@tanstack/react-query'

export function useActivityLog(search?: string, action?: string, date?: string) {
  return useQuery({
    queryKey: ['activity-log', search, action, date],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (action && action !== 'all') params.append('action', action)
      if (date) params.append('date', date)

      const response = await fetch(`/api/activity-log?${params}`)
      if (!response.ok) throw new Error('Failed to fetch activity log')
      return response.json()
    },
  })
}