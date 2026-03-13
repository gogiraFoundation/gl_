'use client'

import { useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { NewsletterForm } from '@/components/newsletter/NewsletterForm'
import { GradientText } from '@/components/ui/GradientText'
import { Mail } from 'lucide-react'

export default function NewsletterSubscribePage() {
  useEffect(() => {
    // Update document title and meta description for SEO
    document.title = 'Newsletter | Emmanuel Ugbaije - Infrastructure & DevOps Insights'
    const metaDescription = document.querySelector('meta[name="description"]')
    const descriptionContent =
      'Subscribe to the newsletter of Infrastructure & DevOps Engineer Emmanuel Ugbaije. Get insights on Terraform, Kubernetes, CI/CD, cloud architecture, and scalable platforms delivered to your inbox.'
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative flex-grow px-4 py-20">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>

        <div className="relative z-10 mx-auto max-w-2xl">
          <div className="mb-12 animate-fade-in-up text-center">
            <div className="bg-gradient-primary/20 mb-6 inline-block rounded-full p-4">
              <Mail className="h-12 w-12 text-purple-400" />
            </div>
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
              <GradientText>Subscribe to the Newsletter</GradientText>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              Stay updated with the latest insights on technology and engineering.
            </p>
          </div>

          <div className="glass scroll-fade-in rounded-2xl p-8">
            <NewsletterForm source="subscribe-page" showNameField={true} />

            <div className="mt-8 border-t border-purple-500/20 pt-8">
              <h3 className="mb-3 text-lg font-semibold text-white">What you'll receive:</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Deep dives into technological systems and architectures</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>CI/CD pipeline strategies and automation best practices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Cloud architecture patterns (AWS, Azure, GCP)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Security and scalability insights for modern platforms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>New projects, portfolio updates, and industry trends</span>
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
