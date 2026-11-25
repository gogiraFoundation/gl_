'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/** First focusable control. Points at the page's <main> after navigation. */
export function SkipLink() {
  const pathname = usePathname()

  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return
    main.id = 'main-content'
    if (!main.hasAttribute('tabindex')) main.tabIndex = -1
  }, [pathname])

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-brutal-ink focus:bg-brutal-bg focus:px-4 focus:py-2 focus:text-brutal-ink"
    >
      Skip to content
    </a>
  )
}
