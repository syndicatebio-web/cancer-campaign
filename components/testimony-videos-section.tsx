'use client'

import { motion } from 'framer-motion'

const survivorVideos = [
  {
    id: 2,
    file: 'https://hhvxqq0spu9scx5q.public.blob.vercel-storage.com/syndicate-bio/ESTHER-Single-2026-02-23T18-50-11.655Z.mp4',
    label: 'Survivor Story 1',
  },
  {
    id: 3,
    file: 'https://hhvxqq0spu9scx5q.public.blob.vercel-storage.com/syndicate-bio/MIDE-Single-2026-02-23T19-10-18.805Z.mp4',
    label: 'Survivor Story 2',
  },
  {
    id: 4,
    file: 'https://hhvxqq0spu9scx5q.public.blob.vercel-storage.com/syndicate-bio/OCHAI-FULL-2026-02-23T19-17-08.185Z.mp4',
    label: 'Survivor Story 3',
  },
  {
    id: 5,
    file: 'https://hhvxqq0spu9scx5q.public.blob.vercel-storage.com/syndicate-bio/Main.mp4',
    label: 'Survivor Story 4',
  },
]

export function TestimonyVideosSection() {
  return (
    <section id="stories" className="relative z-10 px-4 md:px-8 py-16 md:py-20">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Jemima Osunde main video */}
        <div className="grid gap-10 md:grid-cols-2 items-start">
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
            className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/80 backdrop-blur-sm shadow-lg"
          >
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <video
              className="w-full h-full max-h-[360px] object-cover"
              controls
              src="https://hhvxqq0spu9scx5q.public.blob.vercel-storage.com/syndicate-bio/Syndicate-testimony-1%20.MOV"
            />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-card-foreground/90">
              <span className="px-2 py-1 rounded-full bg-black/50 text-[0.7rem] font-semibold uppercase tracking-[0.16em]">
                Featured Testimony
              </span>
              <span className="text-[0.75rem] bg-black/40 px-2 py-1 rounded-full">Jemima Osunde</span>
            </div>
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
                <video className="w-full h-72 object-cover" controls src={video.file} />
                <div className="p-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{video.label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-muted text-[0.7rem] uppercase tracking-[0.14em]">
                    Survivor
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


