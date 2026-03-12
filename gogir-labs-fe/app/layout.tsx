import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'Emmanuel Ugbaje - Software Engineer | Building Solutions with Data Insights',
    template: '%s | Emmanuel Ugbaje',
  },
  description: 'Software Engineer specializing in Python, Django, data analysis, and RESTful APIs. Building accessible, efficient digital products that deliver real public value.',
  keywords: ['Software Engineer', 'Python Developer', 'Django', 'Data Analysis', 'REST APIs', 'PostgreSQL', 'Agile Development', 'CI/CD', 'Accessibility', 'User-Centered Design'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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

