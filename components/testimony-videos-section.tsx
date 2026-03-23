'use client'

import { motion } from 'framer-motion'

type SurvivorVideo = {
  id: number
  source: string
  type: 'file' | 'youtube'
  label: string
}

const survivorVideos: SurvivorVideo[] = [
  {
    id: 2,
    source: 'https://youtu.be/tVYuOgKUvzo?si=Eb4W5TPwwdRGBZkP',
    type: 'youtube',
    label: 'Overview',
  },
  {
    id: 3,
    source: 'https://youtube.com/shorts/g-X-BU2YvRA?si=LApo6PY8iWIwRPsI',
    type: 'youtube',
    label: '',
  },
  {
    id: 4,
    source: 'https://youtube.com/shorts/dk292zli0Ac?si=j1MXxHqWKifXBzlT',
    type: 'youtube',
    label: '',
  },
  {
    id: 5,
    source: 'https://youtube.com/shorts/1bv-CBiTPs0?si=3dt_8I_ohmPlc15n',
    type: 'youtube',
    label: '',
  },
]

const featuredVideos = {
  jemima: {
    source: 'https://youtu.be/c1tC6nmIzv8?si=i4LaFf41YWjWvYlg',
    type: 'youtube' as const,
  },
  teniola: {
    source: 'https://youtu.be/7jqVdcxSelc?si=ouh9CJ6WTkRwHsFt',
    type: 'youtube' as const,
  },
}

function getYoutubeEmbedUrl(url: string) {
  const watchUrlMatch = url.match(/[?&]v=([^&]+)/)
  if (watchUrlMatch) return `https://www.youtube.com/embed/${watchUrlMatch[1]}`

  const shortUrlMatch = url.match(/youtu\.be\/([^?&/]+)/)
  if (shortUrlMatch) return `https://www.youtube.com/embed/${shortUrlMatch[1]}`

  const shortsUrlMatch = url.match(/youtube\.com\/shorts\/([^?&/]+)/)
  if (shortsUrlMatch) return `https://www.youtube.com/embed/${shortsUrlMatch[1]}`

  const embedUrlMatch = url.match(/youtube\.com\/embed\/([^?&/]+)/)
  if (embedUrlMatch) return `https://www.youtube.com/embed/${embedUrlMatch[1]}`

  return url
}


export function TestimonyVideosSection() {
  return (
    <section id="stories" className="relative z-10 px-4 md:px-8 py-16 md:py-20">
      <div className="max-w-6xl mx-auto space-y-32">
        {/* Jemima Osunde main video */}
        <div className="grid gap-10 md:grid-cols-2 items-start my-8">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Real stories. Real fighters.
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Cancer can be defeated.
              <span className="block mt-2 text-primary">
                See how in this video by <span className="underline underline-offset-4">Jemima Osunde</span>
              </span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl">
              Hear how early action, information, and support transformed fear into courage. This story shows what is
              possible when we refuse to stand still.
            </p>
          </motion.div>

          {/* Main video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative h-[360px] overflow-hidden rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm shadow-lg"
          >
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {featuredVideos.jemima.type === 'youtube' ? (
              <iframe
                className="w-full h-full"
                src={getYoutubeEmbedUrl(featuredVideos.jemima.source)}
                title="Jemima Osunde testimony video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <video className="w-full h-full object-cover" controls src={featuredVideos.jemima.source} />
            )}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-card-foreground/90">
              <span className="px-2 py-1 rounded-full bg-black/50 text-[0.7rem] font-semibold uppercase tracking-[0.16em]">
                Featured Testimony
              </span>
              <span className="text-[0.75rem] bg-black/40 px-2 py-1 rounded-full">Jemima Osunde</span>
            </div>
          </motion.div>
        </div>

        {/* Dr. Teniola Akirindolu-Michaels featured video */}
        <div className="grid gap-10 md:grid-cols-2 items-start my-8">
          {/* Featured video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative h-[360px] overflow-hidden rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm shadow-lg order-2 md:order-1"
          >
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {featuredVideos.teniola.type === 'youtube' ? (
              <iframe
                className="w-full h-full"
                src={getYoutubeEmbedUrl(featuredVideos.teniola.source)}
                title="Dr. Teniola Akirindolu-Michaels featured story video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <video className="w-full h-full object-cover" controls src={featuredVideos.teniola.source} />
            )}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-card-foreground/90">
              <span className="px-2 py-1 rounded-full bg-black/50 text-[0.7rem] font-semibold uppercase tracking-[0.16em]">
                Featured Story
              </span>
              <span className="text-[0.75rem] bg-black/40 px-2 py-1 rounded-full">
                Dr. Teniola Akirindolu-Michaels
              </span>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 order-1 md:order-2"
          >
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Family history. Early signals.
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              In cancer care, family history is often the first signal.
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl">
              After losing her father to prostate cancer and seeing her mother survive breast cancer,
              Dr. Teniola Akirindolu-Michaels chose genetic testing to understand her own risk. Watch
              her story.
            </p>
          </motion.div>
        </div>

        {/* Survivor grid */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2"
          >
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Action is the weapon
            </p>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              See how these survivors defeated cancer
            </h3>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
              Every testimony is proof that early detection, honest conversations, and strong support can change the
              outcome.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {survivorVideos.map((video, index) => (
              <motion.article
                key={video.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -6, scale: 1.02, boxShadow: '0 16px 30px rgba(0,0,0,0.15)' }}
                className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/90 backdrop-blur-sm shadow-sm"
              >
                {video.type === 'youtube' ? (
                  <div className="relative w-full h-72">
                    <iframe
                      className="w-full h-full"
                      src={getYoutubeEmbedUrl(video.source)}
                      title={video.label || 'Survivor testimony video'}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video className="w-full h-72 object-cover" controls src={video.source} />
                )}
                <div className="p-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{video.label}</span>
                  {/* <span className="px-2 py-0.5 rounded-full bg-muted text-[0.7rem] uppercase tracking-[0.14em]">
                    Survivor
                  </span> */}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


