import React from 'react'

import { BookingForm } from '@/components/BookingForm'
import { SectionHeading } from '@/components/SectionHeading'

type SearchParams = Promise<{ destination?: string }>

export const metadata = { title: 'Reserve Your Adventure — Motorhome Adventures' }

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const { destination } = await searchParams

  return (
    <div className="mx-auto max-w-[800px] px-4 py-12">
      <SectionHeading
        title="RESERVE YOUR ADVENTURE"
        subtitle="Tell us about your trip and we’ll be in touch"
      />
      <div className="mt-10">
        <BookingForm destination={destination ?? ''} />
      </div>
    </div>
  )
}
