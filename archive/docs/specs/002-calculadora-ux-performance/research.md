# Research y Riesgos

## Problemas detectados

- UX desktop no aprovecha ancho: inputs y resultados compiten por espacio vertical.
- Charts presentan jank con interacciones rápidas.
- Transformaciones de datos ocurren en render (parcialmente resuelto con `useMemo`).

## Opciones de librerías de charts

- Recharts (actual): fácil, pero pesado; animaciones pueden penalizar.
- visx: bajo nivel, flexible, requiere más código.
- uPlot: ultra-ligero y muy rápido; ideal para series grandes; menos componentes UI.
- ECharts: potente, buen rendimiento; bundle mayor; opción de canvas.

## Recomendación inicial

- Prototipo con uPlot para comparar rendimiento con dataset de 24/120 puntos.
- Si uPlot cierra requisitos UI, migrar; si no, mantener Recharts optimizando animaciones y downsampling.

## Riesgos y mitigaciones

- Cambio de librería implica curva de aprendizaje → realizar spike aislado en `playground/`.
- Accesibilidad y theming deben reevaluarse → checklist ARIA y tokens.
- Compatibilidad SSR → usar dynamic import con `ssr: false` para gráficos.
