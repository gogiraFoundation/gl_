'use client'

import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'
import { NewsletterForm } from '@/components/newsletter/NewsletterForm'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'

export function Footer() {
  const { trackClick } = useAnalyticsEvent()

  return (
    <footer className="mt-auto border-t border-gray-700/30 bg-gray-900 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* About Section */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Emmanuel Ugbaije</h3>
            <p className="mb-4 text-sm text-gray-400">
              Software Engineer building solutions using Data Insights
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/gogiraFoundation"
                target="_blank"
                rel="me noopener noreferrer"
                onClick={() => trackClick('social_github', { platform: 'github' })}
                className="text-gray-400 transition-colors hover:text-white"
                aria-label="GitHub"
              >
                <Github className="h-8 w-8" />
              </a>
              <a
                href="https://www.linkedin.com/in/emmanuel-ugbaije"
                target="_blank"
                rel="me noopener noreferrer"
                onClick={() => trackClick('social_linkedin', { platform: 'linkedin' })}
                className="text-gray-400 transition-colors hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-8 w-8" />
              </a>
              <a
                href="https://medium.com/@aigbemanuel"
                target="_blank"
                rel="me noopener noreferrer"
                onClick={() => trackClick('social_medium', { platform: 'medium' })}
                className="text-gray-400 transition-colors hover:text-white"
                aria-label="Medium"
              >
                <Mail className="h-8 w-8" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                  onClick={() => trackClick('footer_link', { link: 'home' })}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                  onClick={() => trackClick('footer_link', { link: 'about' })}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                  onClick={() => trackClick('footer_link', { link: 'portfolio' })}
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                  onClick={() => trackClick('footer_link', { link: 'blog' })}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                  onClick={() => trackClick('footer_link', { link: 'contact' })}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Stay Updated</h3>
            <p className="mb-4 text-sm text-gray-400">
              Subscribe to our newsletter for the latest updates and insights.
            </p>
            <NewsletterForm source="footer" compact={true} />
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700/30 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Emmanuel Ugbaije. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
