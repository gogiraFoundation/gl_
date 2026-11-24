'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroGeometric } from '@/components/home/HeroGeometric'
import { ArrowRight } from 'lucide-react'

const expertise = [
  {
    title: 'Backend & Security',
    lines: [
      'Python, Django, REST APIs',
      'Authentication & IAM',
      'API security (rate limiting, breach detection, file validation)',
      'Microservices & system design',
    ],
  },
  {
    title: 'Platform & DevOps',
    lines: ['Docker, Redis, CI/CD', 'Git, Linux', 'AWS, GCP'],
  },
  {
    title: 'Data & Databases',
    lines: ['PostgreSQL, SQL, data modelling', 'Pandas, ETL pipelines', 'Data automation'],
  },
  {
    title: 'Delivery & Practices',
    lines: ['Automated testing', 'Git workflows', 'Agile methodologies, code reviews'],
  },
]

const impacts = [
  {
    title: 'IAM & Security',
    text: 'Rate limiting, breach detection, and file validation across identity verification flows.',
  },
  {
    title: 'Product Operations',
    text: 'Enhanced internal efficiency by approximately 60% through tailored tooling and process improvements.',
  },
  {
    title: 'Blockchain Data',
    text: 'Optimised blockchain data research pipeline, improving processing speed by ~50%.',
  },
  {
    title: 'Energy Analytics',
    text: 'Developed ISO 50001-aligned analytics and ETL processes in prior energy sector roles.',
  },
]

export default function Home() {
  useEffect(() => {
    document.title = 'Emmanuel Ugbaje | Software | Data Engineer'
    const metaDescription = document.querySelector('meta[name="description"]')
    const descriptionContent =
      'Software Engineer and Lead Developer building secure, scalable backend systems and APIs. Currently leading backend development at Traq Authenticator, specialising in identity verification and Identity Access Management (IAM).'
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
    <div className="animate-page-fade flex min-h-screen flex-col bg-brutal-bg">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="border-b border-brutal-ink bg-brutal-bg">
          <div className="layout-grid min-h-[min(85vh,920px)] items-center py-16 md:py-24">
            <div className="col-span-12 flex flex-col justify-center gap-8 lg:col-span-6">
              <div className="mx-auto flex w-full max-w-xl flex-col gap-8 lg:mx-0">
                <h1
                  className="text-center font-serif font-semibold tracking-tight text-brutal-ink lg:text-left"
                  style={{
                    fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.05,
                  }}
                >
                  Emmanuel Ugbaje
                </h1>
                <p className="text-center font-mono text-sm font-medium uppercase tracking-[0.12em] text-brutal-muted md:text-base lg:text-left">
                  Software | Data Engineer
                </p>
                <p className="w-full text-center font-sans text-base leading-relaxed text-brutal-ink lg:text-left">
                  I build secure, scalable backend systems and APIs, currently leading backend
                  development at <strong>Traq Authenticator</strong>.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:justify-start">
                  <Link
                    href="/portfolio"
                    className="btn-brutal btn-brutal-md group w-fit gap-2 font-sans text-sm"
                  >
                    View portfolio
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
                      aria-hidden
                    />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex w-fit items-center gap-2 border-0 bg-transparent font-sans text-sm font-semibold text-brutal-ink transition-opacity hover:opacity-70"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-span-12 flex justify-center lg:col-span-6 lg:justify-start">
              <HeroGeometric />
            </div>
          </div>
        </section>

        {/* Core expertise */}
        <section className="border-b border-brutal-ink/15 bg-brutal-bg py-20 md:py-28">
          <div className="container-content">
            <h2
              className="mb-4 text-left font-serif text-[1.9rem] font-semibold tracking-tight text-brutal-ink md:text-[2.15rem]"
              style={{ fontSize: 'clamp(1.9rem, 4.2vw, 2.15rem)' }}
            >
              Core expertise & toolchain
            </h2>
            <div className="text-meta mx-auto mb-14 max-w-xl space-y-4 text-left font-sans text-brutal-muted md:text-justify">
              <p>
                Backend engineering, platform delivery, and data systems—Django, PostgreSQL, and the
                practices that keep production APIs secure under load.
              </p>
              <p>
                Security work includes Redis rate limiting, password breach detection, file
                validation, and automated scanning, plus CI/CD and cloud-ready deploys.
              </p>
              <p>
                With an <strong className="text-brutal-ink">MSc in Renewable Energy</strong>, I also
                build data pipelines for energy analytics—turning sensor and meter data into
                decisions teams can use.
              </p>
            </div>
            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 justify-items-center gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {expertise.map((block) => (
                <div
                  key={block.title}
                  className="group w-full max-w-[min(100%,240px)] border border-brutal-ink/15 bg-brutal-bg p-5 text-center"
                >
                  <h3 className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-brutal-muted transition-colors duration-300 group-hover:text-brutal-ink">
                    {block.title}
                  </h3>
                  <div className="mx-auto mb-4 h-px w-10 bg-brutal-ink/20 transition-[width,background-color] duration-300 group-hover:w-14 group-hover:bg-brutal-ink/40" />
                  <ul className="space-y-2 font-sans text-sm leading-relaxed text-brutal-ink">
                    {block.lines.map((line) => (
                      <li
                        key={line}
                        className="flex items-start justify-center gap-2 rounded-sm py-0.5 text-center transition-colors duration-200 hover:bg-brutal-ink/5"
                      >
                        <span
                          className="mt-px text-brutal-muted transition-colors duration-200 group-hover:text-brutal-ink/70"
                          aria-hidden
                        >
                          —
                        </span>
                        <span className="text-left">{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Selected impact */}
        <section className="border-b border-brutal-ink/15 bg-brutal-bg pb-20 pt-10 md:pb-24 md:pt-12">
          <div className="container-content mx-auto">
            <h2
              className="mb-10 text-center font-serif text-[1.75rem] font-semibold tracking-tight text-brutal-ink md:text-[2rem]"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2rem)' }}
            >
              Selected impact
            </h2>
            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
              {impacts.map((item) => (
                <article
                  key={item.title}
                  className="border-t border-brutal-ink/15 pt-5 text-center font-sans text-brutal-ink"
                >
                  <p className="text-base leading-relaxed">
                    <strong className="font-semibold">{item.title}.</strong> {item.text}
                  </p>
                </article>
              ))}
            </div>
            <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center gap-5 border-t border-brutal-ink/15 pt-10 text-center">
              <p className="font-sans text-sm leading-relaxed text-brutal-muted">
                Explore these themes in the portfolio, or get in touch about your next project.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                <Link
                  href="/portfolio"
                  className="inline-flex min-h-11 items-center gap-2 font-sans text-sm font-semibold text-brutal-ink transition-opacity hover:opacity-70"
                >
                  View portfolio
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center gap-2 border-b border-brutal-ink/30 pb-0.5 font-sans text-sm font-semibold text-brutal-ink transition-opacity hover:opacity-70"
                >
                  Contact me
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
