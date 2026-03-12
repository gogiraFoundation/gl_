'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { GradientText } from '@/components/ui/GradientText'
import { SkillChips } from '@/components/ui/SkillChips'
import { TestimonialCarousel } from '@/components/testimonials/TestimonialCarousel'
import { ArrowRight, Code, Zap, Users, BarChart, GitBranch, Cpu } from 'lucide-react'

export default function Home() {
  useEffect(() => {
    // Update document title and meta description for SEO
    document.title = 'Emmanuel Ugbaje - Technical Project Manager & Python Developer | SaaS & Energy Innovations'
    const metaDescription = document.querySelector('meta[name="description"]')
    const descriptionContent = 'Technical Project Manager and Python Developer specializing in scalable SaaS platforms, renewable energy systems, and digital transformation. MSc in Renewable Energy & Sustainable Technology.'
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20 md:py-32 lg:py-40 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-mesh opacity-50 animate-gradient"></div>
          <div className="absolute inset-0 bg-gradient-secondary"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            {/* Speech Bubble */}
            <div className="mb-6 animate-fade-in-up">
              <div className="inline-block glass rounded-2xl px-5 py-2.5 mb-4">
                <p className="text-base font-semibold gradient-text">
                  Hello! I Am <span className="text-white">Emmanuel Ugbaje</span>
                </p>
              </div>
            </div>

            {/* Main Headline - SEO Optimized */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in-up delay-200">
              <span className="text-white">Technical Project Manager & Python Developer</span>
            </h1>
            <br></br>
            <br></br>
            <hr className="border-gray-700 mb-6 animate-fade-in-up delay-250" />
            <p className="text-2xl md:text-3xl text-gray-300 mb-6 animate-fade-in-up delay-300">
              <GradientText>Building Scalable Digital Products</GradientText>
            </p>
            <p className="text-md md:text-lg text-gray-400 mb-4 animate-fade-in-up delay-500">
              SaaS | Energy Innovations | Clean Tech
            </p>

            {/* About Paragraph - SEO Optimized */}
            <div className="container-content mb-10 animate-fade-in-up delay-700">
              <p className="text-lg text-gray-300 leading-relaxed">
                Technical Project Manager and Python Developer with an MSc in Renewable Energy & Sustainable Technology. 
                I specialise in building scalable digital products, leading cross-functional teams, and optimising energy systems 
                using Python, Agile, and data-driven insights. My work bridges software development, digital transformation, 
                and sustainability—delivering measurable impact in SaaS, clean tech, and blockchain.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 md:gap-8 justify-center mt-12 animate-fade-in-up delay-1000">
              <Link
                href="/portfolio"
                className="group relative px-5 py-2.5 bg-gradient-primary text-white rounded-lg font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-glow-purple active:scale-100 text-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  View Portfolio
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 border-2 border-purple-500 text-purple-400 rounded-lg font-semibold hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300 hover:scale-105 active:scale-100 text-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                Get in Touch
              </Link>
            </div>
          </div>

          {/* Floating Decorative Elements */}
          <div
            aria-hidden="true"
            className="absolute top-20 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl animate-float"
          ></div>
          <div
            aria-hidden="true"
            className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-float delay-700"
          ></div>
        </section>

        {/* Skills Section - SEO Optimized */}
        <section className="pt-12 pb-20 md:pt-24 md:pb-32 lg:pt-32 lg:pb-40 px-4 relative -mt-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              <GradientText>Core Expertise & Toolchain</GradientText>
            </h2>
            <div className="container-content mb-8">
              <p className="text-center text-gray-400">
                Combining technical depth with project leadership to deliver impactful solutions across:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mt-8">
              {[
                { 
                  title: 'Software Development', 
                  skills: 'Python, Django, Django REST Framework, API Integration, Redis, SQL', 
                  icon: Code, 
                  alt: 'Software Development Icon' 
                },
                { 
                  title: 'Project Management', 
                  skills: 'Agile (Scrum/Kanban), SDLC, Technical Documentation, Stakeholder Management, Product Operations', 
                  icon: Users, 
                  alt: 'Project Management Icon' 
                },
                { 
                  title: 'Data & Analytics', 
                  skills: 'Power BI, Excel Macros, Performance Monitoring, Data Visualisation, ETL', 
                  icon: BarChart, 
                  alt: 'Data Analytics Icon' 
                },
                { 
                  title: 'Energy & Sustainability', 
                  skills: 'Renewable Energy Systems, ISO 50001, Energy Audits, BESS, Blockchain Tokenisation', 
                  icon: Zap, 
                  alt: 'Energy and Sustainability Icon' 
                },
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <div
                    key={index}
                    className="card-glow p-6 md:p-8 text-center group cursor-pointer"
                  >
                    <div className="mb-4 flex justify-center">
                      <div className="p-3 rounded-lg bg-gradient-primary/20 group-hover:bg-gradient-primary/40 transition-colors">
                        <Icon className="w-8 h-8 text-purple-400" aria-label={item.alt} />
                      </div>
                    </div>
                    <h3 className="font-semibold mb-3 text-white">{item.title}</h3>
                    <SkillChips skills={item.skills} className="justify-center" />
                  </div>
                )
              })}
            </div>

            {/* Optional: Key Achievements Teaser */}
            <div className="mt-16 text-center">
              <p className="text-gray-400 mb-4">Key achievements include:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
                <span className="px-3 py-1 bg-white/5 rounded-full">↑ 15% SaaS efficiency gain</span>
                <span className="px-3 py-1 bg-white/5 rounded-full">🔗 Blockchain tokenization research</span>
                <span className="px-3 py-1 bg-white/5 rounded-full">⚡ ISO 50001 energy audits</span>
                <span className="px-3 py-1 bg-white/5 rounded-full">🐍 Django + CI/CD systems</span>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <TestimonialCarousel />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}