import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="relative flex flex-grow items-center justify-center px-4 py-20">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h1 className="gradient-text mb-4 text-9xl font-bold">404</h1>
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">Page Not Found</h2>
          <p className="mb-8 text-lg text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg bg-gradient-primary px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-glow-purple"
            >
              <Home className="h-5 w-5" />
              Go Home
            </Link>
            <Link
              href="/blog"
              className="flex items-center gap-2 rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-gray-700"
            >
              <Search className="h-5 w-5" />
              Browse Blog
            </Link>
            <Link
              href="/portfolio"
              className="flex items-center gap-2 rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
              View Portfolio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
