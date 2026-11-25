'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { EssayDesignScope } from '@/components/essays/EssayDesignScope'
import { EssayNav } from '@/components/essays/EssayNav'
import { EssayFooter } from '@/components/essays/EssayFooter'
import { EvidenceTag } from '@/components/essays/EvidenceTag'
import api from '@/lib/api'
import { evidenceForSlug, essaysForIndex } from '@/lib/essays'

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  featured_image: string | null
  category: { id: number; name: string; slug: string } | null
  tags: Array<{ id: number; name: string; slug: string }>
  author_name: string
  published: boolean
  featured: boolean
  views: number
  created_at: string
  published_at: string | null
}

function parsePosts(data: unknown): Post[] {
  if (!data) return []
  if (Array.isArray(data)) return data as Post[]
  const results = (data as { results?: Post[] }).results
  return results || []
}

export default function BlogClient() {
  const {
    data: posts = [],
    isLoading,
    error,
  } = useQuery<Post[]>({
    // Allow-list via essaysForIndex — do not filter by category id so a
    // miscategorized allow-listed post (e.g. Energy) still appears.
    queryKey: ['posts', 'essays', 'index'],
    queryFn: async () => {
      const response = await api.get('/blog/posts/')
      return essaysForIndex(parsePosts(response.data))
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  return (
    <EssayDesignScope>
      <div className="flex min-h-screen flex-col bg-essay-bg text-essay-ink">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-essay-bg focus:px-3 focus:py-2 focus:text-essay-accent"
        >
          Skip to content
        </a>
        <EssayNav active="essays" />
        <main id="main-content" className="flex-grow px-6 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-shell">
            <header className="mx-auto max-w-prose text-center">
              <p className="font-essay-mono text-xs text-essay-muted" aria-hidden="true">
                // essays
              </p>
              <h1 className="mt-3 font-essay-display text-4xl font-semibold tracking-tight md:text-5xl">
                Essays
              </h1>
              <p className="mt-4 text-justify font-essay-sans text-base leading-relaxed text-essay-muted">
                Project write-ups and Bench Notes, with labelled evidence. Failures and limits are
                included.
              </p>
            </header>

            {error && (
              <div
                role="alert"
                className="mx-auto mt-10 max-w-prose border border-essay-ink/20 p-4 text-center"
              >
                <p className="font-semibold">Could not load essays</p>
                <p className="mt-1 text-justify text-sm text-essay-muted">
                  {error instanceof Error ? error.message : 'Something went wrong.'}
                </p>
              </div>
            )}

            {isLoading ? (
              <p className="mt-12 text-center text-essay-muted">Loading essays…</p>
            ) : posts.length === 0 && !error ? (
              <p className="mx-auto mt-12 max-w-prose text-justify text-essay-muted">
                Essays are on the way. See the{' '}
                <Link href="/portfolio" className="text-essay-accent underline underline-offset-4">
                  portfolio
                </Link>{' '}
                in the meantime.
              </p>
            ) : (
              <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => {
                  const evidence = evidenceForSlug(post.slug)
                  return (
                    <li key={post.id} className="min-w-0">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group flex h-full flex-col border border-essay-accent/35 bg-essay-bg p-5 shadow-[4px_4px_0_0_rgba(13,92,86,0.28)] transition-colors duration-essay-fast ease-essay"
                      >
                        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
                          <span className="text-center font-essay-display text-xl font-semibold text-essay-ink transition-colors duration-essay-fast ease-essay group-hover:text-essay-accent md:text-2xl">
                            {post.title}
                          </span>
                          {evidence && <EvidenceTag kind={evidence} />}
                        </div>
                        {post.excerpt ? (
                          <p className="mt-3 flex-1 text-justify font-essay-sans text-sm leading-relaxed text-essay-muted md:text-base">
                            {post.excerpt}
                          </p>
                        ) : null}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </main>
        <EssayFooter />
      </div>
    </EssayDesignScope>
  )
}
