'use client'

import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'
import { NewsletterForm } from '@/components/newsletter/NewsletterForm'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'

export function Footer() {
  const { trackClick } = useAnalyticsEvent()

  return (
    <footer className="bg-gray-900 dark:bg-gray-800 border-t border-gray-700/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Emmanuel Ugbaije</h3>
            <p className="text-gray-400 text-sm mb-4">
              Software Engineer building solutions using Data Insights
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/gogiraFoundation"
                target="_blank"
                rel="me noopener noreferrer"
                onClick={() => trackClick('social_github', { platform: 'github' })}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-8 h-8" />
              </a>
              <a
                href="https://www.linkedin.com/in/emmanuel-ugbaije"
                target="_blank"
                rel="me noopener noreferrer"
                onClick={() => trackClick('social_linkedin', { platform: 'linkedin' })}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-8 h-8" />
              </a>
              <a
                href="https://medium.com/@aigbemanuel"
                target="_blank"
                rel="me noopener noreferrer"
                onClick={() => trackClick('social_medium', { platform: 'medium' })}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Medium"
              >
                <Mail className="w-8 h-8" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                  onClick={() => trackClick('footer_link', { link: 'home' })}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                  onClick={() => trackClick('footer_link', { link: 'about' })}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/portfolio" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                  onClick={() => trackClick('footer_link', { link: 'portfolio' })}
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                  onClick={() => trackClick('footer_link', { link: 'blog' })}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                  onClick={() => trackClick('footer_link', { link: 'contact' })}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for the latest updates and insights.
            </p>
            <NewsletterForm source="footer" compact={true} />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700/30 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Emmanuel Ugbaije. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
