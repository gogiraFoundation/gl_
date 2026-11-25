'use client'

import Link from 'next/link'

const FOOTER_LINKS = [
  { href: '/resume', label: 'Resume', external: false },
  { href: '/privacy', label: 'Privacy', external: false },
  { href: 'https://www.gogirlabs.uk', label: 'www.gogirlabs.uk', external: true },
  { href: 'https://github.com/gogiraFoundation', label: 'GitHub', external: true },
  { href: 'https://medium.com/@aigbemanuel', label: 'Medium', external: true },
  {
    href: 'https://www.linkedin.com/in/emmanuel-ugbaje-b19227161/',
    label: 'LinkedIn',
    external: true,
  },
] as const

const linkClass =
  'inline-flex h-11 w-full items-center justify-start text-left font-essay-sans text-sm text-essay-ink underline-offset-4 transition-colors duration-essay-fast ease-essay hover:text-essay-accent hover:underline'

export function EssayFooter() {
  return (
    <footer className="mt-auto border-t border-essay-ink/10 bg-essay-bg">
      <div className="mx-auto flex max-w-shell flex-col gap-8 px-6 py-10 sm:flex-row sm:items-start sm:justify-between sm:gap-12 lg:px-8">
        <div className="shrink-0 text-center sm:text-left">
          <p className="flex h-11 items-center justify-center font-essay-sans text-sm font-semibold text-essay-ink sm:justify-start">
            Emmanuel Ugbaje
          </p>
          <p className="font-essay-mono text-xs text-essay-muted">
            gogira-station_chief · Backend engineer building AI systems
          </p>
          <a
            href="mailto:hi@gogirlabs.uk"
            className="mt-1 inline-flex h-11 items-center justify-center font-essay-sans text-sm text-essay-accent underline-offset-4 transition-colors duration-essay-fast ease-essay hover:underline sm:justify-start"
          >
            hi@gogirlabs.uk
          </a>
        </div>

        <ul className="mx-auto grid w-full max-w-xl grid-cols-3 gap-x-6 gap-y-0 sm:mx-0 sm:ml-auto sm:w-[28rem] sm:max-w-none">
          {FOOTER_LINKS.map((link) => (
            <li key={link.href} className="min-w-0">
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className={linkClass}
                >
                  <span className="truncate">{link.label}</span>
                </a>
              ) : (
                <Link href={link.href} className={linkClass}>
                  <span className="truncate">{link.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
