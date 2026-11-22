/** Remessas fictícias do painel demonstrativo. */
export type ShipmentStatus = 'coleta' | 'transito' | 'distribuicao' | 'entregue'

export interface Shipment {
  code: string
  client: string
  origin: string
  destination: string
  region: 'Sul' | 'Sudeste' | 'Centro-Oeste' | 'Nordeste' | 'Norte'
  status: ShipmentStatus
  progress: number
  eta: string
  alert?: { level: 'atencao' | 'critico'; text: string }
}

export const SHIPMENTS: Shipment[] = [
  { code: 'DM-4821', client: 'Cliente A', origin: 'Campinas · SP', destination: 'Curitiba · PR', region: 'Sul', status: 'transito', progress: 62, eta: 'Hoje · 18h' },
  { code: 'DM-4822', client: 'Cliente B', origin: 'Contagem · MG', destination: 'Vitória · ES', region: 'Sudeste', status: 'distribuicao', progress: 88, eta: 'Hoje · 14h' },
  { code: 'DM-4823', client: 'Cliente C', origin: 'Goiânia · GO', destination: 'Brasília · DF', region: 'Centro-Oeste', status: 'transito', progress: 45, eta: 'Amanhã · 10h', alert: { level: 'atencao', text: 'Parada não programada · 25 min' } },
  { code: 'DM-4824', client: 'Cliente A', origin: 'Guarulhos · SP', destination: 'Rio de Janeiro · RJ', region: 'Sudeste', status: 'entregue', progress: 100, eta: 'Concluída' },
  { code: 'DM-4825', client: 'Cliente D', origin: 'Recife · PE', destination: 'Natal · RN', region: 'Nordeste', status: 'coleta', progress: 8, eta: 'Coleta · 15h' },
  { code: 'DM-4826', client: 'Cliente E', origin: 'Joinville · SC', destination: 'Porto Alegre · RS', region: 'Sul', status: 'entregue', progress: 100, eta: 'Concluída' },
  { code: 'DM-4827', client: 'Cliente B', origin: 'Salvador · BA', destination: 'Aracaju · SE', region: 'Nordeste', status: 'transito', progress: 34, eta: 'Amanhã · 09h', alert: { level: 'critico', text: 'Janela de entrega em risco' } },
  { code: 'DM-4828', client: 'Cliente F', origin: 'Cuiabá · MT', destination: 'Campo Grande · MS', region: 'Centro-Oeste', status: 'entregue', progress: 100, eta: 'Concluída' },
  { code: 'DM-4829', client: 'Cliente C', origin: 'Belém · PA', destination: 'São Luís · MA', region: 'Norte', status: 'transito', progress: 51, eta: 'Amanhã · 16h' },
  { code: 'DM-4830', client: 'Cliente D', origin: 'Sorocaba · SP', destination: 'Ribeirão Preto · SP', region: 'Sudeste', status: 'distribuicao', progress: 92, eta: 'Hoje · 11h' },
  { code: 'DM-4831', client: 'Cliente E', origin: 'Londrina · PR', destination: 'Maringá · PR', region: 'Sul', status: 'entregue', progress: 100, eta: 'Concluída' },
  { code: 'DM-4832', client: 'Cliente F', origin: 'Fortaleza · CE', destination: 'Teresina · PI', region: 'Nordeste', status: 'coleta', progress: 4, eta: 'Coleta · 17h' },
]

export const STATUS_LABEL: Record<ShipmentStatus, string> = {
  coleta: 'Aguardando coleta',
  transito: 'Em trânsito',
  distribuicao: 'Em distribuição',
  entregue: 'Entregue',
}
