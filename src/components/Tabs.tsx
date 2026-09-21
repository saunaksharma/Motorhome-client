'use client'

import React, { useState } from 'react'

import { cn } from '@/lib/utils'

// Minimal accessible tabs. Panels are passed in already rendered (server
// components are fine), so only the active-tab toggle runs on the client.
export function Tabs({ tabs }: { tabs: { label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(0)
  if (tabs.length === 0) return null

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
