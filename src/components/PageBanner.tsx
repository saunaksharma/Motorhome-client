import React from 'react'

// The detail-page header banner: patterned green, gold italic title, swoosh.
export function PageBanner({ eyebrow, title }: { eyebrow?: string | null; title: string }) {
  return (
    <header className="pattern-green py-14 text-center text-white">
      {eyebrow && (
        <p className="font-heading uppercase tracking-[0.2em] text-white/80">{eyebrow}</p>
      )}
      <h1 className="mt-2 font-display text-5xl italic text-gold drop-shadow-sm sm:text-6xl">
        {title}
      </h1>
      <div className="mx-auto mt-4 h-1 w-28 rounded bg-gold" />
    </header>
  )
}
