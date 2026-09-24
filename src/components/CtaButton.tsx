import Link from 'next/link'
import React from 'react'

import { cn } from '@/lib/utils'

// Reusable pill button that fills green on hover (design note:
// "Book Now turns green after cursor is taken to book now").
export function CtaButton({
  href = '#',
  label,
  onGreen = false,
  gold = false,
  solid = false,
}: {
  href?: string
  label: string
  onGreen?: boolean
  // `gold` = gold outline + gold text (used on the hero, over photos).
  gold?: boolean
  // `solid` + `gold` = filled gold pill: the page's one main action (hero).
  solid?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-block rounded-full border-2 px-8 py-3.5 font-heading font-semibold uppercase tracking-wider transition-colors',
        gold && solid
          ? 'border-gold bg-gold text-green hover:border-[#d8b457] hover:bg-[#d8b457]' // no shadow: the client asked for none on Book Now
          : gold
            ? 'border-gold text-gold hover:bg-gold hover:text-green'
            : onGreen
              ? 'border-white text-white hover:bg-white hover:text-green'
              : 'border-green text-green hover:bg-green hover:text-white',
      )}
    >
      {label}
    </Link>
  )
}
