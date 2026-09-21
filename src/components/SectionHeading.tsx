import React from 'react'

// Italic display title + the gold swoosh underline used across the site.
export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center">
      <h2 className="font-display text-4xl italic text-green sm:text-5xl">{title}</h2>
      <div className="mx-auto mt-3 h-1 w-40 rounded bg-gold" />
      {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
    </div>
  )
}
