'use client'

import React, { useState } from 'react'

import { cn } from '@/lib/utils'

// Minimal accessible tabs. Panels are passed in already rendered (server
// components are fine), so only the active-tab toggle runs on the client.
// `hanging` = the Canva's Tales / Snaps tabs (design pages 45, 46, 51): a green rule with the tabs
// hanging below it, flared where they meet the rule; the panel follows underneath.
export function Tabs({ tabs, hanging = false }: { tabs: { label: string; content: React.ReactNode }[]; hanging?: boolean }) {
  const [active, setActive] = useState(0)
  if (tabs.length === 0) return null

  if (hanging) {
    return (
      <div>
        <div aria-hidden className="h-2 rounded-full bg-green" />
        <div role="tablist" className="flex gap-6 pl-6 sm:gap-8 sm:pl-12">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              role="tab"
              aria-selected={index === active}
              onClick={() => setActive(index)}
              className={cn(
                // The flares: a quarter-circle cut-out each side, so the tab grows out of the rule.
                'relative -mt-px rounded-b-[1.6rem] px-9 pb-3 pt-2 font-heading text-lg font-bold uppercase tracking-wide text-white transition-colors sm:px-12 sm:text-xl',
                "before:absolute before:-left-4 before:top-0 before:size-4 before:bg-[radial-gradient(circle_at_0_100%,transparent_1rem,var(--tab)_calc(1rem+0.5px))] before:content-['']",
                "after:absolute after:-right-4 after:top-0 after:size-4 after:bg-[radial-gradient(circle_at_100%_100%,transparent_1rem,var(--tab)_calc(1rem+0.5px))] after:content-['']",
                index === active ? 'bg-green [--tab:var(--color-green)]' : 'bg-green/60 [--tab:color-mix(in_srgb,var(--color-green)_60%,transparent)] hover:bg-green/80',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div role="tabpanel" className="pt-8">
          {tabs[active].content}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div role="tablist" className="flex flex-wrap gap-2 border-b border-border">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            role="tab"
            aria-selected={index === active}
            onClick={() => setActive(index)}
            className={cn(
              'rounded-t-lg px-5 py-2 font-heading font-semibold uppercase tracking-wide transition-colors',
              index === active ? 'bg-green text-white' : 'text-green hover:bg-green/10',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="pt-6">
        {tabs[active].content}
      </div>
    </div>
  )
}
