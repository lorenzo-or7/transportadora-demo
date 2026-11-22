import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight, MessageCircle } from 'lucide-react'
import { site } from '../config/site'
import { PHOTOS } from '../data/assets'
import { unsplash, unsplashSrcSet } from '../lib/img'
import { EASE_OUT, VIEWPORT } from '../lib/motion'
import { useQuote } from '../lib/quote-context'
import { Button } from '../components/ui/Button'
import { MaskText } from '../components/ui/Reveal'

/** ContactCTA — chamada final de alto impacto. */
export function ContactCTA() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { requestQuote } = useQuote()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const frame = useTransform(scrollYProgress, [0, 0.35], ['inset(6% 4% 0% 4% round 32px)', 'inset(0% 0% 0% 0% round 0px)'])

  const specialistHref = site.whatsappNumber
    ? `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(`Olá! Gostaria de falar com um especialista da ${site.brand} sobre a minha operação.`)}`
    : site.email
      ? `mailto:${site.email}?subject=${encodeURIComponent('Falar com especialista')}`
      : null

  return (
    <section id="contato" ref={ref} aria-labelledby="contato-title" className="force-dark relative isolate overflow-hidden bg-bg text-text">
      <motion.div className="absolute inset-0 -z-10 overflow-hidden" style={reduce ? undefined : { clipPath: frame }} aria-hidden="true">
        <motion.img
          src={unsplash(PHOTOS.truckNightRoad, 1920)}
          srcSet={unsplashSrcSet(PHOTOS.truckNightRoad)}
          sizes="100vw"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full scale-[1.18] object-cover"
          style={reduce ? undefined : { y: imgY }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgb(11_16_23/0.94)_10%,rgb(11_16_23/0.72)_50%,rgb(11_16_23/0.35)_100%)]" />
      </motion.div>

      <div className="container-x relative flex min-h-[88svh] flex-col justify-center py-28 lg:min-h-[92vh]">
        <p className="eyebrow mb-6 flex items-center gap-3 text-[#c9d2dd]">
          <span className="text-primary">08</span>
          <span aria-hidden="true" className="h-px w-8 bg-primary" />
          <span>Start moving</span>
        </p>
        <MaskText
          id="contato-title"
          className="display-xl max-w-[14ch]"
          lines={[
            'Sua próxima',
            'entrega começa',
            <>
              aqui<span className="text-primary">.</span>
            </>,
          ]}
        />
        <motion.p
          className="mt-8 max-w-[44ch] text-[1.05rem] leading-relaxed text-[#c9d2dd] sm:text-lg"
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.35 }}
        >
          Conte-nos sobre sua operação. Vamos encontrar a solução logística ideal para o seu negócio.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-col gap-3 xs:flex-row xs:flex-wrap"
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.5 }}
        >
          <Button size="lg" magnetic onClick={() => requestQuote()} icon={<ArrowUpRight size={18} />}>
            Solicitar cotação
          </Button>
          {specialistHref ? (
            <Button href={specialistHref} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg" magnetic icon={<MessageCircle size={18} />}>
              Falar com especialista
            </Button>
          ) : (
            <Button variant="secondary" size="lg" magnetic onClick={() => requestQuote()} icon={<MessageCircle size={18} />}>
              Falar com especialista
            </Button>
          )}
        </motion.div>
        {!specialistHref && (
          <p className="mt-5 max-w-[52ch] text-[0.84rem] text-[#a6b2c1]">
            Sem canal direto configurado nesta demonstração: o contato com especialista segue pelo simulador de
            cotação.
          </p>
        )}
      </div>
    </section>
  )
}
