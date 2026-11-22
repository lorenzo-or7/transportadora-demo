/** Fotografias da Unsplash (Licença Unsplash) servidas com redimensionamento. */
const BASE = 'https://images.unsplash.com/photo-'

export function unsplash(id: string, w: number, h?: number, q = 70): string {
  const size = h ? `&h=${h}` : ''
  return `${BASE}${id}?auto=format&fit=crop&w=${w}${size}&q=${q}`
}

export function unsplashSrcSet(id: string, widths: number[] = [480, 768, 1080, 1440, 1920]): string {
  return widths.map((w) => `${unsplash(id, w)} ${w}w`).join(', ')
}
