'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import React, { useState } from 'react'

type NavItem = { label: string; link: string }

// Responsive header: logo + text nav on desktop; logo + hamburger that opens
// the nav on mobile (reconciles design pages 18 and 20).
export function SiteHeader({ brand, nav }: { brand: string; nav: NavItem[] }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-green/90 text-white backdrop-blur">
      <div className="mx-auto flex min-h-[72px] max-w-[1200px] items-center justify-between gap-4 px-4">
        <Link href="/" className="font-display text-xl italic tracking-wide text-gold">
          {brand}
        </Link>

        <nav className="hidden gap-6 font-heading text-sm uppercase tracking-wide lg:flex">
          {nav.map((item) => (
            <Link key={item.label} href={item.link} className="transition-colors hover:text-gold">
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col pb-4 font-heading uppercase tracking-wide lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.link}
              onClick={() => setOpen(false)}
              className="border-t border-white/10 px-4 py-2.5 transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
