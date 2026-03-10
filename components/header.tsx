'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo-icon.svg" alt="SyndicateBio logo" width={32} height={32} priority />
          <span className="font-semibold text-lg text-foreground">SyndicateBio</span>
        </div>
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#pledges" className="text-sm text-muted-foreground hover:text-foreground transition">
            Pledges
          </a>
          <a href="#stories" className="text-sm text-muted-foreground hover:text-foreground transition">
            Testimonies
          </a>
          <ThemeToggle />
        </nav>
        {/* Mobile nav trigger */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            className="p-2 rounded-md border border-border bg-card text-foreground"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-2">
            <a
              href="#pledges"
              onClick={close}
              className="py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Pledges
            </a>
            <a
              href="#stories"
              onClick={close}
              className="py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Testimonies
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
