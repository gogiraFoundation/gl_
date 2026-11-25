import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const title = 'Privacy'
const description =
  'Privacy policy for gogirlabs.uk: analytics consent and how usage data is handled.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
  alternates: {
    canonical: '/privacy',
  },
}

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return children
}
