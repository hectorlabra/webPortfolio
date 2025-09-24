# KPIs y Medición

## Métricas Objetivo

- Lighthouse Desktop Performance ≥ 90
- Time to Interactive (TTI) ≤ 2.0s
- First Input Delay (FID) (o INP) ≤ 100ms
- Cumulative Layout Shift (CLS) < 0.02
- FPS ≥ 55 durante interacción con sliders y tabs
- Render de charts:
  - 24 puntos < 100ms
  - 120 puntos < 300ms

## Herramientas

- Lighthouse (CI opcional o manual)
- Web Vitals (INP, LCP, CLS) con `web-vitals` o `@vercel/analytics` si aplica
- React Profiler (flamegraph de renders)
- Performance panel del navegador (markers, FPS)

## Procedimiento de Medición

1. Correr Lighthouse en Desktop (modo incognito, sin extensiones).
2. Registrar Web Vitals en consola durante la sesión.
3. Perfil de render al mover sliders 10s, capturar FPS y commits.
4. Medir tiempo de render de charts con `performance.now()` alrededor de `transformToChartData` y render.

## Reporte

- Guardar hallazgos en `specs/002-calculadora-ux-performance/report.md` con tablas comparativas antes/después.
