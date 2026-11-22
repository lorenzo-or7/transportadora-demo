import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { PHOTOS } from '../data/assets'
import { REGIONS } from '../data/regions'
import { SERVICES } from '../data/services'
import { STAGES } from '../data/tracking'
import { unsplash, unsplashSrcSet } from '../lib/img'
import { AnimatedCounter, DemoTag } from '../components/ui/misc'
import { FadeIn, ImageReveal, MaskText } from '../components/ui/Reveal'

const INDICATORS = [
  { value: REGIONS.length, label: 'Regiões na rede de exemplo', note: 'Cobertura regional' },
  { value: 3, label: 'Modalidades operacionais', note: 'Fracionada · dedicada · expressa' },
  { value: STAGES.length, label: 'Etapas monitoradas', note: 'Da coleta à entrega' },
  { value: SERVICES.length, label: 'Tipos de solução', note: 'Transporte a armazenagem' },
]

export function Operations() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // revelação da fotografia sincronizada com o scroll
  const clip = useTransform(scrollYProgress, [0, 0.4], ['inset(18% 12% 18% 0% round 28px)', 'inset(0% 0% 0% 0% round 28px)'])
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1.02])

  return (
    <section id="sobre" aria-labelledby="sobre-title" className="section-y relative border-t border-line">
      <div ref={ref} className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
        {/* Fotografia dominante */}
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-24">
            <motion.div
              className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-elevated sm:aspect-[5/4] lg:aspect-auto lg:h-[calc(100svh-8rem)] lg:max-h-[820px]"
              style={reduce ? undefined : { clipPath: clip }}
            >
              <motion.img
                src={unsplash(PHOTOS.loadingDocks, 1440)}
                srcSet={unsplashSrcSet(PHOTOS.loadingDocks)}
                sizes="(min-width: 1024px) 58vw, 100vw"
                alt="Docas de carga de um centro de distribuição com portas seccionais numeradas"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
                style={reduce ? undefined : { scale }}
              />
              <div className="force-dark absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-[linear-gradient(to_top,rgb(11_16_23/0.85),transparent)] p-5 pt-16 sm:p-7">
                <p className="mono text-[0.72rem] uppercase tracking-[0.14em] text-text">Centro de distribuição · docas</p>
                <p className="mono text-[0.72rem] text-muted">Fotografia ilustrativa</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Conteúdo lateral */}
        <div className="flex flex-col lg:col-span-5 lg:pt-6">
          <FadeIn y={10}>
            <p className="eyebrow mb-5 flex items-center gap-3">
              <span className="text-primary-ink">05</span>
              <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
              <span>Built for precision</span>
            </p>
          </FadeIn>
          <MaskText id="sobre-title" lines={['Estrutura feita', 'para precisão.']} className="display-lg" />
          <FadeIn delay={0.12}>
            <p className="lede mt-6">
              Frota, docas, armazéns e equipe trabalhando no mesmo ritmo. Cada carga passa por etapas definidas, com
              conferência na coleta, rota planejada e registro na entrega.
            </p>
          </FadeIn>

          <div className="mt-10 flex items-center justify-between border-t border-line pt-5">
            <p className="text-[0.85rem] text-muted">Estrutura deste protótipo</p>
            <DemoTag>Números de exemplo</DemoTag>
          </div>
          <dl className="mt-2 grid grid-cols-2">
            {INDICATORS.map((it, i) => (
              <FadeIn key={it.label} delay={0.08 * i} className={`border-b border-line py-6 ${i % 2 === 0 ? 'pr-4' : 'border-l border-line pl-5'}`}>
                <dt className="sr-only">{it.label}</dt>
                <dd>
                  <AnimatedCounter value={it.value} className="font-display text-[clamp(2.6rem,4.4vw,3.8rem)] font-semibold leading-none tracking-[-0.05em]" />
                  <p className="mt-3 text-[0.95rem] font-medium leading-snug">{it.label}</p>
                  <p className="mono mt-1 text-[0.7rem] uppercase tracking-[0.08em] text-muted">{it.note}</p>
                </dd>
              </FadeIn>
            ))}
          </dl>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <ImageReveal
              src={unsplash(PHOTOS.warehouseShelves, 800)}
              srcSet={unsplashSrcSet(PHOTOS.warehouseShelves, [400, 600, 800, 1080])}
              sizes="(min-width: 1024px) 20vw, 50vw"
              alt="Estantes de armazém com caixas de papelão organizadas por endereço"
              className="aspect-[3/4] rounded-[18px]"
              from="left"
            />
            <ImageReveal
              src={unsplash(PHOTOS.aerialTrucks, 800)}
              srcSet={unsplashSrcSet(PHOTOS.aerialTrucks, [400, 600, 800, 1080])}
              sizes="(min-width: 1024px) 20vw, 50vw"
              alt="Vista aérea de carretas estacionadas lado a lado em pátio logístico"
              className="mt-12 aspect-[3/4] rounded-[18px]"
              from="right"
              delay={0.12}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
