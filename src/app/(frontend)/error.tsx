'use client' // Error boundaries must be Client Components

import React, { useEffect } from 'react'

import { CtaButton } from '@/components/CtaButton'

// Shown if a page fails to load (e.g. the database is briefly unreachable).
// Visitors get a calm message and two ways forward — never a raw error.
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[700px] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <h1 className="font-display text-4xl text-green">A bump in the road</h1>
      <p className="text-muted-foreground">
        This page didn’t load properly. Please try again — or head back home and continue from there.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-full border-2 border-green bg-green px-8 py-3.5 font-heading font-semibold uppercase tracking-wider text-white transition-colors hover:bg-green/90"
        >
          Try again
        </button>
        <CtaButton href="/" label="Back Home" />
      </div>
    </div>
  )
}
