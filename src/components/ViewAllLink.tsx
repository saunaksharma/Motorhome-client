import Link from 'next/link'
import React from 'react'

// The gold "View All …" pill used under each featured strip.
export function ViewAllLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-10 text-center">
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 font-heading font-semibold uppercase tracking-wider text-green transition hover:brightness-95"
      >
        {label} →
      </Link>
    </div>
  )
}
