'use client'

import Link from 'next/link'
import { EssayDesignScope } from '@/components/essays/EssayDesignScope'
import { EssayNav } from '@/components/essays/EssayNav'
import { EssayFooter } from '@/components/essays/EssayFooter'
import { ESSAY_BYLINE } from '@/lib/essays'

export default function AboutPage() {
  return (
    <EssayDesignScope>
      <div className="flex min-h-screen flex-col bg-essay-bg text-essay-ink">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-essay-bg focus:px-3 focus:py-2 focus:text-essay-accent"
        >
          Skip to content
        </a>
        <EssayNav active="about" />
        <main id="main-content" className="flex-grow px-6 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-prose space-y-16">
            <header>
              <p className="font-essay-mono text-xs text-essay-muted" aria-hidden="true">
                // about
              </p>
              <h1 className="mt-3 font-essay-display text-4xl font-semibold tracking-tight md:text-5xl">
                Emmanuel Ugbaje
              </h1>
              <p className="mt-2 font-essay-mono text-xs text-essay-muted">{ESSAY_BYLINE}</p>
              <p className="mt-6 text-justify font-essay-sans text-base leading-relaxed text-essay-muted">
                Backend engineer focused on auth flows that don&apos;t leak, rate limits that hold
                under load, and pipelines that reconcile.
              </p>
              <p className="mt-4 text-justify font-essay-sans text-base leading-relaxed text-essay-muted">
                I am also building AI systems in public, starting with the Bench Notes series.
              </p>
              <p className="mt-4 font-essay-sans text-sm text-essay-ink">
                Currently open to full-time and contract backend, IAM, and AI systems work.
              </p>
            </header>

            <section aria-labelledby="summary-heading" className="space-y-4">
              <h2
                id="summary-heading"
                className="font-essay-display text-2xl font-semibold text-essay-ink"
              >
                What I do
              </h2>
              <p className="text-justify font-essay-sans text-base leading-relaxed text-essay-ink">
                I lead backend development at{' '}
                <strong className="font-medium">Traq Authenticator</strong>, an identity and access
                management product built on Django and PostgreSQL. The work sits behind verification
                flows and was built under a security-review constraint. I have not published a
                dedicated essay for that card yet. The public write-ups beside it are the TraqHq and
                traq_frontend essays, which are about the supply-chain product, not a transferred
                result from the IAM work.
              </p>
              <p className="text-justify font-essay-sans text-base leading-relaxed text-essay-ink">
                I came to backend engineering through energy analytics and blockchain data, where I
                learned to treat data quality as a security problem. I hold an MSc in Renewable
                Energy and Sustainable Technology, useful training in asking where a number came
                from before trusting it.
              </p>
              <p className="text-justify font-essay-sans text-base leading-relaxed text-essay-ink">
                I write up how the work was built and where it failed, because that is where the
                design decisions show.{' '}
                <Link href="/blog" className="text-essay-accent underline underline-offset-4">
                  Read the essays
                </Link>
                .
              </p>
            </section>

            <section aria-labelledby="tech-heading" className="space-y-4">
              <h2
                id="tech-heading"
                className="font-essay-display text-2xl font-semibold text-essay-ink"
              >
                Core tech
              </h2>
              <dl className="space-y-3 font-essay-sans text-sm leading-relaxed text-essay-ink">
                <div>
                  <dt className="font-medium text-essay-muted">Languages &amp; frameworks</dt>
                  <dd className="mt-1">Python · Django · REST APIs</dd>
                </div>
                <div>
                  <dt className="font-medium text-essay-muted">Data</dt>
                  <dd className="mt-1">PostgreSQL · Redis · pandas / ETL</dd>
                </div>
                <div>
                  <dt className="font-medium text-essay-muted">Infrastructure</dt>
                  <dd className="mt-1">Docker · CI/CD · AWS · GCP</dd>
                </div>
              </dl>
            </section>

            <section aria-labelledby="awards-heading" className="space-y-6">
              <h2
                id="awards-heading"
                className="font-essay-display text-2xl font-semibold text-essay-ink"
              >
                Awards &amp; certifications
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-essay-sans text-sm font-semibold uppercase tracking-wider text-essay-muted">
                    Awards &amp; volunteer work
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-justify font-essay-sans text-base text-essay-ink">
                    <li>Google Africa Developer Scholarship (2022)</li>
                    <li>Polygon Africa Bootcamp (2022)</li>
                    <li>Volunteer Agro-Extension Officer, N-Agro Scheme (2018–2020)</li>
                    <li>
                      Award of Excellence, Community Agricultural Programmes, NYSC Community
                      Development Service, Niger State (2017)
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-essay-sans text-sm font-semibold uppercase tracking-wider text-essay-muted">
                    Certifications
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-justify font-essay-sans text-base text-essay-ink">
                    <li>Google Project Management (Foundations) — Coursera</li>
                    <li>Understanding Research Methods — University of London, via Coursera</li>
                    <li>Google Cloud Platform foundations course (Coursera)</li>
                  </ul>
                </div>
              </div>
            </section>

            <p className="flex flex-wrap gap-x-4 gap-y-2 border-t border-essay-ink/10 pt-8 font-essay-sans text-sm">
              <Link
                href="/resume"
                className="inline-flex min-h-[44px] items-center text-essay-accent underline underline-offset-4"
              >
                Resume
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-[44px] items-center text-essay-accent underline underline-offset-4"
              >
                Get in touch
              </Link>
            </p>
          </div>
        </main>
        <EssayFooter />
      </div>
    </EssayDesignScope>
  )
}
