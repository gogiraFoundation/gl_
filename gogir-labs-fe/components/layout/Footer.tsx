'use client'

import Link from 'next/link'
import { Github, Linkedin, Mail, BookOpen } from 'lucide-react'
import { NewsletterForm } from '@/components/newsletter/NewsletterForm'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'

export function Footer() {
  const { trackClick } = useAnalyticsEvent()

  return (
    <footer className="mt-auto border-t border-brutal-ink bg-brutal-ink text-white">
      <div className="mx-auto max-w-shell px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold text-white">Emmanuel Ugbaje</h3>
            <p className="mb-4 text-sm leading-relaxed text-white/85">
              Software | Data Engineer. Building secure, scalable backends and APIs—specialising in
              authentication, data pipelines, and cloud-ready solutions.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://medium.com/@aigbemanuel"
                target="_blank"
                rel="me noopener noreferrer"
                onClick={() => trackClick('social_medium', { platform: 'medium' })}
                className="text-white/70 transition-opacity hover:opacity-70"
                aria-label="Medium"
              >
                <BookOpen className="h-8 w-8" />
              </a>
              <a
                href="https://www.linkedin.com/in/emmanuel-ugbaje-b19227161/"
                target="_blank"
                rel="me noopener noreferrer"
                onClick={() => trackClick('social_linkedin', { platform: 'linkedin' })}
                className="text-white/70 transition-opacity hover:opacity-70"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-8 w-8" />
              </a>
              <a
                href="mailto:dev@gogirlabs.uk"
                onClick={() => trackClick('social_email', { platform: 'email' })}
                className="text-white/70 transition-opacity hover:opacity-70"
                aria-label="Email"
              >
                <Mail className="h-8 w-8" />
              </a>
              <a
                href="https://github.com/gogiraFoundation"
                target="_blank"
                rel="me noopener noreferrer"
                onClick={() => trackClick('social_github', { platform: 'github' })}
                className="text-white/70 transition-opacity hover:opacity-70"
                aria-label="GitHub"
              >
                <Github className="h-8 w-8" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold text-white">Quick links</h3>
            <ul className="grid grid-cols-3 gap-x-4 gap-y-3">
              {[
                ['Home', '/'],
                ['About', '/about'],
                ['Portfolio', '/portfolio'],
                ['Blog', '/blog'],
                ['Contact', '/contact'],
              ].map(([label, href], idx) => (
                <li
                  key={href}
                  className="opacity-0 [animation:fadeIn_0.45s_ease-out_forwards]"
                  style={{ animationDelay: `${idx * 70}ms` }}
                >
                  <Link
                    href={href}
                    className="inline-flex items-center px-1 py-1.5 text-sm text-white/85 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-white hover:underline hover:underline-offset-4"
                    onClick={() => trackClick('footer_link', { link: label?.toLowerCase() })}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold text-white">Stay updated</h3>
            <p className="mb-4 text-sm text-white/75">
              Sign up for my newsletter to receive updates, insights, and the latest trends in
              backend development and security.
            </p>
            <NewsletterForm source="footer" compact={true} />
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-8 text-center">
          <p className="text-sm text-white/65">
            © {new Date().getFullYear()} Emmanuel Ugbaje. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
