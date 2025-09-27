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

### Próximos pasos sugeridos

1. Conectar datasets reales de la calculadora para contrastar resultados.
2. Instrumentar métricas adicionales (memoria, FPS) y anotar hallazgos.
3. Documentar comparativas con Recharts en `TESTING_REPORT.md` o un reporte dedicado.
