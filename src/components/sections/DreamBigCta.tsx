import React from 'react'

import { CtaButton } from '@/components/CtaButton'
import { getHomepage } from '@/lib/payload'

// "Dream Big With Us" — exactly as the client's design (page 39): a green band with the
// Canva doodle pattern on the page's cream pattern, the heading centred above two pill buttons
// (outlined + white). Heading and both buttons are edited in Homepage → Dream Big.
export async function DreamBigCta() {
  const home = await getHomepage()
  const cta = home?.dreamBigCta
  if (!cta?.heading) return null

  return (
    <section className="pb-6 pt-14 sm:pb-8 sm:pt-20">
      <div className="pattern-green px-4 py-10 text-center sm:py-12">
        {/* Phones: heading on one line and the two buttons side by side, compact — like desktop. */}
        <h2 className="whitespace-nowrap font-display text-[length:min(1.875rem,6.6vw)] text-white sm:text-5xl">{cta.heading}</h2>
        <div className="mt-5 flex items-center justify-center gap-3 *:px-5 *:py-2.5 *:text-xs sm:mt-7 sm:gap-5 sm:*:px-8 sm:*:py-3.5 sm:*:text-base">
          {cta.ctaLabel && <CtaButton href={cta.ctaLink ?? '#'} label={cta.ctaLabel} onGreen />}
          {cta.secondCtaLabel && <CtaButton href={cta.secondCtaLink ?? '#'} label={cta.secondCtaLabel} onGreen solid />}
        </div>
      </div>
    </section>
  )
}
