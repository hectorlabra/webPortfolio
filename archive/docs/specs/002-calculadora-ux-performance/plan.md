# Plan: UX Desktop + Performance para Calculadora de Ingresos

Estado: Draft
Responsable: hectorlabra
Fecha: 2025-09-24

## Objetivos

- UX: Rediseñar la experiencia en escritorio para mayor claridad, velocidad de comprensión y foco en tareas clave.
- Performance: Reducir coste de render y carga, optimizar cálculos y gráficos, mejorar Core Web Vitals.

## Alcance

- Desktop-first layout (≥1280px) con adaptación fluida a 1024–1440–>.
- Reorganización de la página: Inputs a la izquierda (sticky), Resultados y Charts a la derecha con navegación local.
- Sustitución/optimización de charts: evaluar Recharts vs. alternativas (visx, ECharts, uPlot) y lazy chunking.
- Optimización de cálculos: memoización, diferido, throttling y off-main-thread (Web Worker opcional).
- Medición: Lighthouse, Web Vitals, React Profiler, Performance panel.

## No Alcance (por ahora)

- Nuevas features de negocio (reportes PDF reales, cuenta de usuario, etc.).
- Cambios de branding o diseño visual mayor.

## Arquitectura UX Desktop

- Wizard de 3 pasos (flujo guiado) con guardado local entre pasos:
  - Paso 1: Producto y objetivo
    - Campos: modelo (único/suscripción), precio, coste base, objetivo opcional.
    - Acción: Continuar → valida mínimos, guarda, no calcula aún.
  - Paso 2: Mercado y retención
    - Campos: clientes/mes o ARPU, churn, CAC opcional.
    - Acción: Continuar → calcula preliminar sin montar charts.
  - Paso 3: Horizonte y resultados
    - Campos: horizonte temporal, sensibilidades opcionales.
    - Acción: Ver resultados → calcula definitivo y monta charts.
- Layout a 2 columnas en desktop dentro del wizard:
  - Columna A (30–35%): formulario del paso (sticky en desktop).
  - Columna B (65–70%): vista contextual del paso (resumen compacto en 1–2, resultados en 3).
- AppBar local en Columna B con anclas (“Resumen”, “Gráfico”, “Insights”, “Próximos pasos”) solo en Paso 3.
- Estados: skeletons y errores aislados por sección; chart se monta solo en Paso 3 con datos válidos.
- Accesibilidad: ARIA para regiones, foco visible, teclas rápidas básicas (/, g r, g c).

## Estrategia de Rendimiento

- Carga:
  - Gating: no montar charts hasta Paso 3 y con inputs válidos.
  - Code-splitting de secciones pesadas (Charts, Insights).
  - `next/dynamic` con `ssr: false` para charts si es necesario.
  - Lazy-import de librería de charts cuando existan resultados.
- Render:
  - `useDeferredValue` para resultados y horizontes (ya iniciado).
  - `useMemo`/`memo` para transformaciones (ya iniciado en Charts).
  - Virtualización para listas largas (mensual breakdown).
- Cálculo:
  - Debounce/commit por paso: calcular al continuar cada paso, no en cada keystroke.
  - Memoizar cálculos por inputs con hash simple.
  - Desacoplar a Web Worker si el payload crece.
- Gráficos:
  - Evaluar alternativas: uPlot (muy ligero), visx (flexible), ECharts (potente + offscreen canvas opcional).
  - Limitar puntos renderizados (downsampling) y activar animations/light mode condicional.

## Problemas conocidos de Charts y Fix táctico

- Síntomas:

  - Errores intermitentes de hidratación/SSR cuando el chart intenta montarse en server.
  - `ResponsiveContainer` con width/height 0 en el primer render → gráfico no visible o reflow brusco.
  - Animaciones y tooltips costosos provocan jank y alto uso de CPU.
  - Re-renders encadenados por cambios frecuentes de props/state.

- Causas probables:

  - Montaje del chart antes de que el contenedor tenga tamaño calculado.
  - SSR/hidratación de componentes que dependen de `window` y medidas.
  - Falta de memoización en datos transformados/series.

- Fix táctico (previo a una migración de librería si fuera necesaria):
  - Importación dinámica con `ssr: false` para el módulo de charts.
  - Guardas de render: no montar chart hasta Paso 3 y hasta que el contenedor reporte tamaño > 0.
  - Desactivar animaciones por defecto y simplificar tooltips.
  - `useMemo` para datasets/series y throttling/debounce en interacciones.
  - Manejo de resize con `ResizeObserver` (o efecto) para recalcular solo cuando cambie el tamaño.

## Criterios de Aceptación

- UX:
  - Wizard 3 pasos con progresión clara, validación y guardado entre pasos.
  - Layout desktop de 2 columnas estable y sin reflows molestos.
  - Tiempo de primera interacción < 100ms al modificar inputs.
  - Navegación de teclado completa por inputs y tabs.
- Performance:
  - Lighthouse Performance ≥ 90 en Desktop.
  - TTI ≤ 2.0s en hardware medio; CLS < 0.02.
  - FPS estable ≥ 55 durante interacción con sliders.
- Charts:
  - Render < 100ms con 24 puntos; < 300ms con 120 puntos.
  - Interacción fluida sin jank visible.

## Entregables

- Nuevo layout con navegación local.
- Charts optimizados o reemplazados.
- Estrategia de medición integrada (scripts y docs).
- Suite de pruebas actualizada (unit/integration/e2e) para nuevas interacciones.

## Dependencias

- Next.js 15, React 19, Tailwind, Shadcn/UI.
- Librería de charts a decidir.

## Riesgos

- Cambio de librería de charts implica refactor mayor.
- Posibles regresiones de accesibilidad tras el rediseño.
- Trabajos en paralelo pueden tocar el layout.

## Plan de Comunicación

- PRs pequeños por feature (layout, charts, workers).
- Demo interna después de cada sub-fase.
