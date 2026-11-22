import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Check,
  Copy,
  Loader2,
  MapPin,
  MessageCircle,
  RotateCcw,
  Truck,
  Zap,
  X,
} from 'lucide-react'
import { site } from '../config/site'
import { SERVICES, type ModalityId } from '../data/services'
import { cepRange, maskCep, validateCep } from '../lib/cep'
import { copyText } from '../lib/hooks'
import { EASE_OUT } from '../lib/motion'
import { useQuote } from '../lib/quote-context'
import { Button } from './ui/Button'
import { ChoiceGroup, Field, describedBy } from './form'

/* ------------------------------------------------------------------ */
/* Modelo                                                              */
/* ------------------------------------------------------------------ */
type CargoType = 'geral' | 'paletizada' | 'fragil' | 'volumosa' | 'temperatura'
type Deadline = 'flexivel' | 'ate5' | 'programada'

interface FormState {
  origin: string
  destination: string
  cargoType: CargoType | ''
  weight: string
  volume: string
  modality: ModalityId | ''
  deadline: Deadline | ''
  date: string
  name: string
  company: string
  email: string
  phone: string
  notes: string
}

type Key = keyof FormState

const EMPTY: FormState = {
  origin: '',
  destination: '',
  cargoType: '',
  weight: '',
  volume: '',
  modality: '',
  deadline: '',
  date: '',
  name: '',
  company: '',
  email: '',
  phone: '',
  notes: '',
}

const CARGO_LABEL: Record<CargoType, string> = {
  geral: 'Carga geral',
  paletizada: 'Paletizada',
  fragil: 'Frágil',
  volumosa: 'Volumosa',
  temperatura: 'Temperatura controlada',
}

const MODALITY: Record<ModalityId, { label: string; description: string; icon: React.ReactNode }> = {
  fracionada: { label: 'Fracionada', description: 'Compartilha o veículo com outras cargas.', icon: <Boxes size={19} /> },
  dedicada: { label: 'Dedicada', description: 'Veículo exclusivo, sem transbordo.', icon: <Truck size={19} /> },
  expressa: { label: 'Expressa', description: 'Prioridade de coleta e saída.', icon: <Zap size={19} /> },
}

const DEADLINE_LABEL: Record<Deadline, string> = {
  flexivel: 'Sem urgência',
  ate5: 'Até 5 dias úteis',
  programada: 'Data programada',
}

const STEPS = [
  { n: '01', title: 'Rota', fields: ['origin', 'destination'] as Key[] },
  { n: '02', title: 'Carga', fields: ['cargoType', 'weight', 'volume', 'modality', 'deadline', 'date'] as Key[] },
  { n: '03', title: 'Solicitação', fields: ['name', 'company', 'email', 'phone', 'notes'] as Key[] },
]

function maskPhone(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function parseNum(v: string): number {
  return Number(v.replace(/\./g, '').replace(',', '.'))
}

function todayISO(): string {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

function validate(f: FormState): Partial<Record<Key, string>> {
  const e: Partial<Record<Key, string>> = {}
  const o = validateCep(f.origin)
  const d = validateCep(f.destination)
  if (o) e.origin = o
  if (d) e.destination = d
  if (!o && !d && f.origin === f.destination) e.destination = 'O destino precisa ser diferente da origem.'

  if (!f.cargoType) e.cargoType = 'Escolha o tipo de carga.'
  const w = parseNum(f.weight)
  if (!f.weight.trim()) e.weight = 'Informe o peso estimado.'
  else if (!Number.isFinite(w) || w <= 0) e.weight = 'Use apenas números, por exemplo 850.'
  else if (w > 74000) e.weight = 'Acima de 74 t, fale direto com um especialista.'
  const v = parseNum(f.volume)
  if (!f.volume.trim()) e.volume = 'Informe o volume aproximado.'
  else if (!Number.isFinite(v) || v <= 0) e.volume = 'Use apenas números, por exemplo 2,5.'
  else if (v > 150) e.volume = 'Volume acima do esperado para um veículo. Revise o valor.'
  if (!f.modality) e.modality = 'Selecione uma modalidade.'
  if (!f.deadline) e.deadline = 'Selecione o prazo desejado.'
  if (f.deadline === 'programada') {
    if (!f.date) e.date = 'Escolha a data desejada.'
    else if (f.date < todayISO()) e.date = 'A data não pode estar no passado.'
  }

  if (f.name.trim().length < 2) e.name = 'Informe seu nome.'
  if (!f.email.trim()) e.email = 'Informe um e-mail para retorno.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Verifique o formato do e-mail.'
  const p = f.phone.replace(/\D/g, '')
  if (!p) e.phone = 'Informe um telefone ou WhatsApp.'
  else if (p.length < 10) e.phone = 'Inclua DDD e número completo.'
  if (f.notes.length > 500) e.notes = 'Use até 500 caracteres.'
  return e
}

function buildMessage(f: FormState, serviceTitle: string | null): string {
  const o = cepRange(f.origin)
  const d = cepRange(f.destination)
  const lines = [
    `*Solicitação de cotação — ${site.brand}*`,
    '',
    '*Rota*',
    `Origem: CEP ${f.origin}${o ? ` (${o.ufs})` : ''}`,
    `Destino: CEP ${f.destination}${d ? ` (${d.ufs})` : ''}`,
    '',
    '*Carga*',
    serviceTitle ? `Serviço de interesse: ${serviceTitle}` : null,
    `Tipo: ${f.cargoType ? CARGO_LABEL[f.cargoType] : '—'}`,
    `Peso estimado: ${f.weight} kg`,
    `Volume: ${f.volume} m³`,
    `Modalidade: ${f.modality ? MODALITY[f.modality].label : '—'}`,
    `Prazo: ${f.deadline ? DEADLINE_LABEL[f.deadline] : '—'}${f.deadline === 'programada' && f.date ? ` (${f.date.split('-').reverse().join('/')})` : ''}`,
    '',
    '*Contato*',
    `Nome: ${f.name.trim()}`,
    f.company.trim() ? `Empresa: ${f.company.trim()}` : null,
    `E-mail: ${f.email.trim()}`,
    `Telefone: ${f.phone}`,
    f.notes.trim() ? `Observações: ${f.notes.trim()}` : null,
  ]
  return lines.filter((l): l is string => l !== null).join('\n')
}

/* ------------------------------------------------------------------ */
/* Componente                                                          */
/* ------------------------------------------------------------------ */
export function FreightStepper() {
  const reduce = useReducedMotion()
  const { intent } = useQuote()
  const [f, setF] = useState<FormState>(EMPTY)
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({})
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [status, setStatus] = useState<'editing' | 'sending' | 'done'>('editing')
  const [serviceId, setServiceId] = useState<string | null>(null)
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')
  const [announce, setAnnounce] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)

  const errors = useMemo(() => validate(f), [f])
  const service = SERVICES.find((s) => s.id === serviceId) ?? null
  const message = useMemo(() => buildMessage(f, service?.title ?? null), [f, service])

  // CTA de serviço abre o simulador com contexto
  useEffect(() => {
    if (intent.nonce === 0) return
    setServiceId(intent.serviceId)
    if (intent.modality) setF((p) => ({ ...p, modality: intent.modality ?? p.modality }))
    if (status === 'done') {
      setStatus('editing')
      setStep(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intent.nonce])

  const set = <K extends Key>(k: K, v: FormState[K]) => setF((p) => ({ ...p, [k]: v }))
  const touch = (k: Key) => setTouched((t) => (t[k] ? t : { ...t, [k]: true }))
  const err = (k: Key) => (touched[k] ? (errors[k] ?? null) : null)

  const goTo = (next: number) => {
    setDir(next > step ? 1 : -1)
    setStep(next)
    requestAnimationFrame(() => rootRef.current?.querySelector<HTMLElement>('[data-step-heading]')?.focus({ preventScroll: true }))
    const top = rootRef.current?.getBoundingClientRect().top ?? 0
    if (top < 0) rootRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  const stepErrors = (i: number) => (STEPS[i]?.fields ?? []).filter((k) => errors[k])

  const next = () => {
    const bad = stepErrors(step)
    if (bad.length) {
      setTouched((t) => ({ ...t, ...Object.fromEntries(bad.map((k) => [k, true])) }))
      setAnnounce(`${bad.length} ${bad.length === 1 ? 'campo precisa' : 'campos precisam'} de atenção.`)
      requestAnimationFrame(() => {
        const first = bad[0]
        const el =
          rootRef.current?.querySelector<HTMLElement>(`#q-${first}`) ??
          rootRef.current?.querySelector<HTMLElement>(`input[name="q-${first}"]`)
        el?.focus()
      })
      return
    }
    setAnnounce('')
    if (step < 2) goTo(step + 1)
    else submit()
  }

  const submit = () => {
    setStatus('sending')
    // Simula o tempo de preparo para exibir o estado de carregamento; nada é enviado a servidor.
    window.setTimeout(() => {
      setStatus('done')
      setAnnounce('Solicitação pronta para envio.')
    }, 700)
  }

  const reset = () => {
    setF(EMPTY)
    setTouched({})
    setServiceId(null)
    setStatus('editing')
    setCopied('idle')
    setDir(-1)
    setStep(0)
  }

  const onCopy = async () => {
    const ok = await copyText(message)
    setCopied(ok ? 'ok' : 'fail')
    if (!ok) {
      // facilita a cópia manual: seleciona o texto da mensagem
      const pre = document.getElementById('quote-message')
      const sel = window.getSelection()
      if (pre && sel) {
        const range = document.createRange()
        range.selectNodeContents(pre)
        sel.removeAllRanges()
        sel.addRange(range)
      }
    }
    setAnnounce(ok ? 'Solicitação copiada.' : 'Não foi possível copiar automaticamente.')
  }

  const waHref = site.whatsappNumber ? `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}` : null
  const progress = status === 'done' ? 1 : step / 2

  return (
    <div ref={rootRef} className="grid scroll-mt-28 grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>

      {/* ------------- Formulário ------------- */}
      <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-5 shadow-card sm:p-8 lg:col-span-8 lg:p-10">
        {/* Indicador de progresso */}
        <ol className="grid grid-cols-3 gap-2" aria-label="Etapas da solicitação">
          {STEPS.map((s, i) => {
            const state = status === 'done' || i < step ? 'done' : i === step ? 'current' : 'todo'
            const canJump = status === 'editing' && i < step
            return (
              <li key={s.n} className="min-w-0">
                <button
                  type="button"
                  disabled={!canJump}
                  onClick={() => canJump && goTo(i)}
                  aria-current={state === 'current' ? 'step' : undefined}
                  className="group flex w-full min-w-0 flex-col items-start gap-2 rounded-md text-left disabled:cursor-default"
                >
                  <span className="relative h-[3px] w-full overflow-hidden rounded-full bg-line">
                    <motion.span
                      className="absolute inset-y-0 left-0 rounded-full bg-primary"
                      initial={false}
                      animate={{ width: state === 'todo' ? '0%' : '100%' }}
                      transition={{ duration: 0.7, ease: EASE_OUT }}
                    />
                  </span>
                  <span className="flex min-w-0 items-center gap-2">
                    <span className={`mono text-[0.72rem] ${state === 'todo' ? 'text-muted' : 'text-primary-ink'}`}>
                      {state === 'done' ? <Check size={13} className="inline" aria-label="concluída" /> : s.n}
                    </span>
                    <span
                      className={`truncate text-[0.88rem] font-medium ${state === 'todo' ? 'text-muted' : 'text-text'} ${canJump ? 'group-hover:underline underline-offset-4' : ''}`}
                    >
                      {s.title}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <div className="relative mt-8 sm:mt-10">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            {status === 'done' ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              >
                <Confirmation
                  message={message}
                  waHref={waHref}
                  copied={copied}
                  onCopy={onCopy}
                  onReset={reset}
                />
              </motion.div>
            ) : (
              <motion.form
                key={step}
                custom={dir}
                noValidate
                onSubmit={(e) => {
                  e.preventDefault()
                  next()
                }}
                initial={{ opacity: 0, x: reduce ? 0 : dir * 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reduce ? 0 : dir * -20 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                aria-labelledby={`step-h-${step}`}
              >
                <h3
                  id={`step-h-${step}`}
                  data-step-heading
                  tabIndex={-1}
                  className="display-md rounded-md outline-none focus-visible:outline-2"
                >
                  {step === 0 && 'De onde sai e para onde vai?'}
                  {step === 1 && 'Conte sobre a carga.'}
                  {step === 2 && 'Revise e deixe seu contato.'}
                </h3>

                {step === 0 && (
                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {(['origin', 'destination'] as const).map((k) => {
                      const range = cepRange(f[k])
                      const hint = 'Somente números. Ex.: 01310-100'
                      return (
                        <Field
                          key={k}
                          id={`q-${k}`}
                          label={k === 'origin' ? 'CEP de origem' : 'CEP de destino'}
                          hint={range ? undefined : hint}
                          error={err(k)}
                        >
                          <div className="relative">
                            <MapPin
                              size={17}
                              className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 ${k === 'origin' ? 'text-muted' : 'text-primary-ink'}`}
                              aria-hidden="true"
                            />
                            <input
                              id={`q-${k}`}
                              className="field mono pl-10 tracking-[0.06em]"
                              inputMode="numeric"
                              autoComplete="postal-code"
                              placeholder="00000-000"
                              value={f[k]}
                              maxLength={9}
                              onChange={(e) => set(k, maskCep(e.target.value))}
                              onBlur={() => touch(k)}
                              aria-invalid={!!err(k)}
                              aria-describedby={range ? `q-${k}-range` : describedBy(`q-${k}`, err(k), hint)}
                            />
                          </div>
                          <AnimatePresence initial={false}>
                            {range && !err(k) && (
                              <motion.p
                                id={`q-${k}-range`}
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-[0.82rem] text-muted"
                              >
                                <Check size={14} className="text-ok" aria-hidden="true" />
                                Faixa de CEP: {range.area} <span className="mono text-[0.75rem]">({range.ufs})</span>
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </Field>
                      )
                    })}
                    <p className="text-[0.85rem] leading-relaxed text-muted md:col-span-2">
                      Usamos apenas a faixa do CEP para orientar o atendimento. Nenhum endereço é consultado nesta
                      demonstração.
                    </p>
                  </div>
                )}

                {step === 1 && (
                  <div className="mt-8 grid gap-7">
                    <ChoiceGroup
                      name="q-cargoType"
                      legend="Tipo de carga"
                      value={f.cargoType}
                      onChange={(v) => {
                        set('cargoType', v)
                        touch('cargoType')
                      }}
                      error={err('cargoType')}
                      options={(Object.keys(CARGO_LABEL) as CargoType[]).map((k) => ({ value: k, label: CARGO_LABEL[k] }))}
                    />

                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field id="q-weight" label="Peso estimado" error={err('weight')} hint="Em quilos.">
                        <div className="relative">
                          <input
                            id="q-weight"
                            className="field mono pr-12"
                            inputMode="decimal"
                            placeholder="850"
                            value={f.weight}
                            onChange={(e) => set('weight', e.target.value.replace(/[^\d.,]/g, '').slice(0, 9))}
                            onBlur={() => touch('weight')}
                            aria-invalid={!!err('weight')}
                            aria-describedby={describedBy('q-weight', err('weight'), 'Em quilos.')}
                          />
                          <span className="mono pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[0.8rem] text-muted" aria-hidden="true">
                            kg
                          </span>
                        </div>
                      </Field>
                      <Field id="q-volume" label="Volume" error={err('volume')} hint="Em metros cúbicos (aproximado).">
                        <div className="relative">
                          <input
                            id="q-volume"
                            className="field mono pr-12"
                            inputMode="decimal"
                            placeholder="2,5"
                            value={f.volume}
                            onChange={(e) => set('volume', e.target.value.replace(/[^\d.,]/g, '').slice(0, 7))}
                            onBlur={() => touch('volume')}
                            aria-invalid={!!err('volume')}
                            aria-describedby={describedBy('q-volume', err('volume'), 'Em metros cúbicos (aproximado).')}
                          />
                          <span className="mono pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[0.8rem] text-muted" aria-hidden="true">
                            m³
                          </span>
                        </div>
                      </Field>
                    </div>

                    <ChoiceGroup
                      name="q-modality"
                      legend="Modalidade"
                      variant="card"
                      columns="sm:grid-cols-3"
                      value={f.modality}
                      onChange={(v) => {
                        set('modality', v)
                        touch('modality')
                      }}
                      error={err('modality')}
                      options={(Object.keys(MODALITY) as ModalityId[]).map((k) => ({
                        value: k,
                        label: MODALITY[k].label,
                        description: MODALITY[k].description,
                        icon: MODALITY[k].icon,
                      }))}
                    />

                    <div className="grid gap-4">
                      <ChoiceGroup
                        name="q-deadline"
                        legend="Prazo desejado"
                        value={f.deadline}
                        onChange={(v) => {
                          set('deadline', v)
                          touch('deadline')
                        }}
                        error={err('deadline')}
                        options={(Object.keys(DEADLINE_LABEL) as Deadline[]).map((k) => ({ value: k, label: DEADLINE_LABEL[k] }))}
                      />
                      <AnimatePresence initial={false}>
                        {f.deadline === 'programada' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: EASE_OUT }}
                            className="overflow-hidden"
                          >
                            <Field id="q-date" label="Data desejada para entrega" error={err('date')} className="max-w-xs pt-1">
                              <input
                                id="q-date"
                                type="date"
                                className="field mono"
                                min={todayISO()}
                                value={f.date}
                                onChange={(e) => set('date', e.target.value)}
                                onBlur={() => touch('date')}
                                aria-invalid={!!err('date')}
                                aria-describedby={describedBy('q-date', err('date'))}
                              />
                            </Field>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    <Field id="q-name" label="Nome" error={err('name')}>
                      <input
                        id="q-name"
                        className="field"
                        autoComplete="name"
                        value={f.name}
                        onChange={(e) => set('name', e.target.value.slice(0, 80))}
                        onBlur={() => touch('name')}
                        aria-invalid={!!err('name')}
                        aria-describedby={describedBy('q-name', err('name'))}
                      />
                    </Field>
                    <Field id="q-company" label="Empresa" optional>
                      <input
                        id="q-company"
                        className="field"
                        autoComplete="organization"
                        value={f.company}
                        onChange={(e) => set('company', e.target.value.slice(0, 80))}
                      />
                    </Field>
                    <Field id="q-email" label="E-mail" error={err('email')}>
                      <input
                        id="q-email"
                        type="email"
                        className="field"
                        autoComplete="email"
                        inputMode="email"
                        value={f.email}
                        onChange={(e) => set('email', e.target.value.slice(0, 120))}
                        onBlur={() => touch('email')}
                        aria-invalid={!!err('email')}
                        aria-describedby={describedBy('q-email', err('email'))}
                      />
                    </Field>
                    <Field id="q-phone" label="Telefone ou WhatsApp" error={err('phone')}>
                      <input
                        id="q-phone"
                        type="tel"
                        className="field mono"
                        autoComplete="tel-national"
                        inputMode="tel"
                        placeholder="(00) 00000-0000"
                        value={f.phone}
                        onChange={(e) => set('phone', maskPhone(e.target.value))}
                        onBlur={() => touch('phone')}
                        aria-invalid={!!err('phone')}
                        aria-describedby={describedBy('q-phone', err('phone'))}
                      />
                    </Field>
                    <Field
                      id="q-notes"
                      label="Observações"
                      optional
                      error={err('notes')}
                      className="sm:col-span-2"
                      aside={<span className="mono text-[0.72rem] text-muted tabular">{f.notes.length}/500</span>}
                    >
                      <textarea
                        id="q-notes"
                        rows={3}
                        className="field min-h-24 resize-y"
                        placeholder="Horário de coleta, restrições de acesso, frequência de envios…"
                        value={f.notes}
                        onChange={(e) => {
                          set('notes', e.target.value)
                          touch('notes')
                        }}
                        aria-invalid={!!err('notes')}
                        aria-describedby={describedBy('q-notes', err('notes'))}
                      />
                    </Field>
                  </div>
                )}

                <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                  {step > 0 ? (
                    <Button variant="ghost" onClick={() => goTo(step - 1)} className="justify-start px-0 sm:px-2" icon={null}>
                      <span className="inline-flex items-center gap-2">
                        <ArrowLeft size={17} aria-hidden="true" /> Voltar
                      </span>
                    </Button>
                  ) : (
                    <span className="mono hidden text-[0.72rem] uppercase tracking-[0.14em] text-muted sm:block">
                      Etapa 1 de 3
                    </span>
                  )}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={status === 'sending'}
                    aria-busy={status === 'sending'}
                    icon={
                      status === 'sending' ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : step < 2 ? (
                        <ArrowRight size={18} />
                      ) : (
                        <Check size={18} />
                      )
                    }
                  >
                    {status === 'sending' ? 'Preparando…' : step < 2 ? 'Continuar' : 'Gerar solicitação'}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ------------- Resumo ------------- */}
      <aside className="lg:col-span-4" aria-label="Resumo da solicitação">
        <div className="grid-texture rounded-[var(--radius-lg)] border border-line bg-elevated/60 p-5 sm:p-7 lg:sticky lg:top-28">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Resumo</p>
            <span className="mono text-[0.72rem] text-muted tabular">{Math.round(progress * 100)}%</span>
          </div>
          <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-line">
            <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${Math.max(progress, 0.04) * 100}%` }} transition={{ duration: 0.7, ease: EASE_OUT }} />
          </div>

          {service && (
            <div className="mt-5 flex items-center justify-between gap-3 rounded-[10px] border border-line bg-surface px-3 py-2.5">
              <span className="text-[0.85rem]">
                <span className="text-muted">Serviço: </span>
                {service.title}
              </span>
              <button
                type="button"
                onClick={() => setServiceId(null)}
                aria-label={`Remover serviço ${service.title}`}
                className="grid h-9 w-9 place-items-center rounded-full text-muted hover:text-text"
              >
                <X size={15} />
              </button>
            </div>
          )}

          <dl className="mt-5 divide-y divide-line">
            <SummaryRow label="Origem" value={f.origin ? `${f.origin}${cepRange(f.origin) ? ` · ${cepRange(f.origin)?.ufs.split(' ')[0]}` : ''}` : null} mono />
            <SummaryRow label="Destino" value={f.destination ? `${f.destination}${cepRange(f.destination) ? ` · ${cepRange(f.destination)?.ufs.split(' ')[0]}` : ''}` : null} mono />
            <SummaryRow label="Carga" value={f.cargoType ? CARGO_LABEL[f.cargoType] : null} />
            <SummaryRow label="Peso · Volume" value={f.weight || f.volume ? `${f.weight || '—'} kg · ${f.volume || '—'} m³` : null} mono />
            <SummaryRow label="Modalidade" value={f.modality ? MODALITY[f.modality].label : null} />
            <SummaryRow
              label="Prazo"
              value={f.deadline ? `${DEADLINE_LABEL[f.deadline]}${f.deadline === 'programada' && f.date ? ` · ${f.date.split('-').reverse().join('/')}` : ''}` : null}
            />
          </dl>

          <p className="mt-5 border-t border-dashed border-line-strong pt-4 text-[0.8rem] leading-relaxed text-muted">
            Este simulador organiza a solicitação. <strong className="font-medium text-text">Não calcula preço</strong>: o
            valor depende de análise da operação pela equipe comercial.
          </p>
        </div>
      </aside>
    </div>
  )
}

function SummaryRow({ label, value, mono = false }: { label: string; value: string | null; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <dt className="text-[0.82rem] text-muted">{label}</dt>
      <dd className={`text-right text-[0.88rem] ${mono ? 'mono' : ''} ${value ? 'text-text' : 'text-muted/70'}`}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value ?? 'empty'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="inline-block"
          >
            {value ?? 'Pendente'}
          </motion.span>
        </AnimatePresence>
      </dd>
    </div>
  )
}

function Confirmation({
  message,
  waHref,
  copied,
  onCopy,
  onReset,
}: {
  message: string
  waHref: string | null
  copied: 'idle' | 'ok' | 'fail'
  onCopy: () => void
  onReset: () => void
}) {
  return (
    <div>
      <div className="flex items-start gap-4">
        <motion.span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ok/15 text-ok"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          aria-hidden="true"
        >
          <Check size={22} />
        </motion.span>
        <div>
          <h3 className="display-md" data-step-heading tabIndex={-1}>
            Solicitação pronta.
          </h3>
          <p className="mt-2 max-w-[52ch] text-muted">
            {waHref
              ? 'Envie pelo WhatsApp comercial ou copie o texto. A equipe responde com a proposta após analisar a operação.'
              : 'Nenhum número de WhatsApp está configurado nesta demonstração. Copie o texto para enviar pelo canal que preferir.'}
          </p>
        </div>
      </div>

      <div className="mt-7 overflow-hidden rounded-[var(--radius-md)] border border-line bg-bg">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <span className="mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">Mensagem formatada</span>
          <span className="mono text-[0.7rem] text-muted">WhatsApp</span>
        </div>
        <pre id="quote-message" tabIndex={0} className="mono max-h-72 overflow-auto whitespace-pre-wrap break-words p-4 text-[0.8rem] leading-relaxed text-text">
          {message}
        </pre>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {waHref && (
          <Button href={waHref} target="_blank" rel="noopener noreferrer" size="lg" icon={<MessageCircle size={18} />}>
            Enviar pelo WhatsApp
          </Button>
        )}
        <Button
          variant={waHref ? 'secondary' : 'primary'}
          size="lg"
          onClick={onCopy}
          icon={copied === 'ok' ? <Check size={18} /> : <Copy size={18} />}
        >
          {copied === 'ok' ? 'Copiado' : 'Copiar solicitação'}
        </Button>
        <Button variant="ghost" size="lg" onClick={onReset} icon={<RotateCcw size={17} />}>
          Nova solicitação
        </Button>
      </div>
      {copied === 'fail' && (
        <p className="mt-3 text-[0.85rem] text-alert">
          Não foi possível copiar automaticamente. O texto acima já está selecionado: use Ctrl+C (ou Copiar, no celular).
        </p>
      )}
      <p className="mt-6 text-[0.8rem] text-muted">
        Demonstração: nenhum dado foi enviado a servidores. A mensagem só sai do seu navegador se você escolher enviar.
      </p>
    </div>
  )
}
