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
          <a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition">
            Services
          </a>
          <a href="#why" className="text-sm text-muted-foreground hover:text-foreground transition">
            Why Us
          </a>
          <a href="#family" className="text-sm text-muted-foreground hover:text-foreground transition">
            Family First
          </a>
          <a href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition">
            Admin
          </a>
          <ThemeToggle />
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition">
            Get Started
          </button>
        </nav>
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
