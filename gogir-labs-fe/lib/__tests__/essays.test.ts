import {
  calculateEssayReadingTime,
  essaysForIndex,
  evidenceForSlug,
  isAllowedEssaySlug,
  isProjectEssay,
  nextEssaySlug,
  resolveEssayProjectCta,
} from '../essays'

describe('essays helpers', () => {
  it('allow-lists known slugs only', () => {
    expect(isAllowedEssaySlug('tr-bot')).toBe(true)
    expect(isAllowedEssaySlug('bria')).toBe(false)
  })

  it('detects project essays by allow-list even if category drifted', () => {
    expect(isProjectEssay('project-essays', 'tr-bot')).toBe(true)
    expect(isProjectEssay('energy', 'uk-re-market-intel')).toBe(true)
    expect(isProjectEssay('project-essays', 'bria')).toBe(false)
    expect(isProjectEssay('notes', 'bria')).toBe(false)
  })

  it('maps evidence tags', () => {
    expect(evidenceForSlug('tr-bot')).toBe('simulated')
    expect(evidenceForSlug('afri')).toBe('in-development')
    expect(evidenceForSlug('traqhq')).toBe('in-development')
    expect(evidenceForSlug('traq-frontend')).toBe('in-development')
  })

  it('reads at 220 wpm', () => {
    const words = Array.from({ length: 440 }, () => 'word').join(' ')
    expect(calculateEssayReadingTime(words)).toBe(2)
    expect(calculateEssayReadingTime(`<p>${words}</p>`)).toBe(2)
  })

  it('orders index essays and excludes about-the-author', () => {
    const sorted = essaysForIndex([
      { slug: 'afri' },
      { slug: 'tr-bot' },
      { slug: 'bria' },
      { slug: 'about-the-author' },
      { slug: 'introduction' },
    ])
    expect(sorted.map((p) => p.slug)).toEqual(['introduction', 'tr-bot', 'afri'])
  })

  it('skips unpublished slugs when resolving next essay', () => {
    expect(nextEssaySlug('tr-bot')).toBe('traqhq')
    expect(nextEssaySlug('tr-bot', ['tr-bot', 'urbana'])).toBe('urbana')
    expect(nextEssaySlug('uk-re-market-intel')).toBeNull()
    expect(nextEssaySlug('tr-bot', ['tr-bot'])).toBeNull()
  })

  it('resolves essay CTAs to portfolio or GitHub', () => {
    expect(resolveEssayProjectCta('traqhq', true)).toEqual({
      href: '/portfolio/traqhq',
      label: 'View portfolio',
      external: false,
    })
    expect(resolveEssayProjectCta('tr-bot')).toEqual({
      href: 'https://github.com/gogiraFoundation/trader-joes',
      label: 'View on GitHub',
      external: true,
    })
    expect(resolveEssayProjectCta('afri', false)).toEqual({
      href: '/portfolio',
      label: 'View portfolios',
      external: false,
    })
    expect(resolveEssayProjectCta('introduction')).toBeNull()
  })
})
