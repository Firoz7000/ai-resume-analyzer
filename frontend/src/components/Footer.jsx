import { APP_NAME } from '../lib/constants'
import { Container } from './Container'

const footerLinks = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Contact', href: '#' },
]

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-900/40">
      <Container className="flex flex-col items-center justify-between gap-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            R
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">{APP_NAME}</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-6" aria-label="Footer">
          {footerLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              {label}
            </a>
          ))}
        </nav>
        <p className="text-center text-sm text-slate-500 dark:text-slate-500 sm:text-right">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </Container>
    </footer>
  )
}
