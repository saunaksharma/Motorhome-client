import React from 'react'

import { CtaButton } from '@/components/CtaButton'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[700px] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <p className="font-heading text-7xl font-bold text-gold">404</p>
      <h1 className="font-display text-4xl text-green">Off the map</h1>
      <p className="text-muted-foreground">
        That page took a wrong turn. Let’s get you back on the road.
      </p>
      <div className="mt-2">
        <CtaButton href="/" label="Back Home" />
      </div>
    </div>
  )
}
