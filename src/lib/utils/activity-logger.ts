import { db, activityLog } from '@/lib/db'
import type { ActionType, UserRole } from '@/types/database'

interface LogActivityParams {
  userId: string
  userRole: UserRole
  action: ActionType
  tableName: string
  recordId?: string
  description: string
  oldData?: any
  newData?: any
  ipAddress?: string
}

export async function logActivity({
  userId,
  userRole,
  action,
  tableName,
  recordId,
  description,
  oldData,
  newData,
  ipAddress,
}: LogActivityParams) {
  try {
    await db.insert(activityLog).values({
      userId,
      userRole,
      action,
      tableName,
      recordId,
      description,
      oldData: oldData ? JSON.stringify(oldData) : null,
      newData: newData ? JSON.stringify(newData) : null,
      ipAddress,
    })
  } catch (error) {
    console.error('Failed to log activity:', error)
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  return 'unknown'
}