/** Dados 100% demonstrativos. Não há integração com transportadora real. */

export const DEMO_TRACKING_CODE = 'DEMO-OR7-2026'

export type StageId = 'aguardando' | 'coletado' | 'transporte' | 'distribuicao' | 'entregue'

export interface Stage {
  id: StageId
  label: string
  short: string
  description: string
}

export const STAGES: Stage[] = [
  { id: 'aguardando', label: 'Aguardando coleta', short: 'Coleta', description: 'Solicitação registrada e janela de coleta agendada.' },
  { id: 'coletado', label: 'Coletado', short: 'Coletado', description: 'Carga conferida e embarcada no veículo.' },
  { id: 'transporte', label: 'Em transporte', short: 'Trânsito', description: 'Veículo em rota entre a origem e a unidade de destino.' },
  { id: 'distribuicao', label: 'Em distribuição', short: 'Distribuição', description: 'Carga na unidade local, saindo para entrega.' },
  { id: 'entregue', label: 'Entregue', short: 'Entregue', description: 'Entrega concluída e comprovante registrado.' },
]

export interface TrackingEvent {
  stage: StageId
  time: string
  place: string
  text: string
}

/** Histórico completo; o painel mostra os eventos até a etapa selecionada. */
export const DEMO_EVENTS: TrackingEvent[] = [
  { stage: 'aguardando', time: 'Dia 1 · 08:10', place: 'Campinas · SP', text: 'Solicitação recebida e coleta programada.' },
  { stage: 'aguardando', time: 'Dia 1 · 09:40', place: 'Campinas · SP', text: 'Veículo designado para a janela das 14h.' },
  { stage: 'coletado', time: 'Dia 1 · 14:25', place: 'Campinas · SP', text: 'Carga coletada: 12 volumes conferidos.' },
  { stage: 'coletado', time: 'Dia 1 · 16:05', place: 'Campinas · SP', text: 'Documentação validada, saída liberada.' },
  { stage: 'transporte', time: 'Dia 1 · 21:30', place: 'Registro · SP', text: 'Parada programada concluída.' },
  { stage: 'transporte', time: 'Dia 2 · 06:15', place: 'Curitiba · PR', text: 'Chegada à unidade de destino.' },
  { stage: 'distribuicao', time: 'Dia 2 · 08:40', place: 'Curitiba · PR', text: 'Saiu para entrega — rota 3 de 5.' },
  { stage: 'entregue', time: 'Dia 2 · 11:52', place: 'Curitiba · PR', text: 'Entregue. Recebido por: responsável no local.' },
]

export const DEMO_SHIPMENT = {
  code: DEMO_TRACKING_CODE,
  cargo: '12 volumes · carga paletizada',
  weight: '1.840 kg (exemplo)',
  origin: { city: 'Campinas', uf: 'SP' },
  destination: { city: 'Curitiba', uf: 'PR' },
  modality: 'Carga fracionada',
  eta: 'Dia 2 · até 18h',
}
