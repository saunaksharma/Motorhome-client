import React from 'react'

// Title banner for About and the CMS text pages: a patterned green panel inset and
// rounded like the photo headers (lines up with the floating nav), gold italic title,
// short gold rule. Compact on phones so it doesn't read as a big block.
export function PageBanner({ eyebrow, title }: { eyebrow?: string | null; title: string }) {
  return (
    <header className="px-3 sm:px-4">
      <div className="pattern-green rounded-3xl px-6 py-10 text-center text-white sm:py-14">
        {eyebrow && (
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-white/80 sm:text-sm">{eyebrow}</p>
        )}
        <h1 className="mt-2 text-balance font-display text-4xl leading-[1.1] italic text-gold drop-shadow-sm sm:text-6xl">
          {title}
        </h1>
        <div className="mx-auto mt-4 h-0.5 w-16 rounded bg-gold sm:w-24" />
      </div>
    </header>
  )
}
