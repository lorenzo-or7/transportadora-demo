import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { PHOTOS } from '../data/assets'
import { unsplash, unsplashSrcSet } from '../lib/img'
import { useMediaQuery } from '../lib/hooks'
import { FadeIn, ImageReveal, MaskText } from '../components/ui/Reveal'

const PILLARS = [
  {
    n: '01',
    title: 'Planejamento inteligente',
    lead: 'Operações orientadas por eficiência.',
    text: 'Rota, janela e veículo definidos antes da coleta, para reduzir trechos vazios e esperas na doca.',
    photo: PHOTOS.aerialYard,
    alt: 'Vista aérea de pátio com carretas organizadas em fileiras',
  },
  {
    n: '02',
    title: 'Visibilidade operacional',
    lead: 'Acompanhamento das etapas logísticas.',
    text: 'Cada movimentação registrada, do embarque ao comprovante, e acessível a quem precisa da informação.',
    photo: PHOTOS.tunnelNight,
    alt: 'Caminhão atravessando túnel iluminado durante a noite',
  },
  {
    n: '03',
    title: 'Soluções flexíveis',
    lead: 'Estratégias adaptadas a cada operação.',
    text: 'Fracionado, dedicado ou integrado à armazenagem: o desenho muda conforme volume, prazo e tipo de carga.',
    photo: PHOTOS.racksBlue,
    alt: 'Corredor de estantes porta-paletes azuis em armazém',
  },
  {
    n: '04',
    title: 'Atendimento próximo',
    lead: 'Comunicação direta e transparente.',
    text: 'Um contato que conhece a sua operação e avisa antes, não depois, quando algo sai do planejado.',
    photo: PHOTOS.forkliftTrailer,
    alt: 'Operador de empilhadeira carregando carga dentro de um baú',
  },
] as const

export function WhyUs() {
  const desktop = useMediaQuery('(min-width: 1024px)')
  const reduce = useReducedMotion()
  const horizontal = desktop && !reduce

  return (
    <section id="diferenciais" aria-labelledby="diferenciais-title" className="relative border-t border-line">
      {horizontal ? <HorizontalPillars /> : <VerticalPillars />}
    </section>
  )
}

function Heading() {
  return (
    <div>
      <FadeIn y={10}>
        <p className="eyebrow mb-5 flex items-center gap-3">
          <span className="text-primary-ink">07</span>
          <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
          <span>Difference in motion</span>
        </p>
      </FadeIn>
      <MaskText id="diferenciais-title" lines={['Quatro pilares', 'que movem a', 'operação.']} className="display-lg" />
    </div>
  )
}

/* ---------- Desktop: trilho horizontal ligado ao scroll (sem bloquear a rolagem) ---------- */
function HorizontalPillars() {
  const outer = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return
      setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (track.current) ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: outer, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  const x = useTransform(smooth, [0, 1], [0, -distance])
  const bar = useTransform(smooth, [0, 1], ['0%', '100%'])

  return (
    <div ref={outer} style={{ height: `calc(100vh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex w-max items-stretch gap-6 pl-[var(--gutter)] pr-[var(--gutter)] will-change-transform">
          <div className="flex w-[34vw] max-w-[520px] shrink-0 flex-col justify-between py-4 pr-8">
            <Heading />
            <div>
              <p className="lede max-w-[34ch]">O que separa uma entrega no prazo de uma dor de cabeça raramente é o caminhão. É o método.</p>
              <div className="mt-8 h-px w-full overflow-hidden bg-line" aria-hidden="true">
                <motion.div className="h-full bg-primary" style={{ width: bar }} />
              </div>
              <p className="mono mt-3 text-[0.7rem] uppercase tracking-[0.14em] text-muted">Continue rolando</p>
            </div>
          </div>
          {PILLARS.map((p, i) => (
            <PillarPanel key={p.n} pillar={p} index={i} progress={smooth} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function PillarPanel({ pillar, index, progress }: { pillar: (typeof PILLARS)[number]; index: number; progress: MotionValue<number> }) {
  // cada painel tem uma janela própria do progresso para animar máscara e imagem
  const start = index / (PILLARS.length + 0.6)
  const end = start + 0.32
  const clip = useTransform(progress, [Math.max(0, start - 0.12), end], ['inset(0% 0% 0% 100%)', 'inset(0% 0% 0% 0%)'])
  const imgX = useTransform(progress, [start - 0.2, end + 0.3], ['12%', '-6%'])
  const titleY = useTransform(progress, [Math.max(0, start - 0.1), end], ['40%', '0%'])

  return (
    <article className="relative flex h-[min(78vh,720px)] w-[min(64vw,880px)] shrink-0 overflow-hidden rounded-[28px] border border-line bg-surface" aria-labelledby={`pillar-${pillar.n}`}>
      <motion.div className="relative w-[52%] shrink-0 overflow-hidden bg-elevated" style={{ clipPath: clip }}>
        <motion.img
          src={unsplash(pillar.photo, 1080)}
          srcSet={unsplashSrcSet(pillar.photo, [600, 900, 1200])}
          sizes="34vw"
          alt={pillar.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-[124%] max-w-none object-cover"
          style={{ x: imgX }}
        />
      </motion.div>
      <div className="flex flex-1 flex-col justify-between p-8 xl:p-10">
        <span className="font-display text-[clamp(4rem,7vw,7rem)] font-semibold leading-none tracking-[-0.06em] text-[color-mix(in_srgb,var(--text)_14%,transparent)]" aria-hidden="true">
          {pillar.n}
        </span>
        <div>
          <div className="overflow-hidden">
            <motion.h3 id={`pillar-${pillar.n}`} style={{ y: titleY }} className="font-display text-[clamp(1.8rem,2.5vw,2.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
              {pillar.title}
            </motion.h3>
          </div>
          <p className="mt-4 font-medium text-primary-ink">{pillar.lead}</p>
          <p className="mt-3 text-muted">{pillar.text}</p>
        </div>
      </div>
    </article>
  )
}

/* ---------- Mobile/tablet (e movimento reduzido): cards verticais ---------- */
function VerticalPillars() {
  return (
    <div className="container-x section-y">
      <Heading />
      <p className="lede mt-6 max-w-[42ch]">O que separa uma entrega no prazo de uma dor de cabeça raramente é o caminhão. É o método.</p>
      <ol className="mt-12 grid gap-5 md:grid-cols-2">
        {PILLARS.map((p, i) => (
          <FadeIn as="li" key={p.n} delay={(i % 2) * 0.08} className="overflow-hidden rounded-[22px] border border-line bg-surface">
            <ImageReveal
              src={unsplash(p.photo, 900)}
              srcSet={unsplashSrcSet(p.photo, [480, 768, 1080])}
              sizes="(min-width: 768px) 50vw, 100vw"
              alt={p.alt}
              className="aspect-[16/10]"
              parallax={false}
            />
            <div className="p-6">
              <p className="mono text-[0.75rem] text-primary-ink">{p.n}</p>
              <h3 className="mt-2 font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.03em]">{p.title}</h3>
              <p className="mt-2 font-medium">{p.lead}</p>
              <p className="mt-2 text-muted">{p.text}</p>
            </div>
          </FadeIn>
        ))}
      </ol>
    </div>
  )
}
