import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const title = 'About'
const description =
  'Backend engineer building AI systems. Lead backend at Traq Authenticator. Background in energy analytics, where I learned to ask where a number came from before trusting it.'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'Emmanuel Ugbaje',
    'backend engineer',
    'Lead Developer',
    'Traq Authenticator',
    'IAM',
    'Django',
    'Python',
    'PostgreSQL',
    'Redis',
    'REST API',
    'CI/CD',
    'AWS',
    'GCP',
    'backend development',
    'data pipelines',
  ],
  openGraph: {
    title,
    description,
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  alternates: {
    canonical: '/about',
  },
}

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children
}
