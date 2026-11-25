/** Hard allow-list mirroring gogir-labs-be/apps/blog/blog_seed.py */

/** Portfolio slugs held from public catalogue (mirrors portfolio_seed). */
export const PORTFOLIO_PUBLIC_HOLD_SLUGS = new Set(['bria'])

export const PROJECT_ESSAYS_CATEGORY = 'project-essays'

export const ALLOWED_ESSAY_SLUGS = [
  'about-the-author',
  'introduction',
  'bench-notes-preface',
  'bench-notes-week-01',
  'bench-notes-week-02',
  'bench-notes-week-03',
  'bench-notes-week-04',
  'llm-fundamentals',
  'afri',
  'gogir-labs',
  'traq-frontend',
  'traqhq',
  'tr-bot',
  'uk-energy-eff',
  'uk-re-market-intel',
  'urbana',
] as const

export type AllowedEssaySlug = (typeof ALLOWED_ESSAY_SLUGS)[number]

/** Home / blog list order (bio is About, not listed here). */
export const ESSAY_LIST_ORDER: AllowedEssaySlug[] = [
  'introduction',
  'bench-notes-preface',
  'bench-notes-week-01',
  'bench-notes-week-02',
  'bench-notes-week-03',
  'bench-notes-week-04',
  'llm-fundamentals',
  'tr-bot',
  'traqhq',
  'traq-frontend',
  'urbana',
  'gogir-labs',
  'afri',
  'uk-energy-eff',
  'uk-re-market-intel',
]

export const ESSAY_BYLINE = 'gogira-station_chief'

/**
 * Essay → portfolio project and/or GitHub. Prefer the portfolio page when the
 * project is published; otherwise fall back to GitHub when configured.
 */
export type EssayProjectRef = {
  portfolioSlug?: string
  githubUrl?: string
}

export const ESSAY_PROJECT_BY_SLUG: Partial<Record<AllowedEssaySlug, EssayProjectRef>> = {
  traqhq: { portfolioSlug: 'traqhq' },
  'traq-frontend': { portfolioSlug: 'traq-frontend' },
  'uk-energy-eff': { portfolioSlug: 'uk-energy-eff' },
  afri: { portfolioSlug: 'afri-cleans-website' },
  urbana: { portfolioSlug: 'urbana' },
  'tr-bot': {
    portfolioSlug: 'tr-bot',
    githubUrl: 'https://github.com/gogiraFoundation/trader-joes',
  },
  'gogir-labs': { portfolioSlug: 'gogir-labs' },
  'bench-notes-preface': { portfolioSlug: 'ai-engineering-lab' },
  'bench-notes-week-01': { portfolioSlug: 'ai-engineering-lab' },
  'bench-notes-week-02': { portfolioSlug: 'ai-engineering-lab' },
  'bench-notes-week-03': { portfolioSlug: 'ai-engineering-lab' },
  'bench-notes-week-04': { portfolioSlug: 'ai-engineering-lab' },
  'llm-fundamentals': { portfolioSlug: 'ai-engineering-lab' },
}

/** Portfolio project slug → related essay slug (when the essay exists). */
export const PORTFOLIO_ESSAY_BY_PROJECT: Record<string, AllowedEssaySlug> = {
  urbana: 'urbana',
  'afri-cleans-website': 'afri',
  traqhq: 'traqhq',
  'traq-frontend': 'traq-frontend',
  'tr-bot': 'tr-bot',
  'gogir-labs': 'gogir-labs',
  'uk-re-market-intel': 'uk-re-market-intel',
  'uk-energy-eff': 'uk-energy-eff',
  'ai-engineering-lab': 'bench-notes-preface',
}

export type EssayProjectCta = {
  href: string
  label: string
  external: boolean
}

/**
 * Prefer a published portfolio project page; otherwise GitHub; otherwise the
 * portfolio index when a project slug is configured but not yet public.
 *
 * `portfolioAvailable`: true = project detail exists, false = 404 / hold,
 * undefined = not checked yet (optimistic portfolio href when slug is set).
 */
export function resolveEssayProjectCta(
  essaySlug: string,
  portfolioAvailable?: boolean
): EssayProjectCta | null {
  if (!isAllowedEssaySlug(essaySlug)) return null
  const ref = ESSAY_PROJECT_BY_SLUG[essaySlug]
  if (!ref) return null

  if (ref.portfolioSlug && portfolioAvailable === true) {
    return {
      href: `/portfolio/${ref.portfolioSlug}`,
      label: 'View portfolio',
      external: false,
    }
  }

  if (ref.githubUrl && portfolioAvailable !== true) {
    return {
      href: ref.githubUrl,
      label: 'View on GitHub',
      external: true,
    }
  }

  if (ref.portfolioSlug && portfolioAvailable === undefined) {
    return {
      href: `/portfolio/${ref.portfolioSlug}`,
      label: 'View portfolio',
      external: false,
    }
  }

  if (ref.portfolioSlug && portfolioAvailable === false) {
    return {
      href: '/portfolio',
      label: 'View portfolios',
      external: false,
    }
  }

  if (ref.githubUrl) {
    return {
      href: ref.githubUrl,
      label: 'View on GitHub',
      external: true,
    }
  }

  return null
}

export type EvidenceKind = 'simulated' | 'paper' | 'backtest' | 'live' | 'in-development'

const EVIDENCE_BY_SLUG: Partial<Record<AllowedEssaySlug, EvidenceKind>> = {
  'tr-bot': 'simulated',
  afri: 'in-development',
  urbana: 'in-development',
  traqhq: 'in-development',
  'traq-frontend': 'in-development',
}

const EVIDENCE_LABEL: Record<EvidenceKind, string> = {
  simulated: 'SIMULATED',
  paper: 'PAPER',
  backtest: 'BACKTEST',
  live: 'LIVE',
  'in-development': 'IN DEVELOPMENT',
}

export function isAllowedEssaySlug(slug: string): slug is AllowedEssaySlug {
  return (ALLOWED_ESSAY_SLUGS as readonly string[]).includes(slug)
}

/**
 * Allow-listed essay slug wins even if the post was filed under another
 * category in admin (e.g. Energy). Category alone never unlocks a held slug.
 */
export function isProjectEssay(
  _categorySlug: string | null | undefined,
  postSlug: string
): boolean {
  return isAllowedEssaySlug(postSlug)
}

export function evidenceForSlug(slug: string): EvidenceKind | null {
  if (!isAllowedEssaySlug(slug)) return null
  return EVIDENCE_BY_SLUG[slug] ?? null
}

export function evidenceLabel(kind: EvidenceKind): string {
  return EVIDENCE_LABEL[kind]
}

export function calculateEssayReadingTime(content: string | null | undefined): number {
  if (!content) return 0
  const plain = content.replace(/<[^>]+>/g, ' ').trim()
  const words = plain.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

/**
 * Next essay in list order. When `publishedSlugs` is provided, skip unpublished
 * entries so the link never 404s.
 */
export function nextEssaySlug(
  currentSlug: string,
  publishedSlugs?: readonly string[]
): AllowedEssaySlug | null {
  const order =
    publishedSlugs && publishedSlugs.length > 0
      ? ESSAY_LIST_ORDER.filter((slug) => publishedSlugs.includes(slug))
      : ESSAY_LIST_ORDER
  const idx = order.indexOf(currentSlug as AllowedEssaySlug)
  if (idx < 0 || idx >= order.length - 1) return null
  return order[idx + 1]
}

/** Index/home lists: allow-listed essay order, excludes about-the-author. */
export function essaysForIndex<T extends { slug: string }>(posts: T[]): T[] {
  const rank = new Map(ESSAY_LIST_ORDER.map((slug, i) => [slug, i]))
  return [...posts]
    .filter((p) => (ESSAY_LIST_ORDER as readonly string[]).includes(p.slug))
    .sort(
      (a, b) =>
        (rank.get(a.slug as AllowedEssaySlug) ?? 99) - (rank.get(b.slug as AllowedEssaySlug) ?? 99)
    )
}

/** @deprecated Prefer essaysForIndex. Kept for callers that already filter. */
export function sortEssaysByListOrder<T extends { slug: string }>(posts: T[]): T[] {
  return essaysForIndex(posts)
}
