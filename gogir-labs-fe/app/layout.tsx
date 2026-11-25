import type { Metadata } from 'next'
import {
  EB_Garamond,
  Inter,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
  Space_Grotesk,
} from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { SkipLink } from '@/components/a11y/SkipLink'
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-essay-display',
  display: 'swap',
})
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-essay-sans',
  display: 'swap',
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-essay-mono',
  display: 'swap',
})

const siteDescription =
  'Backend engineer building AI systems. Lead backend at Traq Authenticator. I write up how the work was built and where it failed.'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.gogirlabs.uk'),
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  title: {
    default: 'Emmanuel Ugbaje | Backend engineer building AI systems',
    template: '%s | Emmanuel Ugbaje',
  },
  description: siteDescription,
  keywords: [
    'Backend engineer',
    'Python',
    'Django',
    'Authentication',
    'IAM',
    'REST APIs',
    'PostgreSQL',
    'Redis',
    'CI/CD',
    'Docker',
    'AWS',
    'GCP',
    'API Security',
    'Lead Developer',
    'Renewable Energy',
    'ETL',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Gogir Labs',
    title: 'Emmanuel Ugbaje | Backend engineer building AI systems',
    description: siteDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emmanuel Ugbaje | Backend engineer building AI systems',
    description: siteDescription,
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': 'https://api.gogirlabs.uk/feed/',
      'application/atom+xml': 'https://api.gogirlabs.uk/feed/atom/',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ebGaramond.variable} ${spaceGrotesk.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
      data-theme="light"
      data-design="brutalist"
    >
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS Feed"
          href="https://api.gogirlabs.uk/feed/"
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Atom Feed"
          href="https://api.gogirlabs.uk/feed/atom/"
        />
      </head>
      <body>
        <SkipLink />
        <Providers>
          {children}
          <AnalyticsTracker />
        </Providers>
      </body>
    </html>
  )
}
