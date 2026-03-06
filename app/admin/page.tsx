'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Shield, LogOut, Check, EyeOff, Trash2, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

type Submission = {
  id: number
  username: string
  message: string
  image_url: string | null
  filter_applied: string
  engagement_count: number
  moderation_status: string
  created_at: string
}

const ADMIN_KEY_STORAGE = 'admin_key'

function getAdminHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {}
  const key = sessionStorage.getItem(ADMIN_KEY_STORAGE)
  return key ? { 'X-Admin-Key': key } : {}
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [actioningId, setActioningId] = useState<number | null>(null)

  const fetchSubmissions = useCallback(async () => {
    const headers = getAdminHeaders()
    if (!Object.keys(headers).length) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/submissions', { headers })
      if (res.status === 401) {
        sessionStorage.removeItem(ADMIN_KEY_STORAGE)
        setIsAuthenticated(false)
        return
      }
      if (!res.ok) throw new Error('Failed to load submissions')
      const data = await res.json()
      setSubmissions(data)
      setIsAuthenticated(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const key = typeof window !== 'undefined' ? sessionStorage.getItem(ADMIN_KEY_STORAGE) : null
    if (key) {
      setAdminKey(key)
      fetchSubmissions()
    }
  }, [fetchSubmissions])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const key = adminKey.trim()
    if (!key) return
    setLoginLoading(true)
    setError(null)
    sessionStorage.setItem(ADMIN_KEY_STORAGE, key)
    try {
      const res = await fetch('/api/admin/submissions', {
        headers: { 'X-Admin-Key': key },
      })
      if (res.status === 401) {
        sessionStorage.removeItem(ADMIN_KEY_STORAGE)
        setError('The password was incorrect.')
        setLoginLoading(false)
        return
      }
      if (!res.ok) {
        setError('Something went wrong. Please try again.')
        setLoginLoading(false)
        return
      }
      const data = await res.json()
      setSubmissions(data)
      setIsAuthenticated(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_KEY_STORAGE)
    setAdminKey('')
    setIsAuthenticated(false)
    setSubmissions([])
  }

  const handleAction = async (id: number, action: 'approve' | 'unpublish' | 'delete') => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...getAdminHeaders(),
    }
    setActioningId(id)
    setError(null)
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ action }),
      })
      if (res.status === 401) {
        sessionStorage.removeItem(ADMIN_KEY_STORAGE)
        setIsAuthenticated(false)
        return
      }
      if (!res.ok) throw new Error('Action failed')
      await fetchSubmissions()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed')
    } finally {
      setActioningId(null)
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="flex items-center gap-2 text-primary mb-6">
            <Shield className="w-8 h-8" />
            <h1 className="text-2xl font-semibold">Admin</h1>
          </div>
          <p className="text-muted-foreground mb-6">
            Enter your admin key to manage submissions.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Admin key"
              className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              autoComplete="current-password"
            />
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking…
                </>
              ) : (
                'Continue'
              )}
            </button>
          </form>
          {error && (
            <p className="mt-4 text-destructive flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </p>
          )}
          <p className="mt-6 text-sm text-muted-foreground">
            <Link href="/" className="underline hover:text-foreground">Back to site</Link>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Shield className="w-6 h-6" />
            <span className="font-semibold">Admin – Submissions</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchSubmissions}
              disabled={loading}
              className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              {loading ? 'Loading…' : 'Refresh'}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Back to site
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {loading && submissions.length === 0 ? (
          <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
            Loading submissions…
          </div>
        ) : submissions.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No submissions yet.</p>
        ) : (
          <ul className="space-y-4">
            {submissions.map((s) => (
              <li
                key={s.id}
                className="p-4 rounded-lg border border-border bg-card flex flex-wrap items-start gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground">{s.username}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        s.moderation_status === 'approved'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {s.moderation_status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(s.created_at).toLocaleString()}
                    </span>
                  </div>
                  {s.message && (
                    <p className="mt-1 text-sm text-foreground line-clamp-2">{s.message}</p>
                  )}
                  {s.image_url && (
                    <div className="mt-2 relative w-24 h-24 rounded overflow-hidden bg-muted">
                      <Image
                        src={s.image_url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="96px"
                        unoptimized={s.image_url.startsWith('https://')}
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {s.moderation_status !== 'approved' && (
                    <button
                      onClick={() => handleAction(s.id, 'approve')}
                      disabled={actioningId === s.id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
                    >
                      {actioningId === s.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Approve
                    </button>
                  )}
                  {s.moderation_status === 'approved' && (
                    <button
                      onClick={() => handleAction(s.id, 'unpublish')}
                      disabled={actioningId === s.id}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 disabled:opacity-50"
                    >
                      {actioningId === s.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                      Unpublish
                    </button>
                  )}
                  <button
                    onClick={() => handleAction(s.id, 'delete')}
                    disabled={actioningId === s.id}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/15 text-destructive text-sm font-medium hover:bg-destructive/25 disabled:opacity-50"
                  >
                    {actioningId === s.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
