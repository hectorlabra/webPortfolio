"use client";

import {
  useState,
  useCallback,
  useDeferredValue,
  type ComponentType,
} from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calculator,
  TrendingUp,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Check,
  RefreshCw,
} from "lucide-react";
import { useCalculator } from "@/app/calculadora/hooks/use-calculator";
import { useLocalStorage } from "@/app/calculadora/hooks/use-local-storage";
import { CalculatorInputs } from "@/app/calculadora/components/calculator-inputs";
import { ResultsDisplay } from "@/app/calculadora/components/results-display";
import { InsightsPanel } from "@/app/calculadora/components/insights-panel";
import { CTASection } from "@/app/calculadora/components/cta-section";
import { ResultsSkeleton } from "@/app/calculadora/components/results-skeleton";
import { CalculatorErrorBoundary } from "@/app/calculadora/components/calculator-error-boundary";
import { DEFAULT_INPUTS } from "@/lib/types/calculator";
import type { ComparisonChartProps } from "@/app/calculadora/components/comparison-chart";

const ComparisonChart = dynamic(
  () =>
    import("@/app/calculadora/components/comparison-chart").then(
      (mod) => mod.ComparisonChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[360px] items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm text-white/60">
        Cargando visualización...
      </div>
    ),
  }
) as ComponentType<ComparisonChartProps>;

export default function CalculadoraPage() {
  // Calculator state and logic
  const {
    inputs,
    results,
    isCalculating,
    hasResults,
    validationErrors,
    isValid,
    shouldShowResults,
    handleInputChange,
    resetInputs,
  } = useCalculator({
    autoCalculate: true,
    debounceMs: 500,
    onCalculationComplete: (results) => {
      console.log("Cálculo completado:", results);
    },
    onValidationError: (errors) => {
      console.log("Errores de validación:", errors);
    },
  });

  // Local storage for persistence
  const {
    loadFromStorage,
    debouncedSave,
    clearStorage,
    hasStorageSupport,
    lastSaved,
  } = useLocalStorage({
    onLoad: (loadedInputs) => {
      // Load inputs from storage on initial load
      Object.entries(loadedInputs).forEach(([key, value]) => {
        if (key in DEFAULT_INPUTS) {
          handleInputChange(key as keyof typeof DEFAULT_INPUTS, value);
        }
      });
    },
    onSave: () => {
      console.log("Estado guardado en localStorage");
    },
  });

  // Auto-save inputs to localStorage
  const handleInputChangeWithSave = useCallback(
    (field: keyof typeof inputs, value: number) => {
      handleInputChange(field, value);

      // Save to localStorage with debouncing
      if (hasStorageSupport) {
        const updatedInputs = { ...inputs, [field]: value };
        debouncedSave(updatedInputs);
      }
    },
    [handleInputChange, inputs, debouncedSave, hasStorageSupport]
  );

  // Defer heavy renders to keep interactions snappy
  const deferredResults = useDeferredValue(results);
  const deferredTimeHorizon = useDeferredValue(inputs.timeHorizon);
  const deferredChurnRate = useDeferredValue(inputs.churnRate);
  const renderableResults = deferredResults ?? results;
  const renderableTimeHorizon = deferredTimeHorizon ?? inputs.timeHorizon;
  const renderableChurnRate = deferredChurnRate ?? inputs.churnRate;

  // Handle manual calculations (if auto-calculate is disabled)
  const handleManualCalculation = useCallback(() => {
    // Manual calculation logic would go here if needed
    console.log("Cálculo manual disparado");
  }, []);

  // Handle reset with confirmation
  const handleReset = useCallback(() => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres borrar todos los datos y empezar de nuevo?"
      )
    ) {
      resetInputs();
      clearStorage();
    }
  }, [resetInputs, clearStorage]);

  // Handle download report
  const handleDownloadReport = useCallback(() => {
    if (!results) return;

    // TODO: Implement PDF generation
    console.log("Descargando reporte...");
    alert("Funcionalidad de descarga en desarrollo");
  }, [results]);

  // Handle share results
  const handleShareResults = useCallback(async () => {
    if (!results) return;

    try {
      const shareText = `Comparé modelo único vs suscripción: ${
        results.profitDifference > 0 ? "Suscripción" : "Único"
      } es más rentable por $${Math.abs(results.profitDifference).toFixed(
        2
      )} en ${inputs.timeHorizon} meses.`;

      if (navigator.share) {
        await navigator.share({
          title: "Calculadora de Ingresos - Resultados",
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          `${shareText}\n\n${window.location.href}`
        );
        alert("Resultados copiados al portapapeles");
      }
    } catch (error) {
      console.error("Error compartiendo:", error);
    }
  }, [results, inputs.timeHorizon]);

  // Handle consultation scheduling
  const handleScheduleConsultation = useCallback(() => {
    // Redirect to contact section or open calendar
    window.open("/quien-soy#contacto", "_blank");
  }, []);

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full min-h-[50vh] flex items-center py-16 sm:py-20">
          <div className="container flex-1 flex flex-col justify-center px-4 md:px-6 relative">
            <div className="text-center space-y-6">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <Calculator className="h-8 w-8 text-[#64E365]" />
                  <h1 className="font-mono text-3xl sm:text-4xl font-bold text-white">
                    Calculadora de Ingresos
                  </h1>
                </div>

                <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto">
                  Compara modelo único vs suscripción para transformar tu
                  infoproducto en un micro-SaaS rentable
                </p>

                {/* Features badges */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <Badge
                    variant="outline"
                    className="border-white/20 text-white/80 bg-white/5"
                  >
                    <TrendingUp className="h-4 w-4 mr-1 text-[#64E365]" />
                    Análisis Financiero
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-white/20 text-white/80 bg-white/5"
                  >
                    <BarChart3 className="h-4 w-4 mr-1 text-[#64E365]" />
                    Visualización Interactiva
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-white/20 text-white/80 bg-white/5"
                  >
                    <Lightbulb className="h-4 w-4 mr-1 text-[#64E365]" />
                    Insights Inteligentes
                  </Badge>
                </div>
              </div>

              {/* Storage Status */}
              {hasStorageSupport && lastSaved && (
                <Alert className="max-w-md mx-auto bg-white/5 border-white/20">
                  <Calculator className="h-4 w-4 text-[#64E365]" />
                  <AlertDescription className="text-white/80">
                    Datos guardados automáticamente:{" "}
                    {lastSaved.toLocaleTimeString()}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </section>

        {/* Main Calculator Section */}
        <section className="w-full py-8 sm:py-12">
          <div className="container px-4 md:px-6">
            {/* Calculator Card */}
            <Card className="bg-white/5 border-white/20 shadow-lg backdrop-blur animate-circular-glow">
              <CardHeader className="space-y-4 text-center sm:text-left pb-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="font-mono text-lg sm:text-xl text-white">
                    Configuración del Análisis
                  </CardTitle>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white/70 hover:text-white hover:border-white/40 bg-transparent w-full sm:w-auto"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Reiniciar
                  </Button>
                </div>
                <CardDescription className="text-white/70">
                  Ajusta los parámetros de tu producto para ver la comparación
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8" aria-busy={isCalculating}>
                {/* Calculator Inputs */}
                <div>
                  <CalculatorInputs
                    inputs={inputs}
                    onInputChangeAction={handleInputChangeWithSave}
                    onCalculate={handleManualCalculation}
                    validationErrors={validationErrors}
                    isCalculating={isCalculating}
                    canCalculate={isValid}
                    autoCalculate={true}
                  />
                </div>

                {/* Results Section */}
                <CalculatorErrorBoundary onRetry={handleReset}>
                  {isCalculating && !shouldShowResults ? (
                    <div className="pt-6 border-t border-white/20">
                      <ResultsSkeleton />
                    </div>
                  ) : shouldShowResults && renderableResults ? (
                    <div className="space-y-8 pt-6 border-t border-white/20">
                      {/* Results Display */}
                      <div>
                        <h3 className="font-mono text-lg font-semibold text-white mb-4">
                          📊 Resultados del Análisis
                        </h3>
                        <ResultsDisplay
                          results={renderableResults}
                          timeHorizon={renderableTimeHorizon}
                        />
                      </div>

                      {/* Comparison Chart */}
                      <div>
                        <h3 className="font-mono text-lg font-semibold text-white mb-4">
                          📈 Comparación Visual
                        </h3>
                        <ComparisonChart
                          results={renderableResults}
                          timeHorizon={renderableTimeHorizon}
                        />
                      </div>

                      {/* Insights */}
                      <div>
                        <h3 className="font-mono text-lg font-semibold text-white mb-4">
                          💡 Recomendaciones Inteligentes
                        </h3>
                        <InsightsPanel
                          results={renderableResults}
                          timeHorizon={renderableTimeHorizon}
                          churnRate={renderableChurnRate}
                        />
                      </div>

                      {/* Call to Action */}
                      <div>
                        <h3 className="font-mono text-lg font-semibold text-white mb-4">
                          🚀 Próximos Pasos
                        </h3>
                        <CTASection
                          results={renderableResults}
                          timeHorizon={renderableTimeHorizon}
                          onDownloadReport={handleDownloadReport}
                          onShareResults={handleShareResults}
                          onScheduleConsultation={handleScheduleConsultation}
                        />
                      </div>
                    </div>
                  ) : (
                    /* Empty State */
                    <div className="text-center py-12 border-2 border-dashed border-white/20 rounded-lg bg-white/5">
                      <Calculator className="h-16 w-16 text-white/40 mx-auto mb-4" />
                      <h3 className="font-mono text-lg font-semibold text-white/70 mb-2">
                        Configura tu producto arriba
                      </h3>
                      <p className="text-white/60 max-w-md mx-auto">
                        Los resultados aparecerán automáticamente mientras
                        ajustas los parámetros
                      </p>
                    </div>
                  )}
                </CalculatorErrorBoundary>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Information Section */}
        <section className="w-full py-16 sm:py-20">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h2 className="font-mono text-2xl sm:text-3xl font-bold text-white">
                  ¿Cómo funciona esta calculadora?
                </h2>
                <p className="text-lg text-white/70 max-w-2xl mx-auto">
                  Desarrollado para emprendedores que quieren transformar sus
                  productos digitales en negocios recurrentes
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 border border-white/20 rounded-full flex items-center justify-center mx-auto">
                    <Calculator className="h-8 w-8 text-[#64E365]" />
                  </div>
                  <h3 className="font-mono text-lg font-semibold text-white">
                    Cálculos Precisos
                  </h3>
                  <p className="text-white/70">
                    Utiliza fórmulas estándar de SaaS: LTV, CAC, churn rate, y
                    período de recuperación
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 border border-white/20 rounded-full flex items-center justify-center mx-auto">
                    <BarChart3 className="h-8 w-8 text-[#64E365]" />
                  </div>
                  <h3 className="font-mono text-lg font-semibold text-white">
                    Visualización Clara
                  </h3>
                  <p className="text-white/70">
                    Gráficos interactivos que muestran la evolución de ingresos
                    y punto de equilibrio
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 border border-white/20 rounded-full flex items-center justify-center mx-auto">
                    <Lightbulb className="h-8 w-8 text-[#64E365]" />
                  </div>
                  <h3 className="font-mono text-lg font-semibold text-white">
                    Insights Inteligentes
                  </h3>
                  <p className="text-white/70">
                    Recomendaciones personalizadas basadas en tus números
                    específicos
                  </p>
                </div>
              </div>

              {/* CTA Final */}
              <div className="pt-8">
                <Button className="bg-[#FFD100] text-[#0a0612] hover:bg-[#FFD100]/90 font-bold shadow-[0_0_10px_rgba(255,210,0,0.5)]">
                  EMPIEZA TU ANÁLISIS
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
