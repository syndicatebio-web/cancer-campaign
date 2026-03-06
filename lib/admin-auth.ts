const ADMIN_SECRET = process.env.ADMIN_SECRET

export function isAdminRequest(request: Request): boolean {
  if (!ADMIN_SECRET) return false
  const header =
    request.headers.get('x-admin-key') ?? request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  return header === ADMIN_SECRET
}
