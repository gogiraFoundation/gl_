import type { OutlineHeading } from './StickyOutline'

/** Slugify heading text for fragment ids. */
export function slugifyHeading(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80) || 'section'
  )
}

function toHexIndex(n: number): string {
  return `0x${n.toString(16).padStart(2, '0')}`
}

/**
 * Short kicker label so `0x01 // …` does not echo the full H2 underneath.
 * Prefer an explicit map; otherwise first meaningful word of the heading.
 */
const MARKER_KEYWORDS: Record<string, string> = {
  'the principles that shaped the design': 'principles',
  'how it works': 'architecture',
  'what it grew into': 'platform',
  'challenges, and what the data told me': 'challenges',
  'what i learned': 'lessons',
  'what comes next': 'next',
  closing: 'closing',
  "the technical half is provable. the human half isn't yet.": 'thesis',
  'appendix: technical report': 'appendix',
}

/** Body bylines that duplicate EssayPost chrome (author · date · tags · read time). */
const DUPLICATE_META_RE = /^by\s+.+\s·\s.+(about\s+\d+\s+minutes?\s+to\s+read|min\s+read)/i

function stripDuplicateEssayMetadata(root: HTMLElement): void {
  const first = root.firstElementChild
  if (!first) return
  const text = (first.textContent || '').replace(/\s+/g, ' ').trim()
  if (DUPLICATE_META_RE.test(text)) {
    first.remove()
  }
}

export function markerKeywordForHeading(text: string): string {
  const key = text.trim().toLowerCase()
  if (MARKER_KEYWORDS[key]) return MARKER_KEYWORDS[key]
  const word = key
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .find(Boolean)
  return word || 'section'
}

/**
 * Enhance essay HTML: heading ids, decorative markers (aria-hidden), wide
 * figure wrappers for very wide images, ensure details/summary survive.
 */
export function enhanceEssayHtml(html: string): {
  html: string
  headings: OutlineHeading[]
} {
  if (typeof window === 'undefined') {
    return { html, headings: [] }
  }

  const doc = new DOMParser().parseFromString(`<div id="root">${html}</div>`, 'text/html')
  const root = doc.getElementById('root')
  if (!root) return { html, headings: [] }

  stripDuplicateEssayMetadata(root)

  const headings: OutlineHeading[] = []
  let h2Index = 0
  const usedIds = new Set<string>()

  root.querySelectorAll('h2').forEach((h2) => {
    h2Index += 1
    const text = h2.textContent?.trim() || `Section ${h2Index}`
    let id = h2.getAttribute('id') || slugifyHeading(text)
    if (usedIds.has(id)) id = `${id}-${h2Index}`
    usedIds.add(id)
    h2.setAttribute('id', id)
    headings.push({ id, text })

    const marker = doc.createElement('p')
    marker.className = 'essay-marker'
    marker.setAttribute('aria-hidden', 'true')
    marker.setAttribute('data-essay-marker', id)
    marker.textContent = `${toHexIndex(h2Index)} // ${markerKeywordForHeading(text)}`
    h2.parentNode?.insertBefore(marker, h2)
  })

  root.querySelectorAll('h3').forEach((h3, i) => {
    if (h3.getAttribute('id')) return
    const text = h3.textContent?.trim() || `subsection-${i}`
    let id = slugifyHeading(text)
    if (usedIds.has(id)) id = `${id}-h3-${i}`
    usedIds.add(id)
    h3.setAttribute('id', id)
  })

  root.querySelectorAll('img').forEach((img) => {
    img.classList.add('essay-img')

    const widthAttr = img.getAttribute('width')
    const width = widthAttr ? Number.parseInt(widthAttr, 10) : NaN
    const parent = img.parentElement
    if (!parent) return

    const needsWide =
      (!Number.isNaN(width) && width > 1200) ||
      (img.getAttribute('src') || '').includes('architecture') ||
      (img.getAttribute('alt') || '').toLowerCase().includes('architecture')

    if (needsWide) {
      if (!parent.classList.contains('essay-figure-wide')) {
        const wrap = doc.createElement('div')
        wrap.className = 'essay-figure-wide'
        parent.insertBefore(wrap, img)
        wrap.appendChild(img)
      }
    }

    if (!img.getAttribute('loading')) {
      img.setAttribute('loading', 'lazy')
    }
    if (!img.getAttribute('alt')) {
      img.setAttribute('alt', '')
    }
  })

  return { html: root.innerHTML, headings }
}
