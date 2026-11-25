import type { Metadata } from 'next'
import BlogClient from './BlogClient'

export const metadata: Metadata = {
  title: 'Essays',
  description:
    'Project essays and Bench Notes on backend engineering and AI systems. Failures and limits are stated plainly, and evidence is labelled.',
  keywords: [
    'Project Essays',
    'Backend Engineering',
    'IAM',
    'Django',
    'Python',
    'Data Pipelines',
    'CI/CD',
  ],
  openGraph: {
    title: 'Essays',
    description:
      'Project essays with labelled evidence: how systems were built and where they failed.',
    type: 'website',
    url: '/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Essays',
    description:
      'Project essays with labelled evidence: how systems were built and where they failed.',
  },
  alternates: {
    canonical: '/blog',
  },
}

export default function BlogPage() {
  return <BlogClient />
}
