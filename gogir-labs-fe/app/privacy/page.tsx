'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useAnalytics } from '@/contexts/AnalyticsContext'
import { Shield, Cookie, Eye, Lock } from 'lucide-react'

export default function PrivacyPage() {
  const { consentGiven, trackingEnabled, giveConsent, revokeConsent } = useAnalytics()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">Privacy Policy</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Your privacy is important to us. Learn how we collect and use your data.
            </p>
          </div>

          <div className="space-y-8">
            {/* Privacy Settings */}
            <div className="glass p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Privacy Settings</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-white mb-1">Analytics Tracking</h3>
                    <p className="text-sm text-gray-400">
                      {trackingEnabled 
                        ? 'Analytics tracking is currently enabled. We collect anonymous usage data to improve our website.'
                        : 'Analytics tracking is currently disabled. No usage data is being collected.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      trackingEnabled 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {trackingEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {!trackingEnabled ? (
                    <button
                      onClick={giveConsent}
                      className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300"
                    >
                      Enable Analytics
                    </button>
                  ) : (
                    <button
                      onClick={revokeConsent}
                      className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300"
                    >
                      Disable Analytics
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Data Collection */}
            <div className="glass p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">What We Collect</h2>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <p>When analytics tracking is enabled, we collect the following anonymous data:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Page views and navigation paths</li>
                  <li>User interactions (clicks, form submissions)</li>
                  <li>Browser type and device information</li>
                  <li>Referral sources</li>
                  <li>Session information (anonymized)</li>
                </ul>
                <p className="text-sm text-gray-400 mt-4">
                  <strong>Note:</strong> We do not collect personally identifiable information (PII) 
                  such as names, email addresses, or IP addresses in a way that can identify you.
                </p>
              </div>
            </div>

            {/* How We Use Data */}
            <div className="glass p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Cookie className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">How We Use Your Data</h2>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <p>We use the collected data to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Understand how visitors use our website</li>
                  <li>Improve website performance and user experience</li>
                  <li>Identify popular content and features</li>
                  <li>Detect and fix technical issues</li>
                  <li>Make data-driven decisions about website improvements</li>
                </ul>
              </div>
            </div>

            {/* Data Security */}
            <div className="glass p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Data Security</h2>
              </div>
              
              <div className="space-y-4 text-gray-300">
                <p>We take data security seriously:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All data is stored securely on our servers</li>
                  <li>Data is anonymized and aggregated</li>
                  <li>We do not share data with third parties</li>
                  <li>You can opt-out at any time using the settings above</li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="glass p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Questions?</h2>
              <p className="text-gray-300 mb-4">
                If you have any questions about our privacy practices, please{' '}
                <a href="/contact" className="text-purple-400 hover:text-purple-300 underline">
                  contact us
                </a>.
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

