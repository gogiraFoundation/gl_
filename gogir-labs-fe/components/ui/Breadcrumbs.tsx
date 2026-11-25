'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      className="mb-6 flex flex-wrap items-center gap-2 font-essay-sans text-sm text-essay-muted"
      aria-label="Breadcrumb"
    >
      <Link
        href="/"
        className="flex items-center gap-1 transition-colors duration-essay-fast ease-essay hover:text-essay-accent"
      >
        <Home className="h-4 w-4" aria-hidden />
        <span>Home</span>
      </Link>
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4" aria-hidden />
          {index === items.length - 1 ? (
            <span className="text-essay-ink">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="transition-colors duration-essay-fast ease-essay hover:text-essay-accent"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
