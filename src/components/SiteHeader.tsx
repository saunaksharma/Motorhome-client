'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

type NavItem = { label: string; link: string }

// Floating glass navbar (after 21st.dev's "resizable navbar" pattern). On the
// homepage it starts see-through over the hero photo and turns solid on scroll;
// elsewhere it's solid, with a spacer so page content starts below it.
export function SiteHeader({ brand, logoUrl, nav }: { brand: string; logoUrl?: string | null; nav: NavItem[] }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu after navigating.
  useEffect(() => setOpen(false), [pathname])

  // While the mobile menu is open, the page behind it can't scroll.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const solid = !isHome || scrolled || open
  const isActive = (link: string) => (link === '/' ? pathname === '/' : pathname.startsWith(link))
  const [word1, ...rest] = brand.split(' ')

  return (
    <>
      {/* Backdrop behind the open mobile menu: a tap outside closes the menu
          instead of hitting whatever is underneath. */}
      {open && (
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] lg:hidden"
        />
      )}
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
        <div
          className={cn(
            'mx-auto max-w-[1240px] rounded-2xl border transition-all duration-500',
            solid
              ? 'border-gold/25 bg-green/90 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.45)] backdrop-blur-md'
              : // Over the homepage photo: dark frosted glass so the logo and menu stay readable on bright photos.
                'border-white/15 bg-black/30 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.35)] backdrop-blur-md',
          )}
        >
          <div className={cn('flex items-center justify-between gap-4 px-4 transition-all duration-500', solid ? 'h-16' : 'h-20')}>
            {/* Logo lockup */}
            <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={`${brand} — home`}>
              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt=""
                  width={148}
                  height={80}
                  priority
                  className={cn('w-auto object-contain transition-all duration-500', solid ? 'h-9' : 'h-11')}
                />
              )}
              <span className="flex flex-col leading-none">
                {/* Brand name in Cinzel + the old site's gold, as on the previous site. */}
                <span className="font-brand text-xl font-bold uppercase tracking-wide text-brand-gold sm:text-2xl lg:text-xl">{word1}</span>
                <span className="mt-1 font-brand text-[10px] font-semibold uppercase tracking-[0.42em] text-brand-gold/90">{rest.join(' ')}</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 lg:flex">
              {nav.map((item) => (
                <Link
                  key={item.label}
                  href={item.link}
                  className={cn(
                    // Tighter at lg so all 8 items fit on one line down to 1024px (iPad landscape).
                    'group relative whitespace-nowrap px-1.5 py-2 font-heading text-[12px] uppercase tracking-[0.08em] transition-colors xl:px-2.5 xl:text-[13px] xl:tracking-[0.12em]',
                    isActive(item.link) ? 'text-gold' : 'text-white/90 hover:text-gold',
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      'absolute inset-x-1.5 -bottom-0.5 h-px origin-center bg-gold transition-transform duration-300 xl:inset-x-2.5',
                      isActive(item.link) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                    )}
                  />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/contact"
                className="hidden shrink-0 whitespace-nowrap rounded-full bg-gold px-5 py-2 font-heading text-[13px] font-bold uppercase tracking-wider text-green transition hover:bg-[#d8b457] xl:inline-block"
              >
                Book Now
              </Link>
              <button
                className="rounded-full p-2 text-white transition hover:bg-white/10 lg:hidden"
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={cn(
              'grid transition-[grid-template-rows] duration-300 ease-out lg:hidden',
              open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
            )}
          >
            <nav className="overflow-hidden">
              <div className="flex flex-col gap-1 border-t border-white/10 px-3 pb-4 pt-2">
                {nav.map((item) => (
                  <Link
                    key={item.label}
                    href={item.link}
                    className={cn(
                      'rounded-xl px-3 py-2.5 font-heading uppercase tracking-[0.12em] transition-colors',
                      isActive(item.link) ? 'bg-white/10 text-gold' : 'text-white/90 hover:bg-white/5 hover:text-gold',
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  className="mt-2 rounded-full bg-gold px-5 py-3 text-center font-heading font-semibold uppercase tracking-wider text-green"
                >
                  Book Now
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>
      {/* Pages start below the floating bar. Always rendered: the shared layout is pre-built
          without knowing the page, so a homepage check here put a cream gap above the homepage
          hero. The homepage hero instead pulls itself up under the bar (-mt-[92px]). */}
      <div aria-hidden className="h-[92px]" />
    </>
  )
}
