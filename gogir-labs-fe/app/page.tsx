'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { GradientText } from '@/components/ui/GradientText'
import { SkillChips } from '@/components/ui/SkillChips'
import { TestimonialCarousel } from '@/components/testimonials/TestimonialCarousel'
import { ArrowRight, Code, Zap, Users, BarChart } from 'lucide-react'

export default function Home() {
  useEffect(() => {
    document.title =
      'Emmanuel Ugbaje | Software Engineer & Lead Developer | Python, Django, Authentication'
    const metaDescription = document.querySelector('meta[name="description"]')
    const descriptionContent =
      'Software Engineer: secure Python/Django backends, authentication, Redis, PostgreSQL, CI/CD, AWS/GCP. Lead Developer at Traq Authenticator. MSc Renewable Energy; prior energy analytics and data automation.'
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-20 md:py-32 lg:py-40">
          {/* Animated Background */}
          <div className="animate-gradient absolute inset-0 bg-gradient-mesh opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-secondary"></div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            {/* Speech Bubble */}
            <div className="mb-6 animate-fade-in-up">
              <div className="glass mb-4 inline-block rounded-2xl px-5 py-2.5">
                <p className="gradient-text text-base font-semibold">
                  Hello! I Am{' '}
                  <span className="text-slate-900 dark:text-white">Emmanuel Ugbaje</span>
                </p>
              </div>
            </div>

            {/* Main Headline - SEO Optimized */}
            <h1 className="mb-4 animate-fade-in-up text-2xl font-bold delay-200 sm:text-3xl md:text-4xl lg:text-5xl">
              <span className="text-slate-900 dark:text-white">
                Software Engineer · Lead Developer
              </span>
            </h1>
            <br></br>
            <br></br>
            <hr className="delay-250 mb-6 animate-fade-in-up border-slate-200 dark:border-gray-700" />
            <p className="mb-6 animate-fade-in-up text-2xl delay-300 md:text-3xl">
              <GradientText>Secure backends &amp; authentication platforms</GradientText>
            </p>
            <p className="text-md mb-4 animate-fade-in-up text-slate-500 delay-500 dark:text-gray-400 md:text-lg">
              Python · Django · PostgreSQL · Redis · CI/CD · AWS / GCP
            </p>

            <div className="container-content mb-10 animate-fade-in-up delay-700">
              <p className="text-lg leading-relaxed text-slate-600 dark:text-gray-300">
                I build secure, scalable backend systems and APIs in Python—currently leading backend
                development at Traq Authenticator (identity verification and IAM). I ship Django and
                PostgreSQL services with strong API security: rate limiting with Redis, password
                breach detection, file validation, and automated scanning—plus CI/CD and cloud-ready
                deployments. I hold an MSc in Renewable Energy and bring data-pipeline experience
                from energy analytics and research roles.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="mt-12 flex animate-fade-in-up flex-col justify-center gap-6 delay-1000 sm:flex-row md:gap-8">
              <Link
                href="/portfolio"
                className="group relative overflow-hidden rounded-lg bg-gradient-primary px-5 py-2.5 text-center font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-glow-purple focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent active:scale-100"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  View Portfolio
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border-2 border-purple-600 px-5 py-2.5 text-center font-semibold text-purple-700 transition-all duration-300 hover:scale-105 hover:border-purple-500 hover:bg-purple-500/10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white active:scale-100 dark:border-purple-500 dark:text-purple-400 dark:hover:border-purple-400 dark:focus:ring-offset-transparent"
              >
                Get in Touch
              </Link>
            </div>
          </div>

          {/* Floating Decorative Elements */}
          <div
            aria-hidden="true"
            className="absolute left-10 top-20 h-20 w-20 animate-float rounded-full bg-purple-500/10 blur-xl"
          ></div>
          <div
            aria-hidden="true"
            className="absolute bottom-20 right-10 h-32 w-32 animate-float rounded-full bg-blue-500/10 blur-xl delay-700"
          ></div>
        </section>

        {/* Skills Section - SEO Optimized */}
        <section className="relative -mt-8 px-4 pb-20 pt-12 md:pb-32 md:pt-24 lg:pb-40 lg:pt-32">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-4 text-center text-4xl font-bold md:text-5xl">
              <GradientText>Core Expertise & Toolchain</GradientText>
            </h2>
            <div className="container-content mb-8">
              <p className="text-center text-slate-500 dark:text-gray-400">
                Backend engineering, platform delivery, and data systems—grounded in your stack:
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
              {[
                {
                  title: 'Backend & security',
                  skills:
                    'Python, Django, REST APIs, Authentication Systems, API Security, Microservices, Rate Limiting, System Design',
                  icon: Code,
                  alt: 'Backend and security Icon',
                },
                {
                  title: 'Platform & DevOps',
                  skills: 'Docker, Redis, CI/CD Pipelines, Git, Linux, AWS, GCP',
                  icon: Users,
                  alt: 'Platform and DevOps Icon',
                },
                {
                  title: 'Data & databases',
                  skills: 'PostgreSQL, SQL, Data Modelling, Pandas, ETL Pipelines, Data Automation',
                  icon: BarChart,
                  alt: 'Data and databases Icon',
                },
                {
                  title: 'Delivery & practices',
                  skills:
                    'Automated Testing, Version Control (Git), Agile Development, Code Reviews',
                  icon: Zap,
                  alt: 'Delivery and practices Icon',
                },
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <div
                    key={index}
                    className="card-glow group cursor-pointer p-6 text-center md:p-8"
                  >
                    <div className="mb-4 flex justify-center">
                      <div className="bg-gradient-primary/20 group-hover:bg-gradient-primary/40 rounded-lg p-3 transition-colors">
                        <Icon
                          className="h-8 w-8 text-purple-600 dark:text-purple-400"
                          aria-label={item.alt}
                        />
                      </div>
                    </div>
                    <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <SkillChips skills={item.skills} className="justify-center" />
                  </div>
                )
              })}
            </div>

            {/* Optional: Key Achievements Teaser */}
            <div className="mt-16 text-center">
              <p className="mb-4 text-slate-500 dark:text-gray-400">Selected impact:</p>
              <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-800 dark:text-gray-300">
                <span className="rounded-full bg-slate-100 px-3 py-1.5 dark:bg-white/5">
                  IAM: rate limiting, breach detection, file validation
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 dark:bg-white/5">
                  Product ops: ~60% internal efficiency improvement
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 dark:bg-white/5">
                  Research: ~50% faster blockchain data processing
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 dark:bg-white/5">
                  Energy: ISO 50001-aligned analytics &amp; ETL
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="px-4 py-20">
          <div className="mx-auto max-w-6xl">
            <TestimonialCarousel />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
