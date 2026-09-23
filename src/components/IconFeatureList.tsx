import { Check } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type Feature = {
  id: number | string
  name: string
  icon?: unknown
}

// A titled grid of icon + label rows (Specs / Inclusions / etc.). Icons come
// from the Features collection. `extra` is the admin's free-text "Additional …"
// box — comma- or line-separated items shown with a plain check mark.
export function IconFeatureList({
  title,
  features,
  extra,
}: {
  title: string
  features?: unknown
  extra?: string | null
}) {
  const list = (Array.isArray(features) ? features : []).filter(
    (f): f is Feature => typeof f === 'object' && f !== null,
  )
  const extraItems = (extra ?? '')
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
  if (list.length === 0 && extraItems.length === 0) return null

  return (
    <div className="mb-8">
      <h3 className="font-display text-xl italic text-green">{title}</h3>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((feature) => {
          const icon = typeof feature.icon === 'object' ? (feature.icon as { url?: string }) : null
          return (
            <li key={feature.id} className="flex items-center gap-2 text-sm">
              {icon?.url && <Image src={icon.url} alt="" width={18} height={18} className="shrink-0" />}
              <span>{feature.name}</span>
            </li>
          )
        })}
        {extraItems.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm">
            <Check className="size-4 shrink-0 text-gold" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
