/**
 * Configuração da identidade demonstrativa.
 * Para adaptar a uma transportadora real, altere este arquivo
 * e as imagens em data/assets.ts.
 */
export interface SocialLink {
  label: string
  href: string
}

const envWhatsapp = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? ''

const socials: SocialLink[] = [
  { label: 'LinkedIn', href: '' },
  { label: 'Instagram', href: '' },
  { label: 'YouTube', href: '' },
]

export const site = {
  brand: 'Rotaxis',
  descriptor: 'Transporte & Logística',
  /** Somente dígitos com DDI + DDD. Vazio = simulador oferece "copiar solicitação". */
  whatsappNumber: envWhatsapp.replace(/\D/g, ''),
  /** Deixe vazio enquanto não houver contato real — nada é inventado. */
  email: '',
  /** Redes sociais configuráveis. Itens sem href aparecem como "a configurar", sem link. */
  socials,
  agency: { name: 'Or7.dev', href: 'https://or7.dev' },
  year: new Date().getFullYear(),
}

export const NAV_ITEMS = [
  { id: 'servicos', label: 'Serviços' },
  { id: 'cobertura', label: 'Cobertura' },
  { id: 'tecnologia', label: 'Tecnologia' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'contato', label: 'Contato' },
] as const

export type NavId = (typeof NAV_ITEMS)[number]['id']
