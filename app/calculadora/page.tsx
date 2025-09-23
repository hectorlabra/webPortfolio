"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calculator,
  TrendingUp,
  BarChart3,
  Lightbulb,
  Rocket,
  Info,
} from "lucide-react";
import { useCalculator } from "@/app/calculadora/hooks/use-calculator";
import { useLocalStorage } from "@/app/calculadora/hooks/use-local-storage";
import { CalculatorInputs } from "@/app/calculadora/components/calculator-inputs";
import { ResultsDisplay } from "@/app/calculadora/components/results-display";
import { ComparisonChart } from "@/app/calculadora/components/comparison-chart";
import { InsightsPanel } from "@/app/calculadora/components/insights-panel";
import { CTASection } from "@/app/calculadora/components/cta-section";
import { DEFAULT_INPUTS } from "@/lib/types/calculator";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center space-x-3">
            <Calculator className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Calculadora de Ingresos
            </h1>
          </div>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compara modelo único vs suscripción para transformar tu infoproducto
            en un micro-SaaS rentable
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Badge variant="outline" className="px-3 py-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              Análisis Financiero
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <BarChart3 className="h-4 w-4 mr-1" />
              Visualización Interactiva
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <Lightbulb className="h-4 w-4 mr-1" />
              Insights Automáticos
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <Rocket className="h-4 w-4 mr-1" />
              Plan de Acción
            </Badge>
          </div>
        </div>

        {/* Storage Status */}
        {hasStorageSupport && lastSaved && (
          <Alert className="mb-6 max-w-2xl mx-auto">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Tus datos se guardan automáticamente. Última actualización:{" "}
              {lastSaved.toLocaleTimeString()}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Configuración</span>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Reiniciar
                  </Button>
                </CardTitle>
                <CardDescription>
                  Ajusta los parámetros de tu negocio para ver la comparación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CalculatorInputs
                  inputs={inputs}
                  onInputChangeAction={handleInputChangeWithSave}
                  onCalculate={handleManualCalculation}
                  validationErrors={validationErrors}
                  isCalculating={isCalculating}
                  canCalculate={isValid}
                  autoCalculate={true}
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {!shouldShowResults && (
              <Card className="border-dashed border-2">
                <CardContent className="pt-8 pb-8">
                  <div className="text-center space-y-4">
                    <Calculator className="h-16 w-16 text-muted-foreground mx-auto" />
                    <h3 className="text-lg font-semibold text-muted-foreground">
                      Ajusta los parámetros para ver los resultados
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Configura el precio, costos y métricas de tu producto en
                      el panel izquierdo para generar automáticamente el
                      análisis de comparación.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {shouldShowResults && results && (
              <>
                {/* Results Overview */}
                <ResultsDisplay
                  results={results}
                  timeHorizon={inputs.timeHorizon}
                />

                <Separator />

                {/* Visual Comparison */}
                <ComparisonChart
                  results={results}
                  timeHorizon={inputs.timeHorizon}
                />

                <Separator />

                {/* Intelligent Insights */}
                <InsightsPanel
                  results={results}
                  timeHorizon={inputs.timeHorizon}
                  churnRate={inputs.churnRate}
                />

                <Separator />

                {/* Call to Actions */}
                <CTASection
                  results={results}
                  timeHorizon={inputs.timeHorizon}
                  onDownloadReport={handleDownloadReport}
                  onShareResults={handleShareResults}
                  onScheduleConsultation={handleScheduleConsultation}
                />
              </>
            )}
          </div>
        </div>

        {/* Bottom Information */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              ¿Cómo funciona esta calculadora?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-medium">Cálculos Precisos</h4>
                <p className="text-sm text-muted-foreground">
                  Utiliza fórmulas estándar de SaaS: LTV, CAC, churn rate, y
                  período de recuperación
                </p>
              </div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-medium">Visualización Clara</h4>
                <p className="text-sm text-muted-foreground">
                  Gráficos interactivos que muestran la evolución de ingresos y
                  punto de equilibrio
                </p>
              </div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium">Insights Inteligentes</h4>
                <p className="text-sm text-muted-foreground">
                  Recomendaciones personalizadas basadas en tus números
                  específicos
                </p>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                Desarrollado para emprendedores que quieren transformar sus
                productos digitales en negocios recurrentes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
