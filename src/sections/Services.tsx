import { SERVICES } from '../data/services'
import { ServiceCard } from '../components/ServiceCard'
import { SectionHeading } from '../components/ui/SectionHeading'

export function Services() {
  return (
    <section id="servicos" aria-labelledby="servicos-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading
          index="01"
          kicker="Soluções logísticas"
          id="servicos-title"
          title={['Uma operação para', 'cada tipo de carga.']}
          lede="Do volume fracionado ao veículo dedicado, cada solução parte de uma pergunta: o que a sua carga precisa para chegar no prazo e sem surpresas?"
        />

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-20 lg:grid-cols-12 lg:auto-rows-[minmax(340px,auto)] lg:gap-5">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.id} service={s} order={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
