import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const title =
  'About Emmanuel Ugbaje | Software Engineer & Lead Developer | Python, Django, IAM, Cloud'
const description =
  'Software engineer and Lead Developer at Traq Authenticator (IAM). Secure Python/Django backends, REST APIs, PostgreSQL, Redis, CI/CD, Kubernetes, and AWS. Experience in energy analytics, blockchain research, and product operations.'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'Emmanuel Ugbaje',
    'software engineer',
    'Lead Developer',
    'Traq Authenticator',
    'IAM',
    'Django',
    'Python',
    'PostgreSQL',
    'REST API',
    'CI/CD',
    'Kubernetes',
    'AWS',
    'GCP',
    'Terraform',
    'DevOps',
    'backend development',
    'renewable energy',
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
