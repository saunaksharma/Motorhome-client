import Link from 'next/link'
import type { Payload } from 'payload'
import React from 'react'

// Dashboard welcome panel: live counts + one-click shortcuts to the jobs the
// client does most, so nobody has to hunt through the sidebar.
const SHORTCUTS = [
  { label: 'Add a tour', hint: 'New trip + day-by-day plan', href: '/admin/collections/tours/create' },
  { label: 'Add a caravan', hint: 'Photos, specs, tick features', href: '/admin/collections/caravans/create' },
  { label: 'Homepage slideshow', hint: 'Change the big banner photos', href: '/admin/collections/hero-slides' },
  { label: 'Upload photos', hint: 'Media library', href: '/admin/collections/media' },
  { label: 'Add a review', hint: 'Testimonial with photo', href: '/admin/collections/reviews/create' },
  { label: 'Contact & WhatsApp', hint: 'Phone, email, address', href: '/admin/globals/business' },
]

export async function Welcome({ payload }: { payload: Payload }) {
  const [enquiries, subscribers, tours, caravans] = await Promise.all([
    payload.count({ collection: 'enquiries', where: { status: { equals: 'new' } } }),
    payload.count({ collection: 'subscribers' }),
    payload.count({ collection: 'tours' }),
    payload.count({ collection: 'caravans' }),
  ])

  const stats = [
    {
      label: 'New enquiries',
      value: enquiries.totalDocs,
      href: '/admin/collections/enquiries?where[status][equals]=new',
    },
    { label: 'Newsletter sign-ups', value: subscribers.totalDocs, href: '/admin/collections/subscribers' },
    { label: 'Tours', value: tours.totalDocs, href: '/admin/collections/tours' },
    { label: 'Caravans', value: caravans.totalDocs, href: '/admin/collections/caravans' },
  ]

  return (
    <section className="ma-welcome">
      <div className="ma-welcome__hero">
        <div>
          <p className="ma-welcome__eyebrow">Motorhome Adventures</p>
          <h1 className="ma-welcome__title">Welcome back, Admin</h1>
          <p className="ma-welcome__text">
            Everything on the website is edited from here. Pick a shortcut below, or use the menu on the left.
          </p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="ma-welcome__site">
          View website ↗
        </a>
      </div>

      <div className="ma-welcome__stats">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="ma-stat">
            <span className="ma-stat__value">{s.value}</span>
            <span className="ma-stat__label">{s.label}</span>
          </Link>
        ))}
      </div>

      <h2 className="ma-welcome__heading">Quick actions</h2>
      <div className="ma-welcome__shortcuts">
        {SHORTCUTS.map((s) => (
          <Link key={s.label} href={s.href} className="ma-shortcut">
            <span className="ma-shortcut__label">{s.label}</span>
            <span className="ma-shortcut__hint">{s.hint}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
