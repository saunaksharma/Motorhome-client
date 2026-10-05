'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

// Where the layout shows the shared video row (above the footer): every page except the
// homepage and the caravan / tour / innovation pages — those place it themselves, above
// "Watch it in action" (client).
const PLACES_ITS_OWN = /^\/(caravans|tours|innovations)\/[^/]+/

export function ShowcaseSlot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname === '/' || PLACES_ITS_OWN.test(pathname)) return null
  return <div className="mx-auto max-w-[1200px] px-4">{children}</div>
}
