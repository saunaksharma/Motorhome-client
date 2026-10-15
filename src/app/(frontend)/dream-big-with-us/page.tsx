import { RichText } from '@payloadcms/richtext-lexical/react'
import { Sparkle } from 'lucide-react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React from 'react'

import { CtaButton } from '@/components/CtaButton'
import { getPayloadClient } from '@/lib/payload'
import { pageMetadata } from '@/lib/seo'

// Pre-built (instant); saving the Dream Big page in the admin refreshes it.
export const revalidate = 60

const getDreamBig = async () => (await getPayloadClient()).findGlobal({ slug: 'dream-big', depth: 1 })

export async function generateMetadata() {
  const page = await getDreamBig()
  return pageMetadata(null, {
    title: page.tagline ? `${page.heading}: ${page.tagline}` : page.heading,
    path: '/dream-big-with-us',
    description: 'Build your caravan with Motorhome Adventures and we feature it, rent it out through our network and handle the bookings — so it earns while you are not using it.',
    image: page.photo,
  })
}

// "Dream Big With Us" — the partner programme (client's PDF). Editorial and calm: the opening
// beside a tall photo, "how it works" on the green pattern band, the benefits, then one action.
export default async function DreamBigPage() {
  const page = await getDreamBig()
  if (!page.heading) notFound()
  const photo = typeof page.photo === 'object' && page.photo ? page.photo : null
  const benefits = (page.benefits ?? []).filter((b) => b.text?.trim())
  // Up to two actions (client: B2B + get a caravan built), shown at the top and at the end.
  const buttons = [
    page.ctaLabel && page.ctaLink && <CtaButton key="1" href={page.ctaLink} label={page.ctaLabel} gold solid />,
    page.secondCtaLabel && page.secondCtaLink && <CtaButton key="2" href={page.secondCtaLink} label={page.secondCtaLabel} />,
  ].filter(Boolean)
  const cta = buttons.length > 0 ? <div className="flex flex-wrap items-center gap-4">{buttons}</div> : null

  return (
    <article className="text-green">
      {/* Opening */}
      <section className="mx-auto grid max-w-[1160px] items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:pb-24 md:pt-16">
        <div>
          <p className="font-heading text-xs uppercase tracking-[0.3em] text-gold">Partner Programme</p>
          <h1 className="mt-4 font-display text-4xl leading-[1.1] text-balance sm:text-5xl lg:text-6xl">{page.heading}</h1>
          {page.tagline && <p className="mt-5 font-heading text-lg uppercase tracking-[0.12em] text-green/70 sm:text-xl">{page.tagline}</p>}
          {page.intro && (
            <div className="rich-text mt-8 space-y-4 text-lg leading-relaxed text-green/85">
              <RichText data={page.intro} />
            </div>
          )}
          {cta && <div className="mt-9">{cta}</div>}
        </div>
        {photo?.url && (
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-35px_rgb(13_71_63/0.7)]">
            <Image src={photo.url} alt={photo.alt ?? ''} fill priority sizes="(max-width: 768px) 100vw, 45vw" className="object-cover" />
          </div>
        )}
      </section>

      {/* How it works */}
      {(page.how || page.statement) && (
        <section className="pattern-green px-4 py-16 text-white md:py-24">
          <div className="mx-auto grid max-w-[1160px] gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">{page.howHeading}</h2>
            <div>
              {page.how && (
                <div className="rich-text space-y-4 text-lg leading-relaxed text-white/85">
                  <RichText data={page.how} />
                </div>
              )}
              {page.statement && (
                <div className="mt-10 border-t border-white/15 pt-8">
                  <p className="font-display text-2xl leading-snug text-gold sm:text-3xl">{page.statement}</p>
                  {page.statementNote && <p className="mt-3 text-lg text-white/80">{page.statementNote}</p>}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {benefits.length > 0 && (
        <section className="mx-auto max-w-[1160px] px-4 py-16 md:py-24">
          <h2 className="text-center font-display text-3xl leading-tight sm:text-4xl">{page.benefitsHeading}</h2>
          <ul className="mx-auto mt-10 grid max-w-[920px] gap-4 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-4 rounded-2xl border border-green/10 bg-white p-6">
                <Sparkle aria-hidden className="mt-1 size-5 shrink-0 fill-gold text-gold" />
                <span className="text-lg leading-snug">{benefit.text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Closing + the one action */}
      {(page.closing || cta) && (
        <section className="mx-auto max-w-[820px] px-4 pb-20 text-center md:pb-28">
          {page.closing && <p className="font-display text-2xl leading-snug text-balance sm:text-3xl">{page.closing}</p>}
          {cta && <div className="mt-10 flex justify-center">{cta}</div>}
        </section>
      )}
    </article>
  )
}
