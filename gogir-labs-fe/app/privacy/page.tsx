'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useAnalytics } from '@/contexts/AnalyticsContext'
import { Shield, Cookie, Eye, Lock } from 'lucide-react'

export default function PrivacyPage() {
  const { consentGiven, trackingEnabled, giveConsent, revokeConsent } = useAnalytics()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative flex-grow px-4 py-20">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-bold md:text-6xl">
              <span className="gradient-text">Privacy Policy</span>
            </h1>
            <p className="text-lg text-gray-400">
              Your privacy is important to us. Learn how we collect and use your data.
            </p>
          </div>

          <div className="space-y-8">
            {/* Privacy Settings */}
            <div className="glass rounded-lg p-6">
              <div className="mb-4 flex items-center gap-3">
                <Shield className="h-6 w-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Privacy Settings</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-gray-800/50 p-4">
                  <div>
                    <h3 className="mb-1 font-semibold text-white">Analytics Tracking</h3>
                    <p className="text-sm text-gray-400">
                      {trackingEnabled
                        ? 'Analytics tracking is currently enabled. We collect anonymous usage data to improve our website.'
                        : 'Analytics tracking is currently disabled. No usage data is being collected.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        trackingEnabled
                          ? 'border border-green-500/30 bg-green-500/20 text-green-400'
                          : 'border border-gray-500/30 bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {trackingEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {!trackingEnabled ? (
                    <button
                      onClick={giveConsent}
                      className="rounded-lg bg-gradient-primary px-4 py-2 font-semibold text-white transition-all duration-300 hover:scale-105"
                    >
                      Enable Analytics
                    </button>
                  ) : (
                    <button
                      onClick={revokeConsent}
                      className="rounded-lg bg-gray-700 px-4 py-2 font-semibold text-gray-200 transition-all duration-300 hover:bg-gray-600"
                    >
                      Disable Analytics
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Data Collection */}
            <div className="glass rounded-lg p-6">
              <div className="mb-4 flex items-center gap-3">
                <Eye className="h-6 w-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">What We Collect</h2>
              </div>

              <div className="space-y-4 text-gray-300">
                <p>When analytics tracking is enabled, we collect the following anonymous data:</p>
                <ul className="ml-4 list-inside list-disc space-y-2">
                  <li>Page views and navigation paths</li>
                  <li>User interactions (clicks, form submissions)</li>
                  <li>Browser type and device information</li>
                  <li>Referral sources</li>
                  <li>Session information (anonymized)</li>
                </ul>
                <p className="mt-4 text-sm text-gray-400">
                  <strong>Note:</strong> We do not collect personally identifiable information (PII)
                  such as names, email addresses, or IP addresses in a way that can identify you.
                </p>
              </div>
            </div>

            {/* How We Use Data */}
            <div className="glass rounded-lg p-6">
              <div className="mb-4 flex items-center gap-3">
                <Cookie className="h-6 w-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">How We Use Your Data</h2>
              </div>

              <div className="space-y-4 text-gray-300">
                <p>We use the collected data to:</p>
                <ul className="ml-4 list-inside list-disc space-y-2">
                  <li>Understand how visitors use our website</li>
                  <li>Improve website performance and user experience</li>
                  <li>Identify popular content and features</li>
                  <li>Detect and fix technical issues</li>
                  <li>Make data-driven decisions about website improvements</li>
                </ul>
              </div>
            </div>

            {/* Data Security */}
            <div className="glass rounded-lg p-6">
              <div className="mb-4 flex items-center gap-3">
                <Lock className="h-6 w-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Data Security</h2>
              </div>

              <div className="space-y-4 text-gray-300">
                <p>We take data security seriously:</p>
                <ul className="ml-4 list-inside list-disc space-y-2">
                  <li>All data is stored securely on our servers</li>
                  <li>Data is anonymized and aggregated</li>
                  <li>We do not share data with third parties</li>
                  <li>You can opt-out at any time using the settings above</li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="glass rounded-lg p-6">
              <h2 className="mb-4 text-2xl font-bold text-white">Questions?</h2>
              <p className="mb-4 text-gray-300">
                If you have any questions about our privacy practices, please{' '}
                <a href="/contact" className="text-purple-400 underline hover:text-purple-300">
                  contact us
                </a>
                .
              </p>
              <p className="text-sm text-gray-400">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
