'use client'

import { useEffect, useState } from 'react'
import { Heart, Plus, X } from 'lucide-react'
import { SubmissionForm } from '@/components/submission-form'
import { motion, AnimatePresence } from 'framer-motion'

interface Submission {
  id: number
  username: string
  message: string
  image_url: string | null
  filter_applied: string
  engagement_count: number
  created_at: Date | string
}

export function SubmissionsCanvas() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [userEngagements, setUserEngagements] = useState<Set<number>>(new Set())
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/submissions')
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data)
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEngagement = async (submissionId: number) => {
    const userId = `user-${Date.now()}`
    const isEngaged = userEngagements.has(submissionId)

    try {
      await fetch('/api/engagements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          userId,
          engagementType: 'like',
        }),
      })

      setUserEngagements((prev) => {
        const updated = new Set(prev)
        if (isEngaged) {
          updated.delete(submissionId)
        } else {
          updated.add(submissionId)
        }
        return updated
      })

      // Update local count optimistically
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId
            ? { ...s, engagement_count: s.engagement_count + (isEngaged ? -1 : 1) }
            : s
        )
      )
    } catch (error) {
      console.error('Error updating engagement:', error)
    }
  }

  // Generate random rotation for sticky note effect
  const getRandomRotation = (index: number) => {
    const rotations = [-3, -2, -1, 0, 1, 2, 3]
    return rotations[index % rotations.length]
  }

  // Generate random colors for sticky notes (theme-aware)
  const stickyColors = [
    'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800',
    'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
  ]

  const getStickyColor = (index: number) => stickyColors[index % stickyColors.length]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Beautiful gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 via-secondary/5 to-accent/10 dark:from-background dark:via-primary/10 dark:via-secondary/10 dark:to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(23,75,16,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(23,75,16,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(58,63,106,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(58,63,106,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(252,159,146,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(252,159,146,0.12),transparent_60%)]" />
      </div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 pt-20 pb-16 px-4 md:px-8"
      >
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Headline */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 leading-tight">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="block"
              >
                I Stand <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className=" text-primary"
              >
                Strong
              </motion.span>
              </motion.span>
              
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
          >
            Join the movement. Share your pledge. Show cancer that prevention, awareness, and early action are our weapons.
          </motion.p>

          {/* Pledge Options */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12"
          >
            {/* Photo + Pledge Card */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-card border-2 border-primary/20 rounded-xl p-6 shadow-lg"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 1.2 }}
                className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <motion.svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </motion.svg>
              </motion.div>
              <h3 className="text-xl font-bold text-foreground mb-2">Photo + Pledge</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your photo and share your pledge. We'll transform it into a powerful campaign image.
              </p>
              <motion.button
                onClick={() => setShowForm(true)}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Share Your Photo
              </motion.button>
            </motion.div>

            {/* Anonymous Pledge Card */}
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-card border-2 border-secondary/20 rounded-xl p-6 shadow-lg"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 1.4 }}
                className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <motion.svg
                  className="w-8 h-8 text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </motion.svg>
              </motion.div>
              <h3 className="text-xl font-bold text-foreground mb-2">Anonymous Pledge</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Share your message anonymously. Your voice matters, even without a photo.
              </p>
              <motion.button
                onClick={() => setShowForm(true)}
                className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Share Your Pledge
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Example Pledges */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mb-12"
          >
            <p className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
              Example Pledges
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'I get screened yearly',
                'I know my genetic risk',
                'I talk to my family',
                'I choose prevention',
              ].map((pledge, index) => (
                <motion.div
                  key={pledge}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -4 }}
                  className="px-4 py-2 bg-accent/20 dark:bg-accent/10 border border-accent/30 rounded-full text-sm font-medium text-foreground"
                >
                  "{pledge}"
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
            className="flex flex-col items-center gap-2"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wide">See the Movement</p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Canvas Section */}
      <div className="p-4 md:p-8 relative z-10">
        {/* Floating Add Button */}
      <motion.button
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
        aria-label="Add submission"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
      >
        <Plus className="w-8 h-8" />
      </motion.button>

      {/* Canvas Container */}
      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Empty State */}
        <AnimatePresence mode="wait">
          {submissions.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <motion.div
                className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-6"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Plus className="w-16 h-16 text-muted-foreground" />
              </motion.div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Be the First</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-md">
                Start the movement. Share your pledge and show cancer that prevention is our weapon.
              </p>
              <motion.button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Share Your Pledge
              </motion.button>
            </motion.div>
          ) : (
            /* Masonry Grid Layout */
            <motion.div
              key="submissions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 md:gap-6"
            >
              {submissions.map((submission, index) => {
                const rotation = getRandomRotation(index)
                const stickyColor = getStickyColor(index)
                const isEngaged = userEngagements.has(submission.id)
                const hasImage = !!submission.image_url
                const hasMessage = !!submission.message && submission.message.trim().length > 0

                return (
                  <motion.div
                    key={submission.id}
                    className="break-inside-avoid mb-4 md:mb-6 group cursor-pointer relative"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 100,
                      damping: 15,
                      delay: index * 0.05,
                    }}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.2 },
                    }}
                    style={{
                      transformOrigin: 'top center',
                    }}
                  >
                    {/* Realistic Pin */}
                    <motion.div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 z-20"
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 20,
                        delay: index * 0.05 + 0.1,
                      }}
                    >
                      {/* Pin Shadow */}
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-1 bg-black/10 blur-sm rounded-full" />
                      {/* Pin Head */}
                      <div className="w-4 h-4 bg-gradient-to-br from-gray-300 to-gray-500 dark:from-gray-600 dark:to-gray-800 rounded-full shadow-lg border border-gray-400/50 dark:border-gray-700/50 relative">
                        {/* Pin Head Highlight */}
                        <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white/60 rounded-full" />
                      </div>
                      {/* Pin Shaft */}
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-0.5 h-2.5 bg-gradient-to-b from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-700" />
                    </motion.div>

                    <motion.div
                      className={`${stickyColor} border-2 rounded-lg shadow-lg p-4 md:p-5 relative`}
                      style={{
                        transformOrigin: 'top center',
                        rotate: rotation,
                      }}
                      animate={{
                        rotate: [
                          rotation,
                          rotation + 1.5,
                          rotation - 1.5,
                          rotation + 1,
                          rotation - 1,
                          rotation,
                        ],
                      }}
                      transition={{
                        duration: 4 + (index % 3),
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.1,
                      }}
                      whileHover={{
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        scale: 1.02,
                        rotate: rotation,
                        transition: { duration: 0.2 },
                      }}
                    >

                      {/* Image */}
                      {hasImage && (
                        <motion.div
                          className="mb-3 rounded-lg overflow-hidden border border-border/50"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 + 0.1 }}
                        >
                          <motion.img
                            src={submission.image_url || '/placeholder.svg'}
                            alt={submission.username}
                            className="w-full h-auto object-cover"
                            loading="lazy"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          />
                        </motion.div>
                      )}

                      {/* Message/Affirmation */}
                      {hasMessage && (
                        <motion.p
                          className="text-foreground text-sm md:text-base font-medium leading-relaxed mb-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 + 0.15 }}
                        >
                          {submission.message}
                        </motion.p>
                      )}

                      {/* User Info */}
                      <div className="flex items-center justify-between pt-3 border-t border-border/30">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {submission.username}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(submission.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>

                        {/* Engagement Button */}
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEngagement(submission.id)
                          }}
                          className={`ml-2 flex items-center gap-1 px-2 py-1 rounded-md ${
                            isEngaged
                              ? 'text-accent bg-accent/10'
                              : 'text-muted-foreground hover:text-accent hover:bg-accent/5'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <motion.div
                            animate={isEngaged ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            <Heart
                              className={`w-4 h-4 ${isEngaged ? 'fill-current' : ''}`}
                              strokeWidth={2}
                            />
                          </motion.div>
                          <motion.span
                            key={submission.engagement_count}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="text-xs font-medium"
                          >
                            {submission.engagement_count}
                          </motion.span>
                        </motion.button>
                      </div>

                      {/* Filter Badge */}
                      {submission.filter_applied && submission.filter_applied !== 'none' && (
                        <motion.div
                          className="absolute top-2 right-2"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 + 0.2 }}
                        >
                          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                            {submission.filter_applied}
                          </span>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>

      {/* Submission Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-card rounded-lg shadow-xl max-w-2xl w-full p-6 md:p-8 my-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                aria-label="Close"
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
              <SubmissionForm
                onSubmit={() => {
                  setShowForm(false)
                  fetchSubmissions()
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

