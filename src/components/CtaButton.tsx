import Link from 'next/link'
import React from 'react'

// The reusable pill button that fills green on hover (design note:
// "Book Now turns green after cursor is taken to book now").
export function CtaButton({
  href = '#',
  label,
  onGreen = false,
}: {
  href?: string
  label: string
  onGreen?: boolean
}) {
  return (
    <Link href={href} className={onGreen ? 'cta-button cta-button--on-green' : 'cta-button'}>
      {label}
    </Link>
  )
}
