/** Máscara e validação de CEP + faixa postal pelo primeiro dígito. */
export function maskCep(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 8)
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

export function cepDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function isCepComplete(value: string): boolean {
  return cepDigits(value).length === 8
}

/** Faixas iniciais dos CEPs brasileiros. Informativo — não consulta endereço. */
const RANGES: Record<string, { area: string; ufs: string }> = {
  '0': { area: 'Grande São Paulo', ufs: 'SP' },
  '1': { area: 'Interior e litoral de SP', ufs: 'SP' },
  '2': { area: 'Rio de Janeiro e Espírito Santo', ufs: 'RJ · ES' },
  '3': { area: 'Minas Gerais', ufs: 'MG' },
  '4': { area: 'Bahia e Sergipe', ufs: 'BA · SE' },
  '5': { area: 'PE, AL, PB e RN', ufs: 'PE · AL · PB · RN' },
  '6': { area: 'Região Norte, CE, PI e MA', ufs: 'CE · PI · MA · PA · AM · AP · RR · AC' },
  '7': { area: 'Centro-Oeste, TO e RO', ufs: 'DF · GO · TO · MT · MS · RO' },
  '8': { area: 'Paraná e Santa Catarina', ufs: 'PR · SC' },
  '9': { area: 'Rio Grande do Sul', ufs: 'RS' },
}

export function cepRange(value: string): { area: string; ufs: string } | null {
  const first = cepDigits(value)[0]
  if (!first || !isCepComplete(value)) return null
  return RANGES[first] ?? null
}

export function validateCep(value: string): string | null {
  const d = cepDigits(value)
  if (d.length === 0) return 'Informe o CEP.'
  if (d.length < 8) return 'O CEP precisa ter 8 dígitos.'
  if (/^(\d)\1{7}$/.test(d)) return 'Este CEP não parece válido.'
  return null
}
