import React from 'react'

// Phase 2 placeholder: proves the shell (header, footer, tokens, fonts) works.
// The real homepage sections come in Phase 3.
export default function HomePage() {
  return (
    <section className="grid min-h-[60vh] place-content-center gap-2 px-4 py-16 text-center">
      <h1 className="font-display text-4xl italic text-green sm:text-6xl">
        Choose Your Home Away Home
      </h1>
      <div className="mx-auto mt-2 h-1 w-40 rounded bg-gold" />
      <p className="text-muted-foreground">Site shell is live — homepage sections come next.</p>
    </section>
  )
}
