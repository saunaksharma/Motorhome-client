import Link from 'next/link'
import React, { type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

// Magic UI "Shimmer Button" (via 21st.dev, MIT) as a link — a gold light sweeps
// around the pill's edge. Brand colours: green body, gold shimmer + text.
export function ShimmerLink({ href, label, className }: { href: string; label: string; className?: string }) {
  return (
    <Link
      href={href}
      style={
        {
          '--spread': '90deg',
          '--shimmer-color': '#f3d98b',
          '--radius': '999px',
          '--speed': '3s',
          '--cut': '0.1em',
          '--bg': 'rgb(13 71 63 / 0.92)',
        } as CSSProperties
      }
      className={cn(
        'group relative z-0 inline-flex items-center justify-center overflow-hidden [border-radius:var(--radius)] border border-gold/60 px-9 py-3.5 [background:var(--bg)]',
        'font-heading font-semibold uppercase tracking-wider whitespace-nowrap text-gold',
        'transform-gpu transition-transform duration-300 hover:scale-[1.03] active:translate-y-px',
        className,
      )}
    >
      {/* spark */}
      <div className="@container-[size] absolute inset-0 -z-30 overflow-visible blur-[2px]">
        <div className="absolute inset-0 aspect-square h-[100cqh] animate-shimmer-slide">
          <div className="absolute -inset-full w-auto rotate-0 animate-spin-around [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
        </div>
      </div>
      {label}
      {/* highlight */}
      <div className="absolute inset-0 size-full rounded-full shadow-[inset_0_-8px_10px_#ffffff1f] transition-all duration-300 group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]" />
      {/* backdrop */}
      <div className="absolute inset-(--cut) -z-20 [border-radius:var(--radius)] [background:var(--bg)]" />
    </Link>
  )
}
