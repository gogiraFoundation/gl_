'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactForm } from '@/components/contact/ContactForm'
import Script from 'next/script'

export default function ContactClient() {
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPoint',
    email: 'gogiraFoundation@gmail.com',
    contactType: 'Professional service',
    areaServed: 'Worldwide',
    availableLanguage: ['English'],
  }

  return (
    <div className="flex min-h-screen flex-col bg-brutal-bg text-brutal-ink">
      <Header />

      <main className="flex-grow px-6 py-16 md:py-24 lg:px-8">
        <div className="mx-auto max-w-shell">
          <header className="mb-12 max-w-3xl text-left md:mb-16">
            <h1 className="mb-4 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
              Contact
            </h1>
            <div className="space-y-4">
              <p className="text-left text-lg leading-relaxed text-brutal-ink md:text-justify md:text-xl">
                Looking to collaborate on a secure backend, API, or data platform? Send a short note
                below.
              </p>
              <p className="text-left text-base leading-relaxed text-brutal-muted md:text-justify md:text-lg">
                Whether the brief is clear or still forming, I work across backend engineering,
                DevOps, and data systems to ship production-ready services.
              </p>
            </div>
          </header>

          <section
            aria-labelledby="start-conversation-heading"
            className="mb-12 border border-brutal-ink bg-brutal-bg p-6 md:p-8"
          >
            <h2
              id="start-conversation-heading"
              className="mb-2 text-left font-serif text-2xl font-semibold text-brutal-ink"
            >
              Start a conversation
            </h2>
            <p className="mb-6 text-left text-sm text-brutal-muted">
              Fill in the form and I will reply as soon as I can.
            </p>
            <div className="mx-auto max-w-2xl">
              <ContactForm />
            </div>
          </section>

          <section aria-labelledby="get-in-touch-heading" className="mx-auto max-w-4xl">
            <div className="flex h-full flex-col border border-brutal-ink/15 bg-brutal-bg p-6 md:p-8">
              <h2
                id="get-in-touch-heading"
                className="mb-4 text-left font-serif text-2xl font-semibold text-brutal-ink"
              >
                Other ways to reach me
              </h2>
              <p className="mb-8 max-w-3xl text-left text-brutal-muted md:text-justify">
                Prefer email or a public profile? Use the links below.
              </p>

              <div className="w-full space-y-6 text-left md:max-w-2xl">
                <div className="border-t border-brutal-ink/15 pt-6">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brutal-ink">
                    Professional links
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm sm:gap-6">
                    <a
                      href="mailto:gogiraFoundation@gmail.com"
                      aria-label="Email"
                      className="whitespace-nowrap rounded-sm px-3 py-1 font-medium text-brutal-ink transition-colors duration-200 hover:text-brutal-muted"
                    >
                      Email
                    </a>
                    <a
                      href="https://github.com/gogiraFoundation"
                      target="_blank"
                      rel="me noopener noreferrer"
                      aria-label="GitHub"
                      className="whitespace-nowrap rounded-sm px-3 py-1 font-medium text-brutal-ink transition-colors duration-200 hover:text-brutal-muted"
                    >
                      GitHub
                    </a>
                    <a
                      href="https://www.linkedin.com/in/emmanuel-ugbaje-b19227161/"
                      target="_blank"
                      rel="me noopener noreferrer"
                      aria-label="LinkedIn"
                      className="whitespace-nowrap rounded-sm px-3 py-1 font-medium text-brutal-ink transition-colors duration-200 hover:text-brutal-muted"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="https://medium.com/@aigbemanuel"
                      target="_blank"
                      rel="me noopener noreferrer"
                      aria-label="Medium"
                      className="whitespace-nowrap rounded-sm px-3 py-1 font-medium text-brutal-ink transition-colors duration-200 hover:text-brutal-muted"
                    >
                      Medium
                    </a>
                  </div>
                </div>

                <div className="border-t border-brutal-ink/15 pt-6">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brutal-ink">
                    What you can expect
                  </h3>
                  <ul className="list-inside list-disc space-y-2 text-left text-sm leading-relaxed text-brutal-muted marker:text-brutal-ink">
                    <li>Clear, timely communication</li>
                    <li>An engineering-first approach</li>
                    <li>Secure, scalable, maintainable solutions</li>
                    <li>Alignment with modern cloud and DevOps practice</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <Script
        id="contact-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactSchema),
        }}
      />
    </div>
  )
}
