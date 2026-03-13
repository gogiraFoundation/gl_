'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { TestimonialCard } from '@/components/testimonials/TestimonialCard'
import { Github, Linkedin, BookOpen, Code, Users, BarChart, Zap } from 'lucide-react'
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
    // Update document title and meta description for SEO
    document.title =
      'Emmanuel Ugbaje - Technical Project Manager & Python Developer | SaaS & Energy'
    const metaDescription = document.querySelector('meta[name="description"]')
    const descriptionContent =
      'Technical Project Manager and Python Developer with MSc in Renewable Energy. Specializing in scalable SaaS platforms, energy optimization, and digital transformation.'
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
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-20"></div>

        <div className="relative z-10 mx-auto max-w-5xl space-y-24">
          {/* Hero / Page Title */}
          <div className="animate-fade-in-up text-center">
            <h1 className="mb-8 text-5xl font-bold md:text-6xl">
              <GradientText>What I Do</GradientText>
            </h1>
          </div>

          {/* Professional Background */}
          <section>
            <div className="glass space-y-6 rounded-2xl p-8 md:p-12">
              <p className="text-justify text-lg leading-relaxed text-gray-300 md:text-xl">
                I'm a Technical Project Manager and Python Developer with an MSc in Renewable Energy
                & Sustainable Technology. I specialize in building scalable digital products—from
                secure backend systems to data-driven dashboards; that drive efficiency in SaaS,
                clean tech, and energy sectors. My work bridges software development, project
                leadership, and sustainability, delivering measurable impact through technology.
              </p>
              <p className="text-justify text-lg leading-relaxed text-gray-300 md:text-xl">
                In my current role as Lead Software Development Engineer at TraqAuth, I architect
                modular authentication workflows using Django, integrate Redis caching, and deploy
                CI/CD pipelines to ensure high availability and security. Previously, as Product
                Operations Manager at OTUGOH, I led cross-functional teams, developed SOPs, and
                improved operational efficiency by 15%. My experience also includes energy analysis
                at BUA Group, where I conducted ISO 50001-aligned audits and built performance
                dashboards in Python and Power BI.
              </p>
              <p className="text-justify text-lg leading-relaxed text-gray-300 md:text-xl">
                I thrive in Agile environments where collaboration drives technical solutions.
                Whether leading blockchain tokenization research at AfrofutureDAO or automating
                volunteer tracking for a cancer foundation, I focus on creating feedback loops that
                ensure solutions evolve with user needs. My technical toolkit includes Python,
                Django, REST APIs, Redis, SQL, and modern DevOps practices.
              </p>
              <p className="text-justify text-lg leading-relaxed text-gray-300 md:text-xl">
                I'm passionate about clean tech, product innovation, and accessible technology. I'm
                seeking a cross‑functional team where I can apply my blend of software engineering
                and project management to build impactful solutions. Explore my{' '}
                <Link href="/portfolio" className="text-purple-400 underline hover:text-purple-300">
                  portfolio
                </Link>{' '}
                or read my{' '}
                <Link href="/blog" className="text-purple-400 underline hover:text-purple-300">
                  blog
                </Link>{' '}
                for insights on software development, energy systems, and digital transformation.
              </p>
            </div>
          </section>

          {/* Core Expertise & Toolchain */}
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
                <h3 className="mb-3 text-lg font-semibold text-white">Software Development</h3>
                <SkillChips
                  skills="Python, Django, Django REST Framework, API Integration, Redis, SQL"
                  className="justify-center"
                />
              </GlowCard>
              <GlowCard glowColor="blue" className="p-6 text-center md:p-8">
                <h3 className="mb-3 text-lg font-semibold text-white">Project Management</h3>
                <SkillChips
                  skills="Agile (Scrum/Kanban), SDLC, Technical Documentation, Stakeholder Management, Product Operations"
                  className="justify-center"
                />
              </GlowCard>
              <GlowCard glowColor="purple" className="p-6 text-center md:p-8">
                <h3 className="mb-3 text-lg font-semibold text-white">Data & Analytics</h3>
                <SkillChips
                  skills="Power BI, Excel Macros, Performance Monitoring, Data Visualisation, ETL"
                  className="justify-center"
                />
              </GlowCard>
              <GlowCard glowColor="blue" className="p-6 text-center md:p-8">
                <h3 className="mb-3 text-lg font-semibold text-white">Energy & Sustainability</h3>
                <SkillChips
                  skills="Renewable Energy Systems, ISO 50001, Energy Audits, BESS, Blockchain Tokenisation"
                  className="justify-center"
                />
              </GlowCard>
            </div>
          </section>

          {/* Education & Research */}
          <section>
            <h2 className="mb-8 text-3xl font-bold text-white md:mb-12 md:text-4xl">
              Education & Research
            </h2>
            <GlowCard glowColor="purple" className="p-8 md:p-12">
              <h3 className="mb-3 text-2xl font-semibold text-white md:text-3xl">
                MSc in Renewable Energy & Sustainable Technology
              </h3>
              <p className="mb-6 text-lg text-gray-400 md:text-xl">University of South Wales, UK</p>
              <div className="space-y-6">
                <div>
                  <p className="mb-1 font-semibold text-gray-300">Dissertation:</p>
                  <p className="text-justify text-lg leading-relaxed text-gray-300 md:text-xl">
                    Developed Python-based simulations to model UK renewable energy adoption
                    pathways, analyzing policy scenarios and technology deployment trajectories.
                    This project combined data analysis, systems modelling, and research
                    methods—skills I now apply to infrastructure and product challenges.
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-semibold text-gray-300">Key Modules:</p>
                  <p className="text-justify text-lg leading-relaxed text-gray-300 md:text-xl">
                    Systems Modelling, Decision Analysis, Research Methods, Energy Economics, BESS
                    (Battery Energy Storage Systems)
                  </p>
                </div>
              </div>
            </GlowCard>
          </section>

          {/* Beyond the Code */}
          <section>
            <h2 className="mb-8 text-3xl font-bold text-white md:mb-12 md:text-4xl">
              Beyond the Code
            </h2>
            <div className="glass space-y-6 rounded-2xl p-8 md:p-12">
              <p className="text-justify text-lg leading-relaxed text-gray-300 md:text-xl">
                My background in renewable energy systems modelling, combined with software
                engineering, gives me a unique perspective on how technology can drive
                sustainability. I'm passionate about clean tech, product innovation, and creating
                accessible solutions that deliver real-world impact. I actively contribute to
                volunteer initiatives, including IT and data support for a breast cancer foundation,
                and I'm always exploring emerging trends in blockchain, energy optimisation, and
                digital transformation.
              </p>
            </div>
          </section>

          {/* Connect Section */}
          <section>
            <h2 className="mb-8 text-3xl font-bold text-white md:mb-12 md:text-4xl">
              Connect With Me
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-4 md:gap-6">
              <a
                href="https://github.com/gogiraFoundation"
                target="_blank"
                rel="me noopener noreferrer"
                className="group flex items-center gap-2 rounded-lg bg-gradient-primary px-5 py-2 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-glow-purple focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
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
                href="https://medium.com/@aigbemanuel"
                target="_blank"
                rel="me noopener noreferrer"
                className="glass group flex items-center gap-2 rounded-lg border border-purple-500/20 px-5 py-2 font-semibold text-white transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                <BookOpen className="h-5 w-5" />
                <span>Medium</span>
              </a>
            </div>
          </section>

          {/* Testimonials */}
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
