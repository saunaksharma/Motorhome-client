import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import { BedDouble, MapPin, Users } from 'lucide-react'
import { notFound } from 'next/navigation'
import React from 'react'

import { CtaButton } from '@/components/CtaButton'
import { PageBanner } from '@/components/PageBanner'
import { getPayloadClient } from '@/lib/payload'

type Params = Promise<{ slug: string }>

async function getInnovation(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'innovations',
    where: { slug: { equals: slug }, active: { equals: true } },
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
}

export default async function InnovationDetailPage({ params }: { params: Params }) {
  const { slug } = await params
  const item = await getInnovation(slug)
  if (!item) notFound()

  const image = typeof item.heroImage === 'object' ? item.heroImage : null

  return (
    <article>
      <PageBanner eyebrow={item.category} title={item.name} />

      <div className="mx-auto max-w-[1100px] px-4 py-12">
        <div className="grid items-start gap-8 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-green/10">
            {image?.url && (
              <Image
                src={image.url}
                alt={image.alt ?? item.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>

          <div>
            <ul className="space-y-2 text-sm">
              {item.seats && (
                <li className="flex items-center gap-2">
                  <Users className="size-4 text-green" /> Seats: {item.seats}
                </li>
              )}
              {item.sleeps && (
                <li className="flex items-center gap-2">
                  <BedDouble className="size-4 text-green" /> Sleeps: {item.sleeps}
                </li>
              )}
              {item.baseLocation && (
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 text-green" /> {item.baseLocation}
                </li>
              )}
            </ul>

            {item.description && (
              <div className="mt-4 space-y-3 leading-relaxed">
                <RichText data={item.description} />
              </div>
            )}
            <div className="mt-6">
              <CtaButton href={`/contact?destination=${encodeURIComponent(item.name)}`} label="Enquire Now" />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
