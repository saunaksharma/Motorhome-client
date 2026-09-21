import Link from 'next/link'
import React from 'react'

import { cn } from '@/lib/utils'

// Reusable pill button that fills green on hover (design note:
// "Book Now turns green after cursor is taken to book now").
export function CtaButton({
  href = '#',
  label,
  onGreen = false,
}: {
  href?: string
  label: string
  onGreen?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-block rounded-full border-2 px-8 py-3.5 font-heading font-semibold uppercase tracking-wider transition-colors',
        onGreen
          ? 'border-white text-white hover:bg-white hover:text-green'
          : 'border-green text-green hover:bg-green hover:text-white',
      )}
    >
      {label}
    </Link>
  )
}
