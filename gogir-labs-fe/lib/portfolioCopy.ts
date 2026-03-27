/**
 * Editorial copy for portfolio cards (British English). Merged by project slug when present.
 */
export type PortfolioCardCopy = {
  description: string
  /** Shown as "Category: {categoryLabel}" when set */
  categoryLabel: string
}

export const PORTFOLIO_CARD_COPY: Record<string, PortfolioCardCopy> = {
  'afri-cleans-website': {
    categoryLabel: 'Website',
    description:
      'A full-stack website developed for Afri Ltd, offering an efficient cleaning service platform for businesses and consumers. The platform integrates booking, service management, and user engagement features.',
  },
  'energy-management-dashboard': {
    categoryLabel: 'Blockchain',
    description:
      'A dashboard designed to monitor and manage energy consumption within commercial buildings, including features for ISO 50001 compliance. The platform enables real-time energy analytics and reporting, aiding businesses in achieving sustainable energy management.',
  },
  'api-gateway-service': {
    categoryLabel: 'Blockchain',
    description:
      'A high-performance API Gateway built with Django, optimised for managing microservices and API routing. This solution allows seamless integration across various services, ensuring robust API security and performance.',
  },
  'e-commerce-analytics-platform': {
    categoryLabel: 'SaaS',
    description:
      'A comprehensive analytics platform tailored for e-commerce businesses, providing real-time dashboards, sales analytics, and predictive insights to inform business strategy and drive growth.',
  },
  urbana: {
    categoryLabel: 'SaaS',
    description:
      'A business management platform for streamlining operations, providing tools for project management, collaboration, and reporting. Tailored to meet the needs of growing organisations.',
  },
  'pipe-pop': {
    categoryLabel: 'Blockchain',
    description:
      'A suite of tools designed for monitoring and managing Point of Presence (PoP) nodes in pipe networks. The platform provides real-time insights and health monitoring for network infrastructure.',
  },
  bria: {
    categoryLabel: 'Renewable Technology',
    description:
      'Bria is an enterprise-grade renewable power forecasting platform that combines meteorological data, physical modelling, and machine learning to deliver accurate generation forecasts for solar and wind farms. This case study outlines the design, development, and deployment of the platform, which is integral to renewable energy projects.',
  },
  invenire: {
    categoryLabel: 'FinTech',
    description:
      'Invenire is an advanced machine learning-driven software designed for web scraping and data mining. It efficiently extracts valuable insights, trends, and data points from a wide range of online sources using natural language processing (NLP) algorithms, enabling businesses to gather key information for strategic decision-making.',
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
