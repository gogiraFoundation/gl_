'use client'

import { EssayDesignScope } from '@/components/essays/EssayDesignScope'
import { EssayNav } from '@/components/essays/EssayNav'
import { EssayFooter } from '@/components/essays/EssayFooter'
import { ResumeContent } from '@/components/resume/ResumeContent'

export default function ResumePage() {
  return (
    <EssayDesignScope>
      <div className="flex min-h-screen flex-col bg-essay-bg text-essay-ink">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-essay-bg focus:px-3 focus:py-2 focus:text-essay-accent"
        >
          Skip to content
        </a>
        <EssayNav active="resume" />
        <main id="main-content" className="flex-grow px-6 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-prose">
            <ResumeContent />
          </div>
        </main>
        <EssayFooter />
      </div>
    </EssayDesignScope>
  )
}
