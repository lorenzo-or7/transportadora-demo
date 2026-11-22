import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { HERO_VIDEO } from '../data/assets'
import { EASE_OUT } from '../lib/motion'
import { useQuote } from '../lib/quote-context'
import { Button } from '../components/ui/Button'
import { MaskText } from '../components/ui/Reveal'
import { OperationWidget } from '../components/OperationWidget'

function useHeroVideoSrc(): string | null {
  const reduce = useReducedMotion()
  const [src, setSrc] = useState<string | null>(null)
  useEffect(() => {
    if (reduce) return setSrc(null)
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (conn?.saveData) return setSrc(null)
    setSrc(window.matchMedia('(min-width: 768px)').matches ? HERO_VIDEO.desktop : HERO_VIDEO.mobile)
  }, [reduce])
  return src
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { requestQuote } = useQuote()
  const videoSrc = useHeroVideoSrc()
  const [videoReady, setVideoReady] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.16])
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const contentY = useTransform(scrollYProgress, [0, 0.7], ['0%', '-14%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const veil = useTransform(scrollYProgress, [0, 1], [0, 0.65])

  return (
    <section
      id="topo"
      ref={ref}
      aria-labelledby="hero-title"
      className="force-dark relative isolate flex min-h-[640px] h-[100svh] flex-col overflow-hidden bg-bg text-text"
    >
      {/* Mídia */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10 will-change-transform"
        style={reduce ? undefined : { scale: mediaScale, y: mediaY }}
        initial={reduce ? false : { scale: 1.18, opacity: 0 }}
        animate={reduce ? undefined : { opacity: 1 }}
        transition={{ duration: 1.8, ease: EASE_OUT }}
      >
        <img
          src={HERO_VIDEO.poster}
          alt=""
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[60%_50%]"
          width={1280}
          height={720}
        />
        {videoSrc && !videoFailed && (
          <video
            className={`absolute inset-0 h-full w-full object-cover object-[60%_50%] transition-opacity duration-1000 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
            src={videoSrc}
            poster={HERO_VIDEO.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoFailed(true)}
          />
        )}
      </motion.div>

      {/* Sobreposição escura controlada: legibilidade do texto à esquerda + transição para a próxima seção */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(11_16_23/0.88)_0%,rgb(11_16_23/0.62)_42%,rgb(11_16_23/0.18)_100%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-[linear-gradient(to_top,rgb(11_16_23/0.95),transparent)]" />
      <motion.div aria-hidden="true" className="absolute inset-0 -z-10 bg-bg" style={{ opacity: veil }} />

      <motion.div
        className="container-x relative flex flex-1 flex-col justify-end pb-24 pt-28 sm:pb-28 lg:pb-24"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <motion.p
              className="eyebrow mb-6 flex items-center gap-3 text-[#c9d2dd]"
              initial={{ opacity: 0, y: reduce ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.2 }}
            >
              <span className="h-px w-10 bg-primary" aria-hidden="true" />
              Transporte rodoviário · Logística integrada
            </motion.p>

            <MaskText
              as="h1"
              id="hero-title"
              immediate
              delay={0.35}
              className="display-xl max-w-[13ch]"
              lines={[
                'Movemos o que',
                'faz o mundo',
                <>
                  avançar<span className="text-primary">.</span>
                </>,
              ]}
            />

            <motion.p
              className="mt-8 max-w-[46ch] text-[1.05rem] leading-relaxed text-[#c9d2dd] sm:text-lg"
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.95 }}
            >
              Soluções inteligentes em transporte e logística para conectar negócios, otimizar operações e entregar
              resultados.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col gap-3 xs:flex-row xs:flex-wrap"
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: 1.1 }}
            >
              <Button size="lg" magnetic onClick={() => requestQuote()} icon={<ArrowUpRight size={18} />}>
                Solicitar cotação
              </Button>
              <Button href="#servicos" variant="secondary" size="lg" magnetic icon={<ArrowDown size={18} />}>
                Explorar soluções
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="hidden lg:col-span-4 lg:flex lg:justify-end"
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT, delay: 1.35 }}
          >
            <OperationWidget />
          </motion.div>
        </div>

        <motion.div
          className="mt-8 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.35 }}
        >
          <OperationWidget compact />
        </motion.div>
      </motion.div>

      {/* Indicador de scroll */}
      <a
        href="#servicos"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 rounded-md text-[#c9d2dd] sm:flex"
        aria-label="Rolar para os serviços"
      >
        <span className="mono text-[0.65rem] uppercase tracking-[0.22em]">Role</span>
        <span className="relative h-10 w-px overflow-hidden bg-white/20" aria-hidden="true">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-primary [animation:scroll-cue_2.2s_cubic-bezier(.65,0,.35,1)_infinite]" />
        </span>
      </a>
    </section>
  )
}
