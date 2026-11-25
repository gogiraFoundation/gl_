'use client'

import { useLayoutEffect } from 'react'

/**
 * Essay visual system: wrapper sets data-design immediately (SSR + first paint).
 * Also mirrors onto <html> so document-level body rules apply while this tree is mounted.
 */
export function EssayDesignScope({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    const root = document.documentElement
    const previous = root.getAttribute('data-design')
    root.setAttribute('data-design', 'essays')
    return () => {
      if (previous) {
        root.setAttribute('data-design', previous)
      } else {
        root.setAttribute('data-design', 'brutalist')
      }
    }
  }, [])

  // Outer wrapper only scopes tokens; pages own the flex column so footer mt-auto works once.
  return (
    <div data-design="essays" className="bg-essay-bg text-essay-ink">
      {children}
    </div>
  )
}
