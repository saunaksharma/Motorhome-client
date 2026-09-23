import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import React from 'react'

import { CtaButton } from '@/components/CtaButton'
import { PageBanner } from '@/components/PageBanner'
import { SectionHeading } from '@/components/SectionHeading'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 60
export const metadata = { title: 'About Us' }

export default async function AboutPage() {
  const payload = await getPayloadClient()
  const about = await payload.findGlobal({ slug: 'about', depth: 1 })

  const video = typeof about.video === 'object' ? about.video : null
  const team = (Array.isArray(about.team) ? about.team : []).filter((m) => m.name)
  const hiring = about.hiring

  return (
    <article>
      <PageBanner title={about.headline || 'About Us'} />

      <div className="mx-auto max-w-[1100px] space-y-16 px-4 py-14">
        {/* Story + optional intro video/photo */}
        {(about.intro || video?.url) && (
          <section className="grid items-center gap-8 md:grid-cols-2">
            {video?.url && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-green/10">
                <Image src={video.url} alt={video.alt ?? 'Motorhome Adventures'} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              </div>
            )}
            {about.intro && (
              <div className={video?.url ? '' : 'md:col-span-2'}>
                <div className="rich-text space-y-3 leading-relaxed">
                  <RichText data={about.intro} />
                </div>
              </div>
            )}
          </section>
        )}

        {/* The team */}
        {team.length > 0 && (
          <section>
            <SectionHeading title="Meet the Team" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member, index) => {
                const photo = typeof member.photo === 'object' ? member.photo : null
                return (
                  <div key={index} className="text-center">
                    <div className="relative mx-auto aspect-square w-40 overflow-hidden rounded-full bg-green/10 ring-4 ring-gold/30">
                      {photo?.url && (
                        <Image src={photo.url} alt={member.name} fill sizes="160px" className="object-cover" />
                      )}
                    </div>
                    <p className="mt-4 font-heading text-lg font-semibold text-green">{member.name}</p>
                    {member.role && <p className="text-sm text-muted-foreground">{member.role}</p>}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Join our family / hiring */}
        {hiring?.heading && (
          <section className="pattern-green rounded-3xl px-6 py-12 text-center text-white">
            <h2 className="font-display text-3xl italic sm:text-4xl">{hiring.heading}</h2>
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
