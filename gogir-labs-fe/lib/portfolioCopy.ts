/**
 * Editorial copy for portfolio cards (British English). Merged by project slug when present.
 */
export type PortfolioCardCopy = {
  description: string
  /** Shown when the API has no category; empty when category is unresolved */
  categoryLabel: string
}

export const PORTFOLIO_CARD_COPY: Record<string, PortfolioCardCopy> = {
  'afri-cleans-website': {
    categoryLabel: 'Website',
    description:
      'Full-stack site for Afri Ltd: booking, service management, and customer-facing pages for a cleaning business.',
  },
  'energy-management-dashboard': {
    categoryLabel: '',
    description:
      'Commercial building energy dashboard with live analytics and ISO 50001-oriented reporting.',
  },
  'api-gateway-service': {
    categoryLabel: '',
    description:
      'A Django API gateway for routing and securing microservice traffic—rate limits, auth checks, and stable upstream routing without a separate gateway stack.',
  },
  'e-commerce-analytics-platform': {
    categoryLabel: 'SaaS',
    description:
      'E-commerce analytics with live dashboards, sales reporting, and predictive views so operators can act on what sold—and what will.',
  },
  urbana: {
    categoryLabel: 'SaaS',
    description:
      'Operations platform for growing teams: projects, collaboration, and reporting in one place.',
  },
  'pipe-pop': {
    categoryLabel: '',
    description:
      'Monitoring and health tools for Point of Presence (PoP) nodes in pipe networks—live status, not spreadsheets.',
  },
  bria: {
    categoryLabel: 'Renewable Technology',
    description:
      'Renewable power forecasting for solar and wind: weather data, physical models, and ML generation forecasts.',
  },
  invenire: {
    categoryLabel: 'FinTech',
    description:
      'ML-assisted web scraping and data mining—NLP over public sources to surface trends teams can act on.',
  },
}

const SLUG_ALIASES: Record<string, string> = {
  'ecommerce-analytics-platform': 'e-commerce-analytics-platform',
  pipe_pop: 'pipe-pop',
}

export function getPortfolioCardCopy(slug: string): PortfolioCardCopy | undefined {
  const normalised = slug?.toLowerCase?.() ?? ''
  return (
    PORTFOLIO_CARD_COPY[normalised] ??
    (SLUG_ALIASES[normalised] ? PORTFOLIO_CARD_COPY[SLUG_ALIASES[normalised]] : undefined)
  )
}
