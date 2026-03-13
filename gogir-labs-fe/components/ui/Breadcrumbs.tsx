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
    <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400" aria-label="Breadcrumb">
      <Link href="/" className="flex items-center gap-1 transition-colors hover:text-purple-400">
        <Home className="h-4 w-4" />
        <span>Home</span>
      </Link>
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4" />
          {index === items.length - 1 ? (
            <span className="text-white">{item.label}</span>
          ) : (
            <Link href={item.href} className="transition-colors hover:text-purple-400">
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
