import React from 'react'

import { CtaButton } from '@/components/CtaButton'
import { getHomepage } from '@/lib/payload'

// The camping line-art (trees, mountains, caravans) as a mask, so one drawing can be any
// colour: faint green on the cream around the banner, darker lines on the green band.
// (camp-pattern-mask.svg = camp-pattern.svg at full opacity; the overlay sets the strength.)
const patternMask: React.CSSProperties = {
  maskImage: 'url(/camp-pattern-mask.svg)',
  WebkitMaskImage: 'url(/camp-pattern-mask.svg)',
  maskSize: '240px 240px',
  WebkitMaskSize: '240px 240px',
}

// "Dream Big With Us" — exactly as the client's design (page 39): a green band with the
// camping pattern on a cream patterned stage, the heading centred above two pill buttons
// (outlined + white). Heading and both buttons are edited in Homepage → Dream Big.
export async function DreamBigCta() {
  const home = await getHomepage()
  const cta = home?.dreamBigCta
  if (!cta?.heading) return null

  return (
    <section className="relative overflow-hidden pb-6 pt-14 sm:pb-8 sm:pt-20">
      <div aria-hidden className="absolute inset-0 bg-green/[0.08]" style={patternMask} />

      <div className="relative bg-green px-4 py-10 text-center sm:py-12">
        <div aria-hidden className="absolute inset-0 bg-black/20" style={patternMask} />
        <div className="relative">
          <h2 className="font-display text-3xl text-white sm:text-5xl">{cta.heading}</h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:mt-7 sm:gap-5">
            {cta.ctaLabel && <CtaButton href={cta.ctaLink ?? '#'} label={cta.ctaLabel} onGreen />}
            {cta.secondCtaLabel && <CtaButton href={cta.secondCtaLink ?? '#'} label={cta.secondCtaLabel} onGreen solid />}
          </div>
        </div>
      </div>
    </section>
  )
}
