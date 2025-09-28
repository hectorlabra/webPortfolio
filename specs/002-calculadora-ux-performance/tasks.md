# Tasks: UX Desktop + Performance (Calculadora)

## Fase 4.1 – Foundation (Wizard 3 pasos)

- [x] T101 Crear Wizard 3 pasos (1 Producto/objetivo, 2 Mercado/retención, 3 Horizonte/resultados)
- [x] T102 Layout 2 columnas dentro del wizard (A formulario sticky, B contexto)
- [x] T103 Validación por paso + guardado en localStorage
- [x] T104 Code-splitting: `ComparisonChart` e `InsightsPanel` con `next/dynamic`

## Fase 4.2 – Charts

- [x] T110 Spike: Prototipo `uPlot` en `playground/charts/uplot-demo.tsx`
- [x] T111 Instrumentar medición de render (perf.now) para 24/120 puntos
- [x] T112 Decide: mantener Recharts optimizado vs migrar a uPlot
- [x] T113 Implementar downsampling y desactivar animaciones en interacciones rápidas
- [x] T114 Gating: montar charts solo en Paso 3 con inputs válidos
- [x] T115 Dynamic import del chart con `ssr: false`
- [x] T116 Guardas de tamaño: no render si `containerWidth/height === 0`
- [x] T117 Desactivar animaciones y simplificar tooltip/legend
- [x] T118 Memo de datasets y throttle en interacciones

## Fase 4.3 – Performance

- [x] T120 Memo cache para cálculos por hash de inputs en `lib/calculations.ts`
- [ ] T121 Virtualizar lista mensual en `ResultsDisplay` (si > 60 ítems)
- [ ] T122 `useTransition`/`useDeferredValue` en inputs más pesados
- [ ] T123 Web Worker opcional para cálculos (si profiling lo justifica)
- [ ] T124 Debounce/commit de cálculos al avanzar de paso

## Fase 4.4 – UX y Accesibilidad

- [ ] T130 Inputs plegables por sección y ayuda contextual mejorada
- [ ] T131 Atajos de teclado (/, g r, g c) y focos visibles
- [ ] T132 Revisar textos: títulos, “Próximos Pasos Recomendados” y microcopy

## Fase 4.5 – QA y Medición

- [ ] T140 Scripts/guía para Lighthouse y Web Vitals
- [ ] T141 Actualizar pruebas Vitest/Playwright para nuevo layout
- [ ] T142 Reporte antes/después en `report.md`
- [ ] T143 Triage de regressions en charts (SSR/hidratación, resize, jank)

## Reglas

- Commit por tarea
- Si una tarea implica refactor grande, hacer PR separado
