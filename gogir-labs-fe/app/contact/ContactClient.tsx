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
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              <span className="text-white">Hi </span>
              <div>...</div>
              <GradientText>
                Let's Chat
              </GradientText>
              <span className="text-white">
                {' '}
              </span>
            </h1>

            <div className="container-content space-y-4">
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Interested in collaborating or have a scalable cloud project in mind? Let's connect.
              </p>

              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Ready to discuss how technology can improve the overall outlook of your business? Whether you have a project in mind or want to explore how I can contribute to your cross-functional team, I'd love to hear from you.
              </p>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Contact Form */}
            <div>
              <div className="glass rounded-2xl p-6 w-full">
                <h2 className="text-2xl font-bold mb-6 text-white">
                  Send a Message
                </h2>

                <ContactForm />
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <div className="glass rounded-2xl p-6 h-full flex flex-col space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-white">
                    Get in Touch
                  </h2>

                  <p className="text-gray-300 mb-6">
                    Prefer direct contact? Reach out via email or connect on social media for the latest on cloud infrastructure, DevOps, and scalable platforms.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-400 mb-1">Email</p>
                      <a
                        href="mailto:gogirafoundation@gmail.com"
                        className="text-white hover:text-purple-400 transition-colors break-all block"
                      >
                        gogiraFoundation@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Socials */}
                  <div className="pt-6 border-t border-purple-500/20">
                    <p className="text-sm text-gray-400 mb-4">
                      Connect on Social Media
                    </p>

                    <div className="flex gap-4">
                      <a
                        href="https://github.com/gogiraFoundation"
                        target="_blank"
                        rel="me noopener noreferrer"
                        aria-label="GitHub"
                      >
                        <Github className="w-8 h-8 text-white" />
                      </a>

                      <a
                        href="https://www.linkedin.com/in/emmanuel-ugbaje-b19227161/"
                        target="_blank"
                        rel="me noopener noreferrer"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-8 h-8 text-white" />
                      </a>

                      <a
                        href="https://medium.com/@aigbemanuel"
                        target="_blank"
                        rel="me noopener noreferrer"
                        aria-label="Medium"
                      >
                        <BookOpen className="w-8 h-8 text-white" />
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

