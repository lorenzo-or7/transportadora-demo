import { motion, useReducedMotion } from 'motion/react'
import { EASE_INOUT } from '../lib/motion'

const ROUTE = 'M14 62 C 60 62, 70 20, 120 24 S 190 70, 236 30 L 266 22'

/**
 * Interface operacional sobreposta à hero. Puramente demonstrativa —
 * não reflete nenhum veículo real, e está rotulada como tal.
 */
export function OperationWidget({ compact = false }: { compact?: boolean }) {
  const reduce = useReducedMotion()

  if (compact) {
    return (
      <div
        className="flex items-center gap-3 rounded-2xl border border-white/12 bg-[rgb(11_16_23/0.55)] px-4 py-3 backdrop-blur-md"
        role="group"
        aria-label="Painel ilustrativo: operação em movimento (dados demonstrativos)"
      >
        <span className="pulse-dot h-2 w-2 shrink-0 rounded-full bg-ok text-ok" aria-hidden="true" />
        <span className="mono text-[0.68rem] uppercase tracking-[0.16em] text-[#c9d2dd]">
          Operação em movimento
        </span>
        <span className="mono ml-auto text-[0.62rem] uppercase tracking-[0.14em] text-[#8f9bab]">Demo</span>
      </div>
    )
  }

  return (
    <figure
      className="w-[300px] rounded-[20px] border border-white/12 bg-[rgb(11_16_23/0.58)] p-4 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)] backdrop-blur-md"
      aria-label="Painel ilustrativo: operação em movimento (dados demonstrativos)"
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="pulse-dot h-2 w-2 rounded-full bg-ok text-ok" aria-hidden="true" />
          <span className="mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-white">
            Operação em movimento
          </span>
        </span>
        <span className="mono rounded-full border border-dashed border-white/25 px-2 py-0.5 text-[0.58rem] uppercase tracking-[0.14em] text-[#a6b2c1]">
          Demo
        </span>
      </div>

      <svg viewBox="0 0 280 84" className="mt-4 h-[84px] w-full" aria-hidden="true">
        {/* grade de referência */}
        {[21, 42, 63].map((y) => (
          <line key={y} x1="0" x2="280" y1={y} y2={y} stroke="rgb(255 255 255 / 0.06)" />
        ))}
        <path d={ROUTE} fill="none" stroke="rgb(255 255 255 / 0.14)" strokeWidth="1.5" className="dash-flow" />
        <motion.path
          d={ROUTE}
          fill="none"
          stroke="#F5A623"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 0.62 : 0 }}
          animate={{ pathLength: 0.62 }}
          transition={{ duration: 2.2, ease: EASE_INOUT, delay: 1.6 }}
        />
        <circle cx="14" cy="62" r="4" fill="#0B1017" stroke="#F5F7FA" strokeWidth="1.5" />
        <circle cx="266" cy="22" r="4" fill="#0B1017" stroke="#A6B2C1" strokeWidth="1.5" />
        {/* marcador do veículo */}
        <g>
          <circle r="7" fill="rgb(245 166 35 / 0.22)" />
          <circle r="3.5" fill="#F5A623" />
          {reduce ? (
            <animateMotion dur="1s" path={ROUTE} keyPoints="0.6;0.6" keyTimes="0;1" fill="freeze" calcMode="linear" />
          ) : (
            <animateMotion dur="9s" repeatCount="indefinite" path={ROUTE} keyPoints="0.18;0.6;0.18" keyTimes="0;0.5;1" calcMode="spline" keySplines="0.65 0 0.35 1;0.65 0 0.35 1" />
          )}
        </g>
      </svg>

      <dl className="mono mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-white/10 pt-3 text-[0.68rem] uppercase tracking-[0.1em]">
        <div>
          <dt className="text-[#8f9bab]">Rota</dt>
          <dd className="mt-0.5 text-white">CPS → CWB</dd>
        </div>
        <div>
          <dt className="text-[#8f9bab]">Etapa</dt>
          <dd className="mt-0.5 text-white">03 / 05</dd>
        </div>
        <div className="col-span-2 flex items-end justify-between">
          <div>
            <dt className="text-[#8f9bab]">Status</dt>
            <dd className="mt-0.5 text-primary">Em transporte</dd>
          </div>
          <div className="flex h-5 items-end gap-[3px]" aria-hidden="true">
            {[0.5, 0.9, 0.65, 1, 0.75, 0.4].map((h, i) => (
              <motion.span
                key={i}
                className="w-[3px] origin-bottom rounded-full bg-white/50"
                style={{ height: `${h * 100}%` }}
                animate={reduce ? undefined : { scaleY: [1, 0.45, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.14, ease: 'easeInOut' }}
              />
            ))}
          </div>
        </div>
      </dl>
      <figcaption className="mt-3 text-[0.7rem] leading-snug text-[#8f9bab]">
        Ilustração de interface. Sem dados reais de veículos.
      </figcaption>
    </figure>
  )
}
