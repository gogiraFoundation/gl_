'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactForm } from '@/components/contact/ContactForm'
import { GradientText } from '@/components/ui/GradientText'
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
    <div className="flex min-h-screen flex-col bg-brutal-bg">
      <Header />

      <main className="relative flex-grow px-4 py-16 sm:px-6 sm:py-20">
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-12 text-center md:mb-16">
            <h1 className="mb-4 font-sans text-4xl font-semibold text-brutal-ink sm:text-5xl md:text-6xl">
              <GradientText>Let&apos;s Chat</GradientText>
            </h1>

            <div className="container-content mx-auto mt-[20px] max-w-3xl space-y-4 text-center">
              <p className="mx-auto text-justify text-xl text-brutal-ink">
                Interested in collaborating or building a scalable, cloud-native solution?
                Let&apos;s connect.
              </p>
              <p className="mx-auto text-justify text-lg text-brutal-muted">
                If you&apos;re looking to improve your platform, scale your infrastructure, or build
                secure backend systems, I&apos;d be glad to discuss how I can help. Whether you have
                a defined project or are exploring ideas, I bring experience across backend
                engineering, DevOps, and data systems to deliver practical, production-ready
                solutions.
              </p>
              <p className="mx-auto text-justify text-lg text-brutal-muted">
                I also work effectively within cross-functional teams, aligning engineering outcomes
                with business and product goals.
              </p>
            </div>
          </div>

          <section
            aria-labelledby="start-conversation-heading"
            className="relative mb-10 flex min-h-[76vh] items-center justify-center overflow-hidden bg-[rgba(255,69,0,0.66)] p-4 sm:p-6"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.26),transparent_58%),radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.2),transparent_52%)]" />
            <div className="relative z-10 w-full max-w-2xl rounded-xl border border-black/20 bg-brutal-bg p-6 shadow-[0_20px_50px_rgba(0,0,0,0.28)] transition-[background-color,box-shadow] duration-300 hover:bg-white hover:shadow-[0_18px_40px_rgba(107,114,128,0.28),0_10px_24px_rgba(0,0,0,0.28)] md:p-8">
              <h2
                id="start-conversation-heading"
                className="mb-2 text-left font-serif text-2xl font-semibold text-brutal-ink"
              >
                Start a Conversation
              </h2>
              <p className="mb-6 text-left text-sm text-brutal-muted">
                Fill in the form below and I&apos;ll get back to you as soon as possible.
              </p>
              <ContactForm />
            </div>
          </section>

          <section aria-labelledby="get-in-touch-heading" className="mx-auto max-w-4xl">
            <div className="flex h-full flex-col border border-brutal-ink/15 bg-brutal-bg p-6 md:p-8">
              <h2
                id="get-in-touch-heading"
                className="mb-4 text-left font-serif text-2xl font-semibold text-brutal-ink"
              >
                Get in Touch
              </h2>
              <p className="mb-8 w-full px-0 text-left text-brutal-muted [margin:0_auto] md:max-w-3xl">
                Prefer direct contact? You can reach me via email or connect with me online to stay
                updated on my work in cloud infrastructure, DevOps, and scalable systems.
              </p>

              <div className="mx-auto w-full space-y-6 text-center md:max-w-2xl">
                <div className="mt-[60px] w-full border-t border-brutal-ink/15 pt-6 [margin:0_auto] md:max-w-2xl">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brutal-ink">
                    Professional Links
                  </h3>
                  <div className="flex w-full animate-fade-in-up flex-wrap items-center justify-center gap-3 px-0 text-sm [margin:0_auto] sm:w-fit sm:flex-nowrap sm:gap-6">
                    <a
                      href="mailto:gogiraFoundation@gmail.com"
                      aria-label="Email"
                      className="whitespace-nowrap rounded-sm px-3 py-1 font-medium text-brutal-ink transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-[orangered] hover:shadow-[0_8px_20px_rgba(107,114,128,0.24),0_4px_12px_rgba(0,0,0,0.2)]"
                    >
                      Email
                    </a>
                    <a
                      href="https://github.com/gogiraFoundation"
                      target="_blank"
                      rel="me noopener noreferrer"
                      aria-label="GitHub"
                      className="whitespace-nowrap rounded-sm px-3 py-1 font-medium text-brutal-ink transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-[orangered] hover:shadow-[0_8px_20px_rgba(107,114,128,0.24),0_4px_12px_rgba(0,0,0,0.2)]"
                    >
                      GitHub
                    </a>
                    <a
                      href="https://www.linkedin.com/in/emmanuel-ugbaje-b19227161/"
                      target="_blank"
                      rel="me noopener noreferrer"
                      aria-label="LinkedIn"
                      className="whitespace-nowrap rounded-sm px-3 py-1 font-medium text-brutal-ink transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-[orangered] hover:shadow-[0_8px_20px_rgba(107,114,128,0.24),0_4px_12px_rgba(0,0,0,0.2)]"
                    >
                      LinkedIn
                    </a>
                    <a
                      href="https://medium.com/@aigbemanuel"
                      target="_blank"
                      rel="me noopener noreferrer"
                      aria-label="Medium"
                      className="whitespace-nowrap rounded-sm px-3 py-1 font-medium text-brutal-ink transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-[orangered] hover:shadow-[0_8px_20px_rgba(107,114,128,0.24),0_4px_12px_rgba(0,0,0,0.2)]"
                    >
                      Medium
                    </a>
                  </div>
                </div>

                <div className="w-full border-t border-brutal-ink/15 pt-6 [margin:0_auto] md:max-w-2xl">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brutal-ink">
                    What You Can Expect
                  </h3>
                  <ul className="mx-auto list-inside list-disc space-y-2 text-center text-sm leading-relaxed text-brutal-muted marker:text-brutal-ink md:translate-x-2">
                    <li className="animate-fade-in-up transition-all duration-300 hover:translate-x-1 hover:text-brutal-ink">
                      Clear, timely communication
                    </li>
                    <li className="animate-fade-in-up transition-all duration-300 hover:translate-x-1 hover:text-brutal-ink">
                      A practical, engineering-first approach
                    </li>
                    <li className="animate-fade-in-up transition-all duration-300 hover:translate-x-1 hover:text-brutal-ink">
                      Secure, scalable, and maintainable solutions
                    </li>
                    <li className="animate-fade-in-up transition-all duration-300 hover:translate-x-1 hover:text-brutal-ink">
                      Alignment with modern cloud-native and DevOps best practices
                    </li>
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
