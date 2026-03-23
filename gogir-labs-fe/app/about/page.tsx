'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { TestimonialCard } from '@/components/testimonials/TestimonialCard'
import { Github, Linkedin, BookOpen, Code, Users, BarChart, Zap, Mail } from 'lucide-react'
import { GradientText } from '@/components/ui/GradientText'
import { OrbitingIcons } from '@/components/ui/OrbitingIcons'
import { GlowCard } from '@/components/ui/GlowCard'
import { SkillChips } from '@/components/ui/SkillChips'
import api from '@/lib/api'

interface Testimonial {
  id: number
  client_name: string
  client_role: string
  company: string
  content: string
  rating: number
  client_image: string | null
  company_logo: string | null
  featured: boolean
  created_at: string
}

export default function AboutPage() {
  useEffect(() => {
    document.title =
      'About | Emmanuel Ugbaje — Software Engineer & Lead Developer | Python, Django, Auth'
    const metaDescription = document.querySelector('meta[name="description"]')
    const descriptionContent =
      'Software Engineer building secure Python/Django backends and authentication systems. Lead Developer at Traq Authenticator; MSc Renewable Energy; experience in energy analytics, product operations, and data-driven delivery.'
    if (metaDescription) {
      metaDescription.setAttribute('content', descriptionContent)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = descriptionContent
      document.getElementsByTagName('head')[0].appendChild(meta)
    }
  }, [])

  const { data: testimonials } = useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const response = await api.get('/testimonials/')
      return response.data.results || response.data
    },
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative flex-grow px-4 py-20 md:py-32 lg:py-40">
        <div className="absolute inset-0 bg-gradient-mesh opacity-20"></div>

        <div className="relative z-10 mx-auto max-w-5xl space-y-24">
          <div className="animate-fade-in-up text-center">
            <h1 className="mb-8 text-5xl font-bold md:text-6xl">
              <GradientText>What I Do</GradientText>
            </h1>
          </div>

          <section>
            <div className="glass space-y-6 rounded-2xl p-8 md:p-12">
              <p className="text-justify text-lg leading-relaxed text-gray-300 md:text-xl">
                I&apos;m a Software Engineer with experience building secure, scalable backend
                systems and APIs using Python frameworks. I focus on authentication systems, data
                pipelines, and production-ready services with reliability, security, and performance
                in mind. I hold an MSc in Renewable Energy &amp; Sustainable Technology and apply
                that lens when building technology that supports business and environmental
                outcomes.
              </p>
              <p className="text-justify text-lg leading-relaxed text-gray-300 md:text-xl">
                I&apos;m currently Lead Developer at Traq Authenticator—a secure identity and access
                management platform for identity verification and supply chain traceability. I lead
                backend development with Django and PostgreSQL, ship secure REST APIs, and implement
                protections including password breach detection, Redis-backed rate limiting, file
                validation, and integrations for malware scanning and threat detection, alongside
                CI/CD automation for testing and deployment.
              </p>
              <p className="text-justify text-lg leading-relaxed text-gray-300 md:text-xl">
                Earlier roles include Energy Analyst in manufacturing (Python ETL, SQL dashboards,
                ISO 50001-aligned energy performance work), Product Operations Manager for a remote
                digital startup (internal tooling and workflows that improved operational efficiency
                by 60%), Research Analyst in tokenomics and business data (blockchain metrics,
                Python automation that cut processing time by about 50%), and Volunteer IT &amp;
                Data Officer for a breast cancer foundation—digitising volunteer tracking and
                reporting.
              </p>
              <p className="text-justify text-lg leading-relaxed text-gray-300 md:text-xl">
                I&apos;m passionate about reliable platforms that improve how organisations work.
                Explore my{' '}
                <Link href="/portfolio" className="text-purple-400 underline hover:text-purple-300">
                  portfolio
                </Link>{' '}
                or read my{' '}
                <Link href="/blog" className="text-purple-400 underline hover:text-purple-300">
                  blog
                </Link>{' '}
                for more on software development, energy systems, and digital transformation.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-10 text-center text-3xl font-bold text-white md:text-4xl">
              <GradientText>Experience</GradientText>
            </h2>
            <div className="space-y-8">
              <GlowCard glowColor="purple" className="p-6 text-left md:p-8">
                <h3 className="text-xl font-semibold text-white">Lead Developer</h3>
                <p className="mb-1 text-purple-300/90">Traq Authenticator — Secure IAM platform</p>
                <p className="mb-4 text-sm text-gray-400">2024 – Present</p>
                <ul className="list-disc space-y-2 pl-5 text-gray-300 md:text-[17px]">
                  <li>
                    Modular Django + PostgreSQL architecture for authentication, identity
                    verification, and document validation APIs.
                  </li>
                  <li>
                    Advanced security: password breach detection, Redis rate limiting, file
                    validation pipelines, external APIs for malware scanning and threat detection.
                  </li>
                  <li>
                    CI/CD pipelines for automated testing and deployment; scalable,
                    high-availability services.
                  </li>
                </ul>
                <p className="mt-4 text-sm text-gray-500">
                  Technologies: Python, Django, Redis, PostgreSQL, Docker, Git
                </p>
              </GlowCard>

              <GlowCard glowColor="blue" className="p-6 text-left md:p-8">
                <h3 className="text-xl font-semibold text-white">Energy Analyst</h3>
                <p className="mb-1 text-blue-300/90">Manufacturing sector</p>
                <p className="mb-4 text-sm text-gray-400">Mar 2021 – Dec 2022</p>
                <ul className="list-disc space-y-2 pl-5 text-gray-300 md:text-[17px]">
                  <li>Python ETL pipelines for operational datasets and analytics reports.</li>
                  <li>SQL queries and data models supporting energy performance dashboards.</li>
                  <li>
                    Automated KPI reporting; collaboration on ISO 50001 energy management
                    frameworks.
                  </li>
                </ul>
                <p className="mt-4 text-sm text-gray-500">
                  Technologies: Python, SQL, data analysis
                </p>
              </GlowCard>

              <GlowCard glowColor="purple" className="p-6 text-left md:p-8">
                <h3 className="text-xl font-semibold text-white">Product Operations Manager</h3>
                <p className="mb-1 text-purple-300/90">Remote digital start-up</p>
                <p className="mb-4 text-sm text-gray-400">Dec 2021 – Jan 2023</p>
                <ul className="list-disc space-y-2 pl-5 text-gray-300 md:text-[17px]">
                  <li>
                    Designed internal tooling processes; improved operational efficiency by 60%.
                  </li>
                  <li>
                    Automation for CRM workflows and reporting; liaison between engineering and
                    stakeholders.
                  </li>
                </ul>
              </GlowCard>

              <GlowCard glowColor="blue" className="p-6 text-left md:p-8">
                <h3 className="text-xl font-semibold text-white">
                  Research Analyst — Tokenomics &amp; Business Data
                </h3>
                <p className="mb-1 text-blue-300/90">Digital finance sector</p>
                <p className="mb-4 text-sm text-gray-400">Nov 2021 – Feb 2023</p>
                <ul className="list-disc space-y-2 pl-5 text-gray-300 md:text-[17px]">
                  <li>
                    Analysed 1,000+ blockchain user data points for ecosystem growth patterns.
                  </li>
                  <li>Python scripts that reduced data processing time by about 50%.</li>
                  <li>Analytical reports supporting product and investment strategy.</li>
                </ul>
              </GlowCard>

              <GlowCard glowColor="purple" className="p-6 text-left md:p-8">
                <h3 className="text-xl font-semibold text-white">
                  Volunteer IT &amp; Data Officer
                </h3>
                <p className="mb-1 text-purple-300/90">Breast Cancer Foundation (remote)</p>
                <p className="mb-4 text-sm text-gray-400">Mar 2020 – Dec 2020</p>
                <ul className="list-disc space-y-2 pl-5 text-gray-300 md:text-[17px]">
                  <li>
                    Digitised volunteer management with Excel-based tracking and automated
                    reporting.
                  </li>
                  <li>Data visualisations to improve programme efficiency and engagement.</li>
                </ul>
              </GlowCard>
            </div>
          </section>

          <section>
            <h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">
              <GradientText>Core Expertise & Toolchain</GradientText>
            </h2>

            <OrbitingIcons
              centerIcon={<Code className="h-12 w-12 text-white" aria-label="Code Icon" />}
              icons={[
                {
                  icon: <Code className="h-6 w-6 text-purple-400" aria-label="Development Icon" />,
                },
                {
                  icon: (
                    <Users className="h-6 w-6 text-blue-400" aria-label="Project Management Icon" />
                  ),
                },
                {
                  icon: (
                    <BarChart
                      className="h-6 w-6 text-purple-400"
                      aria-label="Data Analytics Icon"
                    />
                  ),
                },
                { icon: <Zap className="h-6 w-6 text-blue-400" aria-label="Energy Icon" /> },
                {
                  icon: <Code className="h-6 w-6 text-purple-400" aria-label="Programming Icon" />,
                },
                { icon: <Users className="h-6 w-6 text-blue-400" aria-label="Team Icon" /> },
              ]}
              radius={120}
              className="mb-12"
            />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
              <GlowCard glowColor="purple" className="p-6 text-center md:p-8">
                <h3 className="mb-3 text-lg font-semibold text-white">Backend &amp; security</h3>
                <SkillChips
                  skills="Python, Django, REST APIs, Authentication Systems, API Security, Microservices, Rate Limiting, Asynchronous Processing, System Design"
                  className="justify-center"
                />
              </GlowCard>
              <GlowCard glowColor="blue" className="p-6 text-center md:p-8">
                <h3 className="mb-3 text-lg font-semibold text-white">Platform &amp; DevOps</h3>
                <SkillChips
                  skills="Docker, Redis, CI/CD Pipelines, Git, Linux, AWS, GCP"
                  className="justify-center"
                />
              </GlowCard>
              <GlowCard glowColor="purple" className="p-6 text-center md:p-8">
                <h3 className="mb-3 text-lg font-semibold text-white">Data &amp; databases</h3>
                <SkillChips
                  skills="PostgreSQL, SQL, Data Modelling, Pandas, ETL Pipelines, Data Automation"
                  className="justify-center"
                />
              </GlowCard>
              <GlowCard glowColor="blue" className="p-6 text-center md:p-8">
                <h3 className="mb-3 text-lg font-semibold text-white">Delivery &amp; practices</h3>
                <SkillChips
                  skills="Automated Testing, Version Control (Git), Agile Development, Code Reviews"
                  className="justify-center"
                />
              </GlowCard>
            </div>
          </section>

          <section>
            <h2 className="mb-8 text-3xl font-bold text-white md:mb-12 md:text-4xl">
              Education &amp; Research
            </h2>
            <GlowCard glowColor="purple" className="p-8 md:p-12">
              <h3 className="mb-3 text-2xl font-semibold text-white md:text-3xl">
                MSc in Renewable Energy &amp; Sustainable Technology
              </h3>
              <p className="mb-6 text-lg text-gray-400 md:text-xl">
                University of South Wales, UK · 2023 – 2024
              </p>
              <div className="space-y-6">
                <div>
                  <p className="mb-1 font-semibold text-gray-300">Dissertation:</p>
                  <p className="text-justify text-lg leading-relaxed text-gray-300 md:text-xl">
                    Applied Python to model policy-driven shifts in renewable energy adoption,
                    combining data analysis, systems modelling, and research methods.
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-gray-300">Key modules:</p>
                  <p className="text-justify text-lg leading-relaxed text-gray-300 md:text-xl">
                    Data &amp; Decision Analysis, Systems Modelling, Research Methods
                  </p>
                </div>
              </div>
            </GlowCard>
          </section>

          <section>
            <h2 className="mb-8 text-3xl font-bold text-white md:mb-12 md:text-4xl">
              Highlight projects
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <GlowCard glowColor="blue" className="p-6 text-left md:p-8">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  UK Housing Data Automation
                </h3>
                <p className="mb-3 text-sm text-gray-400">
                  Automated ETL pipeline for public housing datasets; SQL modelling; analytics
                  dashboards.
                </p>
                <p className="mb-4 text-sm text-gray-500">Python, SQL, Power BI</p>
                <a
                  href="https://github.com/gogiraFoundation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 underline hover:text-purple-300"
                >
                  GitHub
                </a>
              </GlowCard>
              <GlowCard glowColor="purple" className="p-6 text-left md:p-8">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Power forecasting with Python
                </h3>
                <p className="mb-3 text-sm text-gray-400">
                  Academic project: regression models for solar and wind scenarios; pandas-based
                  data prep and interactive dashboards.
                </p>
                <p className="text-sm text-gray-500">Python, Pandas, NumPy</p>
              </GlowCard>
            </div>
          </section>

          <section>
            <h2 className="mb-8 text-3xl font-bold text-white md:mb-12 md:text-4xl">
              Awards &amp; certifications
            </h2>
            <GlowCard glowColor="purple" className="p-8 md:p-12">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-white">Awards &amp; volunteer</h3>
                  <ul className="list-disc space-y-2 pl-5 text-gray-300">
                    <li>Google Africa Developer Scholarship — 2022</li>
                    <li>Polygon Africa Bootcamp — 2022</li>
                    <li>N-agro scheme — volunteer agro-extension officer — 2018 – 2020</li>
                    <li>
                      Award of Excellence — community agricultural programmes (NYSC-CDS), Niger
                      State — 2017
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-white">Certifications</h3>
                  <ul className="list-disc space-y-2 pl-5 text-gray-300">
                    <li>University of London (Coursera): Understanding Research Methods</li>
                    <li>Google Project Management Foundations</li>
                    <li>Google Cloud Platform</li>
                  </ul>
                </div>
              </div>
            </GlowCard>
          </section>

          <section>
            <h2 className="mb-8 text-3xl font-bold text-white md:mb-12 md:text-4xl">
              Beyond the Code
            </h2>
            <div className="glass space-y-6 rounded-2xl p-8 md:p-12">
              <p className="text-justify text-lg leading-relaxed text-gray-300 md:text-xl">
                Renewable energy modelling and software engineering together shape how I think about
                robust, measurable systems—whether optimising energy use or shipping secure APIs. I
                care about accessible technology and products that organisations can rely on day to
                day.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-8 text-3xl font-bold text-white md:mb-12 md:text-4xl">
              Connect With Me
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-4 md:gap-6">
              <a
                href="https://medium.com/@aigbemanuel"
                target="_blank"
                rel="me noopener noreferrer"
                className="glass group flex items-center gap-2 rounded-lg border border-purple-500/20 px-5 py-2 font-semibold text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                <BookOpen className="h-5 w-5" />
                <span>Medium</span>
              </a>
              <a
                href="https://www.linkedin.com/in/emmanuel-ugbaje-b19227161/"
                target="_blank"
                rel="me noopener noreferrer"
                className="group flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                <Linkedin className="h-5 w-5" />
                <span>LinkedIn</span>
              </a>
              <a
                href="mailto:dev@gogirlabs.uk"
                className="group flex items-center gap-2 rounded-lg border border-gray-500/40 bg-white/5 px-5 py-2 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                <Mail className="h-5 w-5" />
                <span>Email</span>
              </a>
              <a
                href="https://github.com/gogiraFoundation"
                target="_blank"
                rel="me noopener noreferrer"
                className="group flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-glow-purple focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>
            </div>
          </section>

          {testimonials && testimonials.length > 0 && (
            <section>
              <h2 className="mb-8 text-center text-3xl font-bold text-white md:mb-12 md:text-4xl">
                <GradientText>Testimonials</GradientText>
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
                {testimonials.slice(0, 4).map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
