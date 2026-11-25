import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Script from 'next/script'

const title = 'Resume | Emmanuel Ugbaje | Backend engineer building AI systems'

const description =
  'Backend engineer building AI systems. Lead backend at Traq Authenticator. MSc Renewable Energy and Sustainable Technology. Experience, education and skills.'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Emmanuel Ugbaje',
  jobTitle: 'Backend engineer building AI systems',
  description,
  url: 'https://www.gogirlabs.uk/resume',
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
  metadataBase: new URL('https://www.gogirlabs.uk'),
  title: { absolute: title },
  description,
  keywords: [
    'Emmanuel Ugbaje',
    'resume',
    'CV',
    'Backend engineer building AI systems',
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
