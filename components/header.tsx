import Image from 'next/image'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo-icon.svg" alt="SyndicateBio logo" width={32} height={32} priority />
          <span className="font-semibold text-lg text-foreground">SyndicateBio</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#pledges" className="text-sm text-muted-foreground hover:text-foreground transition">
            Pledges
          </a>
          <a href="#stories" className="text-sm text-muted-foreground hover:text-foreground transition">
            Testimonies
          </a>
          <a href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition">
            Admin
          </a>
          <ThemeToggle />
        </nav>
        <div className="md:hidden flex items-center gap-4">
          <a href="#pledges" className="text-sm text-muted-foreground hover:text-foreground">Pledges</a>
          <a href="#stories" className="text-sm text-muted-foreground hover:text-foreground">Testimonies</a>
          <a href="/admin" className="text-sm text-muted-foreground hover:text-foreground">Admin</a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
