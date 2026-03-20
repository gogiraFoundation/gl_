'use client'

import { Download } from 'lucide-react'
import { GlowCard } from '@/components/ui/GlowCard'
import { useAnalyticsEvent } from '@/hooks/useAnalyticsEvent'

interface Experience {
  id: number
  title: string
  company: string
  location: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string
  technologies: string
  order: number
}

interface Education {
  id: number
  institution: string
  degree: string
  field_of_study: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string
  gpa: string
  order: number
}

interface Certification {
  id: number
  name: string
  issuer: string
  issue_date: string
  expiry_date: string | null
  credential_id: string
  credential_url: string
  order: number
}

interface Skill {
  id: number
  name: string
  category: string
  proficiency?: number | null
  order: number
}

interface ResumeContentProps {
  experience: Experience[]
  education: Education[]
  certifications: Certification[]
  skills: Skill[]
}

export function ResumeContent({
  experience,
  education,
  certifications,
  skills,
}: ResumeContentProps) {
  const { trackClick } = useAnalyticsEvent()

  const handleDownload = async () => {
    trackClick('resume_download', { format: 'pdf' })
    try {
      // Get base URL - extract from NEXT_PUBLIC_API_URL if it includes /api/v1
      const envApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

      // Remove /api/v1 from the URL if present to get the base URL
      let baseUrl = envApiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')

      // If baseUrl is empty after removal, use default
      if (!baseUrl || baseUrl === 'http://localhost:8000/api') {
        baseUrl = 'http://localhost:8000'
      }

      // Construct download URL
      const downloadUrl = `${baseUrl}/api/v1/resume/download/`

      // Create a temporary link to trigger download
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = 'Emmanuel_Ugbaje_Resume.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading resume:', error)
      // Fallback to opening in new tab
      const envApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
      const baseUrl =
        envApiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '') || 'http://localhost:8000'
      window.open(`${baseUrl}/api/v1/resume/download/`, '_blank')
    }
  }

  const formatDateRange = (start: string, end: string | null, isCurrent: boolean) => {
    const startDate = new Date(start).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    })
    const endDate = end
      ? new Date(end).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
      : null
    return isCurrent || !endDate ? `${startDate} - Present` : `${startDate} - ${endDate}`
  }

  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="text-center">
        <h1 className="gradient-text mb-4 text-5xl font-bold md:text-6xl">My Resume</h1>
        <p className="mx-auto mb-8 max-w-3xl text-lg text-gray-300">
          A detailed overview of my professional journey, technical expertise, and academic
          background.
        </p>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-3 rounded-lg bg-gradient-primary px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-glow-purple"
        >
          <Download className="h-5 w-5" /> Download PDF
        </button>
      </section>

      {/* Experience */}
      {experience.length > 0 && (
        <section>
          <h2 className="mb-8 text-3xl font-bold text-white">Experience</h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <GlowCard key={exp.id} glowColor="blue" className="p-6 md:p-8">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
                    <p className="text-purple-300">
                      {exp.company} {exp.location && `- ${exp.location}`}
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}
                  </span>
                </div>
                <div className="prose prose-invert mt-4 max-w-none whitespace-pre-line leading-relaxed text-gray-300">
                  {exp.description}
                </div>
                {exp.technologies && (
                  <div className="mt-4">
                    <h4 className="text-md mb-2 font-semibold text-white">Technologies:</h4>
                    <p className="text-gray-400">{exp.technologies}</p>
                  </div>
                )}
              </GlowCard>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section>
          <h2 className="mb-8 text-3xl font-bold text-white">Education</h2>
          <div className="space-y-6">
            {education.map((edu) => (
              <GlowCard key={edu.id} glowColor="purple" className="p-6 md:p-8">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{edu.degree}</h3>
                    <p className="text-blue-300">
                      {edu.institution} {edu.field_of_study && `- ${edu.field_of_study}`}
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {formatDateRange(edu.start_date, edu.end_date, edu.is_current)}
                  </span>
                </div>
                {edu.description && (
                  <div className="prose prose-invert mt-4 max-w-none whitespace-pre-line leading-relaxed text-gray-300">
                    {edu.description}
                  </div>
                )}
                {edu.gpa && <p className="mt-2 text-gray-400">GPA: {edu.gpa}</p>}
              </GlowCard>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section>
          <h2 className="mb-8 text-3xl font-bold text-white">Certifications</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert) => (
              <GlowCard key={cert.id} glowColor="blue" className="p-6">
                <h3 className="mb-2 text-xl font-semibold text-white">{cert.name}</h3>
                <p className="mb-2 text-green-300">{cert.issuer}</p>
                {cert.issue_date && (
                  <p className="text-sm text-gray-400">
                    Issued:{' '}
                    {new Date(cert.issue_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </p>
                )}
                {cert.expiry_date && (
                  <p className="text-sm text-gray-400">
                    Expires:{' '}
                    {new Date(cert.expiry_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </p>
                )}
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm text-purple-400 hover:underline"
                    onClick={() =>
                      trackClick('certification_view', { name: cert.name, issuer: cert.issuer })
                    }
                  >
                    View Credential
                  </a>
                )}
              </GlowCard>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <h2 className="mb-8 text-3xl font-bold text-white">Skills</h2>
          <div className="space-y-8">
            {Object.entries(
              skills.reduce(
                (acc, skill) => {
                  const category = skill.category
                    .replace('_', ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())
                  if (!acc[category]) acc[category] = []
                  acc[category].push(skill)
                  return acc
                },
                {} as Record<string, Skill[]>
              )
            ).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="mb-4 text-xl font-semibold text-white">{category}</h3>
                <div className="flex flex-wrap gap-3">
                  {categorySkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="rounded-full bg-gray-700/50 px-4 py-2 text-sm font-medium text-gray-200"
                    >
                      {skill.name}
                      {typeof skill.proficiency === 'number' && <> ({skill.proficiency}/10)</>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
