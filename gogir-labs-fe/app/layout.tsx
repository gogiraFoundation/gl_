import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  title: {
    default: 'Emmanuel Ugbaje | Software Engineer | Python, Django, Authentication & Cloud',
    template: '%s | Emmanuel Ugbaje',
  },
  description:
    'Software Engineer: secure Python/Django backends, REST APIs, authentication and identity systems, Redis, PostgreSQL, Docker, CI/CD, AWS and GCP. Lead Developer at Traq Authenticator. MSc Renewable Energy; data pipelines and energy analytics background.',
  keywords: [
    'Software Engineer',
    'Python',
    'Django',
    'Authentication',
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
    'Agile Development',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} data-theme="dark">
      <head>
        <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/feed/" />
        <link rel="alternate" type="application/atom+xml" title="Atom Feed" href="/feed/atom/" />
      </head>
      <body>
        <Providers>
          {children}
          <AnalyticsTracker />
        </Providers>
      </body>
    </html>
  )
}
