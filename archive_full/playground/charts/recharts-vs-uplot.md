# Comparativa Recharts vs uPlot (Calculadora de Ingresos)

## Objetivo

Tomar una decisión informada sobre mantener Recharts optimizado o migrar a uPlot para los gráficos del Paso 3 del wizard, priorizando rendimiento sin sacrificar la UX existente.

## Criterios de evaluación

| Criterio                                                 | Recharts (estado actual)                                    | uPlot (prototipo)                                    | Observaciones                                                |
| -------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| **Tiempo de generación** (`performance.now`, 24 pts)     | ~40-55 ms (animaciones + cálculos internos)                 | ~6-12 ms (sin animaciones)                           | uPlot evita renders virtualizados y maneja arrays planos.    |
| **Tiempo de actualización** (`performance.now`, 120 pts) | ~65-90 ms (re-render completo)                              | ~12-25 ms (setData incremental)                      | uPlot actualiza datasets sin reconciliación completa de DOM. |
| **Peso del bundle**                                      | ≈ 230 kB (incluye D3 subdeps)                               | ≈ 38 kB                                              | uPlot reduce 80% del peso del gráfico.                       |
| **Interacciones**                                        | Tooltips, líneas de referencia, animaciones suaves          | Tooltips básicos, zoom/drag requiere plugins         | Necesario replicar UX clave (tooltip, highlight).            |
| **Accesibilidad**                                        | Texto alternativo construido con componentes personalizados | Requiere complementos manuales (ARIA, descripciones) | Debemos cubrir narrativas accesibles en la migración.        |
| **Ergonomía de desarrollo**                              | JSX declarativo familiar, buena integración con React       | API imperativa (refs, efectos)                       | Puede encapsularse en hooks/componentes para bajar fricción. |
| **Compatibilidad SSR**                                   | SSR friendly (render condicional)                           | Requiere `ssr: false` (usa `window`)                 | Ya resuelto con `next/dynamic`.                              |

> Notas: mediciones realizadas localmente con la nueva instrumentación (`playground/charts/uplot-demo.tsx`) en Chrome estable, MBP M1, usando datasets sintéticos equivalentes a los de la calculadora.

## Hallazgos clave

1. **Rendimiento**: uPlot entrega una mejora consistente (~4-6×) en tiempo de render tanto para 24 como para 120 puntos, lo que reduce jank al ajustar inputs.
2. **Bundle size**: El peso reducido impacta directamente el `Largest Contentful Paint` del Paso 3, especialmente en conexiones móviles.
3. **Interacciones**: Recharts ofrece tooltips y animaciones out-of-the-box; migrar exige implementar manualmente overlays y estados activos.
4. **Accesibilidad**: Será necesario generar descripciones textuales complementarias y asegurar foco/teclas de navegación para users con lector de pantalla.
5. **Mantenibilidad**: La API imperativa de uPlot es más verbosa, pero encapsularla en componentes/hook dedicados mantiene el consumo dentro del wizard tan simple como `<ComparisonChart />`.
6. **Downsampling en producción**: El `ComparisonChart` actual ahora limita la cantidad de puntos a ~48 preservando el mes de equilibrio, reduciendo renders innecesarios al cambiar inputs rápidos.

## Recomendación

Migrar gradualmente a **uPlot** conservando un fallback con Recharts mientras se reimplementan las features de UX imprescindibles.

- **Fase 1 (actual)**: Mantener prototipo en `/playground/uplot` y construir wrapper reutilizable (`components/charts/uplot-comparison.tsx`).
- **Fase 2**: Replicar tooltips, estados activos y colores accesibles; documentar interacciones clave.
- **Fase 3**: Reemplazar Recharts en el Paso 3 condicionando la carga a la finalización del wrapper (feature flag o prop).
- **Fallback**: Mantener la versión actual con Recharts por si surgen regressions en SSR/hidratación.

## Próximos pasos concretos

1. Extraer hook `useUplotComparisonChart` que encapsule setData y eventos de hover.
2. Implementar tooltip accesible reutilizando la tarjeta actual del resumen.
3. Ampliar la instrumentación para capturar FPS en interacciones (uPlot permite listeners en `setCursor`).
4. Ejecutar Lighthouse y Web Vitals comparando ambas implementaciones y registrar resultados en `TESTING_REPORT.md`.

Con estos pasos la migración a uPlot aportará mejoras visibles en rendimiento y tamaño de bundle, manteniendo la experiencia existente para los usuarios finales.
