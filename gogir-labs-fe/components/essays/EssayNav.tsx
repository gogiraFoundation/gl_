'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

type NavKey = 'essays' | 'portfolio' | 'about' | 'resume' | 'contact'

const LINKS: ReadonlyArray<{ href: string; label: string; key: NavKey }> = [
  { href: '/blog', label: 'Essays', key: 'essays' },
  { href: '/portfolio', label: 'Portfolio', key: 'portfolio' },
  { href: '/about', label: 'About', key: 'about' },
  { href: '/resume', label: 'Resume', key: 'resume' },
  { href: '/contact', label: 'Contact', key: 'contact' },
]

export function EssayNav({ active }: { active?: NavKey }) {
  return (
    <nav
      aria-label="Primary"
      className="border-b border-essay-ink/10 bg-essay-bg/90 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-shell items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <Link
          href="/"
          className="group flex min-h-[44px] flex-col justify-center transition-colors duration-essay-fast ease-essay"
        >
          <span className="font-essay-sans text-sm font-semibold text-essay-ink group-hover:text-essay-accent">
            Emmanuel Ugbaje
          </span>
          <span className="font-essay-mono text-[10px] text-essay-muted group-hover:text-essay-accent">
            gogira-station_chief
          </span>
        </Link>
        <ul className="flex flex-wrap items-center justify-end gap-x-5 gap-y-1 sm:gap-x-6">
          {LINKS.map((link) => {
            const isActive = active === link.key
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'inline-flex min-h-[44px] items-center font-essay-sans text-sm transition-colors duration-essay-fast ease-essay',
                    isActive
                      ? 'text-essay-accent underline underline-offset-4'
                      : 'text-essay-ink hover:text-essay-accent'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
