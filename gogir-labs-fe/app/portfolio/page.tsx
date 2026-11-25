import type { Metadata } from 'next'
import PortfolioClient from './PortfolioClient'

const title = 'Portfolio'
const description =
  'Selected work: UrbanSpick, Traq, an AI engineering lab, this site, and UK energy data. Each card states what is evidenced and what remains unfinished.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: 'website',
    url: '/portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  alternates: {
    canonical: '/portfolio',
  },
}

export default function PortfolioPage() {
  return <PortfolioClient />
}
