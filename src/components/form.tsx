import { motion, AnimatePresence } from 'motion/react'
import { AlertCircle } from 'lucide-react'
import type { ReactNode } from 'react'

interface FieldProps {
  id: string
  label: string
  hint?: string
  error?: string | null
  optional?: boolean
  children: ReactNode
  className?: string
  aside?: ReactNode
}

/** Label persistente, dica e erro acessível ligados ao campo via aria-describedby. */
export function Field({ id, label, hint, error, optional, children, className = '', aside }: FieldProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[0.92rem] font-medium">
          {label}
          {optional && <span className="ml-1.5 text-[0.8rem] font-normal text-muted">(opcional)</span>}
        </label>
        {aside}
      </div>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-[0.82rem] text-muted">
          {hint}
        </p>
      )}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="flex items-start gap-1.5 overflow-hidden text-[0.84rem] text-alert"
          >
            <AlertCircle size={15} className="mt-[3px] shrink-0" aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export function describedBy(id: string, error?: string | null, hint?: string): string | undefined {
  if (error) return `${id}-error`
  if (hint) return `${id}-hint`
  return undefined
}

/* Grupo de opções visuais (radio nativo, navegação por setas). */
interface ChoiceOption<T extends string> {
  value: T
  label: string
  description?: string
  icon?: ReactNode
}

interface ChoiceGroupProps<T extends string> {
  name: string
  legend: string
  options: ChoiceOption<T>[]
  value: T | ''
  onChange: (v: T) => void
  error?: string | null
  variant?: 'chip' | 'card'
  columns?: string
}

export function ChoiceGroup<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  variant = 'chip',
  columns = '',
}: ChoiceGroupProps<T>) {
  const errId = `${name}-error`
  return (
    <fieldset aria-describedby={error ? errId : undefined} aria-invalid={error ? true : undefined} className="min-w-0">
      <legend className="mb-3 text-[0.92rem] font-medium">{legend}</legend>
      <div className={variant === 'chip' ? 'flex flex-wrap gap-2' : `grid gap-3 ${columns}`}>
        {options.map((o) => {
          const checked = value === o.value
          return (
            <label
              key={o.value}
              className={`relative cursor-pointer select-none transition-[border-color,background-color,color] duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
                variant === 'chip'
                  ? `inline-flex min-h-11 items-center rounded-full border px-4 text-[0.9rem] ${
                      checked ? 'border-primary bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-text' : 'border-line-strong text-muted hover:border-muted hover:text-text'
                    }`
                  : `flex flex-col gap-3 rounded-[var(--radius-md)] border p-4 ${
                      checked ? 'border-primary bg-[color-mix(in_srgb,var(--primary)_9%,var(--surface))]' : 'border-line-strong bg-bg hover:border-muted'
                    }`
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {variant === 'card' ? (
                <>
                  <span className="flex items-center justify-between">
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-[10px] border transition-colors ${
                        checked ? 'border-primary bg-primary text-on-primary' : 'border-line text-muted'
                      }`}
                      aria-hidden="true"
                    >
                      {o.icon}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`grid h-5 w-5 place-items-center rounded-full border-2 ${checked ? 'border-primary' : 'border-line-strong'}`}
                    >
                      {checked && <motion.span layoutId={`${name}-dot`} className="h-2 w-2 rounded-full bg-primary" />}
                    </span>
                  </span>
                  <span>
                    <span className="block font-display text-[1.05rem] font-semibold tracking-[-0.02em]">{o.label}</span>
                    {o.description && <span className="mt-1 block text-[0.85rem] leading-snug text-muted">{o.description}</span>}
                  </span>
                </>
              ) : (
                o.label
              )}
            </label>
          )
        })}
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={errId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 flex items-start gap-1.5 overflow-hidden text-[0.84rem] text-alert"
          >
            <AlertCircle size={15} className="mt-[3px] shrink-0" aria-hidden="true" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </fieldset>
  )
}
