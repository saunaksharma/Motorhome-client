import React from 'react'

import { cn } from '@/lib/utils'

// Italic display title + the gold swoosh underline used across the site.
// `light` = for sections on a green background.
export function SectionHeading({
  title,
  subtitle,
  light = false,
}: {
  title: string
  subtitle?: string
  light?: boolean
}) {
  return (
    <div className="text-center">
      <h2 className={cn('font-display text-4xl italic sm:text-5xl', light ? 'text-white' : 'text-green')}>
        {title}
      </h2>
      <div className="mx-auto mt-3 h-1 w-40 rounded bg-gold" />
      {subtitle && (
        <p className={cn('mt-4', light ? 'text-white/80' : 'text-muted-foreground')}>{subtitle}</p>
      )}
    </div>
  )
}
