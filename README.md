# Rotaxis — Transporte & Logística (protótipo Or7.dev)

Protótipo comercial demonstrativo para transportadoras. Marca, rastreamento, painel, rede de cobertura e indicadores são fictícios e estão identificados como tal na interface.

## Rodar

```bash
npm install
npm run dev        # desenvolvimento
npm run typecheck  # TypeScript
npm run build      # build de produção em dist/
```

## Adaptar para um cliente

| O quê | Onde |
| --- | --- |
| Nome, descritor, e-mail, redes sociais | `src/config/site.ts` |
| WhatsApp comercial (simulador e "Falar com especialista") | `.env` → `VITE_WHATSAPP_NUMBER=55DDDNUMERO` (ver `.env.example`) |
| Fotos e vídeo da hero | `src/data/assets.ts` |
| Serviços (textos, fotos, modalidade sugerida) | `src/data/services.ts` |
| Regiões, polos e conexões do mapa | `src/data/regions.ts` |
| Remessas do painel | `src/data/shipments.ts` |
| Jornada do rastreamento demo | `src/data/tracking.ts` |
| Cores, tipografia, raios, sombras, durações | `src/index.css` (tokens) e `src/lib/motion.ts` |
| Logotipo | `Logo` em `src/components/ui/misc.tsx` e `public/favicon.svg` |

Sem número de WhatsApp configurado, o simulador oferece "Copiar solicitação" e o CTA "Falar com especialista" leva ao simulador.

## Estrutura

- `src/sections/` — seções da página (Hero, Services, Tools [cotação + rastreamento], Coverage [mapa + tecnologia], Operations, WhyUs, Contact)
- `src/components/` — FloatingNavbar, ServiceCard, FreightStepper, TrackingTimeline, RouteMap, OperationalDashboard, OperationWidget, Footer
- `src/components/ui/` — Button (Primary/Secondary), ThemeSwitch, SectionHeading, MaskText, ImageReveal, AnimatedCounter, DemoTag
- `src/data/brazil-map.ts` — contornos simplificados das UFs (gerados de GeoJSON público)

## Mídia e licenças

- Fotografias: Unsplash (Licença Unsplash), servidas pelo CDN da Unsplash com redimensionamento.
- Vídeo da hero: Mixkit (Mixkit Stock Video Free License), com poster e fallback para imagem.
- Para produção, hospede vídeo e imagens no domínio/CDN do cliente.


## GitHub Pages

Repositório: `transportadora-demo`.

Em Settings > Pages, selecione **GitHub Actions**.

Site: https://lorenzo-or7.github.io/transportadora-demo/
