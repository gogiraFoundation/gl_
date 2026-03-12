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
    document.title = 'Emmanuel Ugbaje - Technical Project Manager & Python Developer | SaaS & Energy'
    const metaDescription = document.querySelector('meta[name="description"]')
    const descriptionContent = 'Technical Project Manager and Python Developer with MSc in Renewable Energy. Specializing in scalable SaaS platforms, energy optimization, and digital transformation.'
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow relative py-20 md:py-32 lg:py-40 px-4">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-20"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto space-y-24">
          {/* Hero / Page Title */}
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
              <GradientText>What I Do</GradientText>
            </h1>
          </div>

          {/* Professional Background */}
          <section>
            <div className="glass rounded-2xl p-8 md:p-12 space-y-6">
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed text-justify">
                I'm a Technical Project Manager and Python Developer with an MSc in Renewable Energy & Sustainable Technology. 
                I specialize in building scalable digital products—from secure backend systems to data-driven dashboards; that 
                drive efficiency in SaaS, clean tech, and energy sectors. My work bridges software development, project leadership, 
                and sustainability, delivering measurable impact through technology.
              </p>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed text-justify">
                In my current role as Lead Software Development Engineer at TraqAuth, I architect modular authentication 
                workflows using Django, integrate Redis caching, and deploy CI/CD pipelines to ensure high availability and 
                security. Previously, as Product Operations Manager at OTUGOH, I led cross-functional teams, developed SOPs, 
                and improved operational efficiency by 15%. My experience also includes energy analysis at BUA Group, where I 
                conducted ISO 50001-aligned audits and built performance dashboards in Python and Power BI.
              </p>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed text-justify">
                I thrive in Agile environments where collaboration drives technical solutions. Whether leading blockchain 
                tokenization research at AfrofutureDAO or automating volunteer tracking for a cancer foundation, I focus on 
                creating feedback loops that ensure solutions evolve with user needs. My technical toolkit includes Python, 
                Django, REST APIs, Redis, SQL, and modern DevOps practices.
              </p>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed text-justify">
                I'm passionate about clean tech, product innovation, and accessible technology. I'm seeking a cross‑functional 
                team where I can apply my blend of software engineering and project management to build impactful solutions. 
                Explore my{' '}
                <Link href="/portfolio" className="text-purple-400 hover:text-purple-300 underline">
                  portfolio
                </Link>{' '}
                or read my{' '}
                <Link href="/blog" className="text-purple-400 hover:text-purple-300 underline">
                  blog
                </Link>{' '}
                for insights on software development, energy systems, and digital transformation.
              </p>
            </div>
          </section>

          {/* Core Expertise & Toolchain */}
          <section>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white text-center">
              <GradientText>Core Expertise & Toolchain</GradientText>
            </h2>
            
            <OrbitingIcons
              centerIcon={<Code className="w-12 h-12 text-white" aria-label="Code Icon" />}
              icons={[
                { icon: <Code className="w-6 h-6 text-purple-400" aria-label="Development Icon" /> },
                { icon: <Users className="w-6 h-6 text-blue-400" aria-label="Project Management Icon" /> },
                { icon: <BarChart className="w-6 h-6 text-purple-400" aria-label="Data Analytics Icon" /> },
                { icon: <Zap className="w-6 h-6 text-blue-400" aria-label="Energy Icon" /> },
                { icon: <Code className="w-6 h-6 text-purple-400" aria-label="Programming Icon" /> },
                { icon: <Users className="w-6 h-6 text-blue-400" aria-label="Team Icon" /> },
              ]}
              radius={120}
              className="mb-12"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              <GlowCard glowColor="purple" className="p-6 md:p-8 text-center">
                <h3 className="font-semibold mb-3 text-white text-lg">Software Development</h3>
                <SkillChips skills="Python, Django, Django REST Framework, API Integration, Redis, SQL" className="justify-center" />
              </GlowCard>
              <GlowCard glowColor="blue" className="p-6 md:p-8 text-center">
                <h3 className="font-semibold mb-3 text-white text-lg">Project Management</h3>
                <SkillChips skills="Agile (Scrum/Kanban), SDLC, Technical Documentation, Stakeholder Management, Product Operations" className="justify-center" />
              </GlowCard>
              <GlowCard glowColor="purple" className="p-6 md:p-8 text-center">
                <h3 className="font-semibold mb-3 text-white text-lg">Data & Analytics</h3>
                <SkillChips skills="Power BI, Excel Macros, Performance Monitoring, Data Visualisation, ETL" className="justify-center" />
              </GlowCard>
              <GlowCard glowColor="blue" className="p-6 md:p-8 text-center">
                <h3 className="font-semibold mb-3 text-white text-lg">Energy & Sustainability</h3>
                <SkillChips skills="Renewable Energy Systems, ISO 50001, Energy Audits, BESS, Blockchain Tokenisation" className="justify-center" />
              </GlowCard>
            </div>
          </section>

          {/* Education & Research */}
          <section>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-white">Education & Research</h2>
            <GlowCard glowColor="purple" className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-semibold mb-3 text-white">
                MSc in Renewable Energy & Sustainable Technology
              </h3>
              <p className="text-gray-400 mb-6 text-lg md:text-xl">
                University of South Wales, UK
              </p>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-300 font-semibold mb-1">Dissertation:</p>
                  <p className="text-gray-300 text-lg md:text-xl leading-relaxed text-justify">
                    Developed Python-based simulations to model UK renewable energy adoption pathways, analyzing policy scenarios 
                    and technology deployment trajectories. This project combined data analysis, systems modelling, and research 
                    methods—skills I now apply to infrastructure and product challenges.
                  </p>
                </div>
                <div>
                  <p className="text-gray-300 font-semibold mb-1">Key Modules:</p>
                  <p className="text-gray-300 text-lg md:text-xl leading-relaxed text-justify">
                    Systems Modelling, Decision Analysis, Research Methods, Energy Economics, BESS (Battery Energy Storage Systems)
                  </p>
                </div>
              </div>
            </GlowCard>
          </section>

          {/* Beyond the Code */}
          <section>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-white">Beyond the Code</h2>
            <div className="glass rounded-2xl p-8 md:p-12 space-y-6">
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed text-justify">
                My background in renewable energy systems modelling, combined with software engineering, gives me a unique 
                perspective on how technology can drive sustainability. I'm passionate about clean tech, product innovation, 
                and creating accessible solutions that deliver real-world impact. I actively contribute to volunteer initiatives, 
                including IT and data support for a breast cancer foundation, and I'm always exploring emerging trends in 
                blockchain, energy optimisation, and digital transformation.
              </p>
            </div>
          </section>

          {/* Connect Section */}
          <section>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-white">Connect With Me</h2>
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center mt-6">
              <a
                href="https://github.com/gogiraFoundation"
                target="_blank"
                rel="me noopener noreferrer"
                className="group flex items-center gap-2 px-5 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-glow-purple focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/emmanuel-ugbaje-b19227161/"
                target="_blank"
                rel="me noopener noreferrer"
                className="group flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://medium.com/@aigbemanuel"
                target="_blank"
                rel="me noopener noreferrer"
                className="group flex items-center gap-2 px-5 py-2 glass text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300 border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                <BookOpen className="w-5 h-5" />
                <span>Medium</span>
              </a>
            </div>
          </section>

          {/* Testimonials */}
          {testimonials && testimonials.length > 0 && (
            <section>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-white text-center">
                <GradientText>Testimonials</GradientText>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
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