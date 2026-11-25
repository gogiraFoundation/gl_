'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { EssayDesignScope } from '@/components/essays/EssayDesignScope'
import { EssayNav } from '@/components/essays/EssayNav'
import { EssayFooter } from '@/components/essays/EssayFooter'
import { RadarPanel } from '@/components/essays/RadarPanel'
import { EvidenceTag } from '@/components/essays/EvidenceTag'
import api from '@/lib/api'
import { evidenceForSlug, essaysForIndex } from '@/lib/essays'

interface EssayListItem {
  id: number
  title: string
  slug: string
  excerpt: string
  category: { id: number; name: string; slug: string } | null
}

function parsePosts(data: unknown): EssayListItem[] {
  if (!data) return []
  if (Array.isArray(data)) return data as EssayListItem[]
  const results = (data as { results?: EssayListItem[] }).results
  return results || []
}

export default function HomeClient() {
  const { data: posts = [], isLoading } = useQuery({
    // Allow-list via essaysForIndex — ignore admin category so miscategorized
    // allow-listed posts still surface on the home list.
    queryKey: ['posts', 'essays', 'home'],
    queryFn: async () => {
      const response = await api.get('/blog/posts/')
      return essaysForIndex(parsePosts(response.data))
    },
    staleTime: 1000 * 60 * 5,
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
        <EssayNav />
        <main id="main-content" className="relative flex-grow">
          <section className="relative overflow-hidden">
            <div className="mx-auto grid max-w-shell gap-10 px-6 pb-16 pt-24 min-[900px]:grid-cols-12 lg:px-8 lg:pb-24 lg:pt-32">
              <div className="relative z-10 text-center min-[900px]:col-span-7">
                <p className="font-essay-mono text-xs text-essay-muted" aria-hidden="true">
                  // station chief
                </p>
                <h1 className="mt-3 font-essay-display text-4xl font-semibold tracking-tight text-essay-ink md:text-5xl lg:text-6xl">
                  Emmanuel Ugbaje
                </h1>
                <p className="mx-auto mt-3 max-w-md font-essay-sans text-sm text-essay-muted md:text-base">
                  Backend engineer building AI systems. Cofounder at Traq Authenticator.
                </p>
                <div className="mx-auto mt-10 flex max-w-sm flex-col items-center text-center md:mt-12">
                  <p className="font-essay-sans text-sm leading-relaxed text-essay-muted">
                    Planning a backend, API, or platform build?
                  </p>
                  <Link
                    href="/contact"
                    className="mt-2 font-essay-sans text-sm text-essay-accent underline underline-offset-4 transition-opacity duration-essay-fast ease-essay hover:opacity-90"
                  >
                    Get in touch.
                  </Link>
                </div>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/blog"
                    className="essay-btn-primary inline-flex min-h-[48px] w-full max-w-xs items-center justify-center rounded-full bg-essay-accent px-6 font-essay-sans text-sm font-medium text-white transition-opacity duration-essay-fast ease-essay hover:opacity-90 sm:w-auto sm:max-w-none"
                  >
                    Read the essays
                  </Link>
                  <Link
                    href="/portfolio"
                    className="inline-flex min-h-[48px] w-full max-w-xs items-center justify-center rounded-full border border-essay-ink/25 bg-transparent px-6 font-essay-sans text-sm font-medium text-essay-ink transition-colors duration-essay-fast ease-essay hover:border-essay-accent hover:text-essay-accent sm:w-auto sm:max-w-none"
                  >
                    View the portfolio
                  </Link>
                </div>
              </div>
              <div className="relative hidden min-[900px]:col-span-5 min-[900px]:block">
                <div className="ml-auto w-full max-w-[620px] border border-essay-accent/40 bg-essay-bg p-3 shadow-[4px_4px_0_0_rgba(13,92,86,0.28)] sm:p-4">
                  <RadarPanel />
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-essay-ink/10 px-6 py-16 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-shell">
              <h2 className="text-center font-essay-display text-2xl font-semibold text-essay-ink">
                Essays
              </h2>
              {isLoading ? (
                <p className="mt-8 text-center text-essay-muted">Loading essays…</p>
              ) : posts.length === 0 ? (
                <p className="mx-auto mt-8 max-w-prose text-justify text-essay-muted">
                  Project essays will appear here when published. Until then, see the{' '}
                  <Link
                    href="/portfolio"
                    className="text-essay-accent underline underline-offset-4"
                  >
                    portfolio
                  </Link>
                  .
                </p>
              ) : (
                <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => {
                    const evidence = evidenceForSlug(post.slug)
                    return (
                      <li key={post.id} className="min-w-0">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="group flex h-full flex-col border border-essay-accent/35 bg-essay-bg p-5 shadow-[4px_4px_0_0_rgba(13,92,86,0.28)] transition-colors duration-essay-fast ease-essay"
                        >
                          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
                            <span className="text-center font-essay-display text-xl font-semibold text-essay-ink group-hover:text-essay-accent md:text-2xl">
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
              <p className="mt-12 text-center">
                <Link
                  href="/about"
                  className="font-essay-sans text-essay-ink underline-offset-4 hover:text-essay-accent hover:underline"
                >
                  About
                </Link>
                <span className="mx-2 text-essay-muted">·</span>
                <Link
                  href="/contact"
                  className="font-essay-sans text-essay-ink underline-offset-4 hover:text-essay-accent hover:underline"
                >
                  Contact
                </Link>
              </p>
            </div>
          </section>
        </main>
        <EssayFooter />
      </div>
    </EssayDesignScope>
  )
}
