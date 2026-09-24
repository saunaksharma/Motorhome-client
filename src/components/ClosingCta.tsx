import React from 'react'

import { CtaButton } from '@/components/CtaButton'

// Closes a caravan / tour / innovation page with the same action as its header,
// so a visitor who has read to the end doesn't have to scroll back up to enquire.
export function ClosingCta({ name, href, label }: { name: string; href: string; label: string }) {
  return (
    <section className="mx-auto mt-20 max-w-[1100px] px-4">
      <div className="flex flex-col items-center gap-6 rounded-3xl border border-gold/30 bg-white px-6 py-12 text-center shadow-[0_18px_40px_-28px_rgb(13_71_63/0.45)] sm:py-14">
        <h2 className="text-balance font-display text-3xl text-green sm:text-4xl">Interested in {name}?</h2>
        <p className="max-w-md text-muted-foreground">Tell us about your trip and we’ll be in touch.</p>
        <CtaButton href={href} label={label} />
      </div>
    </section>
  )
}
