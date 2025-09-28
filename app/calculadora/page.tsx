"use client";

import {
  useState,
  useCallback,
  useDeferredValue,
  useMemo,
  useEffect,
  useRef,
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Calculator,
  TrendingUp,
  BarChart3,
  Lightbulb,
  ArrowRight,
  LineChart,
  RefreshCw,
  Check,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Repeat,
  Sparkles,
  Loader2,
  Share2,
  Calendar,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCalculator } from "@/app/calculadora/hooks/use-calculator";
import { useLocalStorage } from "@/app/calculadora/hooks/use-local-storage";
import { ResultsDisplay } from "@/app/calculadora/components/results-display";
import { CTASection } from "@/app/calculadora/components/cta-section";
import { ResultsSkeleton } from "@/app/calculadora/components/results-skeleton";
import { CalculatorErrorBoundary } from "@/app/calculadora/components/calculator-error-boundary";
import type { ComparisonChartProps } from "@/app/calculadora/components/comparison-chart";
import {
  DEFAULT_INPUTS,
  type CalculatorInputs,
  type CalculationResults,
  type ValidationError,
} from "@/lib/types/calculator";
import { validateCalculatorInputs } from "@/app/calculadora/lib/calculations";
import {
  formatCurrency,
  formatPercentage,
  formatTimePeriod,
} from "@/app/calculadora/lib/utils";

type InsightsPanelProps = {
  results: CalculationResults;
  timeHorizon: number;
  churnRate?: number;
  className?: string;
};

const InsightsPanelPlaceholder = () => (
  <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-6">
    <div className="h-6 w-40 animate-pulse rounded bg-white/10" />
    <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="h-32 animate-pulse rounded-lg bg-white/5" />
      <div className="h-32 animate-pulse rounded-lg bg-white/5" />
    </div>
  </div>
);

const InsightsPanel = dynamic<InsightsPanelProps>(
  () =>
    import("@/app/calculadora/components/insights-panel").then(
      (mod) => mod.InsightsPanel
    ),
  {
    ssr: false,
    loading: () => <InsightsPanelPlaceholder />,
  }
);

const ComparisonChart = dynamic<ComparisonChartProps>(
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
);

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

const STEP_FIELD_GROUPS: Record<
  number,
  ReadonlyArray<keyof CalculatorInputs>
> = {
  1: ["oneTimePrice", "oneTimeCost", "oneTimeCustomers", "conversionRate"],
  2: ["subscriptionPrice", "subscriptionCost", "churnRate", "timeHorizon"],
  3: ["churnRate", "timeHorizon", "discountRate"],
};

const PRIMARY_FIELD_BY_STEP: Record<number, string> = {
  1: "#oneTimePrice",
  2: "#subscriptionPrice",
  3: "#churnRateStep3",
};

const GO_SHORTCUT_TIMEOUT_MS = 800;

export default function CalculadoraPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepErrors, setStepErrors] = useState<ValidationError[]>([]);
  const [hasRequestedResults, setHasRequestedResults] = useState(false);

  const {
    inputs,
    results,
    isCalculating,
    isPending,
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

  const formColumnRef = useRef<HTMLDivElement | null>(null);
  const contextColumnRef = useRef<HTMLDivElement | null>(null);
  const ctaButtonRef = useRef<HTMLButtonElement | null>(null);
  const pendingGoShortcutRef = useRef(false);
  const goShortcutTimeoutRef = useRef<number | null>(null);

  const registerCtaRef = useCallback((node: HTMLButtonElement | null) => {
    ctaButtonRef.current = node;
  }, []);

  const focusFirstField = useCallback(() => {
    if (typeof window === "undefined") return;

    const selector = PRIMARY_FIELD_BY_STEP[currentStep];
    if (selector) {
      const element = document.querySelector<HTMLInputElement>(selector);
      if (element) {
        element.focus({ preventScroll: false });
        if (typeof element.select === "function") {
          element.select();
        }
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }

    if (formColumnRef.current) {
      formColumnRef.current.focus({ preventScroll: false });
      formColumnRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentStep]);

  const focusResultsColumn = useCallback(() => {
    if (!contextColumnRef.current) return;

    contextColumnRef.current.focus({ preventScroll: false });
    contextColumnRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const focusConsultationCta = useCallback(() => {
    if (ctaButtonRef.current) {
      ctaButtonRef.current.focus({ preventScroll: false });
      ctaButtonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    const fallbackLink = document.querySelector<HTMLAnchorElement>(
      'a[href="/quien-soy#contacto"]'
    );
    if (fallbackLink) {
      fallbackLink.focus({ preventScroll: false });
      fallbackLink.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  useEffect(() => {
    const isEditableElement = (target: EventTarget | null): boolean => {
      if (!(target instanceof HTMLElement)) {
        return false;
      }

      const tagName = target.tagName;
      return (
        target.isContentEditable ||
        tagName === "INPUT" ||
        tagName === "TEXTAREA" ||
        tagName === "SELECT" ||
        target.getAttribute("role") === "textbox"
      );
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.key === "/" && !isEditableElement(event.target)) {
        event.preventDefault();
        focusFirstField();
        return;
      }

      const key = event.key.toLowerCase();

      if (key === "g" && !isEditableElement(event.target)) {
        event.preventDefault();
        pendingGoShortcutRef.current = true;
        if (goShortcutTimeoutRef.current) {
          window.clearTimeout(goShortcutTimeoutRef.current);
          goShortcutTimeoutRef.current = null;
        }
        goShortcutTimeoutRef.current = window.setTimeout(() => {
          pendingGoShortcutRef.current = false;
          goShortcutTimeoutRef.current = null;
        }, GO_SHORTCUT_TIMEOUT_MS);
        return;
      }

      if (pendingGoShortcutRef.current && !isEditableElement(event.target)) {
        if (key === "r") {
          event.preventDefault();
          focusResultsColumn();
        } else if (key === "c") {
          event.preventDefault();
          focusConsultationCta();
        }

        pendingGoShortcutRef.current = false;
        if (goShortcutTimeoutRef.current) {
          window.clearTimeout(goShortcutTimeoutRef.current);
          goShortcutTimeoutRef.current = null;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (goShortcutTimeoutRef.current) {
        window.clearTimeout(goShortcutTimeoutRef.current);
        goShortcutTimeoutRef.current = null;
      }
      pendingGoShortcutRef.current = false;
    };
  }, [focusConsultationCta, focusFirstField, focusResultsColumn]);

  const deferredResults = useDeferredValue(results);
  const deferredTimeHorizon = useDeferredValue(timeHorizon);
  const deferredChurnRate = useDeferredValue(inputs.churnRate);

  const renderableResults = deferredResults ?? results;
  const renderableTimeHorizon = deferredTimeHorizon ?? inputs.timeHorizon;
  const renderableChurnRate = deferredChurnRate ?? inputs.churnRate;

  const validateStep = useCallback(
    (step: number, values: CalculatorInputs = inputs) => {
      const fields = STEP_FIELD_GROUPS[step] ?? [];
      if (fields.length === 0) {
        return [];
      }

      const validationErrors = validateCalculatorInputs(values);
      return validationErrors.filter((error) => fields.includes(error.field));
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

    if (currentStep < STEP_COUNT) {
      calculate();
    }
  }, [currentStep, validateStep, calculate]);

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

  const showResultsError =
    hasRequestedResults && !isCalculating && validationErrors.length > 0;

  const stepContent = useMemo(() => {
    switch (currentStep) {
      case 1:
        return {
          form: (
            <StepOneForm
              inputs={inputs}
              onInputChange={handleInputChangeWithSave}
              onNext={handleNext}
              errors={stepErrors}
            />
          ),
          context: <StepOneContext inputs={inputs} />,
        };
      case 2:
        return {
          form: (
            <StepTwoForm
              inputs={inputs}
              onInputChange={handleInputChangeWithSave}
              onNext={handleNext}
              errors={stepErrors}
            />
          ),
          context: (
            <StepTwoContext
              inputs={inputs}
              timeHorizon={timeHorizon}
              totalOneTimeProfit={totalOneTimeProfit}
              totalSubscriptionProfit={totalSubscriptionProfit}
              breakEvenPoint={breakEvenPoint}
            />
          ),
        };
      case 3:
        return {
          form: (
            <StepThreeForm
              inputs={inputs}
              onInputChange={handleInputChangeWithSave}
              totalOneTimeProfit={totalOneTimeProfit}
              totalSubscriptionProfit={totalSubscriptionProfit}
              breakEvenPoint={breakEvenPoint}
              onBack={handleBack}
              errors={stepErrors}
            />
          ),
          context: (
            <StepThreeContext
              isCalculating={isCalculating}
              isPending={isPending}
              hasRequestedResults={hasRequestedResults}
              shouldShowResults={shouldShowResults}
              renderableResults={renderableResults}
              renderableTimeHorizon={renderableTimeHorizon}
              renderableChurnRate={renderableChurnRate}
              showResultsError={showResultsError}
              validationErrors={validationErrors}
              onDownloadReport={handleDownloadReport}
              onShareResults={handleShareResults}
              onScheduleConsultation={handleScheduleConsultation}
              onReset={handleReset}
              registerCtaRef={registerCtaRef}
            />
          ),
        };
      default:
        return { form: null, context: null };
    }
  }, [
    currentStep,
    inputs,
    timeHorizon,
    handleInputChangeWithSave,
    handleNext,
    totalOneTimeProfit,
    totalSubscriptionProfit,
    breakEvenPoint,
    handleBack,
    isCalculating,
    hasRequestedResults,
    shouldShowResults,
    renderableResults,
    renderableTimeHorizon,
    renderableChurnRate,
    showResultsError,
    validationErrors,
    handleDownloadReport,
    handleShareResults,
    handleScheduleConsultation,
    handleReset,
    stepErrors,
    isPending,
    registerCtaRef,
  ]);

  const { form: activeForm, context: activeContext } = stepContent;

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
                  <h1 className="font-mono text-3xl sm:text-4xl font-bold text-white text-balance">
                    Calculadora de ingresos SaaS vs producto único
                  </h1>
                </div>

                <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto text-balance">
                  Descubre cuánto más puedes generar migrando tu oferta one-time
                  a un modelo recurrente y obtén argumentos claros para tu
                  próxima decisión estratégica.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <Badge
                    variant="outline"
                    className="border-white/20 text-white/80 bg-white/5"
                  >
                    <TrendingUp className="h-4 w-4 mr-1 text-[#64E365]" />
                    Modelo financiero comparativo
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-white/20 text-white/80 bg-white/5"
                  >
                    <BarChart3 className="h-4 w-4 mr-1 text-[#64E365]" />
                    Gráficos en tiempo real
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-white/20 text-white/80 bg-white/5"
                  >
                    <Lightbulb className="h-4 w-4 mr-1 text-[#64E365]" />
                    Recomendaciones accionables
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
                  <CardTitle className="font-mono text-lg sm:text-xl text-white text-balance">
                    Guía paso a paso para comparar tus modelos
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
                <CardDescription className="text-white/70 text-balance">
                  Recorre cada etapa, valida tus supuestos y genera un informe
                  listo para presentar a tu equipo o stakeholders.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8">
                <WizardStepper
                  currentStep={currentStep}
                  completedSteps={completedSteps}
                  onStepClick={handleGoToStep}
                />

                <p className="text-xs text-white/60" role="note">
                  Atajos de teclado:
                  <kbd className="mx-1 rounded border border-white/20 bg-white/10 px-1 font-mono text-[11px] uppercase tracking-wide">
                    /
                  </kbd>
                  enfoca el formulario,
                  <kbd className="mx-1 rounded border border-white/20 bg-white/10 px-1 font-mono text-[11px] uppercase tracking-wide">
                    g
                  </kbd>
                  <kbd className="mr-1 rounded border border-white/20 bg-white/10 px-1 font-mono text-[11px] uppercase tracking-wide">
                    r
                  </kbd>
                  abre el contexto/resultados y
                  <kbd className="mx-1 rounded border border-white/20 bg-white/10 px-1 font-mono text-[11px] uppercase tracking-wide">
                    g
                  </kbd>
                  <kbd className="rounded border border-white/20 bg-white/10 px-1 font-mono text-[11px] uppercase tracking-wide">
                    c
                  </kbd>
                  salta a agendar una consulta.
                </p>

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

                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]">
                    <div
                      ref={formColumnRef}
                      className="lg:sticky lg:top-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#64E365] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0612]"
                      tabIndex={-1}
                      aria-label="Formulario del paso actual"
                    >
                      <div className="space-y-6">{activeForm}</div>
                    </div>

                    <div
                      ref={contextColumnRef}
                      className="space-y-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#64E365] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0612]"
                      tabIndex={-1}
                      aria-label="Contexto y resultados"
                    >
                      {activeContext}
                    </div>
                  </div>

                  {stepErrors.length > 0 && (
                    <Alert className="mt-6 border-red-400 bg-red-400/10 text-red-100">
                      <AlertTitle>
                        Revisa los campos antes de continuar
                      </AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {stepErrors.map((error, index) => (
                            <li key={index}>{error.message}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
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
                      disabled={isCalculating || isPending}
                      className="flex-1 sm:flex-none bg-[#FFD100] text-[#0a0612] hover:bg-[#FFD100]/90 font-bold shadow-[0_0_10px_rgba(255,210,0,0.5)]"
                    >
                      {isCalculating || isPending
                        ? "Calculando..."
                        : "Generar análisis"}
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
            "flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD100] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0612]",
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
              aria-current={isActive ? "step" : undefined}
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
  errors = [],
}: {
  inputs: typeof DEFAULT_INPUTS;
  onInputChange: (field: keyof typeof DEFAULT_INPUTS, value: number) => void;
  onNext: () => void;
  errors?: ValidationError[];
}) {
  const getErrorMessage = (field: keyof typeof DEFAULT_INPUTS) =>
    errors.find((error) => error.field === field)?.message;

  const pricingHelpId = "step1-pricing-help";
  const funnelHelpId = "step1-funnel-help";

  return (
    <div className="space-y-6">
      <Accordion
        type="multiple"
        defaultValue={["pricing", "funnel"]}
        className="space-y-4"
      >
        <AccordionItem
          value="pricing"
          className="overflow-hidden rounded-lg border border-white/20 bg-white/5 shadow-sm"
        >
          <AccordionTrigger className="px-4 text-left font-mono text-base text-white">
            Precios y costos
          </AccordionTrigger>
          <AccordionContent className="space-y-4 px-4 pb-4">
            <p id={pricingHelpId} className="text-sm text-white/70">
              Define el precio y costo unitario de ambas ofertas para comparar
              margen y atractivo percibido. Ajusta estos valores según tus
              escenarios bajo y alto.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="oneTimePrice"
                  className="block text-sm font-medium text-white/90"
                >
                  Precio del producto único
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <DollarSign className="h-5 w-5 text-white/50" />
                  </span>
                  <input
                    id="oneTimePrice"
                    type="number"
                    value={inputs.oneTimePrice}
                    onChange={(e) =>
                      onInputChange("oneTimePrice", parseFloat(e.target.value))
                    }
                    className="block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 pl-10 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    aria-describedby={pricingHelpId}
                  />
                </div>
                {getErrorMessage("oneTimePrice") ? (
                  <p className="mt-2 text-sm text-red-400">
                    {getErrorMessage("oneTimePrice")}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-white/60">
                    Usa el precio total de tu curso, workshop o paquete actual.
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="subscriptionPrice"
                  className="block text-sm font-medium text-white/90"
                >
                  Precio mensual de suscripción
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <DollarSign className="h-5 w-5 text-white/50" />
                  </span>
                  <input
                    id="subscriptionPrice"
                    type="number"
                    value={inputs.subscriptionPrice}
                    onChange={(e) =>
                      onInputChange(
                        "subscriptionPrice",
                        parseFloat(e.target.value)
                      )
                    }
                    className="block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 pl-10 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    aria-describedby={pricingHelpId}
                  />
                </div>
                {getErrorMessage("subscriptionPrice") ? (
                  <p className="mt-2 text-sm text-red-400">
                    {getErrorMessage("subscriptionPrice")}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-white/60">
                    Selecciona un precio competitivo que permita margen tras
                    costos variables.
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="oneTimeCost"
                  className="block text-sm font-medium text-white/90"
                >
                  Costo por cliente (único)
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <DollarSign className="h-5 w-5 text-white/50" />
                  </span>
                  <input
                    id="oneTimeCost"
                    type="number"
                    value={inputs.oneTimeCost}
                    onChange={(e) =>
                      onInputChange("oneTimeCost", parseFloat(e.target.value))
                    }
                    className="block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 pl-10 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    aria-describedby={pricingHelpId}
                  />
                </div>
                {getErrorMessage("oneTimeCost") ? (
                  <p className="mt-2 text-sm text-red-400">
                    {getErrorMessage("oneTimeCost")}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-white/60">
                    Incluye comisiones, ads y soporte puntual por cliente.
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="subscriptionCost"
                  className="block text-sm font-medium text-white/90"
                >
                  Costo mensual por cliente (suscripción)
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <DollarSign className="h-5 w-5 text-white/50" />
                  </span>
                  <input
                    id="subscriptionCost"
                    type="number"
                    value={inputs.subscriptionCost}
                    onChange={(e) =>
                      onInputChange(
                        "subscriptionCost",
                        parseFloat(e.target.value)
                      )
                    }
                    className="block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 pl-10 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    aria-describedby={pricingHelpId}
                  />
                </div>
                {getErrorMessage("subscriptionCost") ? (
                  <p className="mt-2 text-sm text-red-400">
                    {getErrorMessage("subscriptionCost")}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-white/60">
                    Considera hosting, herramientas y horas de soporte
                    recurrente.
                  </p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="funnel"
          className="overflow-hidden rounded-lg border border-white/20 bg-white/5 shadow-sm"
        >
          <AccordionTrigger className="px-4 text-left font-mono text-base text-white">
            Embudo y volumen de clientes
          </AccordionTrigger>
          <AccordionContent className="space-y-4 px-4 pb-4">
            <p id={funnelHelpId} className="text-sm text-white/70">
              Ajusta la tasa de conversión y el volumen estimado de clientes
              para proyectar ingresos. Puedes iterar rápido plegando esta
              sección cuando quieras enfocarte en otros parámetros.
            </p>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="conversionRate"
                  className="block text-sm font-medium text-white/90"
                >
                  Tasa de conversión (%)
                </label>
                <input
                  id="conversionRate"
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
                  aria-describedby={funnelHelpId}
                />
                {getErrorMessage("conversionRate") ? (
                  <p className="mt-2 text-sm text-red-400">
                    {getErrorMessage("conversionRate")}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-white/60">
                    Usa datos reales si los tienes; de lo contrario, parte de un
                    escenario conservador entre 1% y 3%.
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="oneTimeCustomers"
                  className="block text-sm font-medium text-white/90"
                >
                  Clientes adquiridos (estimación)
                </label>
                <input
                  id="oneTimeCustomers"
                  type="number"
                  value={inputs.oneTimeCustomers}
                  onChange={(e) =>
                    onInputChange("oneTimeCustomers", parseInt(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50"
                  placeholder="Ej. 100"
                  min="0"
                  aria-describedby={funnelHelpId}
                />
                {getErrorMessage("oneTimeCustomers") ? (
                  <p className="mt-2 text-sm text-red-400">
                    {getErrorMessage("oneTimeCustomers")}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-white/60">
                    Determina cuántos clientes puedes activar con tu embudo o
                    base actual.
                  </p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          className="w-full bg-[#64E365] font-bold text-white shadow-[0_0_10px_rgba(100,227,101,0.5)] hover:bg-[#64E365]/90 sm:w-auto"
        >
          Calcular modelo único
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function StepOneContext({ inputs }: { inputs: typeof DEFAULT_INPUTS }) {
  const potentialRevenue = inputs.oneTimePrice * inputs.oneTimeCustomers;
  const unitMargin = inputs.oneTimePrice - inputs.oneTimeCost;
  const marginPercentage =
    inputs.oneTimePrice > 0
      ? Math.max(0, (unitMargin / inputs.oneTimePrice) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 font-mono text-white text-base">
            <TrendingUp className="h-5 w-5 text-[#64E365]" />
            <span>Resumen rápido del modelo único</span>
          </CardTitle>
          <CardDescription className="text-white/70 text-balance">
            Confirma que los supuestos del modelo one-time representan tu
            operación actual antes de proyectar la transición a SaaS.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-white/60">
                Ingresos potenciales
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {formatCurrency(potentialRevenue)}
              </p>
              <p className="text-xs text-white/50 mt-2">
                {inputs.oneTimeCustomers} clientes a{" "}
                {formatCurrency(inputs.oneTimePrice)} cada uno
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-white/60">
                Margen unitario
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {formatCurrency(unitMargin, {
                  showSymbol: true,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-white/50 mt-2">
                {formatPercentage(Math.max(0, marginPercentage), 1)} de margen
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-white/60">
                Conversión objetivo
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {formatPercentage(inputs.conversionRate, 1)}
              </p>
              <p className="text-xs text-white/50 mt-2">
                Recomendado: 1% – 5% según el plan UX
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 font-mono text-white text-base">
            <Lightbulb className="h-5 w-5 text-[#FFD100]" />
            <span>Consejos para este paso</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-white/70 text-balance">
            <li>
              Revisa benchmarks de tu nicho: la mayoría de infoproductos premium
              oscilan entre USD 47 y USD 197.
            </li>
            <li>
              Mantén la conversión conservadora (1%–3%) si aún no tienes datos
              consistentes; evita escenarios optimistas.
            </li>
            <li>
              Utiliza la estimación de clientes como un escenario base desde el
              cual contrastar la escalabilidad del modelo recurrente.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function StepTwoForm({
  inputs,
  onInputChange,
  onNext,
  errors = [],
}: {
  inputs: typeof DEFAULT_INPUTS;
  onInputChange: (field: keyof typeof DEFAULT_INPUTS, value: number) => void;
  onNext: () => void;
  errors?: ValidationError[];
}) {
  const getErrorMessage = (field: keyof typeof DEFAULT_INPUTS) =>
    errors.find((error) => error.field === field)?.message;

  const revenueHelpId = "step2-revenue-help";
  const retentionHelpId = "step2-retention-help";

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-white/20 bg-white/5 p-4 sm:p-6">
        <h3 className="font-mono text-lg text-white sm:text-xl text-balance">
          Modelo de suscripción recurrente
        </h3>
        <p className="mt-3 text-sm text-white/70 text-balance">
          Define precios, costes y métricas de retención para visualizar el
          margen mensual y prever el impacto de tus mejoras de producto o
          marketing.
        </p>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["revenue", "retention"]}
        className="space-y-4"
      >
        <AccordionItem
          value="revenue"
          className="overflow-hidden rounded-lg border border-white/20 bg-white/5 shadow-sm"
        >
          <AccordionTrigger className="px-4 text-left font-mono text-base text-white">
            Ingresos recurrentes
          </AccordionTrigger>
          <AccordionContent className="space-y-4 px-4 pb-4">
            <p id={revenueHelpId} className="text-sm text-white/70">
              Ajusta precio y costo mensual para visualizar margen y crecimiento
              potencial. Compara distintos escenarios duplicando la sección y
              cerrando la anterior.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="subscriptionPrice"
                  className="block text-sm font-medium text-white/90"
                >
                  Precio mensual de suscripción
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <DollarSign className="h-5 w-5 text-white/50" />
                  </span>
                  <input
                    id="subscriptionPrice"
                    type="number"
                    value={inputs.subscriptionPrice}
                    onChange={(e) =>
                      onInputChange(
                        "subscriptionPrice",
                        parseFloat(e.target.value)
                      )
                    }
                    className="block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 pl-10 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50"
                    placeholder="Ej. 49"
                    min="0"
                    step="0.01"
                    aria-describedby={revenueHelpId}
                  />
                </div>
                {getErrorMessage("subscriptionPrice") ? (
                  <p className="mt-2 text-sm text-red-400">
                    {getErrorMessage("subscriptionPrice")}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-white/60">
                    Evalúa si incluye niveles (starter, pro) y usa el precio
                    medio más representativo.
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="subscriptionCost"
                  className="block text-sm font-medium text-white/90"
                >
                  Costo mensual por cliente
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <DollarSign className="h-5 w-5 text-white/50" />
                  </span>
                  <input
                    id="subscriptionCost"
                    type="number"
                    value={inputs.subscriptionCost}
                    onChange={(e) =>
                      onInputChange(
                        "subscriptionCost",
                        parseFloat(e.target.value)
                      )
                    }
                    className="block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 pl-10 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50"
                    placeholder="Ej. 5"
                    min="0"
                    step="0.01"
                    aria-describedby={revenueHelpId}
                  />
                </div>
                {getErrorMessage("subscriptionCost") ? (
                  <p className="mt-2 text-sm text-red-400">
                    {getErrorMessage("subscriptionCost")}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-white/60">
                    Suma herramientas SaaS, comisiones y tiempo de tu equipo por
                    cliente activo.
                  </p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="retention"
          className="overflow-hidden rounded-lg border border-white/20 bg-white/5 shadow-sm"
        >
          <AccordionTrigger className="px-4 text-left font-mono text-base text-white">
            Retención y horizonte
          </AccordionTrigger>
          <AccordionContent className="space-y-4 px-4 pb-4">
            <p id={retentionHelpId} className="text-sm text-white/70">
              Ajusta churn y horizonte temporal para entender cuándo supera al
              modelo único. Si haces experimentos, colapsa esta sección para
              mantener un registro visual claro.
            </p>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="churnRate"
                  className="block text-sm font-medium text-white/90"
                >
                  Tasa de abandono mensual (%)
                </label>
                <input
                  id="churnRate"
                  type="number"
                  value={inputs.churnRate}
                  onChange={(e) =>
                    onInputChange("churnRate", parseFloat(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50"
                  placeholder="Ej. 4"
                  min="0"
                  max="100"
                  step="0.01"
                  aria-describedby={retentionHelpId}
                />
                {getErrorMessage("churnRate") ? (
                  <p className="mt-2 text-sm text-red-400">
                    {getErrorMessage("churnRate")}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-white/60">
                    Una tasa menor al 5% mensual suele indicar product-market
                    fit en micro-SaaS.
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="timeHorizon"
                  className="block text-sm font-medium text-white/90"
                >
                  Horizonte temporal (meses)
                </label>
                <input
                  id="timeHorizon"
                  type="number"
                  value={inputs.timeHorizon}
                  onChange={(e) =>
                    onInputChange("timeHorizon", parseInt(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50"
                  placeholder="Ej. 12"
                  min="1"
                  max="60"
                  aria-describedby={retentionHelpId}
                />
                {getErrorMessage("timeHorizon") ? (
                  <p className="mt-2 text-sm text-red-400">
                    {getErrorMessage("timeHorizon")}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-white/60">
                    Analiza entre 12 y 36 meses para medir retorno y estabilidad
                    inicial.
                  </p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          className="w-full bg-[#64E365] font-bold text-white shadow-[0_0_10px_rgba(100,227,101,0.5)] hover:bg-[#64E365]/90 sm:w-auto"
        >
          Calcular modelo de suscripción
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function StepTwoContext({
  inputs,
  timeHorizon,
  totalOneTimeProfit,
  totalSubscriptionProfit,
  breakEvenPoint,
}: {
  inputs: typeof DEFAULT_INPUTS;
  timeHorizon: number;
  totalOneTimeProfit: number;
  totalSubscriptionProfit: number;
  breakEvenPoint: number | null;
}) {
  const netRevenuePerCustomer =
    inputs.subscriptionPrice - inputs.subscriptionCost;
  const retentionRate = Math.max(0, 100 - inputs.churnRate);
  const monthsToMatchOneTime =
    netRevenuePerCustomer > 0
      ? Math.ceil(inputs.oneTimePrice / netRevenuePerCustomer)
      : Infinity;
  const profitDelta = totalSubscriptionProfit - totalOneTimeProfit;

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 font-mono text-white text-base text-balance">
            <BarChart3 className="h-5 w-5 text-[#64E365]" />
            <span>Insights del modelo recurrente</span>
          </CardTitle>
          <CardDescription className="text-white/70 text-balance">
            Verifica que los supuestos del modelo mensual sostienen el margen y
            timing de equilibrio que necesitas antes de pasar al análisis final.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-white/60">
                Margen mensual por cliente
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {formatCurrency(netRevenuePerCustomer, {
                  showSymbol: true,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-white/50 mt-2">
                Incluye precio ({formatCurrency(inputs.subscriptionPrice)}) y
                costo ({formatCurrency(inputs.subscriptionCost)}).
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-white/60">
                Retención estimada
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {formatPercentage(retentionRate, 1)}
              </p>
              <p className="text-xs text-white/50 mt-2">
                Objetivo: mantener churn &lt; 5% mensual para un crecimiento
                sano.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-white/60">
                Equilibrio vs. modelo único
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {formatTimePeriod(monthsToMatchOneTime)}
              </p>
              <p className="text-xs text-white/50 mt-2">
                Tiempo estimado para igualar el ingreso único por cliente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 font-mono text-white text-base text-balance">
            <Repeat className="h-5 w-5 text-[#FFD100]" />
            <span>Qué vigilar antes de avanzar</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-white/70 text-balance">
          <p>
            Considerando un horizonte de {timeHorizon} meses, el modelo
            recurrente proyecta un
            {profitDelta >= 0 ? " incremento" : " déficit"} de{" "}
            {formatCurrency(Math.abs(profitDelta))}
            frente a la oferta única.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Ajusta churn y retención antes de avanzar; cada punto porcentual
              puede alterar el LTV y el payback.
            </li>
            <li>
              Si el punto de equilibrio (
              {breakEvenPoint && breakEvenPoint > 0
                ? formatTimePeriod(breakEvenPoint)
                : "sin cruce aún"}
              ) supera el horizonte, refina la propuesta de valor o revisa tu
              pricing.
            </li>
            <li>
              Usa estos supuestos para diseñar onboarding, nutrir a los clientes
              y sostener la retención.
            </li>
          </ul>
        </CardContent>
      </Card>
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
  errors = [],
}: {
  inputs: typeof DEFAULT_INPUTS;
  onInputChange: (field: keyof typeof DEFAULT_INPUTS, value: number) => void;
  totalOneTimeProfit: number;
  totalSubscriptionProfit: number;
  breakEvenPoint: number;
  onBack: () => void;
  errors?: ValidationError[];
}) {
  const getErrorMessage = (field: keyof typeof DEFAULT_INPUTS) =>
    errors.find((error) => error.field === field)?.message;

  const churnHelpId = "step3-churn-help";
  const horizonHelpId = "step3-horizon-help";
  const discountHelpId = "step3-discount-help";

  return (
    <div className="space-y-6">
      <Accordion
        type="multiple"
        defaultValue={["summary", "advanced"]}
        className="space-y-4"
      >
        <AccordionItem
          value="summary"
          className="overflow-hidden rounded-lg border border-white/20 bg-white/5 shadow-sm"
        >
          <AccordionTrigger className="px-4 text-left font-mono text-base text-white">
            Resumen del análisis
          </AccordionTrigger>
          <AccordionContent className="space-y-4 px-4 pb-4">
            <p className="text-sm text-white/70">
              Revisa los resultados clave antes de ajustar métricas avanzadas.
              Puedes plegar este resumen para concentrarte en la optimización.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col rounded-lg border border-white/10 bg-white/5 p-4">
                <span className="text-sm font-medium text-white/60">
                  Ganancia total (único)
                </span>
                <span className="mt-1 text-2xl font-bold text-white">
                  {formatCurrency(totalOneTimeProfit)}
                </span>
              </div>
              <div className="flex flex-col rounded-lg border border-white/10 bg-white/5 p-4">
                <span className="text-sm font-medium text-white/60">
                  Ganancia total (suscripción)
                </span>
                <span className="mt-1 text-2xl font-bold text-white">
                  {formatCurrency(totalSubscriptionProfit)}
                </span>
              </div>
              <div className="flex flex-col rounded-lg border border-white/10 bg-white/5 p-4">
                <span className="text-sm font-medium text-white/60">
                  Punto de equilibrio estimado
                </span>
                <span className="mt-1 text-2xl font-bold text-white">
                  {breakEvenPoint > 0 ? `${breakEvenPoint} meses` : "Sin cruce"}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="advanced"
          className="overflow-hidden rounded-lg border border-white/20 bg-white/5 shadow-sm"
        >
          <AccordionTrigger className="px-4 text-left font-mono text-base text-white">
            Ajustes avanzados
          </AccordionTrigger>
          <AccordionContent className="space-y-4 px-4 pb-4">
            <p className="text-sm text-white/70">
              Ajusta retención, horizonte y descuento para modelar distintos
              escenarios de cashflow.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="churnRateStep3"
                  className="block text-sm font-medium text-white/90"
                >
                  Tasa de abandono (%)
                </label>
                <input
                  id="churnRateStep3"
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
                  aria-describedby={churnHelpId}
                />
                {getErrorMessage("churnRate") ? (
                  <p className="mt-2 text-sm text-red-400">
                    {getErrorMessage("churnRate")}
                  </p>
                ) : (
                  <p id={churnHelpId} className="mt-2 text-xs text-white/60">
                    Reduce churn con onboarding y seguimiento proactivo; intenta
                    mantenerlo bajo 5%.
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="timeHorizonStep3"
                  className="block text-sm font-medium text-white/90"
                >
                  Horizonte temporal (meses)
                </label>
                <input
                  id="timeHorizonStep3"
                  type="number"
                  value={inputs.timeHorizon}
                  onChange={(e) =>
                    onInputChange("timeHorizon", parseInt(e.target.value))
                  }
                  className="mt-1 block w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white placeholder:text-white/60 focus:border-[#64E365] focus:ring-1 focus:ring-[#64E365]/50"
                  placeholder="Ej. 12"
                  min="1"
                  max="60"
                  aria-describedby={horizonHelpId}
                />
                {getErrorMessage("timeHorizon") ? (
                  <p className="mt-2 text-sm text-red-400">
                    {getErrorMessage("timeHorizon")}
                  </p>
                ) : (
                  <p id={horizonHelpId} className="mt-2 text-xs text-white/60">
                    Evalúa 12, 24 y 36 meses para identificar picos de
                    rentabilidad.
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="discountRateStep3"
                  className="block text-sm font-medium text-white/90"
                >
                  Tasa de descuento (%)
                </label>
                <input
                  id="discountRateStep3"
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
                  aria-describedby={discountHelpId}
                />
                {getErrorMessage("discountRate") ? (
                  <p className="mt-2 text-sm text-red-400">
                    {getErrorMessage("discountRate")}
                  </p>
                ) : (
                  <p id={discountHelpId} className="mt-2 text-xs text-white/60">
                    Usa una tasa mayor si tu negocio es riesgoso o si buscas
                    escenarios conservadores.
                  </p>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="border-white/20 bg-transparent text-white/70 hover:border-white/40 hover:text-white"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Volver
          </Button>
        </div>
      </div>
    </div>
  );
}

interface StepThreeContextProps {
  isCalculating: boolean;
  isPending: boolean;
  hasRequestedResults: boolean;
  shouldShowResults: boolean;
  renderableResults: CalculationResults | null;
  renderableTimeHorizon: number;
  renderableChurnRate: number;
  showResultsError: boolean;
  validationErrors: ValidationError[];
  onDownloadReport: () => void;
  onShareResults: () => Promise<void> | void;
  onScheduleConsultation: () => void;
  onReset: () => void;
  registerCtaRef?: (node: HTMLButtonElement | null) => void;
}

function StepThreeContext({
  isCalculating,
  isPending,
  hasRequestedResults,
  shouldShowResults,
  renderableResults,
  renderableTimeHorizon,
  renderableChurnRate,
  showResultsError,
  validationErrors,
  onDownloadReport,
  onShareResults,
  onScheduleConsultation,
  onReset,
  registerCtaRef,
}: StepThreeContextProps) {
  const isBusy = isCalculating || isPending;
  const canRenderResults =
    hasRequestedResults && shouldShowResults && !!renderableResults && !isBusy;

  const shouldRenderLoadingState =
    isBusy && hasRequestedResults && !showResultsError && !canRenderResults;

  useEffect(() => {
    if (!registerCtaRef) return;

    if (!canRenderResults) {
      registerCtaRef(null);
    }
  }, [canRenderResults, registerCtaRef]);

  return (
    <CalculatorErrorBoundary onRetry={onReset}>
      {showResultsError ? (
        <Alert
          variant="destructive"
          className="bg-red-500/10 border-red-500/40 text-red-100"
        >
          <AlertTitle className="font-semibold">
            Revisemos algunos campos antes de calcular
          </AlertTitle>
          <AlertDescription className="space-y-3 text-sm">
            <p>Ajusta los siguientes valores para que el cálculo sea válido:</p>
            <ul className="space-y-1 pl-4 list-disc">
              {validationErrors.map((error: ValidationError, index: number) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
            <Button
              onClick={onReset}
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:text-white"
            >
              Restablecer valores por defecto
            </Button>
          </AlertDescription>
        </Alert>
      ) : shouldRenderLoadingState ? (
        <Card className="bg-white/5 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 font-mono text-white text-base">
              <Loader2 className="h-5 w-5 animate-spin text-[#64E365]" />
              <span>Generando análisis personalizado</span>
            </CardTitle>
            <CardDescription className="text-white/70">
              Estamos procesando tus métricas para construir la comparativa
              completa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResultsSkeleton />
          </CardContent>
        </Card>
      ) : canRenderResults && renderableResults ? (
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 font-mono text-white text-base">
                <Sparkles className="h-5 w-5 text-[#64E365]" />
                <span>Resultados principales</span>
              </CardTitle>
              <CardDescription className="text-white/70">
                Comparativa directa entre tus modelos único y de suscripción
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResultsDisplay
                results={renderableResults}
                timeHorizon={renderableTimeHorizon}
              />
            </CardContent>
            <CardFooter className="flex flex-wrap gap-3">
              <Button
                onClick={onDownloadReport}
                className="bg-[#64E365] text-white hover:bg-[#64E365]/90"
              >
                Descargar reporte
              </Button>
              <Button
                onClick={onShareResults}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Share2 className="h-4 w-4 mr-2" /> Compartir resultados
              </Button>
              <Button
                onClick={onScheduleConsultation}
                variant="outline"
                className="border-[#FFD100]/40 text-[#FFD100] hover:bg-[#FFD100]/10"
                ref={registerCtaRef ?? undefined}
              >
                <Calendar className="h-4 w-4 mr-2" /> Agendar sesión
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 font-mono text-white text-base">
                <LineChart className="h-5 w-5 text-[#64E365]" />
                <span>Visualización de crecimiento</span>
              </CardTitle>
              <CardDescription className="text-white/70">
                Evolución mensual de ingresos y beneficios en el horizonte
                seleccionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ComparisonChart
                results={renderableResults}
                timeHorizon={renderableTimeHorizon}
              />
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 font-mono text-white text-base">
                <Lightbulb className="h-5 w-5 text-[#FFD100]" />
                <span>Insights accionables</span>
              </CardTitle>
              <CardDescription className="text-white/70">
                Recomendaciones basadas en tus métricas de retención y LTV
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InsightsPanel
                results={renderableResults}
                timeHorizon={renderableTimeHorizon}
                churnRate={renderableChurnRate}
              />
            </CardContent>
          </Card>

          <CTASection
            results={renderableResults}
            timeHorizon={renderableTimeHorizon}
            onDownloadReport={onDownloadReport}
            onShareResults={() => {
              void onShareResults();
            }}
            onScheduleConsultation={onScheduleConsultation}
          />
        </div>
      ) : hasRequestedResults ? (
        <Alert className="bg-white/5 border-white/20 text-white/80">
          <AlertTitle className="font-semibold text-white">
            Casi estamos
          </AlertTitle>
          <AlertDescription>
            Ajusta los valores anteriores y vuelve a calcular para ver el
            análisis completo.
          </AlertDescription>
        </Alert>
      ) : (
        <Card className="bg-white/5 border-dashed border-white/20">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#64E365]/10 text-[#64E365]">
              <Calculator className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <CardTitle className="font-mono text-white text-lg">
                ¿Listo para comparar modelos?
              </CardTitle>
              <CardDescription className="text-white/70">
                Completa los campos de los pasos anteriores y calcula para ver
                la proyección completa.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-white/60">
              Tip: Usa un horizonte de 12 a 24 meses para evaluar la estabilidad
              de tu suscripción.
            </p>
          </CardContent>
        </Card>
      )}
    </CalculatorErrorBoundary>
  );
}
