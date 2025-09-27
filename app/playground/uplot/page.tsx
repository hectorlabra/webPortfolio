import dynamic from "next/dynamic";
import type { Metadata } from "next";

const UPlotDemo = dynamic(
  () => import("@/playground/charts/uplot-demo").then((mod) => mod.UPlotDemo),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[360px] w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm text-white/70">
        Cargando demo de uPlot…
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: "uPlot Playground",
  description:
    "Prototipo de uPlot para evaluar rendimiento frente a Recharts en la calculadora de ingresos.",
};

export default function UPlotPlaygroundPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <section className="space-y-2 text-white">
        <h1 className="text-2xl font-semibold">Playground uPlot</h1>
        <p className="text-sm text-white/70">
          Usa este entorno para contrastar la renderización de uPlot con los
          recursos actuales de la calculadora. Cambia el dataset entre 24 y 120
          puntos para observar diferencias en tiempos de generación y dibujado.
        </p>
      </section>
      <UPlotDemo />
      <section className="rounded-xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-white/70">
        <h2 className="mb-2 text-base font-medium text-white">Notas rápidas</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            uPlot se importa sin SSR para evitar referencias a{" "}
            <code>window</code> en el servidor.
          </li>
          <li>
            La demo captura tiempos de generación y renderizado mediante{" "}
            <code>performance.now()</code>.
          </li>
          <li>
            Ajusta los estilos o datasets según necesites para comparar con el
            comportamiento actual de Recharts en la calculadora.
          </li>
        </ul>
      </section>
    </main>
  );
}
