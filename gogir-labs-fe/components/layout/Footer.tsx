'use client'

import Link from 'next/link'
import { Github, Linkedin, Mail, BookOpen } from 'lucide-react'
import { NewsletterForm } from '@/components/newsletter/NewsletterForm'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'

export function Footer() {
  const { trackClick } = useAnalyticsEvent()

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-100 dark:border-gray-700/30 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* About Section */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
              Emmanuel Ugbaje
            </h3>
            <p className="mb-4 text-sm text-slate-600 dark:text-gray-400">
              Software Engineer building secure, scalable backends and APIs—authentication, data
              pipelines, and cloud-ready delivery.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://medium.com/@aigbemanuel"
                target="_blank"
                rel="me noopener noreferrer"
                onClick={() => trackClick('social_medium', { platform: 'medium' })}
                className="text-slate-500 transition-colors hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
                aria-label="Medium"
              >
                <BookOpen className="h-8 w-8" />
              </a>
              <a
                href="https://www.linkedin.com/in/emmanuel-ugbaje-b19227161/"
                target="_blank"
                rel="me noopener noreferrer"
                onClick={() => trackClick('social_linkedin', { platform: 'linkedin' })}
                className="text-slate-500 transition-colors hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-8 w-8" />
              </a>
              <a
                href="mailto:dev@gogirlabs.uk"
                onClick={() => trackClick('social_email', { platform: 'email' })}
                className="text-slate-500 transition-colors hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
                aria-label="Email"
              >
                <Mail className="h-8 w-8" />
              </a>
              <a
                href="https://github.com/gogiraFoundation"
                target="_blank"
                rel="me noopener noreferrer"
                onClick={() => trackClick('social_github', { platform: 'github' })}
                className="text-slate-500 transition-colors hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
                aria-label="GitHub"
              >
                <Github className="h-8 w-8" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
                  onClick={() => trackClick('footer_link', { link: 'home' })}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
                  onClick={() => trackClick('footer_link', { link: 'about' })}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
                  onClick={() => trackClick('footer_link', { link: 'portfolio' })}
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
                  onClick={() => trackClick('footer_link', { link: 'blog' })}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
                  onClick={() => trackClick('footer_link', { link: 'contact' })}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Stay Updated</h3>
            <p className="mb-4 text-sm text-slate-600 dark:text-gray-400">
              Subscribe to our newsletter for the latest updates and insights.
            </p>
            <NewsletterForm source="footer" compact={true} />
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-8 text-center dark:border-gray-700/30">
          <p className="text-sm text-slate-600 dark:text-gray-400">
            © {new Date().getFullYear()} Emmanuel Ugbaje. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
