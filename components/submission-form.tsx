'use client'

import React from "react"

import { useState, useRef } from 'react'
import { Upload, Loader2 } from 'lucide-react'

interface SubmissionFormProps {
  onSubmit: () => void
  /** When false (e.g. anonymous pledge), photo upload and filter are hidden. */
  allowPhoto?: boolean
}

export function SubmissionForm({ onSubmit, allowPhoto = true }: SubmissionFormProps) {
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [selectedFilter, setSelectedFilter] = useState('defiant')
  const [loading, setLoading] = useState(false)
  const [filteredImage, setFilteredImage] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filters = [
    { id: 'defiant', label: 'Defiant', icon: '⚡' },
    { id: 'military', label: 'Military', icon: '🛡️' },
    { id: 'warrior', label: 'Warrior', icon: '⚔️' },
    { id: 'fierce', label: 'Fierce', icon: '🔥' },
  ]

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const applyFilter = async () => {
    if (!preview) return

    setLoading(true)
    try {
      const response = await fetch('/api/apply-filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: preview,
          filterType: selectedFilter,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setFilteredImage(data.image || preview)
      }
    } catch (error) {
      console.error('[v0] Error applying filter:', error)
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = allowPhoto
    ? username && (message || preview)
    : username && message

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    try {
      setLoading(true)
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          message,
          imageUrl: allowPhoto ? (filteredImage || preview || null) : null,
          filterApplied: allowPhoto && preview ? selectedFilter : 'none',
        }),
      })

      if (response.ok) {
        setUsername('')
        setMessage('')
        setImage(null)
        setPreview('')
        setFilteredImage('')
        setSelectedFilter('defiant')
        onSubmit()
      }
    } catch (error) {
      console.error('[v0] Error submitting:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card text-card-foreground rounded-lg shadow-lg p-6 space-y-4 max-h-[80vh] overflow-y-auto"
    >
      <h2 className="text-2xl font-bold">Share Your Defiance</h2>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Your Name
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Your Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={allowPhoto ? "Share your affirmation or message (optional if uploading an image)..." : "Share your pledge or message..."}
          rows={4}
          required={!allowPhoto}
          className="w-full px-4 py-2 border border-border bg-background text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {allowPhoto && (
        <>
          <div>
            <label className="block text-sm font-medium text-foreground mb-4">
              Add a Photo (Optional)
            </label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors bg-background"
            >
              <Upload className="mx-auto mb-2 text-muted-foreground" size={32} />
              <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {preview && (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Select Filter</p>
            <div className="grid grid-cols-4 gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`p-3 rounded-lg font-medium transition-all ${
                    selectedFilter === filter.id
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary/60'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  <span className="text-xl">{filter.icon}</span>
                  <p className="text-xs mt-1">{filter.label}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={applyFilter}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 disabled:bg-muted flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            Apply Filter
          </button>

          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-2">Original</p>
              <img src={preview || "/placeholder.svg"} alt="Original" className="w-full rounded-lg" />
            </div>
            {filteredImage && (
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-2">Filtered</p>
                <img src={filteredImage || "/placeholder.svg"} alt="Filtered" className="w-full rounded-lg" />
              </div>
            )}
          </div>
        </div>
          )}
        </>
      )}

      <button
        type="submit"
        disabled={loading || !canSubmit}
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 disabled:bg-muted font-bold text-lg"
      >
        {loading ? 'Submitting...' : 'Add Your Note'}
      </button>
    </form>
  )
}
