'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { formatDate } from '@/lib/utils'
import {
  ESSAY_PROJECT_BY_SLUG,
  calculateEssayReadingTime,
  evidenceForSlug,
  essaysForIndex,
  nextEssaySlug,
  resolveEssayProjectCta,
  type AllowedEssaySlug,
} from '@/lib/essays'
import api from '@/lib/api'
import { EvidenceTag } from './EvidenceTag'
import { ReadingProgress } from './ReadingProgress'
import { StickyOutline, type OutlineHeading } from './StickyOutline'
import { enhanceEssayHtml } from './essayHtml'

export interface EssayPostData {
  title: string
  slug: string
  content: string
  excerpt?: string
  author_name: string
  published_at: string | null
  created_at: string
  word_document?: string | null
  tags?: Array<{ id: number; name: string; slug: string }>
}

interface EssayPostProps {
  post: EssayPostData
}

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'u',
  's',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'blockquote',
  'pre',
  'code',
  'a',
  'img',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'div',
  'span',
  'hr',
  'sub',
  'sup',
  'figure',
  'figcaption',
  'details',
  'summary',
]

const ALLOWED_ATTR = [
  'href',
  'src',
  'alt',
  'title',
  'class',
  'id',
  'width',
  'height',
  'loading',
  'open',
  'target',
  'rel',
]

function sanitizeAndEnhance(raw: string): { html: string | null; headings: OutlineHeading[] } {
  if (!raw.trim()) return { html: null, headings: [] }

  // Client-only: never paint unsanitized HTML (SSR leaves body empty until mount).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const DOMPurify = require('dompurify') as typeof import('dompurify').default
  const sanitized = DOMPurify.sanitize(raw, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  }) as string

  return enhanceEssayHtml(sanitized)
}

export function EssayPost({ post }: EssayPostProps) {
  const articleRef = useRef<HTMLElement>(null)
  const evidence = evidenceForSlug(post.slug)
  const readingMins = calculateEssayReadingTime(post.content)
  const hasTechnicalAppendix = /appendix/i.test(post.content || '')
  const [body, setBody] = useState<{ html: string | null; headings: OutlineHeading[] }>({
    html: null,
    headings: [],
  })
  const [bodyReady, setBodyReady] = useState(false)

  const { data: publishedSlugs = [] } = useQuery({
    queryKey: ['posts', 'essays', 'next-link'],
    queryFn: async () => {
      const response = await api.get('/blog/posts/')
      const data = response.data
      const list = Array.isArray(data) ? data : data.results || []
      return essaysForIndex(list as Array<{ slug: string }>).map((p) => p.slug)
    },
    staleTime: 1000 * 60 * 5,
  })

  const projectRef = ESSAY_PROJECT_BY_SLUG[post.slug as AllowedEssaySlug]
  const { data: portfolioAvailable } = useQuery({
    queryKey: ['portfolio', 'by-slug', projectRef?.portfolioSlug],
    queryFn: async () => {
      const slug = projectRef?.portfolioSlug
      if (!slug) return false
      try {
        await api.get('/portfolio/projects/by-slug/', { params: { slug } })
        return true
      } catch {
        return false
      }
    },
    enabled: Boolean(projectRef?.portfolioSlug),
    staleTime: 1000 * 60 * 5,
    retry: false,
  })

  const nextSlug = nextEssaySlug(post.slug, publishedSlugs)
  const projectCta = resolveEssayProjectCta(
    post.slug,
    projectRef?.portfolioSlug ? portfolioAvailable : undefined
  )

  useEffect(() => {
    setBody(sanitizeAndEnhance(post.content || ''))
    setBodyReady(true)
  }, [post.content])

  useEffect(() => {
    if (!bodyReady || !articleRef.current) return
    const markers = articleRef.current.querySelectorAll<HTMLElement>('[data-essay-marker]')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      markers.forEach((m) => m.classList.add('is-visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )
    markers.forEach((m) => io.observe(m))
    return () => io.disconnect()
  }, [body.html, bodyReady])

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto grid max-w-shell gap-10 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_14rem] lg:px-8 lg:py-16">
        <article ref={articleRef} className="min-w-0">
          <p className="font-essay-mono text-xs text-essay-muted" aria-hidden="true">
            // station chief
          </p>
          <h1 className="mt-3 font-essay-display text-4xl font-semibold tracking-tight text-essay-ink md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-essay-mono text-[0.7rem] tracking-wider text-essay-muted">
            <span className="normal-case">Emmanuel Ugbaje</span>
            <span aria-hidden>•</span>
            <span className="uppercase">{formatDate(post.published_at || post.created_at)}</span>
            <span aria-hidden>•</span>
            <span className="normal-case">
              {readingMins} min read
              {hasTechnicalAppendix ? ' · technical appendix follows' : ''}
            </span>
            {evidence && (
              <>
                <span aria-hidden>•</span>
                <EvidenceTag kind={evidence} />
              </>
            )}
          </p>
          {post.tags && post.tags.length > 0 ? (
            <p className="mt-3 font-essay-mono text-[0.7rem] tracking-wider text-essay-muted">
              <span className="normal-case">Tags: {post.tags.map((t) => t.name).join(' · ')}</span>
            </p>
          ) : null}
          {projectCta ? (
            <p className="mt-5">
              {projectCta.external ? (
                <a
                  href={projectCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-essay-sans text-sm text-essay-accent underline underline-offset-4 transition-opacity duration-essay-fast ease-essay hover:opacity-90"
                >
                  {projectCta.label} →
                </a>
              ) : (
                <Link
                  href={projectCta.href}
                  className="font-essay-sans text-sm text-essay-accent underline underline-offset-4 transition-opacity duration-essay-fast ease-essay hover:opacity-90"
                >
                  {projectCta.label} →
                </Link>
              )}
            </p>
          ) : null}

          {!bodyReady ? (
            <p className="mt-10 text-essay-muted">Loading essay…</p>
          ) : body.html ? (
            <div
              className="essay-prose mt-10 text-essay-ink"
              dangerouslySetInnerHTML={{ __html: body.html }}
            />
          ) : (
            <p className="mt-10 text-essay-muted">This essay has no content yet.</p>
          )}

          <section className="mt-16 border-t border-essay-ink/10 pt-10">
            <h2 className="font-essay-display text-2xl font-semibold text-essay-ink">
              More essays
            </h2>
            {projectCta ? (
              <p className="mt-4">
                {projectCta.external ? (
                  <a
                    href={projectCta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="essay-btn-primary inline-flex min-h-[44px] items-center rounded-full bg-essay-accent px-5 font-essay-sans text-sm font-medium text-white transition-opacity duration-essay-fast ease-essay hover:opacity-90"
                  >
                    {projectCta.label}
                  </a>
                ) : (
                  <Link
                    href={projectCta.href}
                    className="essay-btn-primary inline-flex min-h-[44px] items-center rounded-full bg-essay-accent px-5 font-essay-sans text-sm font-medium text-white transition-opacity duration-essay-fast ease-essay hover:opacity-90"
                  >
                    {projectCta.label}
                  </Link>
                )}
              </p>
            ) : null}
            {post.word_document ? (
              <p className="mt-4">
                <a
                  href={post.word_document}
                  className="font-essay-sans text-essay-accent underline underline-offset-4"
                  download
                >
                  Download Word version
                </a>
              </p>
            ) : null}
            {nextSlug ? (
              <p className="mt-6">
                <Link
                  href={`/blog/${nextSlug}`}
                  className="font-essay-sans text-essay-ink underline-offset-4 transition-colors duration-essay-fast ease-essay hover:text-essay-accent hover:underline"
                >
                  Next essay →
                </Link>
              </p>
            ) : (
              <p className="mt-6">
                <Link
                  href="/blog"
                  className="font-essay-sans text-essay-ink underline-offset-4 transition-colors duration-essay-fast ease-essay hover:text-essay-accent hover:underline"
                >
                  All essays →
                </Link>
              </p>
            )}
          </section>
        </article>

        <aside className="min-w-0">
          {bodyReady ? <StickyOutline headings={body.headings} /> : null}
        </aside>
      </div>
    </>
  )
}
