import React from 'react'

import { cn } from '@/lib/utils'

// Title banner for About and the CMS text pages: a patterned green panel inset and
// rounded like the photo headers (lines up with the floating nav), gold title,
// short gold rule. Compact on phones so it doesn't read as a big block.
export function PageBanner({ eyebrow, title }: { eyebrow?: string | null; title: string }) {
  // A very long single word ("CANCELLATION", "COLLABORATOR") is wider than a phone at
  // text-4xl, so such titles scale with the screen; others keep the normal size.
  const longWord = Math.max(...title.split(/\s+/).map((word) => word.length)) >= 11
  return (
    <header className="px-3 sm:px-4">
      <div className="pattern-green rounded-3xl px-6 py-10 text-center text-white sm:py-14">
        {eyebrow && (
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-white/80 sm:text-sm">{eyebrow}</p>
        )}
        <h1
          className={cn(
            'mt-2 text-balance font-display leading-[1.1] text-gold drop-shadow-sm sm:text-6xl',
            longWord ? 'text-[length:min(2.25rem,8vw)]' : 'text-4xl max-[359px]:text-[1.9rem]',
          )}
        >
          {title}
        </h1>
        <div className="mx-auto mt-4 h-0.5 w-16 rounded bg-gold sm:w-24" />
      </div>
    </header>
  )
}
