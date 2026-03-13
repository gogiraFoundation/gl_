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

      <main className="relative flex-grow px-4 py-20">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-16 animate-fade-in-up text-center">
            <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl">
              <span className="text-white">Hi </span>
              <div>...</div>
              <GradientText>Let's Chat</GradientText>
              <span className="text-white"> </span>
            </h1>

            <div className="container-content space-y-4">
              <p className="mx-auto max-w-2xl text-xl text-gray-300">
                Interested in collaborating or have a scalable cloud project in mind? Let's connect.
              </p>

              <p className="mx-auto max-w-2xl text-lg text-gray-400">
                Ready to discuss how technology can improve the overall outlook of your business?
                Whether you have a project in mind or want to explore how I can contribute to your
                cross-functional team, I'd love to hear from you.
              </p>
            </div>
          </div>

          {/* Grid */}
          <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <div className="glass w-full rounded-2xl p-6">
                <h2 className="mb-6 text-2xl font-bold text-white">Send a Message</h2>

                <ContactForm />
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <div className="glass flex h-full flex-col space-y-6 rounded-2xl p-6">
                <div>
                  <h2 className="mb-4 text-2xl font-bold text-white">Get in Touch</h2>

                  <p className="mb-6 text-gray-300">
                    Prefer direct contact? Reach out via email or connect on social media for the
                    latest on cloud infrastructure, DevOps, and scalable platforms.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-primary">
                      <Mail className="h-6 w-6 text-white" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-sm text-gray-400">Email</p>
                      <a
                        href="mailto:gogirafoundation@gmail.com"
                        className="block break-all text-white transition-colors hover:text-purple-400"
                      >
                        gogiraFoundation@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Socials */}
                  <div className="border-t border-purple-500/20 pt-6">
                    <p className="mb-4 text-sm text-gray-400">Connect on Social Media</p>

                    <div className="flex gap-4">
                      <a
                        href="https://github.com/gogiraFoundation"
                        target="_blank"
                        rel="me noopener noreferrer"
                        aria-label="GitHub"
                      >
                        <Github className="h-8 w-8 text-white" />
                      </a>

                      <a
                        href="https://www.linkedin.com/in/emmanuel-ugbaje-b19227161/"
                        target="_blank"
                        rel="me noopener noreferrer"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-8 w-8 text-white" />
                      </a>

                      <a
                        href="https://medium.com/@aigbemanuel"
                        target="_blank"
                        rel="me noopener noreferrer"
                        aria-label="Medium"
                      >
                        <BookOpen className="h-8 w-8 text-white" />
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
