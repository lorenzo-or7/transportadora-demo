import { type ReactNode, useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { DUR, EASE_OUT, VIEWPORT } from '../../lib/motion'

/* --------------------------------------------------------------
   MaskText — revelação tipográfica por máscara, linha a linha.
   -------------------------------------------------------------- */
interface MaskTextProps {
  lines: ReactNode[]
  className?: string
  lineClassName?: string
  delay?: number
  /** dispara já no carregamento (hero) em vez de ao entrar na viewport */
  immediate?: boolean
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  id?: string
}

export function MaskText({ lines, className = '', lineClassName = '', delay = 0, immediate = false, as = 'h2', id }: MaskTextProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, VIEWPORT)
  const reduce = useReducedMotion()
  const show = immediate || inView
  const Tag = motion[as]

  return (
    <Tag ref={ref as never} id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={`block will-change-transform ${lineClassName}`}
            initial={reduce ? { opacity: 0 } : { y: '108%' }}
            animate={show ? (reduce ? { opacity: 1 } : { y: '0%' }) : undefined}
            transition={{ duration: reduce ? 0.3 : DUR.cinematic, ease: EASE_OUT, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/* --------------------------------------------------------------
   FadeIn — entrada escalonada simples para blocos de texto/UI.
   -------------------------------------------------------------- */
export function FadeIn({
  children,
  delay = 0,
  y = 20,
  className = '',
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'p' | 'li' | 'section'
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR.slow, ease: EASE_OUT, delay }}
    >
      {children}
    </Tag>
  )
}

/* --------------------------------------------------------------
   ImageReveal — máscara (clip-path) + leve escala ligada ao scroll.
   -------------------------------------------------------------- */
interface ImageRevealProps {
  src: string
  srcSet?: string
  sizes?: string
  alt: string
  className?: string
  imgClassName?: string
  /** direção de abertura da máscara */
  from?: 'bottom' | 'left' | 'right'
  parallax?: boolean
  priority?: boolean
  delay?: number
  children?: ReactNode
}

const CLIP_FROM = {
  bottom: 'inset(100% 0% 0% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
} as const

export function ImageReveal({
  src,
  srcSet,
  sizes,
  alt,
  className = '',
  imgClassName = '',
  from = 'bottom',
  parallax = true,
  priority = false,
  delay = 0,
  children,
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden bg-elevated ${className}`}
      initial={reduce ? { opacity: 0 } : { clipPath: CLIP_FROM[from] }}
      whileInView={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={VIEWPORT}
      transition={{ duration: reduce ? 0.3 : DUR.cinematic, ease: EASE_OUT, delay }}
    >
      <motion.img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover ${parallax && !reduce ? 'scale-[1.14]' : ''} ${imgClassName}`}
        style={parallax && !reduce ? { y } : undefined}
      />
      {children}
    </motion.div>
  )
}
