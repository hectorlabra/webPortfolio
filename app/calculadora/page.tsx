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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Calculator,
  TrendingUp,
  BarChart3,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Check,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Repeat,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCalculator } from "@/app/calculadora/hooks/use-calculator";
import { useLocalStorage } from "@/app/calculadora/hooks/use-local-storage";
import { ResultsDisplay } from "@/app/calculadora/components/results-display";
import { InsightsPanel } from "@/app/calculadora/components/insights-panel";
import { CTASection } from "@/app/calculadora/components/cta-section";
import { ResultsSkeleton } from "@/app/calculadora/components/results-skeleton";
import { CalculatorErrorBoundary } from "@/app/calculadora/components/calculator-error-boundary";
import type { ComparisonChartProps } from "@/app/calculadora/components/comparison-chart";
import {
  DEFAULT_INPUTS,
  CALCULATOR_CONFIG,
  type CalculatorInputs,
} from "@/lib/types/calculator";
import { formatCurrency } from "@/app/calculadora/lib/utils";

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

type WizardStep = {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
};

const wizardSteps: WizardStep[] = [
  {
    id: 1,
    title: "Modelo de Producto Único",
    description: "Define tu oferta inicial, precio y tasa de conversión.",
    icon: DollarSign,
  },
  {
    id: 2,
    title: "Modelo de Suscripción",
    description:
      "Configura los parámetros recurrentes para estimar ingresos mensuales.",
    icon: Repeat,
  },
  {
    id: 3,
    title: "Ajustes y Resultados",
    description:
      "Afina métricas avanzadas, revisa tu resumen y genera el análisis.",
    icon: Sparkles,
  },
];

const STEP_COUNT = wizardSteps.length;

export default function CalculadoraPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepErrors, setStepErrors] = useState<string[]>([]);
  const [hasRequestedResults, setHasRequestedResults] = useState(false);

  const {
    inputs,
    results,
    isCalculating,
    validationErrors,
    shouldShowResults,
    handleInputChange,
    resetInputs,
    calculate,
    timeHorizon,
    totalSubscriptionProfit,
    totalOneTimeProfit,
    breakEvenPoint,
  } = useCalculator({
    autoCalculate: false,
    debounceMs: 500,
    onCalculationComplete: (results) => {
      console.log("Cálculo completado:", results);
    },
    onValidationError: (errors) => {
      console.log("Errores de validación:", errors);
    },
  });

  const { debouncedSave, clearStorage, hasStorageSupport, lastSaved } =
    useLocalStorage({
      onLoad: (loadedInputs) => {
        Object.entries(loadedInputs).forEach(([key, value]) => {
          if (key in DEFAULT_INPUTS) {
            handleInputChange(key as keyof typeof DEFAULT_INPUTS, value);
          }
        });
        setHasRequestedResults(false);
        setCurrentStep(1);
        setCompletedSteps([]);
      },
      onSave: () => {
        console.log("Estado guardado en localStorage");
      },
    });

  const deferredResults = useDeferredValue(results);
  const deferredTimeHorizon = useDeferredValue(timeHorizon);
  const deferredChurnRate = useDeferredValue(inputs.churnRate);

  const renderableResults = deferredResults ?? results;
  const renderableTimeHorizon = deferredTimeHorizon ?? inputs.timeHorizon;
  const renderableChurnRate = deferredChurnRate ?? inputs.churnRate;

  const validateStep = useCallback(
    (step: number, values: CalculatorInputs = inputs) => {
      const errors: string[] = [];

      if (step === 1) {
        if (values.oneTimePrice <= 0)
          errors.push("El precio del producto único debe ser mayor a 0.");
        if (values.oneTimeCost < 0)
          errors.push("El costo por cliente no puede ser negativo.");
        if (values.oneTimeCustomers <= 0)
          errors.push("El número de clientes debe ser mayor a 0.");
        if (values.conversionRate <= 0 || values.conversionRate > 100)
          errors.push("La tasa de conversión debe estar entre 0% y 100%.");
      }

      if (step === 2) {
        if (values.subscriptionPrice <= 0)
          errors.push("El precio mensual debe ser mayor a 0.");
        if (values.subscriptionCost < 0)
          errors.push("El costo mensual por cliente no puede ser negativo.");
        if (
          values.churnRate < CALCULATOR_CONFIG.MIN_CHURN_RATE ||
          values.churnRate > CALCULATOR_CONFIG.MAX_CHURN_RATE
        )
          errors.push(
            `La tasa de abandono debe estar entre ${CALCULATOR_CONFIG.MIN_CHURN_RATE}% y ${CALCULATOR_CONFIG.MAX_CHURN_RATE}%.`
          );
        if (
          values.timeHorizon < CALCULATOR_CONFIG.MIN_TIME_HORIZON ||
          values.timeHorizon > CALCULATOR_CONFIG.MAX_TIME_HORIZON
        )
          errors.push(
            `El horizonte temporal debe estar entre ${CALCULATOR_CONFIG.MIN_TIME_HORIZON} y ${CALCULATOR_CONFIG.MAX_TIME_HORIZON} meses.`
          );
      }

      if (step === 3) {
        if (values.discountRate < 0 || values.discountRate > 50)
          errors.push("La tasa de descuento debe estar entre 0% y 50%.");
      }

      return errors;
    },
    [inputs]
  );

  const handleInputChangeWithSave = useCallback(
    (field: keyof typeof inputs, value: number) => {
      handleInputChange(field, value);
      setHasRequestedResults(false);
      setStepErrors([]);

      if (hasStorageSupport) {
        const updatedInputs = { ...inputs, [field]: value };
        debouncedSave(updatedInputs);
      }
    },
    [handleInputChange, inputs, debouncedSave, hasStorageSupport]
  );

  const handleReset = useCallback(() => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres borrar todos los datos y empezar de nuevo?"
      )
    ) {
      resetInputs();
      clearStorage();
      setCurrentStep(1);
      setCompletedSteps([]);
      setStepErrors([]);
      setHasRequestedResults(false);
    }
  }, [resetInputs, clearStorage]);

  const handleBack = useCallback(() => {
    setStepErrors([]);
    setCurrentStep((step) => Math.max(1, step - 1));
  }, []);

  const handleNext = useCallback(() => {
    const errors = validateStep(currentStep);
    if (errors.length > 0) {
      setStepErrors(errors);
      return;
    }

    setStepErrors([]);
    setCompletedSteps((prev) =>
      prev.includes(currentStep) ? prev : [...prev, currentStep]
    );
    setCurrentStep((step) => Math.min(STEP_COUNT, step + 1));
  }, [currentStep, validateStep]);

  const handleGoToStep = useCallback(
    (targetStep: number) => {
      if (targetStep < currentStep) {
        setStepErrors([]);
        setCurrentStep(targetStep);
      }
    },
    [currentStep]
  );

  const handleGenerateAnalysis = useCallback(() => {
    const errors = validateStep(3);
    if (errors.length > 0) {
      setStepErrors(errors);
      return;
    }

    setStepErrors([]);
    setHasRequestedResults(true);
    setCompletedSteps((prev) =>
      prev.includes(3) ? prev : [...prev.filter((id) => id !== 3), 3]
    );
    calculate();
  }, [calculate, validateStep]);

  const handleDownloadReport = useCallback(() => {
    if (!results) return;

    console.log("Descargando reporte...");
    alert("Funcionalidad de descarga en desarrollo");
  }, [results]);

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

  const handleScheduleConsultation = useCallback(() => {
    window.open("/quien-soy#contacto", "_blank");
  }, []);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOneForm
            inputs={inputs}
            onInputChange={handleInputChangeWithSave}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <StepTwoForm
            inputs={inputs}
            onInputChange={handleInputChangeWithSave}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <StepThreeForm
            inputs={inputs}
            onInputChange={handleInputChangeWithSave}
            totalOneTimeProfit={totalOneTimeProfit}
            totalSubscriptionProfit={totalSubscriptionProfit}
            breakEvenPoint={breakEvenPoint}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  const showResultsError =
    hasRequestedResults && !isCalculating && validationErrors.length > 0;

  const canGoBack = currentStep > 1;
  const isLastStep = currentStep === STEP_COUNT;

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <main className="flex-1">
        <section className="w-full min-h-[50vh] flex items-center py-16 sm:py-20">
          <div className="container flex-1 flex flex-col justify-center px-4 md:px-6 relative">
            <div className="text-center space-y-6">
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

        <section className="w-full py-8 sm:py-12">
          <div className="container px-4 md:px-6">
            <Card className="bg-white/5 border-white/20 shadow-lg backdrop-blur animate-circular-glow">
              <CardHeader className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="font-mono text-lg sm:text-xl text-white">
                    Tu ruta hacia el análisis
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
                  Completa los pasos a continuación para obtener tu análisis
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8">
                <WizardStepper
                  currentStep={currentStep}
                  completedSteps={completedSteps}
                  onStepClick={handleGoToStep}
                />

                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <div className="mb-6 space-y-2">
                    <Badge className="bg-[#64E365]/15 text-[#64E365]">
                      Paso {currentStep} de {STEP_COUNT}
                    </Badge>
                    <div className="space-y-1">
                      <h3 className="font-mono text-lg font-semibold text-white">
                        {wizardSteps[currentStep - 1]?.title}
                      </h3>
                      <p className="text-sm text-white/70">
                        {wizardSteps[currentStep - 1]?.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">{renderStepContent()}</div>

                  {stepErrors.length > 0 && (
                    <Alert className="mt-6 border-red-400 bg-red-400/10 text-red-100">
                      <AlertTitle>
                        Revisa los campos antes de continuar
                      </AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {stepErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {currentStep === 3 && (
                  <CalculatorErrorBoundary onRetry={handleReset}>
                    {isCalculating &&
                    hasRequestedResults &&
                    !shouldShowResults ? (
                      <div className="pt-6 border-t border-white/20">
                        <ResultsSkeleton />
                      </div>
                    ) : shouldShowResults && renderableResults ? (
                      <div className="space-y-8 pt-6 border-t border-white/20">
                        <div>
                          <h3 className="font-mono text-lg font-semibold text-white mb-4">
                            📊 Resultados del Análisis
                          </h3>
                          <ResultsDisplay
                            results={renderableResults}
                            timeHorizon={renderableTimeHorizon}
                          />
                        </div>

                        <div>
                          <h3 className="font-mono text-lg font-semibold text-white mb-4">
                            📈 Comparación Visual
                          </h3>
                          <ComparisonChart
                            results={renderableResults}
                            timeHorizon={renderableTimeHorizon}
                          />
                        </div>

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
                    ) : showResultsError ? (
                      <Alert className="mt-6 border-red-400 bg-red-400/10 text-red-100">
                        <AlertTitle>
                          Necesitas ajustar algunos valores
                        </AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {validationErrors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    ) : hasRequestedResults ? (
                      <Alert className="mt-6 border-yellow-400 bg-yellow-400/10 text-yellow-100">
                        <AlertTitle>Estamos listos para calcular</AlertTitle>
                        <AlertDescription>
                          Asegúrate de que todos los campos tengan valores
                          válidos antes de generar el análisis.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-white/20 rounded-lg bg-white/5">
                        <Calculator className="h-16 w-16 text-white/40 mx-auto mb-4" />
                        <h3 className="font-mono text-lg font-semibold text-white/70 mb-2">
                          Confirma los pasos anteriores para ver el resultado
                        </h3>
                        <p className="text-white/60 max-w-md mx-auto">
                          Ajusta tus datos y presiona &quot;Generar
                          análisis&quot; para obtener la comparación completa.
                        </p>
                      </div>
                    )}
                  </CalculatorErrorBoundary>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-white/10 bg-white/5/50">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Check className="h-4 w-4 text-[#64E365]" />
                  Progreso: {completedSteps.length} de {STEP_COUNT} pasos
                  completos
                </div>
                <div className="flex w-full gap-3 sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={!canGoBack}
                    className="flex-1 sm:flex-none border-white/20 text-white/70 hover:text-white hover:border-white/40"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Paso anterior
                  </Button>
                  {isLastStep ? (
                    <Button
                      onClick={handleGenerateAnalysis}
                      disabled={isCalculating}
                      className="flex-1 sm:flex-none bg-[#FFD100] text-[#0a0612] hover:bg-[#FFD100]/90 font-bold shadow-[0_0_10px_rgba(255,210,0,0.5)]"
                    >
                      {isCalculating ? "Calculando..." : "Generar análisis"}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="flex-1 sm:flex-none bg-[#64E365]/20 text-[#64E365] hover:bg-[#64E365]/30"
                    >
                      Siguiente paso
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardFooter>
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

type WizardStepperProps = {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
};

function WizardStepper({
  currentStep,
  completedSteps,
  onStepClick,
}: WizardStepperProps) {
  const progressPercentage =
    STEP_COUNT > 1
      ? Math.min(100, Math.max(0, ((currentStep - 1) / (STEP_COUNT - 1)) * 100))
      : currentStep > 0
      ? 100
      : 0;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-inner">
      <div className="grid gap-2 sm:grid-cols-3">
        {wizardSteps.map((step) => {
          const isActive = step.id === currentStep;
          const isComplete =
            completedSteps.includes(step.id) || step.id < currentStep;
          const canNavigate = step.id < currentStep;

          const buttonClasses = [
            "flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all",
            isActive
              ? "border-[#FFD100]/80 bg-[#FFD100]/10 text-white shadow-lg"
              : "border-white/10 bg-white/5 text-white/70",
            canNavigate
              ? "cursor-pointer hover:border-[#64E365]/60 hover:bg-[#64E365]/10"
              : "cursor-default",
          ].join(" ");

          const circleClasses = [
            "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold",
            isComplete
              ? "border-[#64E365] bg-[#64E365]/20 text-[#64E365]"
              : isActive
              ? "border-[#FFD100] bg-[#FFD100]/20 text-[#FFD100]"
              : "border-white/30 text-white/60",
          ].join(" ");

          return (
            <button
              key={step.id}
              type="button"
              className={buttonClasses}
              onClick={() => (canNavigate ? onStepClick(step.id) : undefined)}
              disabled={!canNavigate}
            >
              <span className={circleClasses}>
                {isComplete ? <Check className="h-4 w-4" /> : step.id}
              </span>

              <span className="flex flex-col text-left">
                <span className="text-xs uppercase tracking-wide text-white/50">
                  Paso {step.id}
                </span>
                <span className="text-sm font-medium text-white">
                  {step.title}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[#64E365] transition-all"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}

function StepOneForm({
  inputs,
  onInputChange,
  onNext,
}: {
  inputs: typeof DEFAULT_INPUTS;
  onInputChange: (field: keyof typeof DEFAULT_INPUTS, value: number) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Pricing Section */}
      <div className="rounded-lg bg-white/5 p-4 sm:p-6 border border-white/20">
        <h3 className="font-mono text-lg sm:text-xl text-white mb-4">
          Precios y Costos
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* One-Time Price */}
          <div>
            <label className="block text-sm font-medium text-white/90">
              Precio del Producto Único
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <DollarSign className="h-5 w-5 text-white/50" />
              </span>
              <input
                type="number"
                value={inputs.oneTimePrice}
                onChange={(e) =>
                  onInputChange("oneTimePrice", parseFloat(e.target.value))
                }
                className="block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50 pl-10"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Subscription Price */}
          <div>
            <label className="block text-sm font-medium text-white/90">
              Precio Mensual de Suscripción
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <DollarSign className="h-5 w-5 text-white/50" />
              </span>
              <input
                type="number"
                value={inputs.subscriptionPrice}
                onChange={(e) =>
                  onInputChange("subscriptionPrice", parseFloat(e.target.value))
                }
                className="block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50 pl-10"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* One-Time Cost */}
          <div>
            <label className="block text-sm font-medium text-white/90">
              Costo por Cliente (Único)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <DollarSign className="h-5 w-5 text-white/50" />
              </span>
              <input
                type="number"
                value={inputs.oneTimeCost}
                onChange={(e) =>
                  onInputChange("oneTimeCost", parseFloat(e.target.value))
                }
                className="block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50 pl-10"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Subscription Cost */}
          <div>
            <label className="block text-sm font-medium text-white/90">
              Costo Mensual por Cliente (Suscripción)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <DollarSign className="h-5 w-5 text-white/50" />
              </span>
              <input
                type="number"
                value={inputs.subscriptionCost}
                onChange={(e) =>
                  onInputChange("subscriptionCost", parseFloat(e.target.value))
                }
                className="block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50 pl-10"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Rate */}
      <div>
        <label className="block text-sm font-medium text-white/90">
          Tasa de Conversión (%)
        </label>
        <input
          type="number"
          value={inputs.conversionRate}
          onChange={(e) =>
            onInputChange("conversionRate", parseFloat(e.target.value))
          }
          className="mt-1 block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50"
          placeholder="Ej. 2.5"
          min="0"
          max="100"
          step="0.01"
        />
      </div>

      {/* Customers Acquired */}
      <div>
        <label className="block text-sm font-medium text-white/90">
          Clientes Adquiridos (Estimación)
        </label>
        <input
          type="number"
          value={inputs.oneTimeCustomers}
          onChange={(e) =>
            onInputChange("oneTimeCustomers", parseInt(e.target.value))
          }
          className="mt-1 block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50"
          placeholder="Ej. 100"
          min="0"
        />
      </div>

      {/* Manual Calculation Trigger */}
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          className="w-full sm:w-auto bg-[#64E365] text-white hover:bg-[#64E365]/90 font-bold shadow-[0_0_10px_rgba(100,227,101,0.5)]"
        >
          Calcular Modelo Único
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function StepTwoForm({
  inputs,
  onInputChange,
  onNext,
}: {
  inputs: typeof DEFAULT_INPUTS;
  onInputChange: (field: keyof typeof DEFAULT_INPUTS, value: number) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Subscription Model Description */}
      <div className="rounded-lg bg-white/5 p-4 sm:p-6 border border-white/20">
        <h3 className="font-mono text-lg sm:text-xl text-white mb-4">
          Configuración del Modelo de Suscripción
        </h3>
        <p className="text-white/70 text-sm">
          Establece los parámetros para calcular los ingresos recurrentes
        </p>
      </div>

      {/* Pricing Section */}
      <div className="rounded-lg bg-white/5 p-4 sm:p-6 border border-white/20">
        <h3 className="font-mono text-lg sm:text-xl text-white mb-4">
          Precios y Costos
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Subscription Price */}
          <div>
            <label className="block text-sm font-medium text-white/90">
              Precio Mensual de Suscripción
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <DollarSign className="h-5 w-5 text-white/50" />
              </span>
              <input
                type="number"
                value={inputs.subscriptionPrice}
                onChange={(e) =>
                  onInputChange("subscriptionPrice", parseFloat(e.target.value))
                }
                className="block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50 pl-10"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Subscription Cost */}
          <div>
            <label className="block text-sm font-medium text-white/90">
              Costo Mensual por Cliente (Suscripción)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <DollarSign className="h-5 w-5 text-white/50" />
              </span>
              <input
                type="number"
                value={inputs.subscriptionCost}
                onChange={(e) =>
                  onInputChange("subscriptionCost", parseFloat(e.target.value))
                }
                className="block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50 pl-10"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Churn Rate */}
      <div>
        <label className="block text-sm font-medium text-white/90">
          Tasa de Abandono (%)
        </label>
        <input
          type="number"
          value={inputs.churnRate}
          onChange={(e) =>
            onInputChange("churnRate", parseFloat(e.target.value))
          }
          className="mt-1 block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50"
          placeholder="Ej. 5"
          min="0"
          max="100"
          step="0.01"
        />
      </div>

      {/* Time Horizon */}
      <div>
        <label className="block text-sm font-medium text-white/90">
          Horizonte Temporal (meses)
        </label>
        <input
          type="number"
          value={inputs.timeHorizon}
          onChange={(e) =>
            onInputChange("timeHorizon", parseInt(e.target.value))
          }
          className="mt-1 block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50"
          placeholder="Ej. 12"
          min="1"
          max="24"
        />
      </div>

      {/* Manual Calculation Trigger */}
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          className="w-full sm:w-auto bg-[#64E365] text-white hover:bg-[#64E365]/90 font-bold shadow-[0_0_10px_rgba(100,227,101,0.5)]"
        >
          Calcular Modelo de Suscripción
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function StepThreeForm({
  inputs,
  onInputChange,
  totalOneTimeProfit,
  totalSubscriptionProfit,
  breakEvenPoint,
  onBack,
}: {
  inputs: typeof DEFAULT_INPUTS;
  onInputChange: (field: keyof typeof DEFAULT_INPUTS, value: number) => void;
  totalOneTimeProfit: number;
  totalSubscriptionProfit: number;
  breakEvenPoint: number;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="rounded-lg bg-white/5 p-4 sm:p-6 border border-white/20">
        <h3 className="font-mono text-lg sm:text-xl text-white mb-4">
          Resumen del Análisis
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Total Profit from One-Time Sales */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white/60">
              Ganancia Total (Único)
            </span>
            <span className="mt-1 text-2xl font-bold text-white">
              {formatCurrency(totalOneTimeProfit)}
            </span>
          </div>

          {/* Total Profit from Subscriptions */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white/60">
              Ganancia Total (Suscripción)
            </span>
            <span className="mt-1 text-2xl font-bold text-white">
              {formatCurrency(totalSubscriptionProfit)}
            </span>
          </div>

          {/* Break-Even Point */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white/60">
              Punto de Equilibrio
            </span>
            <span className="mt-1 text-2xl font-bold text-white">
              {breakEvenPoint} meses
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Results Section */}
      <div className="rounded-lg bg-white/5 p-4 sm:p-6 border border-white/20">
        <h3 className="font-mono text-lg sm:text-xl text-white mb-4">
          Detalles del Análisis
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Churn Rate */}
          <div>
            <label className="block text-sm font-medium text-white/90">
              Tasa de Abandono (%)
            </label>
            <input
              type="number"
              value={inputs.churnRate}
              onChange={(e) =>
                onInputChange("churnRate", parseFloat(e.target.value))
              }
              className="mt-1 block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50"
              placeholder="Ej. 5"
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          {/* Time Horizon */}
          <div>
            <label className="block text-sm font-medium text-white/90">
              Horizonte Temporal (meses)
            </label>
            <input
              type="number"
              value={inputs.timeHorizon}
              onChange={(e) =>
                onInputChange("timeHorizon", parseInt(e.target.value))
              }
              className="mt-1 block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50"
              placeholder="Ej. 12"
              min="1"
              max="24"
            />
          </div>

          {/* Discount Rate */}
          <div>
            <label className="block text-sm font-medium text-white/90">
              Tasa de Descuento (%)
            </label>
            <input
              type="number"
              value={inputs.discountRate}
              onChange={(e) =>
                onInputChange("discountRate", parseFloat(e.target.value))
              }
              className="mt-1 block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50"
              placeholder="Ej. 10"
              min="0"
              max="50"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Final Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="border-white/20 text-white/70 hover:text-white hover:border-white/40 bg-transparent"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver
          </Button>
        </div>
      </div>
    </div>
  );
}
