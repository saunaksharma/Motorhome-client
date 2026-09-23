import { Check, X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import { cn } from '@/lib/utils'

type Feature = {
  id: number | string
  name: string
  icon?: unknown
}

// The shared stand-in icon every feature starts with (from the initial seed). Features
// still using it show a clean tick instead; once the client uploads a real icon for a
// feature in the admin, that icon is shown.
const PLACEHOLDER_ICON = 'feature-icon.svg'

// A titled grid of feature rows (Specs / Inclusions / Exclusions / Add-ons). `extra` is
// the admin's free-text "Additional …" box — comma- or line-separated items.
// `exclude` = things NOT included: shown with a muted ✕ rather than a tick.
export function IconFeatureList({
  title,
  features,
  extra,
  exclude = false,
}: {
  title: string
  features?: unknown
  extra?: string | null
  exclude?: boolean
}) {
  const list = (Array.isArray(features) ? features : []).filter(
    (f): f is Feature => typeof f === 'object' && f !== null,
  )
  const extraItems = (extra ?? '')
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
  if (list.length === 0 && extraItems.length === 0) return null

  const rows = [
    ...list.map((f) => {
      const icon = typeof f.icon === 'object' && f.icon !== null ? (f.icon as { url?: string; filename?: string }) : null
      const customIcon = icon?.url && icon.filename !== PLACEHOLDER_ICON ? icon.url : null
      return { key: `f-${f.id}`, name: f.name, customIcon }
    }),
    ...extraItems.map((name) => ({ key: `x-${name}`, name, customIcon: null as string | null })),
  ]

  return (
    <div className="mb-10">
      <h3 className="font-heading text-lg uppercase tracking-[0.18em] text-green">{title}</h3>
      <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
          <li key={row.key} className="flex items-center gap-3 text-sm">
            <span
              className={cn(
                'grid size-7 shrink-0 place-items-center rounded-full',
                exclude ? 'bg-green/[0.06] text-green/40' : 'bg-gold/15 text-gold',
              )}
            >
              {row.customIcon && !exclude ? (
                <Image src={row.customIcon} alt="" width={16} height={16} />
              ) : exclude ? (
                <X className="size-3.5" />
              ) : (
                <Check className="size-3.5" />
              )}
            </span>
            <span className={exclude ? 'text-green/60' : 'text-green'}>{row.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
