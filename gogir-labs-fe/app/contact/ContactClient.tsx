'use client'

import { EssayDesignScope } from '@/components/essays/EssayDesignScope'
import { EssayNav } from '@/components/essays/EssayNav'
import { EssayFooter } from '@/components/essays/EssayFooter'
import { ContactForm } from '@/components/contact/ContactForm'
import Script from 'next/script'

const CONTACT_EMAIL = 'hi@gogirlabs.uk'

const linkClass =
  'inline-flex min-h-[44px] items-center justify-center font-essay-sans text-sm text-essay-ink underline-offset-4 transition-colors duration-essay-fast ease-essay hover:text-essay-accent hover:underline'

export default function ContactClient() {
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPoint',
    email: CONTACT_EMAIL,
    contactType: 'Professional service',
    areaServed: 'Worldwide',
    availableLanguage: ['English'],
  }

  return (
    <EssayDesignScope>
      <div className="flex min-h-screen flex-col bg-essay-bg text-essay-ink">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-essay-bg focus:px-3 focus:py-2 focus:text-essay-accent"
        >
          Skip to content
        </a>
        <EssayNav active="contact" />

        <main id="main-content" className="flex-grow px-6 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto w-full max-w-2xl text-center">
            <header className="mb-12 md:mb-16">
              <p className="font-essay-mono text-xs text-essay-muted" aria-hidden="true">
                // contact
              </p>
              <h1 className="mt-3 font-essay-display text-4xl font-semibold tracking-tight md:text-5xl">
                Contact
              </h1>
              <p className="mt-4 text-justify font-essay-sans text-lg leading-relaxed text-essay-ink md:text-xl">
                Tell me what you are building, what is blocking it, and your timeline. For security
                or IAM work, say whether you need a review, a build, or both, or a role you are
                hiring for. I reply within two business days.
              </p>
            </header>

            <section aria-labelledby="start-conversation-heading" className="mb-16 text-left">
              <h2
                id="start-conversation-heading"
                className="mb-2 text-center font-essay-display text-2xl font-semibold text-essay-ink"
              >
                Start a conversation
              </h2>
              <p className="mb-6 text-center font-essay-sans text-sm text-essay-muted">
                A few sentences on the problem, your stack, and your timeline is plenty. For
                security reviews, note any compliance or audit constraints.
              </p>
              <ContactForm />
            </section>

            <section
              aria-labelledby="direct-heading"
              className="flex flex-col items-center border-t border-essay-ink/10 pt-10 text-center"
            >
              <h2
                id="direct-heading"
                className="mb-4 font-essay-display text-2xl font-semibold text-essay-ink"
              >
                Or reach me directly
              </h2>
              <p className="inline-flex flex-wrap items-baseline justify-center gap-x-2">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-essay-sans text-base font-medium text-essay-accent underline underline-offset-4"
                >
                  {CONTACT_EMAIL}
                </a>
                <span className="font-essay-sans text-sm text-essay-muted">— fastest route</span>
              </p>
              <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                <li>
                  <a
                    href="https://github.com/gogiraFoundation"
                    target="_blank"
                    rel="me noopener noreferrer"
                    className={linkClass}
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/emmanuel-ugbaje-b19227161/"
                    target="_blank"
                    rel="me noopener noreferrer"
                    className={linkClass}
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://medium.com/@aigbemanuel"
                    target="_blank"
                    rel="me noopener noreferrer"
                    className={linkClass}
                  >
                    Medium
                  </a>
                </li>
              </ul>
              <p className="mt-4 font-essay-sans text-sm text-essay-muted">
                Open to full-time and contract backend
              </p>
            </section>
          </div>
        </main>

        <EssayFooter />

        <Script
          id="contact-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(contactSchema),
          }}
        />
      </div>
    </EssayDesignScope>
  )
}
