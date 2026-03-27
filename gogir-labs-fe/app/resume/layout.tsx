import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Script from 'next/script'

const title =
  'Resume | Emmanuel Ugbaje | Lead Software Engineer, Django, IAM, Data Engineering & Cloud'

const description =
  'Professional CV: Lead Software Engineer at Traq Authenticator (IAM), Django, Python, Redis, Docker, Kubernetes, CI/CD, GitHub Actions, AWS. Data engineering, MSc Renewable Energy & Sustainable Technology, blockchain analytics, ISO 50001 energy analysis, and technical operations.'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Emmanuel Ugbaje',
  jobTitle: 'Lead Software Engineer',
  description,
  url: 'https://gogirlabs.uk/resume',
  sameAs: [
    'https://www.linkedin.com/in/emmanuel-ugbaje-b19227161/',
    'https://github.com/gogiraFoundation',
    'https://medium.com/@aigbemanuel',
  ],
  knowsAbout: [
    'Django',
    'Python',
    'IAM',
    'Authentication',
    'Redis',
    'Docker',
    'Kubernetes',
    'CI/CD',
    'AWS',
    'ETL',
    'SQL',
    'Data Engineering',
    'Blockchain',
    'Renewable Energy',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Traq Authenticator',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'University of South Wales',
  },
}

export const metadata: Metadata = {
  metadataBase: new URL('https://gogirlabs.uk'),
  title,
  description,
  keywords: [
    'Emmanuel Ugbaje',
    'resume',
    'CV',
    'Lead Software Engineer',
    'Traq Authenticator',
    'IAM',
    'Django',
    'Python',
    'Redis',
    'Docker',
    'Kubernetes',
    'CI/CD',
    'GitHub Actions',
    'AWS',
    'ETL',
    'Data Engineering',
    'Authentication',
    'Blockchain',
    'Renewable Energy',
    'University of South Wales',
    'MSc',
  ],
  openGraph: {
    title,
    description,
    type: 'profile',
    url: '/resume',
    siteName: 'Gogir Labs',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  alternates: {
    canonical: '/resume',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ResumeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Script id="resume-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(jsonLd)}
      </Script>
      {children}
    </>
  )
}
