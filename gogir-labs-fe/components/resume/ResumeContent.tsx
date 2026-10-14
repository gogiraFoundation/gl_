'use client'

import Link from 'next/link'
import { Download } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { GlowCard } from '@/components/ui/GlowCard'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'
import api from '@/lib/api'

const RESUME_SECTION_CARD_CLASS =
  'p-6 md:p-8 transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.18),0_2px_12px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.05)_inset] motion-reduce:hover:translate-y-0'

const WHY_I_EXCEL =
  'I am a solutions-driven Lead Software Engineer and Data Engineer with a proven track record of building scalable backends, secure platforms, and automated workflows. From cloud-native systems to blockchain analysis and energy optimisation, my diverse experience makes me highly adaptable to the challenges of modern software development. Whether leading engineering teams, collaborating with stakeholders, or architecting production-grade services, my focus is always on efficiency, security, and performance.'

const SKILL_CATEGORY_LABELS: Record<string, string> = {
  programming: 'Programming Languages',
  framework: 'Frameworks & Libraries',
  database: 'Databases',
  cloud: 'Cloud & DevOps',
  tool: 'Tools & Technologies',
  soft: 'Soft Skills',
}

interface ResumeExperience {
  id: number
  title: string
  company: string
  location: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string
  highlights: string[]
  technologies: string
}

interface ResumeEducation {
  id: number
  degree: string
  institution: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string
  highlights: string[]
}

interface ResumeSkill {
  id: number
  name: string
  category: string
  order: number
}

interface ResumePayload {
  experience: ResumeExperience[]
  education: ResumeEducation[]
  certifications: unknown[]
  skills: ResumeSkill[]
}

interface SiteProfile {
  full_name: string
  headline: string
}

function formatDateRange(start: string, end: string | null, isCurrent: boolean): string {
  const fmt = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
  }
  const startLabel = fmt(start)
  if (isCurrent || !end) return `${startLabel} – Present`
  return `${startLabel} – ${fmt(end)}`
}

function bulletLines(highlights: string[] | undefined, description: string): string[] {
  if (Array.isArray(highlights) && highlights.length > 0) {
    return highlights.filter((line) => line.trim())
  }
  return description
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function groupSkills(skills: ResumeSkill[]): Array<{ category: string; items: string[] }> {
  const map = new Map<string, string[]>()
  for (const skill of skills) {
    const label = SKILL_CATEGORY_LABELS[skill.category] || skill.category
    const list = map.get(label) || []
    list.push(skill.name)
    map.set(label, list)
  }
  return Array.from(map.entries()).map(([category, items]) => ({ category, items }))
}

function apiBase(): string {
  const envApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
  let baseUrl = envApiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')
  if (!baseUrl || baseUrl === 'http://localhost:8000/api') {
    baseUrl = 'http://localhost:8000'
  }
  return baseUrl
}

export function ResumeContent() {
  const { trackClick } = useAnalyticsEvent()

  const { data: resume, isLoading, isError } = useQuery({
    queryKey: ['resume'],
    queryFn: async () => {
      const response = await api.get('/resume/')
      return response.data as ResumePayload
    },
  })

  const { data: site } = useQuery({
    queryKey: ['site'],
    queryFn: async () => {
      const response = await api.get('/site/')
      return response.data as SiteProfile
    },
  })

  const handleDownload = async () => {
    trackClick('resume_download', { format: 'pdf' })
    const downloadUrl = `${apiBase()}/api/v1/resume/download/`
    const filename = `${(site?.full_name || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`
    try {
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading resume:', error)
      window.open(downloadUrl, '_blank')
    }
  }

  const experience = resume?.experience || []
  const education = resume?.education || []
  const skillGroups = groupSkills(resume?.skills || [])

  return (
    <article className="space-y-14 md:space-y-16">
      <header>
        <div className="mb-4 flex min-h-[3rem] flex-wrap items-center justify-between gap-3 sm:min-h-0 sm:flex-nowrap sm:gap-4">
          <h1 className="w-full min-w-0 font-serif text-3xl font-semibold tracking-tight text-brutal-ink sm:w-auto sm:text-4xl md:text-5xl">
            Resume
          </h1>
          <button
            type="button"
            onClick={handleDownload}
            className="btn-brutal btn-brutal-sm w-full gap-2 text-xs sm:w-auto sm:shrink-0 sm:text-sm"
            aria-label="Download resume as PDF"
          >
            <Download className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
            Download PDF
          </button>
        </div>
        <p className="mb-8 max-w-2xl text-left text-sm leading-relaxed text-brutal-muted md:text-base md:text-justify">
          {site?.headline ||
            'Lead Software Engineer — Django, IAM, and data engineering. Experience, education, and skills at a glance.'}
        </p>
      </header>

      {isLoading && <p className="text-center text-brutal-muted">Loading resume…</p>}
      {isError && (
        <p className="text-center text-red-600">Could not load resume data. Try again later.</p>
      )}

      {!isLoading && !isError && (
        <>
          <section aria-labelledby="experience-heading">
            <h2
              id="experience-heading"
              className="mb-6 font-serif text-2xl font-semibold text-brutal-ink md:mb-8 md:text-3xl"
            >
              Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => {
                const lines = bulletLines(exp.highlights, exp.description)
                return (
                  <GlowCard key={exp.id} className={RESUME_SECTION_CARD_CLASS}>
                    <div className="mb-4 flex flex-col gap-1 border-b border-brutal-ink/10 pb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-brutal-ink md:text-xl">
                          {exp.title}
                        </h3>
                        <p className="text-sm text-brutal-muted md:text-base">
                          <span className="font-medium text-brutal-ink">{exp.company}</span>
                          {exp.location ? ` · ${exp.location}` : ''}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-medium text-brutal-muted">
                        {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}
                      </p>
                    </div>
                    {lines.length > 0 && (
                      <ul className="list-inside list-disc space-y-2 pl-1 text-sm leading-relaxed text-brutal-muted marker:text-brutal-ink md:text-[15px]">
                        {lines.map((line, i) => (
                          <li key={`${exp.id}-h-${i}`} className="pl-1">
                            {line}
                          </li>
                        ))}
                      </ul>
                    )}
                    {exp.technologies && (
                      <div className="mt-4">
                        <h4 className="mb-1 text-sm font-semibold text-brutal-ink">Technologies</h4>
                        <p className="text-sm leading-relaxed text-brutal-muted md:text-[15px]">
                          {exp.technologies}
                        </p>
                      </div>
                    )}
                  </GlowCard>
                )
              })}
              {experience.length === 0 && (
                <p className="text-brutal-muted">No experience entries yet.</p>
              )}
            </div>
          </section>

          <section aria-labelledby="education-heading">
            <h2
              id="education-heading"
              className="mb-6 font-serif text-2xl font-semibold text-brutal-ink md:mb-8 md:text-3xl"
            >
              Education
            </h2>
            <div className="space-y-6">
              {education.map((edu) => {
                const lines = bulletLines(edu.highlights, edu.description)
                return (
                  <GlowCard key={edu.id} className={RESUME_SECTION_CARD_CLASS}>
                    <div className="mb-4 flex flex-col gap-1 border-b border-brutal-ink/10 pb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-brutal-ink md:text-xl">
                          {edu.degree}
                        </h3>
                        <p className="text-sm font-medium text-brutal-ink md:text-base">
                          {edu.institution}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-medium text-brutal-muted">
                        {formatDateRange(edu.start_date, edu.end_date, edu.is_current)}
                      </p>
                    </div>
                    {lines.length > 0 && (
                      <ul className="list-inside list-disc space-y-2 pl-1 text-sm leading-relaxed text-brutal-muted marker:text-brutal-ink md:text-[15px]">
                        {lines.map((line, i) => (
                          <li key={`${edu.id}-h-${i}`} className="pl-1">
                            {line}
                          </li>
                        ))}
                      </ul>
                    )}
                  </GlowCard>
                )
              })}
            </div>
          </section>

          <section aria-labelledby="skills-heading">
            <h2
              id="skills-heading"
              className="mb-6 font-serif text-2xl font-semibold text-brutal-ink md:mb-8 md:text-3xl"
            >
              Skills
            </h2>
            <div className="space-y-8">
              {skillGroups.map((group) => (
                <div key={group.category}>
                  <h3 className="mb-3 text-lg font-semibold text-brutal-ink md:text-xl">
                    {group.category}
                  </h3>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {group.items.map((skill) => (
                      <span
                        key={`${group.category}-${skill}`}
                        className="rounded-sm border border-brutal-ink/15 bg-brutal-bg px-3 py-1.5 text-xs font-medium text-brutal-ink shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] md:text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <section aria-labelledby="why-heading">
        <h2
          id="why-heading"
          className="mb-4 font-serif text-2xl font-semibold text-brutal-ink md:text-3xl"
        >
          Why I excel
        </h2>
        <GlowCard className="p-6 md:p-8">
          <p className="text-justify text-sm leading-relaxed text-brutal-muted md:text-[15px]">
            {WHY_I_EXCEL}
          </p>
          <p className="mt-6 text-left text-sm md:text-[15px]">
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center font-medium text-brutal-ink underline underline-offset-4 transition-opacity duration-200 hover:opacity-75 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brutal-ink"
            >
              Contact me
            </Link>
          </p>
        </GlowCard>
      </section>
    </article>
  )
}
