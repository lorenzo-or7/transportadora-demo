import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'motion/react'
import { Moon, Sun } from 'lucide-react'
import { SPRING_PRESS } from '../../lib/motion'
import { site } from '../../config/site'

/* ---------------- Logotipo demonstrativo ---------------- */
export function Logo({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true">
        <rect width="32" height="32" rx="7" className="fill-text" />
        <path d="M7 22 15 10h3l-8 12H7Zm7 0 8-12h3l-8 12h-3Z" className="fill-primary" />
        <circle cx="24" cy="21.5" r="2" className="fill-bg" />
      </svg>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.05rem] font-semibold tracking-[-0.03em]">{site.brand}</span>
          <span className="mono mt-1 text-[0.58rem] uppercase tracking-[0.18em] text-muted">Marca demo</span>
        </span>
      )}
    </span>
  )
}

/* ---------------- ThemeSwitch ---------------- */
export function ThemeSwitch({ theme, onToggle }: { theme: 'dark' | 'light'; onToggle: () => void }) {
  const dark = theme === 'dark'
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={{ scale: 0.92 }}
      transition={SPRING_PRESS}
      role="switch"
      aria-checked={dark}
      aria-label="Tema escuro"
      title={dark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      className="relative grid h-11 w-11 place-items-center rounded-full border border-line text-text transition-colors hover:border-line-strong"
    >
      <motion.span
        key={theme}
        initial={{ rotate: -60, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="grid place-items-center"
        aria-hidden="true"
      >
        {dark ? <Moon size={18} strokeWidth={1.75} /> : <Sun size={18} strokeWidth={1.75} />}
      </motion.span>
    </motion.button>
  )
}

/* ---------------- Selo de dado demonstrativo ---------------- */
export function DemoTag({ children = 'Demonstrativo', className = '' }: { children?: string; className?: string }) {
  return (
    <span
      className={`mono inline-flex items-center gap-1.5 rounded-full border border-dashed border-line-strong px-2.5 py-1 text-[0.66rem] uppercase tracking-[0.14em] text-muted ${className}`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
      {children}
    </span>
  )
}

/* ---------------- AnimatedCounter ---------------- */
export function AnimatedCounter({ value, pad = 2, className = '' }: { value: number; pad?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? value : 0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setN(value)
      return
    }
    const c = animate(0, value, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, value, reduce])

  return (
    <span ref={ref} className={`tabular ${className}`}>
      <span aria-hidden="true">{String(n).padStart(pad, '0')}</span>
      <span className="sr-only">{value}</span>
    </span>
  )
}
