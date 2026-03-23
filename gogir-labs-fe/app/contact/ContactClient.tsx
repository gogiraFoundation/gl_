'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactForm } from '@/components/contact/ContactForm'
import { GradientText } from '@/components/ui/GradientText'
import { Mail, Github, Linkedin, BookOpen } from 'lucide-react'
import Script from 'next/script'

export default function ContactClient() {
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPoint',
    email: 'aigbemanuel@gmail.com',
    contactType: 'Professional service',
    areaServed: 'Worldwide',
    availableLanguage: ['English'],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="relative flex-grow px-4 py-16 sm:px-6 sm:py-20">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-12 animate-fade-in-up text-center md:mb-16">
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
              <span className="text-[var(--text-primary)]">Hi </span>
              <span className="text-[var(--text-tertiary)]">...</span>{' '}
              <GradientText>Let&apos;s Chat</GradientText>
            </h1>

            <div className="container-content mx-auto max-w-2xl space-y-4 text-left md:text-center">
              <p className="text-xl text-[var(--text-secondary)]">
                Interested in collaborating or have a scalable cloud project in mind? Let&apos;s
                connect.
              </p>
              <p className="text-lg text-[var(--text-tertiary)]">
                Ready to discuss how technology can improve the overall outlook of your business?
                Whether you have a project in mind or want to explore how I can contribute to your
                cross-functional team, I&apos;d love to hear from you.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            <div>
              <div className="glass h-full rounded-3xl p-6 shadow-sm md:p-8">
                <h2 className="mb-6 text-left text-2xl font-bold text-[var(--text-primary)]">
                  Send a Message
                </h2>
                <ContactForm />
              </div>
            </div>

            <div>
              <div className="glass flex h-full flex-col rounded-3xl p-6 shadow-sm md:p-8">
                <h2 className="mb-4 text-left text-2xl font-bold text-[var(--text-primary)]">
                  Get in Touch
                </h2>
                <p className="mb-8 text-left text-[var(--text-secondary)]">
                  Prefer direct contact? Reach out via email or connect on social media for the
                  latest on cloud infrastructure, DevOps, and scalable platforms.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-primary">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-sm text-[var(--text-tertiary)]">Email</p>
                      <a
                        href="mailto:gogiraFoundation@gmail.com"
                        className="block break-all text-[var(--accent-primary)] transition-colors hover:opacity-90 dark:text-purple-400 dark:hover:text-purple-300"
                      >
                        gogiraFoundation@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="border-t border-[var(--border-default)] pt-6">
                    <p className="mb-4 text-sm text-[var(--text-tertiary)]">Connect on Social Media</p>
                    <div className="flex flex-wrap gap-4">
                      <a
                        href="https://github.com/gogiraFoundation"
                        target="_blank"
                        rel="me noopener noreferrer"
                        aria-label="GitHub"
                        className="text-slate-700 transition-colors hover:text-slate-900 dark:text-white dark:hover:text-purple-200"
                      >
                        <Github className="h-8 w-8" />
                      </a>
                      <a
                        href="https://www.linkedin.com/in/emmanuel-ugbaje-b19227161/"
                        target="_blank"
                        rel="me noopener noreferrer"
                        aria-label="LinkedIn"
                        className="text-slate-700 transition-colors hover:text-slate-900 dark:text-white dark:hover:text-purple-200"
                      >
                        <Linkedin className="h-8 w-8" />
                      </a>
                      <a
                        href="https://medium.com/@aigbemanuel"
                        target="_blank"
                        rel="me noopener noreferrer"
                        aria-label="Medium"
                        className="text-slate-700 transition-colors hover:text-slate-900 dark:text-white dark:hover:text-purple-200"
                      >
                        <BookOpen className="h-8 w-8" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
