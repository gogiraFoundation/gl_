'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Github, Linkedin, BookOpen, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'
import { SearchBar } from '@/components/search/SearchBar'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Resume', href: '/resume' },
  { name: 'Contact', href: '/contact' },
]

export function Header() {
  const { trackClick } = useAnalyticsEvent()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  let pathname = ''
  try {
    pathname = usePathname() || ''
  } catch (error) {
    // Fallback if usePathname fails
    if (typeof window !== 'undefined') {
      pathname = window.location.pathname
    }
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-purple-500/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            href="/" 
            className="text-xl font-bold gradient-text hover:scale-105 transition-transform"
          >
            Emmanuel Ugbaje
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex space-x-6">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'text-sm font-medium relative transition-all duration-300',
                      isActive
                        ? 'text-purple-400'
                        : 'text-gray-300 hover:text-purple-400'
                    )}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-primary" />
                    )}
                  </Link>
                )
              })}
            </div>
            
            {/* Search & Social Icons */}
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-purple-500/20">
              <SearchBar />
              <a
                href="https://github.com/gogiraFoundation"
                target="_blank"
                rel="me noopener noreferrer"
                onClick={() => trackClick('social_github', { platform: 'github', location: 'header' })}
                className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="w-8 h-8" />
              </a>
              <a
                href="https://www.linkedin.com/in/emmanuel-ugbaje"
                target="_blank"
                rel="me noopener noreferrer"
                onClick={() => trackClick('social_linkedin', { platform: 'linkedin', location: 'header' })}
                className="text-gray-400 hover:text-blue-400 hover:scale-110 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-8 h-8" />
              </a>
              <a
                href="https://medium.com/@aigbemanuel"
                target="_blank"
                rel="me noopener noreferrer"
                onClick={() => trackClick('social_medium', { platform: 'medium', location: 'header' })}
                className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300"
                aria-label="Medium"
              >
                <BookOpen className="w-8 h-8" />
              </a>
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-500/20 animate-slide-in-left">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => {
                      setMobileMenuOpen(false)
                      trackClick('nav_link', { link: item.name, href: item.href, location: 'mobile' })
                    }}
                    className={cn(
                      'text-base font-medium transition-colors',
                      isActive
                        ? 'text-purple-400'
                        : 'text-gray-300 hover:text-purple-400'
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
              <div className="flex items-center gap-4 pt-4 border-t border-purple-500/20">
                <a
                  href="https://github.com/gogiraFoundation"
                  target="_blank"
                  rel="me noopener noreferrer"
                  onClick={() => trackClick('social_github', { platform: 'github', location: 'mobile' })}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-8 h-8" />
                </a>
                <a
                  href="https://www.linkedin.com/in/emmanuel-ugbaje"
                  target="_blank"
                  rel="me noopener noreferrer"
                  onClick={() => trackClick('social_linkedin', { platform: 'linkedin', location: 'mobile' })}
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-8 h-8" />
                </a>
                <a
                  href="https://medium.com/@aigbemanuel"
                  target="_blank"
                  rel="me noopener noreferrer"
                  onClick={() => trackClick('social_medium', { platform: 'medium', location: 'mobile' })}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Medium"
                >
                  <BookOpen className="w-8 h-8" />
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

