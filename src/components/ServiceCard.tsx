import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import type { Service } from '../data/services'
import { unsplash, unsplashSrcSet } from '../lib/img'
import { DUR, EASE_OUT, VIEWPORT } from '../lib/motion'
import { useQuote } from '../lib/quote-context'

const SPAN: Record<Service['layout'], string> = {
  feature: 'md:col-span-2 lg:col-span-7 lg:row-span-2',
  tall: 'lg:col-span-5',
  compact: 'lg:col-span-5',
  wide: 'md:col-span-2 lg:col-span-8',
  band: 'md:col-span-2 lg:col-span-12',
}

/** Altura/proporção da área de imagem por variante (evita layout shift). */
const MEDIA: Record<Service['layout'], string> = {
  feature: 'absolute inset-0',
  tall: 'relative aspect-[16/10] lg:aspect-auto lg:h-[56%]',
  compact: 'relative aspect-[16/9] lg:aspect-auto lg:h-[44%]',
  wide: 'relative aspect-[16/10] md:aspect-auto md:h-full md:w-[52%] md:order-2',
  band: 'relative aspect-[16/10] md:aspect-auto md:h-full md:w-[58%]',
}

const SIZES: Record<Service['layout'], string> = {
  feature: '(min-width: 1024px) 56vw, 100vw',
  tall: '(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw',
  compact: '(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw',
  wide: '(min-width: 1024px) 34vw, 52vw',
  band: '(min-width: 1024px) 56vw, 58vw',
}

export function ServiceCard({ service, order }: { service: Service; order: number }) {
  const { requestQuote } = useQuote()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 120, damping: 20 })
  const y = useSpring(my, { stiffness: 120, damping: 20 })

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width - 0.5) * -18)
    my.set(((e.clientY - r.top) / r.height - 0.5) * -14)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const isFeature = service.layout === 'feature'
  const isRow = service.layout === 'wide' || service.layout === 'band'
  const titleId = `svc-${service.id}`

  return (
    <motion.article
      ref={ref}
      aria-labelledby={titleId}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      initial={{ opacity: 0, y: reduce ? 0 : 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.slow, ease: EASE_OUT, delay: (order % 3) * 0.08 }}
      className={`group relative flex overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface shadow-card ${
        isFeature ? 'force-dark min-h-[520px] flex-col justify-end text-text sm:min-h-[580px] lg:min-h-0' : ''
      } ${isRow ? 'flex-col md:flex-row' : 'flex-col'} ${service.id === 'distribuicao' ? 'lg:col-span-4' : SPAN[service.layout]}`}
    >
      {/* Imagem com revelação por máscara + resposta ao cursor */}
      <motion.div
        className={`overflow-hidden ${MEDIA[service.layout]}`}
        initial={reduce ? false : { clipPath: 'inset(0% 0% 100% 0%)' }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        viewport={VIEWPORT}
        transition={{ duration: DUR.cinematic, ease: EASE_OUT, delay: 0.1 + (order % 3) * 0.08 }}
      >
        <motion.img
          src={unsplash(service.photo, 1080)}
          srcSet={unsplashSrcSet(service.photo, [480, 768, 1080, 1440])}
          sizes={SIZES[service.layout]}
          alt={service.alt}
          loading="lazy"
          decoding="async"
          style={{ x, y }}
          className="absolute inset-[-14px] h-[calc(100%+28px)] w-[calc(100%+28px)] max-w-none object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
        />
        {isFeature && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,rgb(11_16_23/0.94)_8%,rgb(11_16_23/0.55)_45%,rgb(11_16_23/0.05)_80%)]"
          />
        )}
        <span
          className={`mono absolute left-4 top-4 rounded-full px-2.5 py-1 text-[0.68rem] tracking-[0.14em] ${
            isFeature ? 'bg-white/10 text-white backdrop-blur-md' : 'bg-[rgb(11_16_23/0.6)] text-white backdrop-blur-md'
          }`}
        >
          {service.index}
        </span>
      </motion.div>

      {/* Conteúdo */}
      <div
        className={`relative flex flex-col gap-4 p-6 sm:p-7 ${isFeature ? '' : 'flex-1'} ${isFeature ? 'lg:p-10' : ''} ${
          isRow ? 'md:justify-center md:p-9 lg:p-11' : ''
        }`}
      >
        <h3
          id={titleId}
          className={`font-display font-semibold tracking-[-0.035em] ${
            isFeature ? 'text-[clamp(2rem,3.6vw,3.4rem)] leading-[0.98]' : 'text-[clamp(1.5rem,2.2vw,2.1rem)] leading-[1.02]'
          } ${isFeature ? 'max-w-[14ch]' : ''}`}
        >
          {service.title}
        </h3>
        <p className={`max-w-[48ch] text-[0.98rem] leading-relaxed text-muted ${isFeature ? 'sm:text-[1.05rem]' : ''}`}>
          {service.summary}
        </p>

        {/* Expansão suave: visível no toque; em dispositivos com hover, abre no hover/foco */}
        <div className="grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)] [@media(hover:hover)]:grid-rows-[0fr] [@media(hover:hover)]:group-hover:grid-rows-[1fr] [@media(hover:hover)]:group-focus-within:grid-rows-[1fr]">
          <ul className="flex min-h-0 flex-wrap gap-2 overflow-hidden" aria-label={`Destaques de ${service.title}`}>
            {service.points.map((p) => (
              <li
                key={p}
                className="mono rounded-full border border-line px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.1em] text-muted"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className={`mt-auto pt-2 ${isRow ? 'md:mt-4' : ''}`}>
          <button
            type="button"
            onClick={() => requestQuote(service.id, service.modality)}
            className="group/cta inline-flex min-h-11 items-center gap-2 rounded-full text-[0.95rem] font-medium text-text transition-colors hover:text-primary-ink"
          >
            <span className="relative">
              Cotar {service.title.toLowerCase()}
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/cta:scale-x-100" />
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-full border border-line-strong transition-[background-color,border-color,transform] duration-300 group-hover/cta:rotate-45 group-hover/cta:border-primary group-hover/cta:bg-primary group-hover/cta:text-on-primary">
              <ArrowUpRight size={15} aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
    </motion.article>
  )
}
