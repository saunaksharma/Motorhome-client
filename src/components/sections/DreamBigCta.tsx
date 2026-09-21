import React from 'react'

import { CtaButton } from '@/components/CtaButton'
import { getHomepage } from '@/lib/payload'

// "Dream Big With Us" CTA banner (design page 39).
export async function DreamBigCta() {
  const home = await getHomepage()
  const cta = home?.dreamBigCta
  if (!cta?.heading) return null

  return (
    <section className="bg-green">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-6 px-4 py-12 text-center sm:flex-row sm:text-left">
        <h2 className="font-display text-3xl italic text-white sm:text-4xl">{cta.heading}</h2>
        {cta.ctaLabel && <CtaButton href={cta.ctaLink ?? '#'} label={cta.ctaLabel} onGreen />}
      </div>
    </section>
  )
}
