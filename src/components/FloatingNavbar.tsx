import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { NAV_ITEMS } from '../config/site'
import { useActiveSection } from '../lib/hooks'
import { EASE_OUT } from '../lib/motion'
import { Button } from './ui/Button'
import { Logo, ThemeSwitch } from './ui/misc'

const IDS = NAV_ITEMS.map((n) => n.id)

interface Props {
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export function FloatingNavbar({ theme, onToggleTheme }: Props) {
  const { scrollY } = useScroll()
  const reduce = useReducedMotion()
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(IDS)
  const last = useRef(0)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const heroH = window.innerHeight * 0.82
    setSolid(y > 24)
    const delta = y - last.current
    if (Math.abs(delta) > 6) {
      // oculta ao descer (fora da hero), reaparece ao subir
      setHidden(delta > 0 && y > heroH && !open)
      last.current = y
    }
  })

  // Enquanto sobre a hero, a barra é transparente e usa a paleta escura.
  const overHero = !solid

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-[70] rounded-full bg-primary px-4 py-2 text-on-primary focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>

      <motion.header
        initial={false}
        animate={{ y: hidden ? '-140%' : '0%' }}
        transition={{ duration: reduce ? 0 : 0.45, ease: EASE_OUT }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
        onFocusCapture={() => setHidden(false)}
      >
        <nav
          aria-label="Principal"
          className={`mx-auto flex h-16 max-w-[1360px] items-center gap-3 rounded-full border pl-4 pr-2 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 sm:pl-5 ${
            overHero
              ? 'force-dark border-transparent bg-transparent text-text'
              : 'border-line bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] text-text shadow-float backdrop-blur-xl'
          }`}
        >
          <a href="#topo" className="mr-auto rounded-md" aria-label="Rotaxis — voltar ao início">
            <Logo />
          </a>

          {/* Desktop */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id
              return (
                <li key={item.id} className="relative">
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'location' : undefined}
                    className={`relative z-10 inline-flex min-h-11 items-center rounded-full px-4 text-[0.92rem] transition-colors duration-200 ${
                      isActive ? 'text-text' : 'text-muted hover:text-text'
                    }`}
                  >
                    {item.label}
                  </a>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-[color-mix(in_srgb,var(--text)_8%,transparent)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    >
                      <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                    </motion.span>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="hidden lg:block">
            <ThemeSwitch theme={theme} onToggle={onToggleTheme} />
          </div>
          <div className="hidden sm:block">
            <Button href="#cotacao" size="md" magnetic icon={<ArrowUpRight size={17} />}>
              Solicitar cotação
            </Button>
          </div>

          {/* Mobile: CTA compacto sempre acessível + menu */}
          <a
            href="#cotacao"
            className="mono inline-flex min-h-11 items-center rounded-full bg-primary px-4 text-[0.78rem] font-medium uppercase tracking-[0.08em] text-on-primary sm:hidden"
          >
            Cotação
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label="Abrir menu"
            className="grid h-11 w-11 place-items-center rounded-full border border-line lg:hidden"
          >
            <Menu size={20} strokeWidth={1.75} />
          </button>
        </nav>
      </motion.header>

      <MobileMenu open={open} onClose={() => setOpen(false)} active={active} theme={theme} onToggleTheme={onToggleTheme} />
    </>
  )
}

function MobileMenu({
  open,
  onClose,
  active,
  theme,
  onToggleTheme,
}: {
  open: boolean
  onClose: () => void
  active: string | null
} & Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>('button, a')?.focus(), 60)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab' || !panelRef.current) return
      const f = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      const first = f[0]
      const lastEl = f[f.length - 1]
      if (!first || !lastEl) return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      prev?.focus()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] lg:hidden" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <motion.div
            className="absolute inset-0 bg-[rgb(var(--scrim)/0.6)] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            className="absolute inset-x-3 top-3 flex max-h-[calc(100dvh-1.5rem)] flex-col overflow-auto rounded-[28px] border border-line bg-surface p-5 shadow-float"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -24, clipPath: 'inset(0% 0% 100% 0% round 28px)' }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16, clipPath: 'inset(0% 0% 100% 0% round 28px)' }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar menu"
                className="grid h-11 w-11 place-items-center rounded-full border border-line"
              >
                <X size={20} strokeWidth={1.75} />
              </button>
            </div>

            <ul className="mt-8 border-t border-line">
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.id}
                  className="border-b border-line"
                  initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.05, duration: 0.5, ease: EASE_OUT }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={onClose}
                    aria-current={active === item.id ? 'location' : undefined}
                    className="flex min-h-15 items-center justify-between py-3 font-display text-[1.65rem] font-semibold tracking-[-0.03em]"
                  >
                    <span>{item.label}</span>
                    <span className={`mono text-xs ${active === item.id ? 'text-primary-ink' : 'text-muted'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="mt-6 flex items-center gap-3">
              <Button href="#cotacao" onClick={onClose} size="lg" className="flex-1" icon={<ArrowUpRight size={18} />}>
                Solicitar cotação
              </Button>
              <ThemeSwitch theme={theme} onToggle={onToggleTheme} />
            </div>
            <p className="mono mt-5 text-[0.7rem] uppercase tracking-[0.14em] text-muted">
              Protótipo demonstrativo · Or7.dev
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
