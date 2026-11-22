import { PHOTOS } from './assets'

export type ModalityId = 'fracionada' | 'dedicada' | 'expressa'

export interface Service {
  id: string
  index: string
  title: string
  summary: string
  points: string[]
  photo: string
  alt: string
  /** modalidade sugerida ao abrir o simulador a partir deste card */
  modality: ModalityId
  layout: 'feature' | 'tall' | 'wide' | 'compact' | 'band'
}

export const SERVICES: Service[] = [
  {
    id: 'rodoviario',
    index: '01',
    title: 'Transporte rodoviário',
    summary: 'Viagens planejadas de ponta a ponta, com rota definida, janelas de coleta e acompanhamento por etapa.',
    points: ['Rotas interestaduais', 'Planejamento de janela', 'Acompanhamento por etapa'],
    photo: PHOTOS.roadDusk,
    alt: 'Carreta baú branca em rodovia ao entardecer',
    modality: 'dedicada',
    layout: 'feature',
  },
  {
    id: 'fracionadas',
    index: '02',
    title: 'Cargas fracionadas',
    summary: 'Volumes menores consolidados com outras cargas, para enviar com regularidade sem pagar por um veículo inteiro.',
    points: ['Consolidação', 'Envios recorrentes'],
    photo: PHOTOS.warehouseCrates,
    alt: 'Caixas plásticas organizadas em linha de separação de um centro de distribuição',
    modality: 'fracionada',
    layout: 'tall',
  },
  {
    id: 'dedicadas',
    index: '03',
    title: 'Cargas dedicadas',
    summary: 'Veículo exclusivo para a sua mercadoria, sem transbordo, do embarque à entrega.',
    points: ['Sem transbordo', 'Veículo exclusivo'],
    photo: PHOTOS.truckDesert,
    alt: 'Cavalo mecânico com carreta baú estacionado em pátio aberto',
    modality: 'dedicada',
    layout: 'compact',
  },
  {
    id: 'distribuicao',
    index: '04',
    title: 'Distribuição e entregas',
    summary: 'Última milha e abastecimento de pontos de venda com roteirização e comprovante de entrega.',
    points: ['Roteirização', 'Comprovante de entrega'],
    photo: PHOTOS.truckFog,
    alt: 'Caminhão com faróis acesos em estrada sob neblina',
    modality: 'expressa',
    layout: 'compact',
  },
  {
    id: 'integrada',
    index: '05',
    title: 'Logística integrada',
    summary: 'Transporte, armazenagem e distribuição coordenados num único fluxo, com um ponto de contato para a operação toda.',
    points: ['Fluxo único', 'Um ponto de contato', 'Visão por etapa'],
    photo: PHOTOS.containerYard,
    alt: 'Vista aérea de pátio com contêineres empilhados e corredores de circulação',
    modality: 'dedicada',
    layout: 'wide',
  },
  {
    id: 'armazenagem',
    index: '06',
    title: 'Armazenagem e movimentação',
    summary: 'Recebimento, guarda, separação e expedição com controle de endereçamento.',
    points: ['Endereçamento', 'Separação e expedição'],
    photo: PHOTOS.warehouseAisle,
    alt: 'Corredor de armazém com estantes porta-paletes de grande altura',
    modality: 'fracionada',
    layout: 'band',
  },
]
