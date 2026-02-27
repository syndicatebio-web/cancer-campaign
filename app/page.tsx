import { Header } from '@/components/header'
import { SubmissionsCanvas } from '@/components/submissions-canvas'
import { WeaponsSection } from '@/components/weapons-section'
import { TestimonyVideosSection } from '@/components/testimony-videos-section'

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <SubmissionsCanvas />
      <WeaponsSection />
      <TestimonyVideosSection />
    </main>
  )
}
