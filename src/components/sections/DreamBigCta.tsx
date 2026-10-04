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
        <h2 className="font-display text-3xl text-white sm:text-5xl">{cta.heading}</h2>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:mt-7 sm:gap-5">
          {cta.ctaLabel && <CtaButton href={cta.ctaLink ?? '#'} label={cta.ctaLabel} onGreen />}
          {cta.secondCtaLabel && <CtaButton href={cta.secondCtaLink ?? '#'} label={cta.secondCtaLabel} onGreen solid />}
        </div>
      </div>
    </section>
  )
}
