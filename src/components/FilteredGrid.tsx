'use client'

import { useSearchParams } from 'next/navigation'
import React from 'react'

import { cn } from '@/lib/utils'

// One card plus the filter values it matches, e.g. { location: ['7'], preference: ['2', '5'] }.
export type FilterableItem = { id: number | string; keys: Record<string, string[]>; card: React.ReactNode }

// Filters pre-rendered cards in the browser from the URL params the FilterBar
// sets — instant, no server round-trip, and the page itself stays static (fast).
export function FilteredGrid({
  items,
  params,
  emptyText,
  gridClassName = 'sm:grid-cols-2 lg:grid-cols-3',
}: {
  items: FilterableItem[]
  params: string[] // the URL params that act as filters
  emptyText: string
  gridClassName?: string // column layout, e.g. 'md:grid-cols-2'
}) {
  const search = useSearchParams()
  const active = params.map((p) => [p, search.get(p)] as const).filter(([, v]) => v)
  const visible = items.filter((item) => active.every(([p, v]) => item.keys[p]?.includes(v as string)))

  if (visible.length === 0) {
    return <p className="mt-16 text-center text-muted-foreground">{emptyText}</p>
  }
  return (
    <div className={cn('mt-10 grid gap-6', gridClassName)}>
      {visible.map((item) => (
        <React.Fragment key={item.id}>{item.card}</React.Fragment>
      ))}
    </div>
  )
}
