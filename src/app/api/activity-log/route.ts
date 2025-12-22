import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db, activityLog } from '@/lib/db'
import { desc, like, and, eq, gte, lte, sql } from 'drizzle-orm'
import { formatDateForDB, getIndonesiaDate } from '@/lib/utils/timezone'

// GET - Get activity logs with filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Admin only
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const action = searchParams.get('action')
    const date = searchParams.get('date')

    let conditions: any[] = []

    // Search filter (description)
    if (search) {
      conditions.push(like(activityLog.description, `%${search}%`))
    }

    // Action filter
    if (action && action !== 'all') {
      conditions.push(eq(activityLog.action, action as any))
    }

    // ✅ FIX: Date filter menggunakan timezone Indonesia
    if (date) {
      const targetDate = formatDateForDB(date)
      
      // Extract date from timestamp and compare
      conditions.push(
        sql`DATE(${activityLog.createdAt}) = ${targetDate}`
      )
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const logs = await db
      .select()
      .from(activityLog)
      .where(whereClause)
      .orderBy(desc(activityLog.createdAt))
      .limit(100) // Limit to last 100 logs

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching activity log:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity log' },
      { status: 500 }
    )
  }
}