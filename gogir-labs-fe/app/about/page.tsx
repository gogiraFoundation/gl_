'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import type { Testimonial } from '@/components/testimonials/TestimonialCard'
import { TestimonialsCarousel } from '@/components/testimonials/TestimonialsCarousel'
import { Github, Linkedin, BookOpen, Code, Users, BarChart, Zap, Mail } from 'lucide-react'
import { GlowCard } from '@/components/ui/GlowCard'
import api from '@/lib/api'

const CONNECT_LINK_CLASS =
  'connect-social-link group inline-flex shrink-0 items-center gap-1.5 rounded-sm px-2 py-1 text-sm font-medium text-brutal-ink whitespace-nowrap transition-colors duration-200 hover:text-brutal-muted'

const CONNECT_ICON_CLASS = 'block h-3.5 w-3.5 shrink-0 leading-none sm:h-4 sm:w-4'

const EXPERTISE_ICONS = [
  { Icon: Code, label: 'Development' },
  { Icon: Users, label: 'Collaboration' },
  { Icon: BarChart, label: 'Data' },
  { Icon: Zap, label: 'Delivery' },
] as const

function getTestimonialsList(data: unknown): Testimonial[] {
  if (!data) return []
  if (Array.isArray(data)) return data as Testimonial[]
  const results = (data as { results?: Testimonial[] }).results
  return results || []
}

export default function AboutPage() {
  const { data: testimonialsData } = useQuery({
    queryKey: ['testimonials', 'featured'],
    queryFn: async () => {
      const response = await api.get('/testimonials/', { params: { featured: true } })
      return response.data
    },
  })
  const featuredTestimonials = getTestimonialsList(testimonialsData)

  return (
    <div className="flex min-h-screen flex-col bg-brutal-bg">
      <Header />
      <main className="relative flex-grow px-4 py-20 md:py-32 lg:py-40">
        <div className="relative z-10 mx-auto max-w-5xl space-y-24">
          <header className="mx-auto my-0 w-full max-w-3xl text-left">
            <h1 className="mb-3 font-serif text-4xl font-semibold tracking-tight text-brutal-ink md:text-5xl">
              About
            </h1>
            <p className="my-0 max-w-3xl text-left text-base leading-relaxed text-brutal-muted md:text-justify">
              Secure, scalable backends and APIs—with a focus on{' '}
              <strong className="font-medium text-brutal-ink">authentication</strong>,{' '}
              <strong className="font-medium text-brutal-ink">data pipelines</strong>, and{' '}
              <strong className="font-medium text-brutal-ink">cloud-ready systems</strong>.
            </p>
          </header>

          <section
            aria-labelledby="what-i-do-body"
            className="mx-auto my-0 !mt-6 w-full max-w-3xl md:!mt-8"
          >
            <h2 id="what-i-do-body" className="sr-only">
              Professional summary
            </h2>
            <div className="mx-auto my-0 flex w-full max-w-3xl flex-col gap-4 border border-brutal-ink/15 bg-brutal-bg p-6 md:p-8 [&_p]:m-0">
              <p className="text-left text-base leading-relaxed text-brutal-muted md:text-justify">
                As a <strong className="font-medium text-brutal-ink">Software Engineer</strong> and{' '}
                <strong className="font-medium text-brutal-ink">Lead Developer</strong>, I build
                secure, scalable backend systems and APIs, specialising in{' '}
                <strong className="font-medium text-brutal-ink">Python</strong>,{' '}
                <strong className="font-medium text-brutal-ink">Django</strong>, and cloud-ready
                platforms. The focus is{' '}
                <strong className="font-medium text-brutal-ink">authentication</strong>,{' '}
                <strong className="font-medium text-brutal-ink">data pipelines</strong>, and
                production services that stay reliable under load.
              </p>
              <p className="text-left text-base leading-relaxed text-brutal-muted md:text-justify">
                I hold a{' '}
                <strong className="font-medium text-brutal-ink">
                  Master&apos;s in Renewable Energy &amp; Sustainable Technology
                </strong>
                , and I bring that systems mindset to software that serves both business and
                environmental goals.
              </p>
              <p className="text-left text-base leading-relaxed text-brutal-muted md:text-justify">
                I lead backend development at{' '}
                <strong className="font-medium text-brutal-ink">Traq Authenticator</strong>, an{' '}
                <strong className="font-medium text-brutal-ink">
                  Identity and Access Management (IAM)
                </strong>{' '}
                platform. The stack is{' '}
                <strong className="font-medium text-brutal-ink">Django</strong> and{' '}
                <strong className="font-medium text-brutal-ink">PostgreSQL</strong>, with secure{' '}
                <strong className="font-medium text-brutal-ink">REST APIs</strong>, password breach
                detection, Redis rate limiting, file validation, and{' '}
                <strong className="font-medium text-brutal-ink">CI/CD</strong> for testing and
                deployment.
              </p>
              <p className="text-left text-base leading-relaxed text-brutal-muted md:text-justify">
                Earlier work spans <strong className="font-medium text-brutal-ink">energy</strong>,{' '}
                <strong className="font-medium text-brutal-ink">blockchain</strong>, and digital
                products—from data pipelines and energy performance systems to research tooling and
                internal operations.
              </p>
              <p className="text-left text-base leading-relaxed text-brutal-muted md:text-justify">
                See the{' '}
                <Link
                  href="/portfolio"
                  className="font-medium text-brutal-ink underline underline-offset-4 transition-opacity duration-200 hover:opacity-75"
                >
                  portfolio
                </Link>{' '}
                or the{' '}
                <Link
                  href="/blog"
                  className="font-medium text-brutal-ink underline underline-offset-4 transition-opacity duration-200 hover:opacity-75"
                >
                  blog
                </Link>{' '}
                for the work in detail.
              </p>
            </div>
          </section>

          <section aria-labelledby="expertise-heading">
            <div className="mx-auto my-0 w-full max-w-3xl px-1 text-left sm:px-0">
              <h2
                id="expertise-heading"
                className="mb-12 font-serif text-3xl font-semibold tracking-tight text-brutal-ink md:text-4xl"
              >
                Core expertise &amp; tech stack
              </h2>
            </div>

            <div
              className="mb-12 flex flex-wrap items-center justify-start gap-4"
              aria-label="Core expertise areas"
            >
              {EXPERTISE_ICONS.map(({ Icon, label }) => (
                <div
                  key={label}
                  className="flex h-11 w-11 items-center justify-center border border-brutal-ink/15 text-brutal-ink"
                  title={label}
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
              ))}
            </div>

            <div className="mx-auto my-0 grid w-full min-w-0 max-w-full grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-3">
              <GlowCard className="min-w-0 overflow-hidden p-3 text-left sm:p-4 md:p-4">
                <h3 className="mb-2 text-sm font-semibold leading-tight text-brutal-ink sm:text-base">
                  Backend &amp; Security
                </h3>
                <ul className="max-h-28 list-inside list-disc space-y-1 overflow-hidden break-words text-xs leading-snug text-brutal-muted sm:max-h-32 sm:text-[13px] md:text-[14px] xl:max-h-36">
                  <li>
                    <strong className="text-brutal-ink">Python</strong>,{' '}
                    <strong className="text-brutal-ink">Django</strong>,{' '}
                    <strong className="text-brutal-ink">Flask</strong>,{' '}
                    <strong className="text-brutal-ink">FastAPI</strong>
                  </li>
                  <li>
                    <strong className="text-brutal-ink">RESTful APIs</strong>,{' '}
                    <strong className="text-brutal-ink">GraphQL</strong>
                  </li>
                  <li>
                    <strong className="text-brutal-ink">Authentication Systems</strong> (OAuth, JWT,
                    SSO)
                  </li>
                  <li>
                    <strong className="text-brutal-ink">API Security</strong> (Rate Limiting, Breach
                    Detection, File Validation)
                  </li>
                  <li>
                    <strong className="text-brutal-ink">Microservices</strong> architecture,{' '}
                    <strong className="text-brutal-ink">Asynchronous Processing</strong>
                  </li>
                  <li>
                    <strong className="text-brutal-ink">Containerisation</strong> (Docker,
                    Kubernetes)
                  </li>
                  <li>
                    <strong className="text-brutal-ink">Redis</strong>,{' '}
                    <strong className="text-brutal-ink">Celery</strong> (Task Queues)
                  </li>
                  <li>
                    <strong className="text-brutal-ink">System Design</strong> &amp;{' '}
                    <strong className="text-brutal-ink">Architecture</strong>
                  </li>
                </ul>
              </GlowCard>

              <GlowCard className="min-w-0 overflow-hidden p-3 text-left sm:p-4 md:p-4">
                <h3 className="mb-2 text-sm font-semibold leading-tight text-brutal-ink sm:text-base">
                  Cloud Infrastructure &amp; DevOps
                </h3>
                <ul className="max-h-28 list-inside list-disc space-y-1 overflow-hidden break-words text-xs leading-snug text-brutal-muted sm:max-h-32 sm:text-[13px] md:text-[14px] xl:max-h-36">
                  <li>
                    <strong className="text-brutal-ink">AWS</strong>,{' '}
                    <strong className="text-brutal-ink">GCP</strong>,{' '}
                    <strong className="text-brutal-ink">Azure</strong>
                  </li>
                  <li>
                    <strong className="text-brutal-ink">CI/CD</strong> Pipelines (GitHub Actions,
                    Jenkins, CircleCI)
                  </li>
                  <li>
                    <strong className="text-brutal-ink">Infrastructure as Code (IaC)</strong>{' '}
                    (Terraform, CloudFormation)
                  </li>
                  <li>
                    <strong className="text-brutal-ink">Linux</strong>,{' '}
                    <strong className="text-brutal-ink">Git</strong>,{' '}
                    <strong className="text-brutal-ink">Docker</strong>
                  </li>
                </ul>
              </GlowCard>

              <GlowCard className="min-w-0 overflow-hidden p-3 text-left sm:p-4 md:p-4">
                <h3 className="mb-2 text-sm font-semibold leading-tight text-brutal-ink sm:text-base">
                  Data Engineering &amp; Analytics
                </h3>
                <ul className="max-h-28 list-inside list-disc space-y-1 overflow-hidden break-words text-xs leading-snug text-brutal-muted sm:max-h-32 sm:text-[13px] md:text-[14px] xl:max-h-36">
                  <li>
                    <strong className="text-brutal-ink">PostgreSQL</strong>,{' '}
                    <strong className="text-brutal-ink">MySQL</strong>,{' '}
                    <strong className="text-brutal-ink">SQL Server</strong>
                  </li>
                  <li>
                    <strong className="text-brutal-ink">Data Modelling</strong>,{' '}
                    <strong className="text-brutal-ink">ETL Pipelines</strong>,{' '}
                    <strong className="text-brutal-ink">Data Warehousing</strong>
                  </li>
                  <li>
                    <strong className="text-brutal-ink">Pandas</strong>,{' '}
                    <strong className="text-brutal-ink">NumPy</strong>,{' '}
                    <strong className="text-brutal-ink">Apache Spark</strong>
                  </li>
                  <li>
                    <strong className="text-brutal-ink">Data Automation</strong> (Airflow, Prefect)
                  </li>
                </ul>
              </GlowCard>

              <GlowCard className="min-w-0 overflow-hidden p-3 text-left sm:p-4 md:p-4">
                <h3 className="mb-2 text-sm font-semibold leading-tight text-brutal-ink sm:text-base">
                  Agile Development &amp; Best Practices
                </h3>
                <ul className="max-h-28 list-inside list-disc space-y-1 overflow-hidden break-words text-xs leading-snug text-brutal-muted sm:max-h-32 sm:text-[13px] md:text-[14px] xl:max-h-36">
                  <li>
                    <strong className="text-brutal-ink">Agile Methodologies</strong> (Scrum, Kanban)
                  </li>
                  <li>
                    <strong className="text-brutal-ink">Automated Testing</strong> (Unit,
                    Integration, End-to-End)
                  </li>
                  <li>
                    <strong className="text-brutal-ink">Code Reviews</strong>,{' '}
                    <strong className="text-brutal-ink">Test-Driven Development (TDD)</strong>
                  </li>
                  <li>
                    <strong className="text-brutal-ink">Version Control</strong> (Git)
                  </li>
                </ul>
              </GlowCard>
            </div>
          </section>

          <section aria-labelledby="awards-heading">
            <h2
              id="awards-heading"
              className="mb-8 text-left font-serif text-3xl font-semibold tracking-tight text-brutal-ink md:mb-12 md:text-4xl"
            >
              Awards &amp; certifications
            </h2>
            <GlowCard className="p-8 md:p-12">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-brutal-ink">
                    Awards &amp; volunteer work
                  </h3>
                  <ul className="list-disc space-y-2 pl-5 text-brutal-muted">
                    <li>Google Africa Developer Scholarship — 2022</li>
                    <li>Polygon Africa Bootcamp — 2022</li>
                    <li>N-agro Scheme — Volunteer Agro-Extension Officer (2018 – 2020)</li>
                    <li>
                      Award of Excellence — Community Agricultural Programmes (NYSC-CDS), Niger
                      State — 2017
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-brutal-ink">Certifications</h3>
                  <ul className="list-disc space-y-2 pl-5 text-brutal-muted">
                    <li>University of London (Coursera): Understanding Research Methods</li>
                    <li>Google Project Management Foundations</li>
                    <li>Google Cloud Platform</li>
                    <li>AWS Certified Solutions Architect (In Progress)</li>
                  </ul>
                </div>
              </div>
            </GlowCard>
          </section>

          {featuredTestimonials.length > 0 && (
            <section aria-labelledby="testimonials-heading">
              <h2
                id="testimonials-heading"
                className="mb-8 text-left font-serif text-3xl font-semibold tracking-tight text-brutal-ink md:mb-12 md:text-4xl"
              >
                Testimonials
              </h2>
              <TestimonialsCarousel testimonials={featuredTestimonials} />
            </section>
          )}

          <section aria-labelledby="connect-heading" className="w-full max-w-2xl text-left">
            <h2
              id="connect-heading"
              className="mb-6 text-left font-serif text-3xl font-semibold tracking-tight text-brutal-ink md:mb-8 md:text-4xl"
            >
              Connect
            </h2>
            <div className="flex w-full justify-start">
              <div className="flex w-full flex-wrap items-center justify-start gap-2 sm:gap-3">
                <a
                  href="https://medium.com/@aigbemanuel"
                  target="_blank"
                  rel="me noopener noreferrer"
                  className={CONNECT_LINK_CLASS}
                >
                  <BookOpen className={CONNECT_ICON_CLASS} aria-hidden />
                  <span>Medium</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/emmanuel-ugbaje-b19227161/"
                  target="_blank"
                  rel="me noopener noreferrer"
                  className={CONNECT_LINK_CLASS}
                >
                  <Linkedin className={CONNECT_ICON_CLASS} aria-hidden />
                  <span>LinkedIn</span>
                </a>
                <a href="mailto:hi@gogirlabs.uk" className={CONNECT_LINK_CLASS}>
                  <Mail className={CONNECT_ICON_CLASS} aria-hidden />
                  <span>Email</span>
                </a>
                <a
                  href="https://github.com/gogiraFoundation"
                  target="_blank"
                  rel="me noopener noreferrer"
                  className={CONNECT_LINK_CLASS}
                >
                  <Github className={CONNECT_ICON_CLASS} aria-hidden />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
