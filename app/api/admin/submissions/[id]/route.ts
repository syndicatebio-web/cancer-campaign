import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdminRequest } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const id = Number((await context.params).id)
  if (!Number.isInteger(id) || id < 1) {
    return NextResponse.json({ error: 'Invalid submission id' }, { status: 400 })
  }

  let body: { action?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const action = body.action
  if (!action || !['approve', 'unpublish', 'delete'].includes(action)) {
    return NextResponse.json(
      { error: 'action must be one of: approve, unpublish, delete' },
      { status: 400 }
    )
  }

  try {
    if (action === 'delete') {
      await prisma.$executeRaw`DELETE FROM moderation_logs WHERE submission_id = ${id}`
      await prisma.$executeRaw`DELETE FROM engagements WHERE submission_id = ${id}`
      await prisma.$executeRaw`DELETE FROM submissions WHERE id = ${id}`
      return NextResponse.json({ ok: true, action: 'deleted' })
    }

    const status = action === 'approve' ? 'approved' : 'rejected'
    await prisma.$executeRaw`
      UPDATE submissions SET moderation_status = ${status} WHERE id = ${id}
    `
    await prisma.$executeRaw`
      INSERT INTO moderation_logs (submission_id, action, reason)
      VALUES (${id}, ${action}, ${`Admin: ${action}`})
    `
    return NextResponse.json({ ok: true, action, moderation_status: status })
  } catch (error) {
    console.error('[admin] Error moderating submission:', error)
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 })
  }
}
