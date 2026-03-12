'use client'

import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ResumeContent } from '@/components/resume/ResumeContent'
import api from '@/lib/api'
import { useEffect } from 'react'

export default function ResumePage() {
  const { data: resumeData, isLoading } = useQuery({
    queryKey: ['resume'],
    queryFn: async () => {
      const [experience, education, certifications, skills] = await Promise.all([
        api.get('/resume/experience/'),
        api.get('/resume/education/'),
        api.get('/resume/certifications/'),
        api.get('/resume/skills/'),
      ])
      return {
        experience: experience.data.results || experience.data,
        education: education.data.results || education.data,
        certifications: certifications.data.results || certifications.data,
        skills: skills.data.results || skills.data,
      }
    },
    staleTime: 10 * 60 * 1000,
  })

  useEffect(() => {
    document.title = 'Resume | Emmanuel Ugbaije'
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">Loading resume...</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 px-4 relative">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          {resumeData && (
            <ResumeContent
              experience={resumeData.experience}
              education={resumeData.education}
              certifications={resumeData.certifications}
              skills={resumeData.skills}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

