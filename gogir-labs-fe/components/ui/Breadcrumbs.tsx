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
    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
      <Link
        href="/"
        className="hover:text-purple-400 transition-colors flex items-center gap-1"
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4" />
          {index === items.length - 1 ? (
            <span className="text-white">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-purple-400 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

