'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Github, Linkedin, BookOpen, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'
import { SearchBar } from '@/components/search/SearchBar'

const navigation = [
  { name: 'HOME', href: '/' },
  { name: 'PORTFOLIO', href: '/portfolio' },
  { name: 'BLOG', href: '/blog' },
  { name: 'ABOUT', href: '/about' },
  { name: 'RESUME', href: '/resume' },
  { name: 'CONTACT', href: '/contact' },
]

export function Header() {
  const { trackClick } = useAnalyticsEvent()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathnameFromHook = usePathname()
  const pathname =
    pathnameFromHook ?? (typeof window !== 'undefined' ? window.location.pathname : '')
  const panelRef = useRef<HTMLDivElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const closeMenu = useCallback(() => setMobileMenuOpen(false), [])

  useEffect(() => {
    if (!mobileMenuOpen) return

    const originalBodyOverflow = document.body.style.overflow
    const openerEl = menuButtonRef.current
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(focusableSelector)
        ).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1)
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    queueMicrotask(() => firstLinkRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = originalBodyOverflow
      openerEl?.focus()
    }
  }, [mobileMenuOpen, closeMenu])

  return (
    <header className="sticky top-0 z-50 border-b border-brutal-ink/15 bg-brutal-bg/95 backdrop-blur-sm">
      <nav className="mx-auto max-w-shell px-6 lg:px-8" aria-label="Main">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-serif text-lg font-semibold tracking-tight text-brutal-ink transition-opacity hover:opacity-70"
          >
            Emmanuel Ugbaje
          </Link>

          <div className="hidden min-w-0 items-center gap-4 lg:flex xl:gap-6">
            <div className="flex min-w-0 items-center gap-5 xl:gap-7">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn('brutal-nav-link', isActive && 'opacity-100')}
                    data-active={isActive ? 'true' : undefined}
                    onClick={() =>
                      trackClick('nav_link', {
                        link: item.name,
                        href: item.href,
                        location: 'desktop',
                      })
                    }
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
            <div className="ml-1 flex items-center gap-3 border-l border-brutal-ink/15 pl-4 xl:ml-2 xl:gap-4 xl:pl-6">
              <SearchBar />
              <a
                href="https://github.com/gogiraFoundation"
                target="_blank"
                rel="me noopener noreferrer"
                onClick={() =>
                  trackClick('social_github', { platform: 'github', location: 'header' })
                }
                className="text-brutal-muted transition-opacity hover:opacity-70"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/emmanuel-ugbaje-b19227161/"
                target="_blank"
                rel="me noopener noreferrer"
                onClick={() =>
                  trackClick('social_linkedin', { platform: 'linkedin', location: 'header' })
                }
                className="text-brutal-muted transition-opacity hover:opacity-70"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="https://medium.com/@aigbemanuel"
                target="_blank"
                rel="me noopener noreferrer"
                onClick={() =>
                  trackClick('social_medium', { platform: 'medium', location: 'header' })
                }
                className="text-brutal-muted transition-opacity hover:opacity-70"
                aria-label="Medium"
              >
                <BookOpen className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="text-brutal-ink transition-opacity hover:opacity-70"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-drawer"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer: overlay + panel from right */}
      {mobileMenuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <div
            id="mobile-drawer"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
            className="fixed inset-y-0 right-0 z-[70] flex w-[min(100%,20rem)] flex-col border-l border-brutal-ink/15 bg-brutal-bg shadow-[var(--shadow-subtle)] transition-transform duration-300 ease-out"
          >
            <div className="flex items-center justify-between border-b border-brutal-ink/15 px-6 py-4">
              <span id="mobile-menu-title" className="font-serif text-sm font-semibold text-brutal-ink">
                Menu
              </span>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={closeMenu}
                className="text-brutal-ink transition-opacity hover:opacity-70"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="border-b border-brutal-ink/15 px-6 py-4">
              <SearchBar />
            </div>
            <div className="flex flex-col gap-1 px-6 py-6">
              {navigation.map((item, i) => {
                const isActive =
                  pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.name}
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      trackClick('nav_link', {
                        link: item.name,
                        href: item.href,
                        location: 'mobile',
                      })
                    }}
                    className={cn(
                      'py-3 font-sans text-sm font-semibold uppercase tracking-wider text-brutal-ink transition-opacity hover:opacity-70',
                      isActive && 'border-b-2 border-brutal-ink'
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
            <div className="mt-auto flex gap-6 border-t border-brutal-ink/15 px-6 py-6">
              <a
                href="https://github.com/gogiraFoundation"
                target="_blank"
                rel="me noopener noreferrer"
                className="text-brutal-muted transition-opacity hover:opacity-70"
                aria-label="GitHub"
              >
                <Github className="h-7 w-7" />
              </a>
              <a
                href="https://www.linkedin.com/in/emmanuel-ugbaje-b19227161/"
                target="_blank"
                rel="me noopener noreferrer"
                className="text-brutal-muted transition-opacity hover:opacity-70"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-7 w-7" />
              </a>
              <a
                href="https://medium.com/@aigbemanuel"
                target="_blank"
                rel="me noopener noreferrer"
                className="text-brutal-muted transition-opacity hover:opacity-70"
                aria-label="Medium"
              >
                <BookOpen className="h-7 w-7" />
              </a>
            </div>
          </div>
        </>
      ) : null}
    </header>
  )
}
