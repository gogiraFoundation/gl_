'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroGeometric } from '@/components/home/HeroGeometric'
import { ArrowRight, Sparkles } from 'lucide-react'

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
              <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
                <h1
                  className="text-center font-serif font-semibold tracking-tight text-brutal-ink"
                  style={{
                    fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.05,
                  }}
                >
                  Emmanuel Ugbaje
                </h1>
                <p className="text-center font-mono text-sm font-medium uppercase tracking-[0.12em] text-brutal-muted md:text-base">
                  Software | Data Engineer
                </p>
                <p className="w-full text-justify font-sans text-base leading-relaxed text-brutal-ink">
                  I build secure, scalable backend systems and APIs, currently leading backend
                  development at <strong>Traq Authenticator</strong>—specialising in identity
                  verification and Identity Access Management (IAM). With a deep focus on robust
                  security practices, I develop Django-based services integrated with PostgreSQL
                  databases, ensuring high-quality API security measures such as rate limiting with
                  Redis, password breach detection, file validation, and automated scanning. My
                  expertise extends to CI/CD pipelines and cloud-ready deployments.
                </p>
                <p className="w-full text-justify font-sans text-base leading-relaxed text-brutal-ink">
                  Holding a <strong>Master of Science in Renewable Energy</strong>, I also bring
                  substantial experience in data pipelines, having worked on energy analytics and
                  research projects that leverage cutting-edge technology.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:-ml-3">
                  <Link
                    href="/portfolio"
                    className="inline-flex w-fit items-center gap-2 border-0 bg-transparent font-sans text-sm font-semibold text-brutal-ink transition-opacity hover:opacity-70"
                  >
                    View portfolio
                    <ArrowRight className="h-4 w-4" />
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
              className="mb-4 text-justify font-serif text-[1.9rem] font-bold text-brutal-ink [text-align-last:center] md:text-[2.15rem]"
              style={{ fontSize: 'clamp(1.9rem, 4.2vw, 2.15rem)' }}
            >
              Core expertise & toolchain
            </h2>
            <p className="text-meta mx-auto mb-14 max-w-xl text-justify font-sans text-brutal-muted">
              I specialise in backend engineering, platform delivery, and data systems, working with
              the same stack that powers your production environment.
            </p>
            <div className="mx-auto grid w-full max-w-5xl grid-cols-1 justify-items-center gap-10 md:grid-cols-2 lg:grid-cols-4">
              {expertise.map((block, idx) => (
                <div
                  key={block.title}
                  className="group w-full max-w-[min(100%,240px)] border border-brutal-ink/15 bg-brutal-bg/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brutal-ink/35 hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)]"
                  style={{
                    animation: `fadeIn 0.55s ease-out both`,
                    animationDelay: `${idx * 120}ms`,
                  }}
                >
                  <h3 className="mb-4 text-center font-sans text-xs font-semibold uppercase tracking-[0.14em] text-brutal-muted transition-colors duration-300 group-hover:text-brutal-ink">
                    {block.title}
                  </h3>
                  <div className="mx-auto mb-4 h-px w-10 bg-brutal-ink/20 transition-all duration-300 group-hover:w-14 group-hover:bg-brutal-ink/40" />
                  <ul className="space-y-2 font-sans text-sm leading-relaxed text-brutal-ink">
                    {block.lines.map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-2 rounded-sm px-1 py-0.5 transition-colors duration-200 hover:bg-brutal-ink/5"
                      >
                        <span
                          className="mt-[1px] text-brutal-muted transition-colors duration-200 group-hover:text-brutal-ink/70"
                          aria-hidden
                        >
                          —
                        </span>
                        <span>{line}</span>
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
              className="mb-10 text-center font-serif text-[1.75rem] font-semibold text-brutal-ink md:text-[2rem]"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2rem)' }}
            >
              Selected impact
            </h2>
            <div className="mx-auto w-full max-w-5xl">
              <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {impacts.map((item) => (
                  <article
                    key={item.title}
                    className="flex min-w-[280px] flex-1 snap-start gap-3 border border-brutal-ink/10 bg-brutal-bg/65 p-5 font-sans text-brutal-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-brutal-ink/20 hover:shadow-[0_8px_18px_rgba(0,0,0,0.06)] md:min-w-[340px]"
                  >
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brutal-ink/15 text-brutal-ink/70">
                      <Sparkles className="h-3.5 w-3.5" />
                    </span>
                    <p className="text-base leading-relaxed">
                      <strong className="font-semibold">{item.title}.</strong> {item.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
            <div className="mx-auto mt-10 flex max-w-2xl flex-col items-center gap-5 px-2 text-center">
              <p className="font-sans text-sm leading-relaxed text-brutal-muted">
                Explore these themes through my portfolio, or get in touch to discuss your next
                project.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-brutal-ink transition-opacity hover:opacity-70"
                >
                  View portfolio
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border-b border-brutal-ink/30 pb-0.5 font-sans text-sm font-semibold text-brutal-ink transition-colors hover:border-brutal-ink/60"
                >
                  Contact Me
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
