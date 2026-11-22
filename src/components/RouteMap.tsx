import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, MapPin } from 'lucide-react'
import { CITY_POINTS, MAP_H, MAP_W, STATES, type RegionId } from '../data/brazil-map'
import { REGIONS, type CityKey } from '../data/regions'
import { EASE_INOUT, EASE_OUT } from '../lib/motion'
import { DemoTag } from './ui/misc'
import { useMediaQuery } from '../lib/hooks'

const CITY_NAME: Record<CityKey, string> = {
  SP: 'São Paulo',
  REC: 'Recife',
  MAO: 'Manaus',
  GYN: 'Goiânia',
  CWB: 'Curitiba',
  BEL: 'Belém',
  SSA: 'Salvador',
  POA: 'Porto Alegre',
  BH: 'Belo Horizonte',
  CGB: 'Cuiabá',
  FOR: 'Fortaleza',
}

function curve(a: readonly number[], b: readonly number[]): string {
  const [x1 = 0, y1 = 0] = a
  const [x2 = 0, y2 = 0] = b
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const k = 0.22
  return `M${x1},${y1} Q${mx - dy * k},${my + dx * k} ${x2},${y2}`
}

export function RouteMap() {
  const reduce = useReducedMotion()
  const [selected, setSelected] = useState<RegionId>('SE')
  const [hover, setHover] = useState<RegionId | null>(null)
  const small = useMediaQuery('(max-width: 640px)')
  const region = REGIONS.find((r) => r.id === selected) ?? REGIONS[0]!

  const groups = useMemo(() => {
    const m = new Map<RegionId, typeof STATES>()
    for (const s of STATES) m.set(s.region, [...(m.get(s.region) ?? []), s])
    return m
  }, [])

  const hub = CITY_POINTS[region.hub]
  const linkPaths = region.links.map((c) => ({ key: c, d: curve(hub, CITY_POINTS[c]) }))
  const activeCities = new Set<CityKey>([region.hub, ...region.links])

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
      {/* Seletor de regiões (controle principal, acessível por teclado) */}
      <div className="lg:col-span-12">
        <div role="tablist" aria-label="Regiões" className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] sm:mx-0 sm:flex-wrap sm:px-0">
          {REGIONS.map((r, i) => {
            const active = r.id === selected
            return (
              <button
                key={r.id}
                type="button"
                role="tab"
                id={`tab-${r.id}`}
                aria-selected={active}
                aria-controls="region-panel"
                tabIndex={active ? 0 : -1}
                onClick={() => setSelected(r.id)}
                onKeyDown={(e) => {
                  const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
                  if (!dir) return
                  e.preventDefault()
                  const n = (i + dir + REGIONS.length) % REGIONS.length
                  const next = REGIONS[n]
                  if (!next) return
                  setSelected(next.id)
                  document.getElementById(`tab-${next.id}`)?.focus()
                }}
                className={`relative inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-[0.9rem] transition-colors duration-200 ${
                  active ? 'border-primary text-text' : 'border-line text-muted hover:border-line-strong hover:text-text'
                }`}
              >
                {active && (
                  <motion.span layoutId="region-pill" className="absolute inset-0 rounded-full bg-[color-mix(in_srgb,var(--primary)_13%,transparent)]" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />
                )}
                <span className="mono relative text-[0.7rem] text-muted">{r.id}</span>
                <span className="relative">{r.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Mapa */}
      <div className="grid-texture relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface lg:col-span-7">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <span className="mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">Rede · Brasil</span>
          <DemoTag>Rede ilustrativa</DemoTag>
        </div>
        <svg
          viewBox={`-10 -10 ${MAP_W + 20} ${MAP_H + 20}`}
          className="mx-auto block h-auto w-full max-w-[640px] touch-manipulation p-3 sm:p-6"
          role="group"
          aria-label={`Mapa do Brasil. Região selecionada: ${region.name}`}
        >
          {[...groups.entries()].map(([rid, states]) => {
            const isSel = rid === selected
            const isHover = rid === hover && !isSel
            const info = REGIONS.find((r) => r.id === rid)
            return (
              <g
                key={rid}
                role="button"
                tabIndex={0}
                aria-pressed={isSel}
                aria-label={`Selecionar região ${info?.name ?? rid}`}
                onClick={() => setSelected(rid)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelected(rid)
                  }
                }}
                onPointerEnter={() => setHover(rid)}
                onPointerLeave={() => setHover(null)}
                className="cursor-pointer outline-none [&:focus-visible_path]:stroke-[var(--primary)] [&:focus-visible_path]:stroke-[2.5]"
              >
                {states.map((s) => (
                  <path
                    key={s.uf}
                    d={s.d}
                    strokeLinejoin="round"
                    className="transition-[fill,stroke] duration-500"
                    style={{
                      fill: isSel
                        ? 'color-mix(in srgb, var(--primary) 34%, var(--surface))'
                        : isHover
                          ? 'color-mix(in srgb, var(--text) 14%, var(--surface))'
                          : 'var(--elevated)',
                      stroke: isSel ? 'color-mix(in srgb, var(--primary) 70%, var(--surface))' : 'var(--surface)',
                      strokeWidth: isSel ? 1.2 : 1,
                    }}
                  >
                    <title>{s.name}</title>
                  </path>
                ))}
              </g>
            )
          })}

          {/* Conexões animadas */}
          <g pointerEvents="none">
            <AnimatePresence>
              {linkPaths.map((l, i) => (
                <g key={`${selected}-${l.key}`}>
                  <motion.path
                    d={l.d}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    initial={{ pathLength: reduce ? 1 : 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 1.1, ease: EASE_INOUT, delay: reduce ? 0 : i * 0.12 }}
                  />
                  {!reduce && (
                    <circle r="3.5" fill="var(--primary)">
                      <animateMotion dur={`${2.6 + i * 0.4}s`} repeatCount="indefinite" path={l.d} begin={`${1 + i * 0.12}s`} />
                    </circle>
                  )}
                </g>
              ))}
            </AnimatePresence>
          </g>

          {/* Polos */}
          <g pointerEvents="none">
            {(Object.keys(CITY_POINTS) as CityKey[]).map((c) => {
              const [x, y] = CITY_POINTS[c]
              const isHub = c === region.hub
              const isActive = activeCities.has(c)
              return (
                <g key={c} transform={`translate(${x} ${y})`}>
                  {isHub && !reduce && (
                    <motion.circle
                      r={10}
                      fill="none"
                      stroke="var(--primary)"
                      initial={{ scale: 0.6, opacity: 0.9 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}
                  <circle
                    r={(isHub ? 7 : isActive ? 4.5 : 3) * (small ? 1.5 : 1)}
                    className="transition-all duration-500"
                    style={{
                      fill: isHub ? 'var(--primary)' : isActive ? 'var(--text)' : 'var(--muted)',
                      stroke: 'var(--surface)',
                      strokeWidth: 2,
                    }}
                  />
                  {isActive && (
                    <text
                      x={(isHub ? 12 : 8) * (small ? 1.5 : 1)}
                      y={small ? 7 : 4}
                      className="mono"
                      style={{ fontSize: small ? (isHub ? 25 : 21) : isHub ? 15 : 12.5, fill: 'var(--text)', paintOrder: 'stroke', stroke: 'var(--surface)', strokeWidth: small ? 6 : 4, fontWeight: isHub ? 500 : 400 }}
                    >
                      {CITY_NAME[c]}
                    </text>
                  )}
                </g>
              )
            })}
          </g>
        </svg>

        {/* Legenda operacional */}
        <ul className="mono flex flex-wrap gap-x-5 gap-y-2 border-t border-line px-5 py-3 text-[0.7rem] uppercase tracking-[0.1em] text-muted" aria-label="Legenda">
          <li className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" /> Polo regional
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-text" aria-hidden="true" /> Ponto conectado
          </li>
          <li className="flex items-center gap-2">
            <span className="h-[2px] w-5 rounded bg-primary" aria-hidden="true" /> Conexão
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2.5 w-3.5 rounded-[3px] bg-[color-mix(in_srgb,var(--primary)_34%,var(--surface))]" aria-hidden="true" /> Região selecionada
          </li>
        </ul>
      </div>

      {/* Painel contextual */}
      <div
        id="region-panel"
        role="tabpanel"
        aria-labelledby={`tab-${region.id}`}
        aria-live="polite"
        className="flex flex-col rounded-[var(--radius-lg)] border border-line bg-surface p-6 sm:p-8 lg:col-span-5"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={region.id}
            initial={{ opacity: 0, y: reduce ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -10 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="flex flex-1 flex-col"
          >
            <p className="mono text-[0.72rem] uppercase tracking-[0.14em] text-primary-ink">Região {region.id}</p>
            <h3 className="mt-2 font-display text-[clamp(2rem,3.4vw,3rem)] font-semibold leading-none tracking-[-0.04em]">{region.name}</h3>
            <p className="mt-4 text-muted">{region.focus}</p>

            <dl className="mt-8 grid gap-5 border-t border-line pt-6">
              <div className="flex items-start gap-3">
                <MapPin size={17} className="mt-0.5 shrink-0 text-primary-ink" aria-hidden="true" />
                <div>
                  <dt className="text-[0.8rem] text-muted">Polo de exemplo</dt>
                  <dd className="font-medium">{region.hubLabel}</dd>
                </div>
              </div>
              <div>
                <dt className="text-[0.8rem] text-muted">Conexões ilustradas</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {region.links.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[0.85rem]">
                      <ArrowRight size={13} className="text-primary-ink" aria-hidden="true" />
                      {CITY_NAME[c]}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-[0.8rem] text-muted">Modalidades no exemplo</dt>
                <dd className="mono mt-2 flex flex-wrap gap-2 text-[0.75rem] uppercase tracking-[0.08em]">
                  {region.modalities.map((m) => (
                    <span key={m} className="rounded-[6px] bg-elevated px-2.5 py-1.5">
                      {m}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>

            <p className="mt-auto border-t border-dashed border-line-strong pt-5 text-[0.82rem] leading-relaxed text-muted">
              {region.note} A cobertura real é definida por cada transportadora e não está representada aqui.
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
