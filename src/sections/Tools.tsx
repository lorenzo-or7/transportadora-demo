import { FreightStepper } from '../components/FreightStepper'
import { TrackingTimeline } from '../components/TrackingTimeline'
import { SectionHeading } from '../components/ui/SectionHeading'
import { DemoTag } from '../components/ui/misc'
import { FadeIn, MaskText } from '../components/ui/Reveal'

export function Quote() {
  return (
    <section id="cotacao" aria-labelledby="cotacao-title" className="section-y relative border-t border-line bg-[color-mix(in_srgb,var(--surface)_40%,var(--bg))]">
      <div className="container-x">
        <SectionHeading
          index="02"
          kicker="Smart Quote"
          id="cotacao-title"
          title={['Solicite sua cotação', 'em três etapas.']}
          lede="Rota, carga e contato. Ao final, a solicitação sai organizada e pronta para a equipe comercial, sem planilhas nem idas e vindas por e-mail."
          aside={
            <div className="mt-5">
              <DemoTag>Simulador demonstrativo</DemoTag>
            </div>
          }
        />
        <div className="mt-12 lg:mt-16">
          <FreightStepper />
        </div>
      </div>
    </section>
  )
}

export function Tracking() {
  return (
    <section id="rastreamento" aria-labelledby="rastreamento-title" className="section-y relative">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <FadeIn y={10}>
              <p className="eyebrow mb-5 flex items-center gap-3">
                <span className="text-primary-ink">03</span>
                <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
                <span>Live Journey</span>
              </p>
            </FadeIn>
            <MaskText id="rastreamento-title" lines={['Cada etapa,', 'à vista.']} className="display-lg" />
            <FadeIn delay={0.15}>
              <p className="lede mt-6">
                Um portal de rastreamento mostra ao cliente onde a carga está, o que já aconteceu e o que vem a seguir,
                sem precisar ligar para a central.
              </p>
            </FadeIn>
            <FadeIn delay={0.25}>
              <ul className="mt-8 grid gap-3 border-t border-line pt-6 text-[0.92rem]">
                {['Situação atual e previsão', 'Linha do tempo por etapa', 'Histórico de movimentações'].map((t, i) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="mono text-[0.72rem] text-primary-ink">{String(i + 1).padStart(2, '0')}</span>
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[0.84rem] text-muted">
                Demonstração sem integração com transportadora real. Use o código de exemplo para explorar.
              </p>
            </FadeIn>
          </div>
        </div>
        <div className="lg:col-span-8">
          <TrackingTimeline />
        </div>
      </div>
    </section>
  )
}
