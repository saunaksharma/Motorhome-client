import Image from 'next/image'
import React from 'react'

import { cn } from '@/lib/utils'
import { featureIcon } from './featureIcon'

type Feature = {
  id: number | string
  name: string
  icon?: unknown
}

// The shared stand-in icon every feature starts with (from the initial seed). Features
// still using it get a meaningful icon picked from their name (see featureIcon);
// once the client uploads a real icon for a feature in the admin, that is shown.
const PLACEHOLDER_ICON = 'feature-icon.svg'

// A titled set of features, in the style of premium listings (Airbnb amenities,
// Adria highlights):
//   variant "tiles" — highlight tiles (icon above label) for specs / unique features
//   variant "list"  — two-column icon list for inclusions / add-ons
//   exclude         — "not included" items: muted and struck through
// `extra` is the admin's free-text "Additional …" box (comma- or line-separated).
export function IconFeatureList({
  title,
  features,
  extra,
  exclude = false,
  variant = 'list',
}: {
  title: string
  features?: unknown
  extra?: string | null
  exclude?: boolean
  variant?: 'tiles' | 'list'
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

  const renderIcon = (row: (typeof rows)[number], size: string) => {
    if (row.customIcon) return <Image src={row.customIcon} alt="" width={28} height={28} className={size} />
    const Icon = featureIcon(row.name)
    return <Icon className={size} strokeWidth={1.5} aria-hidden />
  }

  return (
    <section className="mb-12">
      <h3 className="font-heading text-sm uppercase tracking-[0.25em] text-green/60">{title}</h3>

      {variant === 'tiles' ? (
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {rows.map((row) => (
            <li
              key={row.key}
              className="flex flex-col gap-4 rounded-2xl border border-green/10 bg-white p-5 transition-colors hover:border-gold/60"
            >
              <span className="text-green">{renderIcon(row, 'size-8')}</span>
              <span className="text-[15px] font-medium leading-snug text-green">{row.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mt-5 grid gap-x-10 sm:grid-cols-2">
          {rows.map((row) => (
            <li key={row.key} className="flex items-center gap-4 border-b border-green/[0.07] py-3.5">
              <span className={cn('shrink-0', exclude ? 'text-green/35' : 'text-green')}>
                {renderIcon(row, 'size-6')}
              </span>
              <span className={cn('text-[15px]', exclude ? 'text-green/50 line-through decoration-green/30' : 'text-green')}>
                {row.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
