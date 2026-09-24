import React from 'react'

import { cn } from '@/lib/utils'

// Section title used across the site: display heading, a gold
// line-diamond-line ornament that draws in on scroll, and a spaced-caps subtitle.
// `light` = for sections on a green background. `as="h1"` = the page's own title
// (one per page, for search engines and screen readers); looks the same.
export function SectionHeading({
  title,
  subtitle,
  light = false,
  as: Tag = 'h2',
}: {
  title: string
  subtitle?: string
  light?: boolean
  as?: 'h1' | 'h2'
}) {
  return (
    <div className="reveal text-center">
      <Tag
        className={cn(
          'font-display text-4xl text-balance sm:text-5xl lg:text-6xl',
          light ? 'text-white' : 'text-green',
        )}
      >
        {title}
      </Tag>
      <div aria-hidden className="reveal-bar mx-auto mt-4 flex w-fit items-center gap-3">
        <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold sm:w-20" />
        <span className="size-2 rotate-45 bg-gold" />
        <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold sm:w-20" />
      </div>
      {subtitle && (
        <p
          className={cn(
            'mx-auto mt-4 max-w-xl font-heading text-sm uppercase tracking-[0.28em]',
            light ? 'text-white/75' : 'text-green/60',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
