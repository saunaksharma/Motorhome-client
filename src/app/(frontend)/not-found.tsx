import Link from 'next/link'
import React from 'react'

import { CtaButton } from '@/components/CtaButton'

const SECTIONS = [
  { label: 'Tours', href: '/tours' },
  { label: 'Caravans', href: '/caravans' },
  { label: 'Innovations', href: '/innovations' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[700px] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <p className="font-heading text-7xl font-bold text-gold">404</p>
      <h1 className="font-display text-4xl text-green">Off the map</h1>
      <p className="text-muted-foreground">
        That page took a wrong turn. Let’s get you back on the road.
      </p>
      <div className="mt-2">
        <CtaButton href="/" label="Back Home" />
      </div>
      {/* Or straight to a main section. */}
      <nav aria-label="Main sections" className="mt-4 flex flex-wrap justify-center gap-2">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-full border border-green/25 px-4 py-2 font-heading text-xs uppercase tracking-wider text-green transition-colors hover:border-green hover:bg-green hover:text-white"
          >
            {s.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
