import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { NAV_ITEMS, site } from '../config/site'
import { SERVICES } from '../data/services'
import { Logo } from './ui/misc'

export function Footer() {
  const socials = site.socials.filter((s) => s.href)
  const pendingSocials = site.socials.filter((s) => !s.href)
  const wa = site.whatsappNumber

  return (
    <footer className="relative border-t border-line bg-bg" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Rodapé
      </h2>
      <div className="container-x pt-16 pb-10 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-[36ch] text-[0.95rem] text-muted">
              {site.descriptor}. Identidade demonstrativa, criada para apresentação comercial e pronta para receber a
              marca de cada transportadora.
            </p>
            <a
              href="#topo"
              className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-[0.88rem] transition-colors hover:border-line-strong"
            >
              <ArrowUp size={15} aria-hidden="true" /> Voltar ao topo
            </a>
          </div>

          <nav aria-label="Navegação do rodapé" className="lg:col-span-2">
            <p className="eyebrow mb-4">Navegação</p>
            <ul className="grid gap-1">
              {NAV_ITEMS.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="inline-flex min-h-10 items-center text-[0.95rem] hover:text-primary-ink">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#rastreamento" className="inline-flex min-h-10 items-center text-[0.95rem] hover:text-primary-ink">
                  Rastreamento
                </a>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="eyebrow mb-4">Serviços</p>
            <ul className="grid gap-1">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <a href="#servicos" className="inline-flex min-h-10 items-center text-[0.95rem] hover:text-primary-ink">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="eyebrow mb-4">Contato</p>
            <ul className="grid gap-1 text-[0.95rem]">
              <li>
                <a href="#cotacao" className="inline-flex min-h-10 items-center gap-1.5 hover:text-primary-ink">
                  Solicitar cotação <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </li>
              {wa ? (
                <li>
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1.5 hover:text-primary-ink">
                    WhatsApp comercial <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </li>
              ) : (
                <li className="py-2 text-muted">WhatsApp: a configurar</li>
              )}
              {site.email ? (
                <li>
                  <a href={`mailto:${site.email}`} className="inline-flex min-h-10 items-center hover:text-primary-ink">
                    {site.email}
                  </a>
                </li>
              ) : (
                <li className="py-2 text-muted">E-mail: a configurar</li>
              )}
            </ul>

            <p className="eyebrow mb-3 mt-8">Redes</p>
            {socials.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-[0.88rem] hover:border-line-strong">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {pendingSocials.length > 0 && (
              <p className="text-[0.88rem] text-muted">
                {pendingSocials.map((s) => s.label).join(' · ')} <span className="block text-[0.8rem]">Perfis configuráveis</span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-16 rounded-[var(--radius-md)] border border-dashed border-line-strong p-5 text-[0.85rem] leading-relaxed text-muted">
          <strong className="font-medium text-text">Aviso de protótipo.</strong> {site.brand} é uma marca fictícia. Rastreamento,
          painel, rede de cobertura e indicadores são demonstrativos; o simulador não calcula preços nem envia dados a
          servidores. Não há CNPJ, endereço ou telefone reais associados a este projeto.
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 text-[0.82rem] text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {site.year} {site.brand} (marca demonstrativa). Fotografias: Unsplash · Vídeo: Mixkit.
          </p>
          <p>
            Projeto e desenvolvimento{' '}
            <a href={site.agency.href} target="_blank" rel="noopener noreferrer" className="font-medium text-text underline-offset-4 hover:text-primary-ink hover:underline">
              {site.agency.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
