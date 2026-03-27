'use client'

import Link from 'next/link'
import { Download } from 'lucide-react'
import { GlowCard } from '@/components/ui/GlowCard'
import { GradientText } from '@/components/ui/GradientText'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'
import {
  resumeEducation,
  resumeExperience,
  resumeSkillCategories,
  resumeWhyIExcel,
} from '@/components/resume/resumeData'

const RESUME_SECTION_CARD_CLASS =
  'p-6 md:p-8 transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.18),0_2px_12px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.05)_inset] motion-reduce:hover:translate-y-0'

export function ResumeContent() {
  const { trackClick } = useAnalyticsEvent()

  const handleDownload = async () => {
    trackClick('resume_download', { format: 'pdf' })
    try {
      const envApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
      let baseUrl = envApiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')
      if (!baseUrl || baseUrl === 'http://localhost:8000/api') {
        baseUrl = 'http://localhost:8000'
      }
      const downloadUrl = `${baseUrl}/api/v1/resume/download/`
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = 'Emmanuel_Ugbaje_Resume.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading resume:', error)
      const envApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
      const baseUrl =
        envApiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '') || 'http://localhost:8000'
      window.open(`${baseUrl}/api/v1/resume/download/`, '_blank')
    }
  }

  return (
    <article className="space-y-14 md:space-y-16">
      <header>
        <div className="mb-4 flex min-h-[3rem] flex-row flex-nowrap items-center justify-between gap-3 sm:min-h-0 sm:gap-4">
          <h1 className="min-w-0 font-serif text-3xl font-bold text-brutal-ink sm:text-4xl md:text-5xl">
            <GradientText>Resume</GradientText>
          </h1>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex shrink-0 items-center gap-2 bg-transparent px-3 py-2 text-xs font-medium text-brutal-ink shadow-[0_0_0_0.5px_rgb(156,163,175)] transition-shadow duration-200 hover:shadow-[0_0_0_0.5px_rgb(0,0,0)] active:shadow-[0_0_0_0.5px_#ff4500] sm:px-4 sm:text-sm"
            aria-label="Download resume as PDF"
          >
            <Download className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
            Download PDF
          </button>
        </div>
        <p className="mx-auto mb-8 max-w-2xl text-center text-sm leading-relaxed text-brutal-muted md:text-base">
          Lead Software Engineer, Django, IAM, and data engineering — professional experience,
          education, and skills at a glance.
        </p>
      </header>

      <section aria-labelledby="experience-heading">
        <h2
          id="experience-heading"
          className="mb-6 font-serif text-2xl font-semibold text-brutal-ink md:mb-8 md:text-3xl"
        >
          Experience
        </h2>
        <div className="space-y-6">
          {resumeExperience.map((exp) => (
            <GlowCard key={exp.id} className={RESUME_SECTION_CARD_CLASS}>
              <div className="mb-4 flex flex-col gap-1 border-b border-brutal-ink/10 pb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-brutal-ink md:text-xl">{exp.title}</h3>
                  <p className="text-sm text-brutal-muted md:text-base">
                    <span className="font-medium text-brutal-ink">{exp.company}</span>
                    {exp.location ? ` · ${exp.location}` : ''}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-medium text-brutal-muted">{exp.dateRange}</p>
              </div>
              <ul className="list-inside list-disc space-y-2 pl-1 text-sm leading-relaxed text-brutal-muted marker:text-brutal-ink md:text-[15px]">
                {exp.highlights.map((line, i) => (
                  <li key={`${exp.id}-h-${i}`} className="pl-1">
                    {line}
                  </li>
                ))}
              </ul>
              {exp.impact && (
                <p className="mt-4 border-l-2 border-brutal-ink/20 pl-4 text-sm italic leading-relaxed text-brutal-ink md:text-[15px]">
                  <strong className="font-semibold not-italic">Impact:</strong> {exp.impact}
                </p>
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
          ))}
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
          {resumeEducation.map((edu) => (
            <GlowCard key={edu.id} className={RESUME_SECTION_CARD_CLASS}>
              <div className="mb-4 flex flex-col gap-1 border-b border-brutal-ink/10 pb-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-brutal-ink md:text-xl">{edu.degree}</h3>
                  <p className="text-sm font-medium text-brutal-ink md:text-base">
                    {edu.institution}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-medium text-brutal-muted">{edu.dateRange}</p>
              </div>
              <ul className="list-inside list-disc space-y-2 pl-1 text-sm leading-relaxed text-brutal-muted marker:text-brutal-ink md:text-[15px]">
                {edu.highlights.map((line, i) => (
                  <li key={`${edu.id}-h-${i}`} className="pl-1">
                    {line}
                  </li>
                ))}
              </ul>
            </GlowCard>
          ))}
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
          {resumeSkillCategories.map((group) => (
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

      <section aria-labelledby="why-heading">
        <h2
          id="why-heading"
          className="mb-4 font-serif text-2xl font-semibold text-brutal-ink md:text-3xl"
        >
          Why I excel
        </h2>
        <GlowCard className="p-6 md:p-8">
          <p className="text-justify text-sm leading-relaxed text-brutal-muted md:text-[15px]">
            {resumeWhyIExcel}
          </p>
          <p className="mt-6 text-center text-sm md:text-[15px]">
            <Link
              href="/contact"
              className="duration-250 mx-auto inline-flex w-fit px-[15px] py-[7px] text-xs font-medium text-brutal-ink no-underline decoration-transparent transition-[opacity,box-shadow] [text-decoration-line:none] [text-shadow:0_1px_2px_rgba(107,114,128,0.45)] [text-underline-offset:0] visited:text-brutal-ink visited:no-underline hover:no-underline hover:opacity-85 hover:shadow-[0_0_0_0.5px_#ff4500,0_6px_14px_rgba(0,0,0,0.14)] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brutal-ink/25 active:shadow-[0_0_0_0.5px_rgba(144,238,144,0.95),0_5px_12px_rgba(144,238,144,0.24)]"
            >
              Contact me
            </Link>
          </p>
        </GlowCard>
      </section>
    </article>
  )
}
