'use client'

import Link from 'next/link'
import { Download } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'
import api from '@/lib/api'

const HOW_I_WORK =
  'I am a backend engineer building AI systems, and I lead backend development at Traq Authenticator. I care about auth flows that do not leak, rate limits that hold under load, and pipelines that reconcile. I would rather show a dated test, a tagged build, or a write-up of a failure than a list of tools. I came to this work through energy analytics and an MSc that trained me to ask where a number came from before trusting it.'

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
  if (isCurrent || !end) return `${startLabel} to Present`
  return `${startLabel} to ${fmt(end)}`
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

  const {
    data: resume,
    isLoading,
    isError,
  } = useQuery({
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
        <p className="font-essay-mono text-xs text-essay-muted" aria-hidden="true">
          // resume
        </p>
        <div className="mb-4 mt-3 flex min-h-[3rem] flex-wrap items-center justify-between gap-3 sm:min-h-0 sm:flex-nowrap sm:gap-4">
          <h1 className="w-full min-w-0 font-essay-display text-3xl font-semibold tracking-tight text-essay-ink sm:w-auto sm:text-4xl md:text-5xl">
            Resume
          </h1>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 border border-essay-ink/25 px-4 font-essay-sans text-sm text-essay-ink transition-colors duration-essay-fast ease-essay hover:border-essay-accent hover:text-essay-accent sm:w-auto sm:shrink-0"
            aria-label="Download resume as PDF"
          >
            <Download className="h-4 w-4 shrink-0" aria-hidden />
            Download PDF
          </button>
        </div>
        <p className="mb-8 max-w-prose text-justify font-essay-sans text-sm leading-relaxed text-essay-muted md:text-base">
          {site?.headline || 'Backend engineer building AI systems.'}
        </p>
      </header>

      {isLoading && <p className="font-essay-sans text-essay-muted">Loading resume…</p>}
      {isError && (
        <p className="font-essay-sans text-red-700">Could not load resume data. Try again later.</p>
      )}

      {!isLoading && !isError && (
        <>
          <section aria-labelledby="experience-heading">
            <h2
              id="experience-heading"
              className="mb-6 font-essay-display text-2xl font-semibold text-essay-ink md:mb-8 md:text-3xl"
            >
              Experience
            </h2>
            <div className="space-y-8">
              {experience.map((exp) => {
                const lines = bulletLines(exp.highlights, exp.description)
                return (
                  <div
                    key={exp.id}
                    className="border-b border-essay-ink/10 pb-8 last:border-b-0 last:pb-0"
                  >
                    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div>
                        <h3 className="font-essay-sans text-lg font-semibold text-essay-ink md:text-xl">
                          {exp.title}
                        </h3>
                        <p className="font-essay-sans text-sm text-essay-muted md:text-base">
                          <span className="font-medium text-essay-ink">{exp.company}</span>
                          {exp.location ? ` · ${exp.location}` : ''}
                        </p>
                      </div>
                      <p className="shrink-0 font-essay-mono text-xs text-essay-muted md:text-sm">
                        {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}
                      </p>
                    </div>
                    {lines.length > 0 && (
                      <ul className="list-inside list-disc space-y-2 pl-1 font-essay-sans text-sm leading-relaxed text-essay-muted marker:text-essay-ink md:text-[15px]">
                        {lines.map((line, i) => (
                          <li key={`${exp.id}-h-${i}`} className="pl-1">
                            {line}
                          </li>
                        ))}
                      </ul>
                    )}
                    {exp.technologies && (
                      <div className="mt-4">
                        <h4 className="mb-1 font-essay-sans text-sm font-semibold text-essay-ink">
                          Technologies
                        </h4>
                        <p className="font-essay-sans text-sm leading-relaxed text-essay-muted md:text-[15px]">
                          {exp.technologies}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
              {experience.length === 0 && (
                <p className="font-essay-sans text-essay-muted">No experience entries yet.</p>
              )}
            </div>
          </section>

          <section aria-labelledby="education-heading">
            <h2
              id="education-heading"
              className="mb-6 font-essay-display text-2xl font-semibold text-essay-ink md:mb-8 md:text-3xl"
            >
              Education
            </h2>
            <div className="space-y-8">
              {education.map((edu) => {
                const lines = bulletLines(edu.highlights, edu.description)
                return (
                  <div
                    key={edu.id}
                    className="border-b border-essay-ink/10 pb-8 last:border-b-0 last:pb-0"
                  >
                    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div>
                        <h3 className="font-essay-sans text-lg font-semibold text-essay-ink md:text-xl">
                          {edu.degree}
                        </h3>
                        <p className="font-essay-sans text-sm font-medium text-essay-ink md:text-base">
                          {edu.institution}
                        </p>
                      </div>
                      <p className="shrink-0 font-essay-mono text-xs text-essay-muted md:text-sm">
                        {formatDateRange(edu.start_date, edu.end_date, edu.is_current)}
                      </p>
                    </div>
                    {lines.length > 0 && (
                      <ul className="list-inside list-disc space-y-2 pl-1 font-essay-sans text-sm leading-relaxed text-essay-muted marker:text-essay-ink md:text-[15px]">
                        {lines.map((line, i) => (
                          <li key={`${edu.id}-h-${i}`} className="pl-1">
                            {line}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          <section aria-labelledby="skills-heading">
            <h2
              id="skills-heading"
              className="mb-6 font-essay-display text-2xl font-semibold text-essay-ink md:mb-8 md:text-3xl"
            >
              Skills
            </h2>
            <div className="space-y-8">
              {skillGroups.map((group) => (
                <div key={group.category}>
                  <h3 className="mb-3 font-essay-sans text-lg font-semibold text-essay-ink md:text-xl">
                    {group.category}
                  </h3>
                  <ul className="flex list-none flex-wrap gap-2 p-0 md:gap-3">
                    {group.items.map((skill, index) => (
                      <li
                        key={`${group.category}-${skill}`}
                        className="border border-essay-ink/15 px-3 py-1.5 font-essay-mono text-xs text-essay-ink md:text-sm"
                      >
                        {skill}
                        {index < group.items.length - 1 ? (
                          <span className="sr-only">, </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                  <p className="sr-only">{group.items.join(', ')}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <section aria-labelledby="how-heading">
        <h2
          id="how-heading"
          className="mb-4 font-essay-display text-2xl font-semibold text-essay-ink md:text-3xl"
        >
          How I work
        </h2>
        <p className="text-justify font-essay-sans text-sm leading-relaxed text-essay-muted md:text-[15px]">
          {HOW_I_WORK}
        </p>
        <p className="mt-6 text-left text-sm md:text-[15px]">
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center font-essay-sans font-medium text-essay-accent underline underline-offset-4 transition-opacity duration-essay-fast ease-essay hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-essay-accent"
          >
            Contact me
          </Link>
        </p>
      </section>
    </article>
  )
}
