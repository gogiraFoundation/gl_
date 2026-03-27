import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-brutal-bg">
      <Header />
      <main className="relative flex flex-grow items-center justify-center px-4 py-20">
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h1 className="mb-4 font-serif text-8xl font-semibold text-brutal-ink md:text-9xl">
            404
          </h1>
          <h2 className="mb-6 font-sans text-3xl font-semibold text-brutal-ink md:text-4xl">
            Page not found
          </h2>
          <p className="mb-8 text-lg text-brutal-muted">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 border border-brutal-ink bg-transparent px-6 py-3 font-semibold text-brutal-ink transition-opacity hover:opacity-70"
            >
              <Home className="h-5 w-5" />
              Go home
            </Link>
            <Link
              href="/blog"
              className="flex items-center gap-2 border border-brutal-ink/20 bg-transparent px-6 py-3 font-semibold text-brutal-ink transition-opacity hover:opacity-70"
            >
              <Search className="h-5 w-5" />
              Browse blog
            </Link>
            <Link
              href="/portfolio"
              className="flex items-center gap-2 border border-brutal-ink/20 bg-transparent px-6 py-3 font-semibold text-brutal-ink transition-opacity hover:opacity-70"
            >
              <ArrowLeft className="h-5 w-5" />
              View portfolio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
