import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { ModalityId } from '../data/services'

/** Permite que CTAs de serviço abram o simulador com o contexto já preenchido. */
interface QuoteIntent {
  serviceId: string | null
  modality: ModalityId | null
  /** incrementa a cada pedido para o simulador reagir mesmo ao mesmo serviço */
  nonce: number
}

interface QuoteCtx {
  intent: QuoteIntent
  requestQuote: (serviceId?: string, modality?: ModalityId) => void
}

const Ctx = createContext<QuoteCtx | null>(null)

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [intent, setIntent] = useState<QuoteIntent>({ serviceId: null, modality: null, nonce: 0 })

  const requestQuote = useCallback((serviceId?: string, modality?: ModalityId) => {
    setIntent((p) => ({ serviceId: serviceId ?? null, modality: modality ?? null, nonce: p.nonce + 1 }))
    const el = document.getElementById('cotacao')
    if (el) {
      el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
      // move o foco para o título do simulador sem saltar a rolagem
      window.setTimeout(() => {
        const t = document.getElementById('cotacao-title')
        if (!t) return
        t.setAttribute('tabindex', '-1')
        t.focus({ preventScroll: true })
      }, 450)
    }
  }, [])

  const value = useMemo(() => ({ intent, requestQuote }), [intent, requestQuote])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useQuote(): QuoteCtx {
  const v = useContext(Ctx)
  if (!v) throw new Error('useQuote fora do QuoteProvider')
  return v
}
