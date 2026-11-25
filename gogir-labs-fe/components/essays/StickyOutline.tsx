'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export interface OutlineHeading {
  id: string
  text: string
}

interface StickyOutlineProps {
  headings: OutlineHeading[]
}

export function StickyOutline({ headings }: StickyOutlineProps) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null)

  useEffect(() => {
    if (!headings.length) return

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 1] }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  if (!headings.length) return null

  return (
    <nav
      aria-label="On this page"
      className="sticky top-24 hidden max-h-[70vh] overflow-y-auto xl:block"
    >
      <p className="mb-3 font-essay-mono text-[0.65rem] uppercase tracking-wider text-essay-muted">
        Outline
      </p>
      <ul className="space-y-2 border-l border-essay-ink/15 pl-3">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                'block py-1 text-sm transition-colors duration-essay-fast ease-essay',
                activeId === h.id ? 'text-essay-accent' : 'text-essay-muted hover:text-essay-ink'
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
