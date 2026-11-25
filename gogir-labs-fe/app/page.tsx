import type { Metadata } from 'next'
import HomeClient from './HomeClient'

const title = 'Emmanuel Ugbaje | Backend engineer building AI systems'
const description =
  'Backend engineer building AI systems. Lead backend at Traq Authenticator. I write up how the work was built and where it failed.'

export const metadata: Metadata = {
  title: {
    absolute: title,
  },
  description,
  openGraph: {
    title,
    description,
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  alternates: {
    canonical: '/',
  },
}

export default function HomePage() {
  return <HomeClient />
}
