'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useAnalytics } from '@/contexts/AnalyticsContext'
import { Shield, Cookie, Eye, Lock } from 'lucide-react'

const panelClass = 'border border-brutal-ink bg-brutal-bg p-6 text-brutal-ink'
const headingClass = 'font-serif text-2xl font-semibold text-brutal-ink'
const bodyClass = 'text-left text-base leading-relaxed text-brutal-muted'

export default function PrivacyPage() {
  const { trackingEnabled, giveConsent, revokeConsent } = useAnalytics()

  return (
    <div className="flex min-h-screen flex-col bg-brutal-bg text-brutal-ink">
      <Header />
      <main className="flex-grow px-6 py-16 md:py-24 lg:px-8">
        <div className="mx-auto max-w-content">
          <header className="mb-12 border-b border-brutal-ink/15 pb-8 text-left">
            <h1 className="mb-4 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
              Privacy policy
            </h1>
            <p className={`${bodyClass} max-w-2xl`}>
              How this site collects and uses anonymous usage data, and how you control it.
            </p>
          </header>

          <div className="space-y-8">
            <section className={panelClass} aria-labelledby="privacy-settings">
              <div className="mb-4 flex items-center gap-3">
                <Shield className="h-6 w-6 text-brutal-ink" aria-hidden />
                <h2 id="privacy-settings" className={headingClass}>
                  Privacy settings
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-4 border border-brutal-ink/15 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-left">
                    <h3 className="mb-1 font-sans text-base font-semibold text-brutal-ink">
                      Analytics tracking
                    </h3>
                    <p className="text-sm leading-relaxed text-brutal-muted">
                      {trackingEnabled
                        ? 'Analytics is on. Anonymous page views and interactions are recorded to improve the site.'
                        : 'Analytics is off. No usage events are being sent.'}
                    </p>
                  </div>
                  <span
                    className={`inline-flex w-fit shrink-0 border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                      trackingEnabled
                        ? 'btn-brutal-active border-brutal-ink'
                        : 'border-brutal-ink/30 text-brutal-muted'
                    }`}
                  >
                    {trackingEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {!trackingEnabled ? (
                    <button
                      type="button"
                      onClick={giveConsent}
                      className="btn-brutal btn-brutal-sm"
                    >
                      Enable analytics
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={revokeConsent}
                      className="btn-brutal btn-brutal-sm"
                    >
                      Disable analytics
                    </button>
                  )}
                </div>
              </div>
            </section>

            <section className={panelClass} aria-labelledby="what-we-collect">
              <div className="mb-4 flex items-center gap-3">
                <Eye className="h-6 w-6 text-brutal-ink" aria-hidden />
                <h2 id="what-we-collect" className={headingClass}>
                  What we collect
                </h2>
              </div>
              <div className={`space-y-4 ${bodyClass}`}>
                <p>When analytics is enabled, we record:</p>
                <ul className="ml-4 list-outside list-disc space-y-2 pl-2">
                  <li>Page views and navigation paths</li>
                  <li>Clicks and form submissions</li>
                  <li>Browser and device type</li>
                  <li>Referral sources</li>
                  <li>Anonymised session information</li>
                </ul>
                <p className="text-sm">
                  <strong className="text-brutal-ink">Note:</strong> We do not collect names, email
                  addresses, or IP addresses in a form that identifies you for analytics.
                </p>
              </div>
            </section>

            <section className={panelClass} aria-labelledby="how-we-use">
              <div className="mb-4 flex items-center gap-3">
                <Cookie className="h-6 w-6 text-brutal-ink" aria-hidden />
                <h2 id="how-we-use" className={headingClass}>
                  How we use data
                </h2>
              </div>
              <div className={`space-y-4 ${bodyClass}`}>
                <p>Collected data is used to:</p>
                <ul className="ml-4 list-outside list-disc space-y-2 pl-2">
                  <li>Understand how visitors use the site</li>
                  <li>Improve performance and clarity</li>
                  <li>See which projects and posts are useful</li>
                  <li>Find and fix technical issues</li>
                </ul>
              </div>
            </section>

            <section className={panelClass} aria-labelledby="data-security">
              <div className="mb-4 flex items-center gap-3">
                <Lock className="h-6 w-6 text-brutal-ink" aria-hidden />
                <h2 id="data-security" className={headingClass}>
                  Data security
                </h2>
              </div>
              <div className={`space-y-4 ${bodyClass}`}>
                <ul className="ml-4 list-outside list-disc space-y-2 pl-2">
                  <li>Data is stored on controlled servers</li>
                  <li>Analytics events are anonymised and aggregated</li>
                  <li>We do not sell or share analytics data with advertisers</li>
                  <li>You can opt out at any time with the controls above</li>
                </ul>
              </div>
            </section>

            <section className={panelClass} aria-labelledby="privacy-questions">
              <h2 id="privacy-questions" className={`${headingClass} mb-4`}>
                Questions?
              </h2>
              <p className={`${bodyClass} mb-4`}>
                If you have questions about these practices,{' '}
                <Link
                  href="/contact"
                  className="font-medium text-brutal-ink underline underline-offset-4 transition-opacity hover:opacity-70"
                >
                  send a message
                </Link>
                .
              </p>
              <p className="text-left text-sm text-brutal-muted">
                Last updated: {new Date().toLocaleDateString('en-GB')}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
