import type { ReactNode } from 'react'
import { FadeIn, MaskText } from './Reveal'

interface SectionHeadingProps {
  index: string
  kicker: string
  title: ReactNode[]
  lede?: ReactNode
  id?: string
  align?: 'split' | 'stack'
  aside?: ReactNode
  className?: string
}

/**
 * Cabeçalho editorial: índice numérico + kicker em mono, título com máscara
 * e texto de apoio. "split" coloca o texto à direita no desktop.
 */
export function SectionHeading({ index, kicker, title, lede, id, align = 'split', aside, className = '' }: SectionHeadingProps) {
  return (
    <header
      className={`grid gap-6 ${align === 'split' ? 'lg:grid-cols-12 lg:items-end lg:gap-10' : ''} ${className}`}
    >
      <div className={align === 'split' ? 'lg:col-span-7' : ''}>
        <FadeIn y={10}>
          <p className="eyebrow mb-5 flex items-center gap-3">
            <span className="text-primary-ink">{index}</span>
            <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
            <span>{kicker}</span>
          </p>
        </FadeIn>
        <MaskText id={id} lines={title} className="display-lg" />
      </div>
      {(lede || aside) && (
        <div className={align === 'split' ? 'lg:col-span-5 lg:pb-2' : 'max-w-2xl'}>
          {lede && (
            <FadeIn delay={0.15}>
              <p className="lede">{lede}</p>
            </FadeIn>
          )}
          {aside}
        </div>
      )}
    </header>
  )
}
