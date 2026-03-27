'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import type { Testimonial } from '@/components/testimonials/TestimonialCard'
import { TestimonialsCarousel } from '@/components/testimonials/TestimonialsCarousel'
import { Github, Linkedin, BookOpen, Code, Users, BarChart, Zap, Mail } from 'lucide-react'
import { GradientText } from '@/components/ui/GradientText'
import { OrbitingIcons } from '@/components/ui/OrbitingIcons'
import { GlowCard } from '@/components/ui/GlowCard'

const STATIC_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    client_name: 'Emily Rodriguez',
    client_role: 'Founder',
    company: 'GreenEnergy Co',
    content:
      "Emmanuel's expertise in renewable energy systems and software development helped us build a cutting-edge platform. Outstanding work!",
    rating: 5,
    client_image: null,
    company_logo: null,
    featured: true,
    created_at: '',
  },
  {
    id: 2,
    client_name: 'Michael Chen',
    client_role: 'Product Manager',
    company: 'DataFlow Systems',
    content:
      'Working with Emmanuel was a pleasure. He transformed our data pipeline and improved performance significantly. Highly recommended!',
    rating: 5,
    client_image: null,
    company_logo: null,
    featured: true,
    created_at: '',
  },
  {
    id: 3,
    client_name: 'Sarah Johnson',
    client_role: 'CTO',
    company: 'TechStart Inc',
    content:
      'Emmanuel delivered an exceptional Django application that exceeded our expectations. His attention to detail and technical expertise made the project a huge success.',
    rating: 5,
    client_image: null,
    company_logo: null,
    featured: true,
    created_at: '',
  },
]

const CONNECT_LINK_CLASS =
  'connect-social-link group inline-flex shrink-0 flex-row flex-nowrap items-center gap-1.5 rounded-sm px-2 py-1 text-sm font-medium text-brutal-ink whitespace-nowrap transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-brutal-ink/[0.06] hover:shadow-[0_4px_14px_rgba(0,0,0,0.07)] motion-reduce:hover:translate-y-0'

const CONNECT_ICON_CLASS =
  'block h-3.5 w-3.5 shrink-0 leading-none transition-transform duration-300 group-hover:scale-105 sm:h-4 sm:w-4'

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-brutal-bg">
      <Header />
      <main className="relative flex-grow px-4 py-20 md:py-32 lg:py-40">
        <div className="relative z-10 mx-auto max-w-5xl space-y-24">
          <header className="animate-fade-in-up text-center">
            <h1 className="mb-3 text-4xl font-bold text-brutal-ink md:text-5xl">
              <GradientText>What I Do</GradientText>
            </h1>
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-brutal-muted md:text-base">
              Building secure, scalable backends and APIs with a focus on{' '}
              <strong className="font-medium text-brutal-ink">authentication</strong>,{' '}
              <strong className="font-medium text-brutal-ink">data pipelines</strong>, and{' '}
              <strong className="font-medium text-brutal-ink">cloud-native solutions</strong>.
            </p>
          </header>

          <section aria-labelledby="what-i-do-body" className="!mt-6 md:!mt-8">
            <h2 id="what-i-do-body" className="sr-only">
              Professional summary
            </h2>
            <div className="group/summary mx-auto my-0 flex max-w-3xl flex-col gap-4 rounded-sm bg-brutal-bg p-6 shadow-[0_4px_16px_rgba(0,0,0,0.07),0_1px_0_rgba(255,255,255,0.04)_inset] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(0,0,0,0.1)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-8 [&_p]:m-0">
              <p className="text-justify text-sm leading-relaxed text-brutal-muted md:text-[15px]">
                As a <strong className="font-medium text-brutal-ink">Software Engineer</strong> and{' '}
                <strong className="font-medium text-brutal-ink">Lead Developer</strong>, I build
                secure, scalable backend systems and APIs, specialising in{' '}
                <strong className="font-medium text-brutal-ink">Python</strong>,{' '}
                <strong className="font-medium text-brutal-ink">Django</strong>, and{' '}
                <strong className="font-medium text-brutal-ink">cloud-native technologies</strong>.
                With a strong foundation in{' '}
                <strong className="font-medium text-brutal-ink">authentication systems</strong>,{' '}
                <strong className="font-medium text-brutal-ink">data pipelines</strong>, and{' '}
                <strong className="font-medium text-brutal-ink">production-grade services</strong>,
                I focus on delivering high-performing solutions that are{' '}
                <strong className="font-medium text-brutal-ink">reliable</strong>,{' '}
                <strong className="font-medium text-brutal-ink">secure</strong>, and{' '}
                <strong className="font-medium text-brutal-ink">scalable</strong>.
              </p>
              <p className="text-justify text-sm leading-relaxed text-brutal-muted md:text-[15px]">
                I hold a{' '}
                <strong className="font-medium text-brutal-ink">
                  Master&apos;s in Renewable Energy &amp; Sustainable Technology
                </strong>
                , and I apply this multidisciplinary approach to designing systems that optimise
                both <strong className="font-medium text-brutal-ink">business</strong> and{' '}
                <strong className="font-medium text-brutal-ink">environmental</strong> outcomes.
              </p>
              <p className="text-justify text-sm leading-relaxed text-brutal-muted md:text-[15px]">
                Currently, I serve as the{' '}
                <strong className="font-medium text-brutal-ink">Lead Developer</strong> at{' '}
                <strong className="font-medium text-brutal-ink">Traq Authenticator</strong>, a
                cutting-edge{' '}
                <strong className="font-medium text-brutal-ink">
                  Identity and Access Management (IAM)
                </strong>{' '}
                platform. Here, I architect backend solutions using{' '}
                <strong className="font-medium text-brutal-ink">Django</strong> and{' '}
                <strong className="font-medium text-brutal-ink">PostgreSQL</strong>, developing
                secure <strong className="font-medium text-brutal-ink">REST APIs</strong> while
                embedding advanced security features such as{' '}
                <strong className="font-medium text-brutal-ink">password breach detection</strong>,{' '}
                <strong className="font-medium text-brutal-ink">rate limiting with Redis</strong>,
                and{' '}
                <strong className="font-medium text-brutal-ink">file validation pipelines</strong>.
                My role also involves driving{' '}
                <strong className="font-medium text-brutal-ink">CI/CD</strong> automation for
                seamless testing, deployment, and continuous integration.
              </p>
              <p className="text-justify text-sm leading-relaxed text-brutal-muted md:text-[15px]">
                I&apos;ve worked across a broad range of industries, including{' '}
                <strong className="font-medium text-brutal-ink">energy</strong>,{' '}
                <strong className="font-medium text-brutal-ink">blockchain</strong>, and{' '}
                <strong className="font-medium text-brutal-ink">digital startups</strong>. From
                building <strong className="font-medium text-brutal-ink">data pipelines</strong> and{' '}
                <strong className="font-medium text-brutal-ink">energy performance systems</strong>{' '}
                to optimising blockchain research tools and streamlining operational workflows,
                I&apos;ve honed a versatile skill set that adapts to modern, high-impact technology
                challenges.
              </p>
              <p className="text-justify text-sm leading-relaxed text-brutal-muted md:text-[15px]">
                I&apos;m deeply passionate about building technology that empowers organisations,
                reduces operational friction, and contributes to environmental sustainability. You
                can explore my{' '}
                <Link
                  href="/portfolio"
                  className="font-medium text-brutal-ink underline underline-offset-4 transition-opacity duration-200 ease-out hover:opacity-75"
                >
                  portfolio
                </Link>{' '}
                or read my{' '}
                <Link
                  href="/blog"
                  className="font-medium text-brutal-ink underline underline-offset-4 transition-opacity duration-200 ease-out hover:opacity-75"
                >
                  blog
                </Link>{' '}
                to learn more about my work in{' '}
                <strong className="font-medium text-brutal-ink">software development</strong>,{' '}
                <strong className="font-medium text-brutal-ink">energy systems</strong>, and{' '}
                <strong className="font-medium text-brutal-ink">digital transformation</strong>.
              </p>
            </div>
          </section>

          <section aria-labelledby="expertise-heading">
            <h2
              id="expertise-heading"
              className="mb-12 text-center text-3xl font-bold text-brutal-ink md:text-4xl"
            >
              <GradientText>Core Expertise &amp; Tech Stack</GradientText>
            </h2>

            <OrbitingIcons
              centerIcon={<Code className="h-12 w-12 text-brutal-ink" aria-label="Code Icon" />}
              icons={[
                {
                  icon: <Code className="h-6 w-6 text-brutal-ink" aria-label="Development Icon" />,
                },
                {
                  icon: (
                    <Users
                      className="h-6 w-6 text-brutal-ink"
                      aria-label="Project Management Icon"
                    />
                  ),
                },
                {
                  icon: (
                    <BarChart
                      className="h-6 w-6 text-brutal-ink"
                      aria-label="Data Analytics Icon"
                    />
                  ),
                },
                { icon: <Zap className="h-6 w-6 text-brutal-ink" aria-label="Energy Icon" /> },
                {
                  icon: <Code className="h-6 w-6 text-brutal-ink" aria-label="Programming Icon" />,
                },
                { icon: <Users className="h-6 w-6 text-brutal-ink" aria-label="Team Icon" /> },
              ]}
              radius={120}
              className="mb-12"
            />

            <div className="mx-auto my-0 grid w-[80%] min-w-0 max-w-full grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-3">
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
              className="mb-8 text-3xl font-bold text-brutal-ink md:mb-12 md:text-4xl"
            >
              Awards &amp; Certifications
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

          <section aria-labelledby="testimonials-heading">
            <h2
              id="testimonials-heading"
              className="mb-8 text-center font-serif text-3xl font-semibold text-brutal-ink md:mb-12 md:text-4xl"
            >
              <GradientText>Testimonials</GradientText>
            </h2>
            <TestimonialsCarousel testimonials={STATIC_TESTIMONIALS} />
          </section>

          <section
            aria-labelledby="connect-heading"
            className="mx-auto w-full max-w-[40%] text-center"
          >
            <h2
              id="connect-heading"
              className="mb-6 text-center font-serif text-3xl font-semibold text-brutal-ink md:mb-8 md:text-4xl"
            >
              Connect with me
            </h2>
            <div className="flex w-full justify-center overflow-x-auto [-webkit-overflow-scrolling:touch]">
              <div className="inline-flex w-max translate-x-[calc(10px-1.25rem)] flex-nowrap items-center justify-center gap-2 sm:translate-x-[calc(10px-2rem)] sm:gap-3">
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
                <a href="mailto:dev@gogirlabs.uk" className={CONNECT_LINK_CLASS}>
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
