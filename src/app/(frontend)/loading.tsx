import React from 'react'

// Shown instantly while the next page loads, so a click never feels "dead"
// (matters on slow mobile connections, and in dev where pages compile on first visit).
export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <span className="size-10 animate-spin rounded-full border-[3px] border-gold/25 border-t-gold motion-reduce:animate-none" />
      <span className="font-heading text-sm uppercase tracking-[0.3em] text-green/60">Loading</span>
    </div>
  )
}
