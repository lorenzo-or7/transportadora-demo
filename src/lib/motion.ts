import type { Transition, Variants } from 'motion/react'

/** Linguagem "Cinematic Industrial Motion": curvas e durações únicas no projeto. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const EASE_INOUT: [number, number, number, number] = [0.65, 0, 0.35, 1]

export const DUR = { fast: 0.18, base: 0.42, slow: 0.9, cinematic: 1.25 } as const

export const SPRING_PRESS: Transition = { type: 'spring', stiffness: 520, damping: 32, mass: 0.6 }
export const SPRING_SOFT: Transition = { type: 'spring', stiffness: 160, damping: 26 }

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.slow, ease: EASE_OUT } },
}

export const stagger = (gap = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
})

export const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const
