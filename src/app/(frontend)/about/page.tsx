import React from 'react'

import { CtaButton } from '@/components/CtaButton'
import { AboutSections } from '@/components/sections/AboutSections'
import { PageBanner } from '@/components/PageBanner'
import { TeamSection } from '@/components/sections/TeamSection'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60
export const metadata = {
  title: 'About Us',
  description:
    'Meet the people behind Motorhome Adventures and how our caravan journeys began.',
  alternates: { canonical: '/about' },
}

export default async function AboutPage() {
  const payload = await getPayloadClient()
  const about = await payload.findGlobal({ slug: 'about', depth: 1 })

  const hiring = about.hiring

  return (
    <article>
      <PageBanner pageTitle="About Motorhome Adventures" title={about.headline || 'About Us'} />

      {/* Our Story as on the homepage (client): the first chapter with its video, then "Read more"
          opens the rest (Homepage → Our Story). */}
      <AboutSections preview />

      <div className="mx-auto max-w-[1100px] space-y-16 px-4 py-14">

        {/* The staff — Site Settings → About → The Team (client). */}
        <TeamSection heading={about.teamHeading} intro={about.teamIntro} people={Array.isArray(about.team) ? about.team : []} />

        {/* Join our family / hiring */}
        {hiring?.heading && (
          <section className="pattern-green rounded-3xl px-6 py-12 text-center text-white">
            <h2 className="font-display text-3xl sm:text-4xl">{hiring.heading}</h2>
            {hiring.text && <p className="mx-auto mt-4 max-w-[640px] text-white/90">{hiring.text}</p>}
            {hiring.ctaLink && (
              <div className="mt-6">
                <CtaButton href={hiring.ctaLink} label={hiring.ctaLabel || 'See open roles'} gold />
              </div>
            )}
          </section>
        )}

        {/* Socials */}
        {(about.instagramUrl || about.youtubeUrl) && (
          <section className="flex flex-wrap items-center justify-center gap-4">
            {about.instagramUrl && (
              <a href={about.instagramUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-green px-6 py-3 font-heading font-semibold text-green transition hover:bg-green hover:text-white">
                Follow on Instagram
              </a>
            )}
            {about.youtubeUrl && (
              <a href={about.youtubeUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-green px-6 py-3 font-heading font-semibold text-green transition hover:bg-green hover:text-white">
                Watch on YouTube
              </a>
            )}
          </section>
        )}
      </div>
    </article>
  )
}
