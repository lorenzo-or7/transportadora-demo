import type { CITY_POINTS, RegionId } from './brazil-map'

export type CityKey = keyof typeof CITY_POINTS

export interface RegionInfo {
  id: RegionId
  name: string
  hub: CityKey
  hubLabel: string
  /** cidades-ponto exibidas como conexões demonstrativas */
  links: (CityKey)[]
  focus: string
  modalities: string[]
  note: string
}

/**
 * Configuração ilustrativa da rede. Não representa disponibilidade real —
 * cada transportadora substitui pelos próprios polos e rotas.
 */
export const REGIONS: RegionInfo[] = [
  {
    id: 'SE',
    name: 'Sudeste',
    hub: 'SP',
    hubLabel: 'São Paulo · SP',
    links: ['BH', 'CWB', 'GYN', 'SSA'],
    focus: 'Polo de consolidação e redistribuição',
    modalities: ['Fracionada', 'Dedicada', 'Distribuição urbana'],
    note: 'Exemplo de região com operação diária e cross-docking.',
  },
  {
    id: 'S',
    name: 'Sul',
    hub: 'CWB',
    hubLabel: 'Curitiba · PR',
    links: ['POA', 'SP'],
    focus: 'Corredor Sul–Sudeste',
    modalities: ['Fracionada', 'Dedicada'],
    note: 'Exemplo de corredor com saídas programadas por janela.',
  },
  {
    id: 'CO',
    name: 'Centro-Oeste',
    hub: 'GYN',
    hubLabel: 'Goiânia · GO',
    links: ['CGB', 'SP', 'BH'],
    focus: 'Conexão com o interior e o agronegócio',
    modalities: ['Dedicada', 'Armazenagem'],
    note: 'Exemplo de região atendida por cargas dedicadas.',
  },
  {
    id: 'NE',
    name: 'Nordeste',
    hub: 'REC',
    hubLabel: 'Recife · PE',
    links: ['SSA', 'FOR', 'SP'],
    focus: 'Distribuição regional a partir de polo litorâneo',
    modalities: ['Fracionada', 'Distribuição'],
    note: 'Exemplo de região com distribuição a partir de um polo.',
  },
  {
    id: 'N',
    name: 'Norte',
    hub: 'MAO',
    hubLabel: 'Manaus · AM',
    links: ['BEL', 'CGB'],
    focus: 'Operações sob planejamento',
    modalities: ['Dedicada', 'Sob consulta'],
    note: 'Exemplo de região atendida sob consulta e planejamento prévio.',
  },
]
