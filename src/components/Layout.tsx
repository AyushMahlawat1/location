import type { ReactNode } from 'react'
import { AnimatedBackground } from './AnimatedBackground'
import { FloatingParticles } from './FloatingParticles'
import { ThemeToggle } from './ThemeToggle'

interface LayoutProps {
  children: ReactNode
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export function Layout({ children, theme, onToggleTheme }: LayoutProps) {
  return (
    <div className="relative min-h-dvh">
      <AnimatedBackground />
      <FloatingParticles />

      <header className="fixed top-0 right-0 z-40 p-4 sm:p-6">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 pb-16 pt-16">
        {children}
      </main>

      <footer className="relative z-10 text-center pb-8 text-sm text-midnight-700/50 dark:text-cream-200/40">
        <p>Take your time. You&apos;re exactly where you need to be.</p>
      </footer>
    </div>
  )
}
