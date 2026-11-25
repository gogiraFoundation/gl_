import ContactClient from './ContactClient'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Emmanuel Ugbaje about backend engineering and AI systems work. I reply within two business days. hi@gogirlabs.uk',
  keywords: [
    'contact Emmanuel Ugbaje',
    'backend engineer contact',
    'Django developer',
    'IAM consulting',
    'Traq Authenticator',
  ],
  openGraph: {
    title: 'Contact',
    description: 'Backend, IAM, and data platform briefs. Reply within two business days.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact',
    description: 'Backend, IAM, and data platform briefs. Reply within two business days.',
  },
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactPage() {
  return <ContactClient />
}
