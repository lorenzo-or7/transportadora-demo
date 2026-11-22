import { RouteMap } from '../components/RouteMap'
import { OperationalDashboard } from '../components/OperationalDashboard'
import { SectionHeading } from '../components/ui/SectionHeading'
import { FadeIn } from '../components/ui/Reveal'

export function Coverage() {
  return (
    <section id="cobertura" aria-labelledby="cobertura-title" className="section-y relative border-t border-line">
      <div className="container-x">
        <SectionHeading
          index="04"
          kicker="Connected Territory"
          id="cobertura-title"
          title={['Uma rede que', 'conecta regiões.']}
          lede="Selecione uma região para ver como polos e conexões se organizam. A estrutura é ilustrativa e pronta para receber a malha real de cada operação."
        />
        <div className="mt-12 lg:mt-16">
          <RouteMap />
        </div>
      </div>
    </section>
  )
}

export function Technology() {
  return (
    <section id="tecnologia" aria-labelledby="tecnologia-title" className="section-y relative overflow-hidden border-t border-line bg-[color-mix(in_srgb,var(--surface)_40%,var(--bg))]">
      <div className="container-x">
        <SectionHeading
          index="06"
          kicker="Visibility at every step"
          id="tecnologia-title"
          title={['Visibilidade', 'em cada etapa.']}
          lede="Um portal logístico integrado ao site: status das entregas, alertas e linha do tempo de cada remessa, filtrados por região. Alterne as visões e explore."
        />
        <FadeIn className="mt-12 lg:mt-16" y={40}>
          <OperationalDashboard />
        </FadeIn>
        <p className="mt-5 text-[0.84rem] text-muted">
          Painel demonstrativo com remessas fictícias. Em um projeto real, os dados viriam do sistema de gestão da
          transportadora.
        </p>
      </div>
    </section>
  )
}
