import { useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { SPRING_PRESS } from '../../lib/motion'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

interface BaseProps {
  children: ReactNode
  variant?: Variant
  size?: Size
  icon?: ReactNode
  /** botão magnético discreto (apenas ponteiro fino, sem movimento reduzido) */
  magnetic?: boolean
  className?: string
}

type AsLink = BaseProps & { href: string } & Omit<ComponentPropsWithoutRef<'a'>, keyof BaseProps | 'href'>
type AsButton = BaseProps & { href?: undefined } & Omit<ComponentPropsWithoutRef<'button'>, keyof BaseProps>

const base =
  'group relative inline-flex select-none items-center justify-center gap-2.5 rounded-full font-medium tracking-[-0.01em] whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-200 disabled:cursor-not-allowed disabled:opacity-50'

const sizes: Record<Size, string> = {
  md: 'min-h-11 px-5 text-[0.95rem]',
  lg: 'min-h-13 px-7 text-base',
}

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-on-primary hover:bg-[color-mix(in_srgb,var(--primary)_88%,white)] shadow-[0_10px_30px_-12px_color-mix(in_srgb,var(--primary)_70%,transparent)]',
  secondary:
    'border border-line-strong text-text bg-[color-mix(in_srgb,var(--surface)_55%,transparent)] backdrop-blur-sm hover:border-text',
  ghost: 'text-text hover:text-primary-ink',
}

function useMagnet(enabled: boolean) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 20, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 })
  const active = enabled && !reduce

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!active || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set(((e.clientX - r.left) / r.width - 0.5) * 10)
    y.set(((e.clientY - r.top) / r.height - 0.5) * 8)
  }
  const onPointerLeave = () => {
    x.set(0)
    y.set(0)
  }
  return { style: active ? { x: sx, y: sy } : undefined, onPointerMove, onPointerLeave }
}

export function Button(props: AsLink | AsButton) {
  const { children, variant = 'primary', size = 'md', icon, magnetic = false, className = '', ...rest } = props
  const magnet = useMagnet(magnetic)
  const ref = useRef<HTMLElement>(null)
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`

  const inner = (
    <>
      <span className="relative">{children}</span>
      {icon && (
        <span
          aria-hidden="true"
          className="relative grid place-items-center transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5"
        >
          {icon}
        </span>
      )}
    </>
  )

  const motionProps = {
    whileTap: { scale: 0.96 },
    transition: SPRING_PRESS,
    style: magnet.style,
    onPointerMove: magnet.onPointerMove,
    onPointerLeave: magnet.onPointerLeave,
  }

  if ('href' in rest && typeof rest.href === 'string') {
    const { href, ...a } = rest as AsLink
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={cls}
        {...motionProps}
        {...(a as Record<string, unknown>)}
      >
        {inner}
      </motion.a>
    )
  }
  const b = rest as Omit<AsButton, keyof BaseProps>
  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={b.type ?? 'button'}
      className={cls}
      {...motionProps}
      {...(b as Record<string, unknown>)}
    >
      {inner}
    </motion.button>
  )
}

export function PrimaryButton(props: Omit<AsLink, 'variant'> | Omit<AsButton, 'variant'>) {
  return <Button {...(props as AsButton)} variant="primary" />
}

export function SecondaryButton(props: Omit<AsLink, 'variant'> | Omit<AsButton, 'variant'>) {
  return <Button {...(props as AsButton)} variant="secondary" />
}
