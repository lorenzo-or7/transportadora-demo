import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { AlertCircle, Check, Info, Loader2, PackageSearch, Search, Truck } from 'lucide-react'
import { DEMO_EVENTS, DEMO_SHIPMENT, DEMO_TRACKING_CODE, STAGES, type StageId } from '../data/tracking'
import { EASE_OUT } from '../lib/motion'
import { Button } from './ui/Button'
import { DemoTag } from './ui/misc'

type Status = 'idle' | 'loading' | 'invalid' | 'notfound' | 'found'

export function TrackingTimeline() {
  const reduce = useReducedMotion()
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [stageIdx, setStageIdx] = useState(2)
  const [queried, setQueried] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const timer = useRef<number | undefined>(undefined)
  const errId = useId()

  const search = (value: string) => {
    const v = value.trim().toUpperCase()
    window.clearTimeout(timer.current)
    if (!v) {
      setStatus('invalid')
      inputRef.current?.focus()
      return
    }
    setQueried(v)
    setStatus('loading')
    // Breve estado de consulta para demonstrar o feedback; não há requisição externa.
    timer.current = window.setTimeout(() => {
      if (v === DEMO_TRACKING_CODE) {
        setStageIdx(2)
        setStatus('found')
      } else setStatus('notfound')
    }, 650)
  }

  const useExample = () => {
    setCode(DEMO_TRACKING_CODE)
    search(DEMO_TRACKING_CODE)
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Consulta */}
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          search(code)
        }}
        className="rounded-[var(--radius-lg)] border border-line bg-surface p-5 shadow-card sm:p-7"
        role="search"
        aria-label="Rastrear carga"
      >
        <label htmlFor="track-code" className="text-[0.92rem] font-medium">
          Código de rastreamento
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              ref={inputRef}
              id="track-code"
              className="field mono h-14 pl-11 text-[1rem] uppercase tracking-[0.08em]"
              placeholder="EX.: DEMO-OR7-2026"
              autoComplete="off"
              spellCheck={false}
              value={code}
              onChange={(e) => {
                setCode(e.target.value.slice(0, 24))
                if (status === 'invalid') setStatus('idle')
              }}
              aria-invalid={status === 'invalid' || status === 'notfound'}
              aria-describedby={status === 'invalid' || status === 'notfound' ? errId : 'track-hint'}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-14"
            disabled={status === 'loading'}
            icon={status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          >
            {status === 'loading' ? 'Consultando…' : 'Rastrear'}
          </Button>
        </div>
        <div id="track-hint" className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.85rem] text-muted">
          <span>Código de exemplo:</span>
          <button
            type="button"
            onClick={useExample}
            className="mono inline-flex min-h-11 items-center rounded-full border border-dashed border-line-strong px-3 text-[0.8rem] text-text transition-colors hover:border-primary hover:text-primary-ink"
          >
            {DEMO_TRACKING_CODE}
          </button>
        </div>
        <div aria-live="polite" role="status">
          <AnimatePresence initial={false}>
            {(status === 'invalid' || status === 'notfound') && (
              <motion.p
                id={errId}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 flex items-start gap-2 overflow-hidden text-[0.88rem] text-alert"
              >
                <AlertCircle size={16} className="mt-[3px] shrink-0" aria-hidden="true" />
                {status === 'invalid'
                  ? 'Digite um código para consultar.'
                  : `Não encontramos “${queried}”. Nesta demonstração, apenas ${DEMO_TRACKING_CODE} retorna resultado.`}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </form>

      {/* Resultado */}
      <div aria-live="polite" aria-busy={status === 'loading'}>
        <AnimatePresence mode="wait" initial={false}>
          {status === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-[var(--radius-lg)] border border-line bg-surface p-6 sm:p-8">
              <span className="sr-only">Consultando código…</span>
              <div className="grid gap-4" aria-hidden="true">
                {[40, 100, 70, 85].map((w, i) => (
                  <div key={i} className="h-4 animate-pulse rounded bg-elevated" style={{ width: `${w}%` }} />
                ))}
                <div className="mt-4 h-24 animate-pulse rounded-xl bg-elevated" />
              </div>
            </motion.div>
          )}

          {status === 'found' && (
            <motion.div key="found" initial={{ opacity: 0, y: reduce ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE_OUT }}>
              <ResultPanel stageIdx={stageIdx} onStage={setStageIdx} />
            </motion.div>
          )}

          {(status === 'idle' || status === 'invalid' || status === 'notfound') && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid-texture flex flex-col items-center justify-center gap-4 rounded-[var(--radius-lg)] border border-dashed border-line-strong px-6 py-14 text-center"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full border border-line bg-surface text-muted" aria-hidden="true">
                <PackageSearch size={24} strokeWidth={1.6} />
              </span>
              <p className="max-w-[40ch] text-muted">
                {status === 'notfound'
                  ? 'Confira o código ou use o exemplo para ver o painel completo de acompanhamento.'
                  : 'Informe um código para ver a jornada da carga, etapa por etapa.'}
              </p>
              <Button variant="secondary" onClick={useExample}>
                Ver exemplo de rastreamento
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function ResultPanel({ stageIdx, onStage }: { stageIdx: number; onStage: (i: number) => void }) {
  const reduce = useReducedMotion()
  const explorerRef = useRef<HTMLDivElement>(null)
  // no mobile o seletor rola horizontalmente: mantém o estado ativo visível
  useEffect(() => {
    const box = explorerRef.current
    const el = box?.children[stageIdx] as HTMLElement | undefined
    if (!box || !el || box.scrollWidth <= box.clientWidth) return
    box.scrollTo({ left: el.offsetLeft - box.clientWidth / 2 + el.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' })
  }, [stageIdx, reduce])
  const stage = STAGES[stageIdx] ?? STAGES[0]!
  const reached = new Set(STAGES.slice(0, stageIdx + 1).map((s) => s.id))
  const events = DEMO_EVENTS.filter((e) => reached.has(e.stage)).slice().reverse()
  const pct = (stageIdx / (STAGES.length - 1)) * 100
  const delivered = stage.id === 'entregue'

  return (
    <article className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface shadow-card" aria-label={`Rastreamento ${DEMO_SHIPMENT.code}`}>
      {/* Aviso explícito */}
      <div className="flex items-start gap-3 border-b border-line bg-[color-mix(in_srgb,var(--primary)_9%,var(--surface))] px-5 py-3 text-[0.84rem] sm:px-8">
        <Info size={16} className="mt-[3px] shrink-0 text-primary-ink" aria-hidden="true" />
        <p>
          <strong className="font-medium">Rastreamento demonstrativo.</strong>{' '}
          <span className="text-muted">Não existe integração com transportadora real; todos os dados são fictícios.</span>
        </p>
      </div>

      {/* Cabeçalho */}
      <div className="grid gap-6 px-5 pb-2 pt-6 sm:px-8 sm:pt-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <p className="mono text-[0.75rem] tracking-[0.12em] text-muted">{DEMO_SHIPMENT.code}</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.h3
              key={stage.id}
              initial={{ opacity: 0, y: reduce ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -8 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="display-md mt-2 flex items-center gap-3"
            >
              <span className={`h-2.5 w-2.5 rounded-full ${delivered ? 'bg-ok' : 'pulse-dot bg-primary text-primary'}`} aria-hidden="true" />
              {stage.label}
            </motion.h3>
          </AnimatePresence>
          <p className="mt-2 text-muted">{stage.description}</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-[0.88rem]">
          <Meta label="Carga" value={DEMO_SHIPMENT.cargo} />
          <Meta label="Modalidade" value={DEMO_SHIPMENT.modality} />
          <Meta label="Peso" value={DEMO_SHIPMENT.weight} />
          <Meta label="Previsão demonstrativa" value={delivered ? 'Concluída' : DEMO_SHIPMENT.eta} accent />
        </dl>
      </div>

      {/* Rota com progresso */}
      <div className="px-5 py-8 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Origem</p>
            <p className="mt-1 font-display text-lg font-semibold tracking-[-0.02em] sm:text-xl">
              {DEMO_SHIPMENT.origin.city} <span className="text-muted">· {DEMO_SHIPMENT.origin.uf}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="eyebrow">Destino</p>
            <p className="mt-1 font-display text-lg font-semibold tracking-[-0.02em] sm:text-xl">
              {DEMO_SHIPMENT.destination.city} <span className="text-muted">· {DEMO_SHIPMENT.destination.uf}</span>
            </p>
          </div>
        </div>

        <div className="relative mt-6 h-12" role="progressbar" aria-label="Progresso da viagem" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)}>
          <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-line" />
          <motion.div
            className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: reduce ? 0 : 0.9, ease: EASE_OUT }}
          />
          {STAGES.map((s, i) => (
            <span
              key={s.id}
              aria-hidden="true"
              className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-colors duration-500 ${
                i <= stageIdx ? 'border-primary bg-primary' : 'border-line-strong bg-surface'
              }`}
              style={{ left: `${(i / (STAGES.length - 1)) * 100}%` }}
            />
          ))}
          <motion.span
            aria-hidden="true"
            className="absolute top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-primary bg-surface text-primary-ink shadow-float"
            initial={{ left: '0%' }}
            animate={{ left: `${pct}%` }}
            style={{ x: '-50%' }}
            transition={{ duration: reduce ? 0 : 0.9, ease: EASE_OUT }}
          >
            {delivered ? <Check size={18} /> : <Truck size={18} />}
          </motion.span>
        </div>

        {/* Explorar estados */}
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p id="stage-explorer" className="text-[0.88rem] font-medium">
              Explore os estados da jornada
            </p>
            <DemoTag>Simulação</DemoTag>
          </div>
          <div ref={explorerRef} role="radiogroup" aria-labelledby="stage-explorer" className="no-scrollbar relative -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:grid sm:grid-cols-5 sm:px-0">
            {STAGES.map((s, i) => {
              const checked = i === stageIdx
              return (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  tabIndex={checked ? 0 : -1}
                  onClick={() => onStage(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                      e.preventDefault()
                      const n = (i + 1) % STAGES.length
                      onStage(n)
                      ;(e.currentTarget.parentElement?.children[n] as HTMLElement | undefined)?.focus()
                    }
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                      e.preventDefault()
                      const n = (i - 1 + STAGES.length) % STAGES.length
                      onStage(n)
                      ;(e.currentTarget.parentElement?.children[n] as HTMLElement | undefined)?.focus()
                    }
                  }}
                  className={`relative flex min-h-12 shrink-0 items-center gap-2 rounded-[10px] border px-3.5 text-left text-[0.85rem] transition-colors duration-200 ${
                    checked ? 'border-primary text-text' : 'border-line text-muted hover:border-line-strong hover:text-text'
                  }`}
                >
                  {checked && (
                    <motion.span
                      layoutId="stage-pill"
                      className="absolute inset-0 rounded-[9px] bg-[color-mix(in_srgb,var(--primary)_12%,transparent)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span className="mono relative text-[0.7rem] text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span className="relative whitespace-nowrap">{s.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Etapas + histórico */}
      <div className="grid border-t border-line lg:grid-cols-[1fr_1.3fr]">
        <div className="border-b border-line px-5 py-7 sm:px-8 lg:border-b-0 lg:border-r">
          <p className="eyebrow mb-5">Etapas da viagem</p>
          <ol className="relative">
            {STAGES.map((s, i) => {
              const done = i < stageIdx || (i === stageIdx && delivered)
              const current = i === stageIdx && !delivered
              return (
                <li key={s.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < STAGES.length - 1 && (
                    <span className="absolute left-[11px] top-7 bottom-0 w-px bg-line" aria-hidden="true">
                      <motion.span
                        className="absolute inset-x-0 top-0 bg-primary"
                        initial={false}
                        animate={{ height: i < stageIdx ? '100%' : '0%' }}
                        transition={{ duration: 0.5, ease: EASE_OUT, delay: reduce ? 0 : i * 0.06 }}
                      />
                    </span>
                  )}
                  <span
                    className={`relative mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors duration-300 ${
                      done ? 'border-primary bg-primary text-on-primary' : current ? 'border-primary bg-surface' : 'border-line-strong bg-surface'
                    }`}
                    aria-hidden="true"
                  >
                    {done ? <Check size={13} strokeWidth={3} /> : current ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
                  </span>
                  <div>
                    <p className={`font-medium ${i > stageIdx ? 'text-muted' : ''}`}>
                      {s.label}
                      <span className="sr-only">{done ? ' — concluída' : current ? ' — etapa atual' : ' — pendente'}</span>
                    </p>
                    <p className="text-[0.84rem] text-muted">{s.description}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        <div className="px-5 py-7 sm:px-8">
          <p className="eyebrow mb-5">Histórico de movimentações</p>
          <ul className="grid gap-3">
            <AnimatePresence initial={false} mode="popLayout">
              {events.map((ev, i) => (
                <motion.li
                  key={`${ev.time}-${ev.text}`}
                  layout={!reduce}
                  initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: reduce ? 0 : -12 }}
                  transition={{ duration: 0.45, ease: EASE_OUT, delay: reduce ? 0 : i * 0.05 }}
                  className={`rounded-[12px] border p-4 ${i === 0 ? 'border-line-strong bg-elevated/50' : 'border-line'}`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="mono text-[0.75rem] text-muted tabular">{ev.time}</span>
                    <span className="mono text-[0.72rem] uppercase tracking-[0.1em] text-muted">{ev.place}</span>
                  </div>
                  <p className="mt-1.5 text-[0.93rem]">{ev.text}</p>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </article>
  )
}

function Meta({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <dt className="text-[0.78rem] text-muted">{label}</dt>
      <dd className={`mt-0.5 ${accent ? 'text-primary-ink font-medium' : ''}`}>{value}</dd>
    </div>
  )
}

export type { StageId }
