import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-20 relative">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h1 className="text-9xl font-bold gradient-text mb-4">404</h1>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Page Not Found</h2>
          <p className="text-gray-400 text-lg mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-glow-purple"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            <Link
              href="/blog"
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-300"
            >
              <Search className="w-5 h-5" />
              Browse Blog
            </Link>
            <Link
              href="/portfolio"
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              View Portfolio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

