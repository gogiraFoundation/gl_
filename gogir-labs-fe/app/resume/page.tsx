'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ResumeContent } from '@/components/resume/ResumeContent'

export default function ResumePage() {
  return (
    <div className="flex min-h-screen flex-col bg-brutal-bg">
      <Header />
      <main className="relative flex-grow px-4 py-12 md:py-16 lg:py-20">
        <div className="relative z-10 mx-auto max-w-4xl">
          <ResumeContent />
        </div>
      </main>
      <Footer />
    </div>
  )
}
