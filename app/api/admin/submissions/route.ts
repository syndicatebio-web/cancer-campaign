import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminRequest } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const submissions = await prisma.$queryRaw<
      {
        id: number
        username: string
        message: string
        image_url: string | null
        filter_applied: string
        engagement_count: number
        moderation_status: string
        created_at: Date
      }[]
    >`
      SELECT id, username, message, image_url, filter_applied, engagement_count, moderation_status, created_at
      FROM submissions
      ORDER BY created_at DESC
      LIMIT 500
    `
    return NextResponse.json(submissions)
  } catch (error) {
    console.error('[admin] Error fetching submissions:', error)
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}
