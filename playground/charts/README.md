# Playground de Charts

Este directorio contiene experimentos orientados a optimizar los gráficos de la calculadora de ingresos.

## uPlot Demo

- **Archivo principal**: `uplot-demo.tsx`
- **Ruta de prueba**: `/playground/uplot`
- **Objetivo**: Medir el tiempo de generación y render frente a datasets de 24 y 120 puntos, comparándolo con la
  implementación actual basada en Recharts.

### Ejecutar localmente

```bash
pnpm dev
```

Luego, visita `http://localhost:3000/playground/uplot` para interactuar con el prototipo.

### Métricas capturadas

La interfaz muestra, para cada dataset (24 y 120 puntos):

- Tiempo de generación (`performance.now`) antes de renderizar.
- Primera renderización registrada (sirve como línea base por dataset).
- Última medición y número de muestras acumuladas.
- Marca de tiempo de la medición más reciente.

Además, se conserva un historial (últimas 8 muestras) con detalle de modo, tipo de medición (inicial/actualización) y duración en ms. Cada cambio de dataset también emite un `console.info` con el mismo resumen para poder copiar resultados rápidamente.

### Cómo registrar nuevas mediciones

1. Cambia entre “Dataset corto (24)” y “Dataset largo (120)” para forzar nuevos renders.
2. Observa la tarjeta de métricas y el historial para ver cómo cambian los tiempos.
3. Copia los logs de consola si necesitas adjuntarlos a un reporte o comparar contra Recharts.
4. Repite el proceso tras ajustar estilos/datasets para obtener mediciones comparables.

### Próximos pasos sugeridos

1. Conectar datasets reales de la calculadora para contrastar resultados.
2. Instrumentar métricas adicionales (memoria, FPS) y anotar hallazgos.
3. Documentar comparativas con Recharts en `TESTING_REPORT.md` o un reporte dedicado.
