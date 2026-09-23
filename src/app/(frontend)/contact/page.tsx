import React from 'react'

import { BookingForm } from '@/components/BookingForm'
import { SectionHeading } from '@/components/SectionHeading'

export const metadata = { title: 'Reserve Your Adventure' }

// Static page (instant); the form fills "Destination" from the link in the browser.
export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 py-12">
      <SectionHeading
        title="RESERVE YOUR ADVENTURE"
        subtitle="Tell us about your trip and we’ll be in touch"
      />
      <div className="mt-10">
        <BookingForm />
      </div>
    </div>
  )
}
