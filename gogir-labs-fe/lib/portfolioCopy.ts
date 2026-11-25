/**
 * Editorial copy for portfolio cards (British English). Merged by project slug when present.
 * Public card descriptions now come from the API. This map is only a fallback for
 * category labels when the API has no category; do not put marketing blurbs here,
 * and do not add held or excluded slugs (bria, energy-management-dashboard, and the others).
 */
export type PortfolioCardCopy = {
  description: string
  /** Shown when the API has no category; empty when category is unresolved */
  categoryLabel: string
}

export const PORTFOLIO_CARD_COPY: Record<string, PortfolioCardCopy> = {}

const SLUG_ALIASES: Record<string, string> = {}

export function getPortfolioCardCopy(slug: string): PortfolioCardCopy | undefined {
  const normalised = slug?.toLowerCase?.() ?? ''
  return (
    PORTFOLIO_CARD_COPY[normalised] ??
    (SLUG_ALIASES[normalised] ? PORTFOLIO_CARD_COPY[SLUG_ALIASES[normalised]] : undefined)
  )
}
