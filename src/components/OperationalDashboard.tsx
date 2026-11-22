import { useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { AlertTriangle, CheckCircle2, ChevronDown, PackageOpen, Search, Truck, X } from 'lucide-react'
import { SHIPMENTS, STATUS_LABEL, type Shipment, type ShipmentStatus } from '../data/shipments'
import { EASE_OUT } from '../lib/motion'
import { DemoTag } from './ui/misc'

type View = 'geral' | 'transito' | 'concluidas'
const VIEWS: { id: View; label: string }[] = [
  { id: 'geral', label: 'Visão geral' },
  { id: 'transito', label: 'Em trânsito' },
  { id: 'concluidas', label: 'Concluídas' },
]
const REGIONS = ['Todas', 'Sul', 'Sudeste', 'Centro-Oeste', 'Nordeste', 'Norte'] as const

const STATUS_STYLE: Record<ShipmentStatus, string> = {
  coleta: 'text-info bg-info/12',
  transito: 'text-primary-ink bg-primary/14',
  distribuicao: 'text-primary-ink bg-primary/14',
  entregue: 'text-ok bg-ok/12',
}

const STATUS_ORDER: ShipmentStatus[] = ['coleta', 'transito', 'distribuicao', 'entregue']

function inView(s: Shipment, v: View) {
  if (v === 'transito') return s.status === 'transito' || s.status === 'distribuicao'
  if (v === 'concluidas') return s.status === 'entregue'
  return true
}

export function OperationalDashboard() {
  const reduce = useReducedMotion()
  const [view, setView] = useState<View>('geral')
  const [region, setRegion] = useState<(typeof REGIONS)[number]>('Todas')
  const [query, setQuery] = useState('')
  const [selectedCode, setSelectedCode] = useState<string>('DM-4821')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SHIPMENTS.filter(
      (s) =>
        inView(s, view) &&
        (region === 'Todas' || s.region === region) &&
        (!q || `${s.code} ${s.origin} ${s.destination} ${s.client}`.toLowerCase().includes(q)),
    )
  }, [view, region, query])

  const stats = useMemo(() => {
    const scope = SHIPMENTS.filter((s) => region === 'Todas' || s.region === region)
    return {
      total: scope.length,
      moving: scope.filter((s) => s.status === 'transito' || s.status === 'distribuicao').length,
      done: scope.filter((s) => s.status === 'entregue').length,
      alerts: scope.filter((s) => s.alert).length,
      byStatus: STATUS_ORDER.map((st) => ({ st, n: scope.filter((s) => s.status === st).length })),
    }
  }, [region])

  const alerts = rows.filter((r) => r.alert)
  const selected = rows.find((r) => r.code === selectedCode) ?? rows[0] ?? null
  const filtered = region !== 'Todas' || query.trim() !== ''
  const clear = () => {
    setRegion('Todas')
    setQuery('')
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface shadow-card">
      {/* Barra superior do "portal" */}
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3 sm:px-6">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        </span>
        <span className="mono text-[0.72rem] uppercase tracking-[0.14em] text-muted">Portal do cliente</span>
        <DemoTag className="ml-auto">Dados fictícios</DemoTag>
      </div>

      {/* Controles */}
      <div className="flex flex-col gap-4 border-b border-line px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <LayoutGroup id="dash-tabs">
          <div role="tablist" aria-label="Visões do painel" className="inline-flex w-full rounded-full border border-line bg-bg p-1 sm:w-auto">
            {VIEWS.map((v, i) => {
              const active = view === v.id
              return (
                <button
                  key={v.id}
                  id={`dash-tab-${v.id}`}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  aria-controls="dash-panel"
                  tabIndex={active ? 0 : -1}
                  onClick={() => setView(v.id)}
                  onKeyDown={(e) => {
                    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
                    if (!d) return
                    e.preventDefault()
                    const n = VIEWS[(i + d + VIEWS.length) % VIEWS.length]!
                    setView(n.id)
                    document.getElementById(`dash-tab-${n.id}`)?.focus()
                  }}
                  className={`relative min-h-10 flex-1 rounded-full px-2.5 text-[0.82rem] transition-colors xs:px-4 sm:flex-none sm:text-[0.88rem] ${active ? 'text-on-primary' : 'text-muted hover:text-text'}`}
                >
                  {active && <motion.span layoutId="dash-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                  <span className="relative whitespace-nowrap">{v.label}</span>
                </button>
              )
            })}
          </div>
        </LayoutGroup>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <label htmlFor="dash-region" className="sr-only">
              Filtrar por região
            </label>
            <select
              id="dash-region"
              value={region}
              onChange={(e) => setRegion(e.target.value as (typeof REGIONS)[number])}
              className="field min-h-11 appearance-none py-2 pr-10 text-[0.9rem] sm:w-48"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r === 'Todas' ? 'Todas as regiões' : r}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
          </div>
          <div className="relative">
            <label htmlFor="dash-search" className="sr-only">
              Buscar remessa
            </label>
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id="dash-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Código ou cidade"
              className="field min-h-11 py-2 pl-10 text-[0.9rem] sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* Indicadores */}
      <dl className="grid grid-cols-2 border-b border-line lg:grid-cols-4">
        {[
          { label: 'Remessas no período', value: stats.total, icon: <PackageOpen size={16} /> },
          { label: 'Em movimento', value: stats.moving, icon: <Truck size={16} /> },
          { label: 'Concluídas', value: stats.done, icon: <CheckCircle2 size={16} /> },
          { label: 'Alertas ativos', value: stats.alerts, icon: <AlertTriangle size={16} />, alert: stats.alerts > 0 },
        ].map((k, i) => (
          <div key={k.label} className={`px-4 py-5 sm:px-6 ${i % 2 === 0 ? 'border-r border-line' : ''} ${i < 2 ? 'border-b border-line lg:border-b-0' : ''} ${i === 1 ? 'lg:border-r' : ''}`}>
            <dt className="flex items-center gap-2 text-[0.8rem] text-muted">
              <span className={k.alert ? 'text-alert' : 'text-muted'} aria-hidden="true">
                {k.icon}
              </span>
              {k.label}
            </dt>
            <dd className="mt-2 font-display text-[2rem] font-semibold leading-none tracking-[-0.04em] tabular">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={k.value} className="inline-block" initial={{ y: reduce ? 0 : 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: reduce ? 0 : -14, opacity: 0 }} transition={{ duration: 0.35, ease: EASE_OUT }}>
                  {String(k.value).padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
            </dd>
          </div>
        ))}
      </dl>

      {/* Distribuição por status (contexto para os números acima) */}
      <div className="border-b border-line px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between text-[0.78rem] text-muted">
          <span>Distribuição por etapa {region !== 'Todas' && `· ${region}`}</span>
          <span className="mono tabular">{stats.total} remessas</span>
        </div>
        <div className="mt-2.5 flex h-2.5 gap-[3px] overflow-hidden rounded-full" role="img" aria-label={stats.byStatus.map((b) => `${STATUS_LABEL[b.st]}: ${b.n}`).join(', ')}>
          {stats.byStatus.map((b) =>
            b.n ? (
              <motion.span
                key={b.st}
                layout={!reduce}
                className={`h-full ${b.st === 'entregue' ? 'bg-ok' : b.st === 'coleta' ? 'bg-info' : b.st === 'transito' ? 'bg-primary' : 'bg-[color-mix(in_srgb,var(--primary)_55%,var(--surface))]'}`}
                style={{ flexGrow: b.n }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              />
            ) : null,
          )}
        </div>
        <ul className="mono mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.7rem] uppercase tracking-[0.08em] text-muted">
          {stats.byStatus.map((b) => (
            <li key={b.st} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full ${b.st === 'entregue' ? 'bg-ok' : b.st === 'coleta' ? 'bg-info' : b.st === 'transito' ? 'bg-primary' : 'bg-[color-mix(in_srgb,var(--primary)_55%,var(--surface))]'}`}
              />
              {STATUS_LABEL[b.st]} <span className="text-text tabular">{b.n}</span>
            </li>
          ))}
        </ul>
      </div>

      <div id="dash-panel" role="tabpanel" aria-labelledby={`dash-tab-${view}`} className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        {/* Tabela / lista */}
        <div className="min-w-0 border-b border-line lg:border-b-0 lg:border-r">
          <p className="sr-only" aria-live="polite">
            {rows.length} {rows.length === 1 ? 'remessa exibida' : 'remessas exibidas'}
          </p>
          {rows.length === 0 ? (
            <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
              <PackageOpen size={28} className="text-muted" aria-hidden="true" />
              <p className="text-muted">Nenhuma remessa encontrada com estes filtros.</p>
              {filtered && (
                <button type="button" onClick={clear} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-4 text-[0.9rem] hover:border-text">
                  <X size={15} aria-hidden="true" /> Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop/tablet: tabela compacta */}
              <table className="hidden w-full text-left text-[0.88rem] md:table">
                <caption className="sr-only">Remessas demonstrativas</caption>
                <thead>
                  <tr className="mono border-b border-line text-[0.68rem] uppercase tracking-[0.12em] text-muted">
                    <th scope="col" className="px-6 py-3 font-normal">Remessa</th>
                    <th scope="col" className="px-3 py-3 font-normal">Rota</th>
                    <th scope="col" className="px-3 py-3 font-normal">Situação</th>
                    <th scope="col" className="px-6 py-3 text-right font-normal">Previsão</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {rows.map((s) => {
                      const isSel = selected?.code === s.code
                      return (
                        <motion.tr
                          key={s.code}
                          layout={!reduce}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`group border-b border-line last:border-b-0 transition-colors ${isSel ? 'bg-elevated/60' : 'hover:bg-elevated/35'}`}
                        >
                          <td className="px-6 py-3.5">
                            <button
                              type="button"
                              onClick={() => setSelectedCode(s.code)}
                              aria-pressed={isSel}
                              className="mono flex min-h-9 items-center gap-2 rounded text-left text-[0.82rem] font-medium hover:text-primary-ink"
                            >
                              {s.alert && <AlertTriangle size={13} className={s.alert.level === 'critico' ? 'text-alert' : 'text-warn'} aria-label="Com alerta" />}
                              {s.code}
                            </button>
                          </td>
                          <td className="px-3 py-3.5">
                            <span className="block">{s.origin.split(' · ')[0]} → {s.destination.split(' · ')[0]}</span>
                            <span className="mono text-[0.7rem] text-muted">{s.region}</span>
                          </td>
                          <td className="px-3 py-3.5">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[0.75rem] font-medium ${STATUS_STYLE[s.status]}`}>{STATUS_LABEL[s.status]}</span>
                            <span className="mt-1.5 block h-1 w-24 overflow-hidden rounded-full bg-line" aria-hidden="true">
                              <motion.span className={`block h-full ${s.status === 'entregue' ? 'bg-ok' : 'bg-primary'}`} initial={{ width: 0 }} whileInView={{ width: `${s.progress}%` }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE_OUT }} />
                            </span>
                          </td>
                          <td className="mono px-6 py-3.5 text-right text-[0.8rem] text-muted tabular">{s.eta}</td>
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                </tbody>
              </table>

              {/* Mobile: lista simplificada */}
              <ul className="divide-y divide-line md:hidden">
                {rows.map((s) => (
                  <li key={s.code}>
                    <button type="button" onClick={() => setSelectedCode(s.code)} aria-pressed={selected?.code === s.code} className={`flex w-full items-center gap-3 px-4 py-4 text-left ${selected?.code === s.code ? 'bg-elevated/60' : ''}`}>
                      <div className="min-w-0 flex-1">
                        <p className="mono flex items-center gap-1.5 text-[0.78rem] text-muted">
                          {s.alert && <AlertTriangle size={12} className={s.alert.level === 'critico' ? 'text-alert' : 'text-warn'} aria-label="Com alerta" />}
                          {s.code}
                        </p>
                        <p className="truncate text-[0.95rem]">
                          {s.origin.split(' · ')[0]} → {s.destination.split(' · ')[0]}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[0.72rem] font-medium ${STATUS_STYLE[s.status]}`}>{STATUS_LABEL[s.status]}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Detalhe + alertas */}
        <div className="flex flex-col">
          <div className="border-b border-line p-5 sm:p-6">
            <p className="eyebrow">Remessa selecionada</p>
            <AnimatePresence mode="wait" initial={false}>
              {selected ? (
                <motion.div key={selected.code} initial={{ opacity: 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE_OUT }}>
                  <div className="mt-3 flex items-baseline justify-between gap-3">
                    <p className="mono text-[1rem] font-medium">{selected.code}</p>
                    <p className="text-[0.82rem] text-muted">{selected.client}</p>
                  </div>
                  <RouteLine shipment={selected} />
                </motion.div>
              ) : (
                <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-[0.9rem] text-muted">
                  Nenhuma remessa nesta visão.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="eyebrow">Alertas</p>
              <span className="mono text-[0.72rem] text-muted tabular">{alerts.length}</span>
            </div>
            {alerts.length === 0 ? (
              <p className="mt-4 flex items-center gap-2 text-[0.9rem] text-muted">
                <CheckCircle2 size={16} className="text-ok" aria-hidden="true" /> Sem alertas nesta visão.
              </p>
            ) : (
              <ul className="mt-4 grid gap-2.5">
                {alerts.map((a) => (
                  <li key={a.code}>
                    <button
                      type="button"
                      onClick={() => setSelectedCode(a.code)}
                      className={`flex w-full items-start gap-3 rounded-[12px] border p-3.5 text-left transition-colors hover:border-line-strong ${a.alert?.level === 'critico' ? 'border-alert/40 bg-alert/6' : 'border-line'}`}
                    >
                      <AlertTriangle size={16} className={`mt-0.5 shrink-0 ${a.alert?.level === 'critico' ? 'text-alert' : 'text-warn'}`} aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block text-[0.88rem]">{a.alert?.text}</span>
                        <span className="mono text-[0.72rem] text-muted">
                          {a.code} · {a.alert?.level === 'critico' ? 'Crítico' : 'Atenção'}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function RouteLine({ shipment }: { shipment: Shipment }) {
  const reduce = useReducedMotion()
  const idx = STATUS_ORDER.indexOf(shipment.status)
  return (
    <div className="mt-5">
      <div className="flex justify-between text-[0.85rem]">
        <span>{shipment.origin}</span>
        <span className="text-right">{shipment.destination}</span>
      </div>
      <div className="relative mt-3 h-[3px] rounded-full bg-line">
        <motion.div className={`absolute inset-y-0 left-0 rounded-full ${shipment.status === 'entregue' ? 'bg-ok' : 'bg-primary'}`} initial={{ width: 0 }} animate={{ width: `${shipment.progress}%` }} transition={{ duration: reduce ? 0 : 0.9, ease: EASE_OUT }} />
        <motion.span
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-primary"
          initial={{ left: 0 }}
          animate={{ left: `${shipment.progress}%` }}
          transition={{ duration: reduce ? 0 : 0.9, ease: EASE_OUT }}
          aria-hidden="true"
        />
      </div>
      <ol className="mono mt-5 grid grid-cols-4 gap-1 text-[0.64rem] uppercase tracking-[0.06em]" aria-label="Linha do tempo da remessa">
        {STATUS_ORDER.map((st, i) => (
          <li key={st} className={`border-t-2 pt-2 ${i <= idx ? 'border-primary text-text' : 'border-line text-muted'}`}>
            {STATUS_LABEL[st].replace('Aguardando ', '')}
            <span className="sr-only">{i < idx ? ' (concluída)' : i === idx ? ' (atual)' : ' (pendente)'}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-[0.82rem] text-muted">
        Previsão: <span className="mono text-text">{shipment.eta}</span>
      </p>
    </div>
  )
}
