import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

// Header for a homepage card row, after Adria's product rows: title (+ small subtitle) on
// the left, a quiet "View all" link on the right — instead of a centred title with a big
// button under the row.
export function RowHeading({
  title,
  subtitle,
  href,
  linkLabel = 'View all',
}: {
  title: string
  subtitle?: string
  href: string
  linkLabel?: string
}) {
  return (
    <div className="reveal flex items-end justify-between gap-4">
      <div className="min-w-0">
        {/* Narrow Android phones: a smaller size so one long word ("INNOVATIONS") fits beside "View all". */}
        <h2 className="font-display text-3xl text-green max-[380px]:text-[1.6rem] max-[340px]:text-[1.35rem] sm:text-4xl lg:text-5xl">{title}</h2>
        {subtitle && (
          <p className="mt-2 font-heading text-xs uppercase tracking-[0.25em] text-green/55 sm:text-sm">{subtitle}</p>
        )}
      </div>
      <Link
        href={href}
        className="group inline-flex shrink-0 items-center gap-1.5 pb-1 font-heading text-xs font-bold uppercase tracking-[0.18em] text-green transition-colors hover:text-gold sm:text-sm"
      >
        {/* Phones: just "View all" so title + link fit on one line at 375px. */}
        <span className="sm:hidden">View all</span>
        <span className="hidden sm:inline">{linkLabel}</span>
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  )
}
