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
    // Update document title and meta description for SEO
    document.title =
      'Emmanuel Ugbaje - Technical Project Manager & Python Developer | SaaS & Energy Innovations'
    const metaDescription = document.querySelector('meta[name="description"]')
    const descriptionContent =
      'Technical Project Manager and Python Developer specializing in scalable SaaS platforms, renewable energy systems, and digital transformation. MSc in Renewable Energy & Sustainable Technology.'
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
                  Hello! I Am <span className="text-white">Emmanuel Ugbaje</span>
                </p>
              </div>
            </div>

            {/* Main Headline - SEO Optimized */}
            <h1 className="mb-4 animate-fade-in-up text-2xl font-bold delay-200 sm:text-3xl md:text-4xl lg:text-5xl">
              <span className="text-white">Technical Project Manager & Python Developer</span>
            </h1>
            <br></br>
            <br></br>
            <hr className="delay-250 mb-6 animate-fade-in-up border-gray-700" />
            <p className="mb-6 animate-fade-in-up text-2xl text-gray-300 delay-300 md:text-3xl">
              <GradientText>Building Scalable Digital Products</GradientText>
            </p>
            <p className="text-md mb-4 animate-fade-in-up text-gray-400 delay-500 md:text-lg">
              SaaS | Energy Innovations | Clean Tech
            </p>

            {/* About Paragraph - SEO Optimized */}
            <div className="container-content mb-10 animate-fade-in-up delay-700">
              <p className="text-lg leading-relaxed text-gray-300">
                Technical Project Manager and Python Developer with an MSc in Renewable Energy &
                Sustainable Technology. I specialise in building scalable digital products, leading
                cross-functional teams, and optimising energy systems using Python, Agile, and
                data-driven insights. My work bridges software development, digital transformation,
                and sustainability—delivering measurable impact in SaaS, clean tech, and blockchain.
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
                className="rounded-lg border-2 border-purple-500 px-5 py-2.5 text-center font-semibold text-purple-400 transition-all duration-300 hover:scale-105 hover:border-purple-400 hover:bg-purple-500/10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent active:scale-100"
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
              <p className="text-center text-gray-400">
                Combining technical depth with project leadership to deliver impactful solutions
                across:
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
              {[
                {
                  title: 'Software Development',
                  skills: 'Python, Django, Django REST Framework, API Integration, Redis, SQL',
                  icon: Code,
                  alt: 'Software Development Icon',
                },
                {
                  title: 'Project Management',
                  skills:
                    'Agile (Scrum/Kanban), SDLC, Technical Documentation, Stakeholder Management, Product Operations',
                  icon: Users,
                  alt: 'Project Management Icon',
                },
                {
                  title: 'Data & Analytics',
                  skills: 'Power BI, Excel Macros, Performance Monitoring, Data Visualisation, ETL',
                  icon: BarChart,
                  alt: 'Data Analytics Icon',
                },
                {
                  title: 'Energy & Sustainability',
                  skills:
                    'Renewable Energy Systems, ISO 50001, Energy Audits, BESS, Blockchain Tokenisation',
                  icon: Zap,
                  alt: 'Energy and Sustainability Icon',
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
                        <Icon className="h-8 w-8 text-purple-400" aria-label={item.alt} />
                      </div>
                    </div>
                    <h3 className="mb-3 font-semibold text-white">{item.title}</h3>
                    <SkillChips skills={item.skills} className="justify-center" />
                  </div>
                )
              })}
            </div>

            {/* Optional: Key Achievements Teaser */}
            <div className="mt-16 text-center">
              <p className="mb-4 text-gray-400">Key achievements include:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
                <span className="rounded-full bg-white/5 px-3 py-1">
                  ↑ 15% SaaS efficiency gain
                </span>
                <span className="rounded-full bg-white/5 px-3 py-1">
                  🔗 Blockchain tokenization research
                </span>
                <span className="rounded-full bg-white/5 px-3 py-1">
                  ⚡ ISO 50001 energy audits
                </span>
                <span className="rounded-full bg-white/5 px-3 py-1">🐍 Django + CI/CD systems</span>
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
