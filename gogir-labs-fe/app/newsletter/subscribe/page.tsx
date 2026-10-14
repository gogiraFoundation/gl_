'use client'

import { useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { NewsletterForm } from '@/components/newsletter/NewsletterForm'
import { Mail } from 'lucide-react'

export default function NewsletterSubscribePage() {
  useEffect(() => {
    document.title = 'Newsletter | Emmanuel Ugbaje — Software Engineering & Platform Insights'
    const metaDescription = document.querySelector('meta[name="description"]')
    const descriptionContent =
      'Subscribe for updates from Emmanuel Ugbaje on Python, Django, backends, CI/CD, cloud, and data—practical notes for engineers and builders.'
    if (metaDescription) {
      metaDescription.setAttribute('content', descriptionContent)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = descriptionContent
      document.getElementsByTagName('head')[0].appendChild(meta)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-brutal-bg text-brutal-ink">
      <Header />
      <main className="flex-grow px-6 py-16 lg:px-8 md:py-24">
        <div className="mx-auto max-w-2xl">
          <header className="mb-10 text-left">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center border border-brutal-ink">
              <Mail className="h-7 w-7 text-brutal-ink" aria-hidden />
            </div>
            <h1 className="mb-4 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
              Newsletter
            </h1>
            <p className="max-w-xl text-left text-base leading-relaxed text-brutal-muted md:text-lg">
              Practical notes on backends, security, CI/CD, and data systems. Occasional updates when
              there is something worth reading.
            </p>
          </header>

          <div className="border border-brutal-ink bg-brutal-bg p-6 md:p-8">
            <NewsletterForm source="subscribe-page" showNameField={true} />

            <div className="mt-8 border-t border-brutal-ink/15 pt-8">
              <h2 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wide text-brutal-ink">
                What you receive
              </h2>
              <ul className="space-y-2 text-left text-sm leading-relaxed text-brutal-muted">
                <li className="flex items-start gap-2">
                  <span className="text-brutal-ink" aria-hidden>
                    —
                  </span>
                  <span>Deep dives into backend systems and architecture</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brutal-ink" aria-hidden>
                    —
                  </span>
                  <span>CI/CD and automation practices that hold up in production</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brutal-ink" aria-hidden>
                    —
                  </span>
                  <span>Cloud patterns for AWS, Azure, and GCP</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brutal-ink" aria-hidden>
                    —
                  </span>
                  <span>Security and scalability notes for modern platforms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brutal-ink" aria-hidden>
                    —
                  </span>
                  <span>New projects and writing when they ship</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
