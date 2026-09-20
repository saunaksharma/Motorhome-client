'use client'

import Link from 'next/link'
import React, { useState } from 'react'

type NavItem = { label: string; link: string }

// Responsive header: logo + text nav on desktop; logo + hamburger ("dash")
// that opens the nav on mobile. Industry-standard reconciliation of design
// pages 18 (mobile icons/dash) and 20 (desktop text nav).
export function SiteHeader({ brand, nav }: { brand: string; nav: NavItem[] }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="site-header__brand">
          {brand}
        </Link>

        <nav className="site-nav">
          {nav.map((item) => (
            <Link key={item.label} href={item.link}>
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </div>

      {open && (
        <nav className="mobile-nav container">
          {nav.map((item) => (
            <Link key={item.label} href={item.link} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
