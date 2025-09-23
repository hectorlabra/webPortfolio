"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Target,
  Clock,
  DollarSign,
  Users,
  Zap,
  ArrowRight,
} from "lucide-react";
import { CalculationResults } from "@/lib/types/calculator";
import {
  formatCurrency,
  formatPercentage,
  formatTimePeriod,
  generateInsightsText,
} from "@/app/calculadora/lib/utils";

interface InsightsPanelProps {
  results: CalculationResults;
  timeHorizon: number;
  churnRate?: number; // se pasa desde los inputs originales
  className?: string;
}

interface InsightCardProps {
  title: string;
  description: string;
  type: "success" | "warning" | "info" | "danger";
  icon?: React.ReactNode;
  metric?: string;
  progress?: number;
  recommendation?: string;
}

function InsightCard({
  title,
  description,
  type,
  icon,
  metric,
  progress,
  recommendation,
}: InsightCardProps) {
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          border: "border-[#64E365]/40",
          bg: "bg-[#64E365]/10",
          icon: "text-[#64E365]",
          title: "text-[#64E365]",
          badge: "bg-[#64E365]/20 text-[#64E365] border border-[#64E365]/30",
          progress: "bg-[#64E365]/30",
        };
      case "warning":
        return {
          border: "border-[#FFD100]/40",
          bg: "bg-[#FFD100]/10",
          icon: "text-[#FFD100]",
          title: "text-[#FFD100]",
          badge: "bg-[#FFD100]/20 text-[#FFD100] border border-[#FFD100]/30",
          progress: "bg-[#FFD100]/30",
        };
      case "danger":
        return {
          border: "border-red-400/40",
          bg: "bg-red-400/10",
          icon: "text-red-400",
          title: "text-red-400",
          badge: "bg-red-400/20 text-red-300 border border-red-400/30",
          progress: "bg-red-400/30",
        };
      default:
        return {
          border: "border-white/20",
          bg: "bg-white/5",
          icon: "text-white/70",
          title: "text-white",
          badge: "bg-white/10 text-white/70 border border-white/20",
          progress: "bg-white/20",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <Card className={`${styles.border} ${styles.bg} backdrop-blur-sm`}>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              {icon && <div className={styles.icon}>{icon}</div>}
              <h3 className={`font-mono text-sm font-semibold ${styles.title}`}>
                {title}
              </h3>
            </div>
            {metric && (
              <span
                className={`text-[10px] px-2 py-1 rounded-full font-medium ${styles.badge}`}
              >
                {metric}
              </span>
            )}
          </div>

          <p className="text-sm text-white/70 leading-relaxed">{description}</p>

          {progress !== undefined && (
            <div className="space-y-1">
              <Progress value={progress} className="h-2" />
              <p className="text-[10px] tracking-wide text-right text-white/50">
                {Math.round(progress)}%
              </p>
            </div>
          )}

          {recommendation && (
            <div className="mt-2 text-xs bg-white/5 border border-white/10 rounded p-3 flex items-start space-x-2">
              <Lightbulb className="h-4 w-4 text-[#64E365] shrink-0" />
              <p className="text-white/70">
                <span className="font-semibold text-white/80">
                  Recomendación:{" "}
                </span>
                {recommendation}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function InsightsPanel({
  results,
  timeHorizon,
  churnRate = 5,
  className,
}: InsightsPanelProps) {
  // Calculate key metrics for insights
  const isSubscriptionBetter = results.profitDifference > 0;
  const breakEvenReached =
    results.breakEvenPoint > 0 && results.breakEvenPoint <= timeHorizon;
  const paybackQuick = results.paybackPeriod < 12;
  const ltv = results.ltv;
  const margin = results.oneTimeMargin;

  // Generate dynamic insights
  const dynamicInsights = generateInsightsText(results, timeHorizon);

  // Calculate metrics for insight cards
  const revenueGrowthRate =
    (results.revenueDifference / results.oneTimeRevenue) * 100;
  const profitGrowthRate =
    results.oneTimeProfit === 0
      ? 0
      : (results.profitDifference / results.oneTimeProfit) * 100;

  // Break-even progress
  const breakEvenProgress = breakEvenReached
    ? 100
    : results.breakEvenPoint === -1
    ? 0
    : Math.min((timeHorizon / results.breakEvenPoint) * 100, 100);

  // LTV to CAC ratio (assuming initial cost is CAC)
  const ltvToCacRatio =
    results.ltv / Math.max(results.oneTimeRevenue / 1000, 1); // Simplified calculation

  const insights = [
    // Model Comparison Insight
    {
      title: isSubscriptionBetter
        ? "Suscripción más rentable"
        : "Modelo único más rentable",
      description: isSubscriptionBetter
        ? `El modelo de suscripción genera ${formatCurrency(
            results.profitDifference
          )} más en ${timeHorizon} meses, representando un crecimiento del ${formatPercentage(
            profitGrowthRate,
            1
          )} sobre el modelo único.`
        : `El modelo único es más rentable por ${formatCurrency(
            Math.abs(results.profitDifference)
          )} en el período analizado. Considera extender el horizonte temporal para evaluar el potencial a largo plazo.`,
      type: isSubscriptionBetter ? ("success" as const) : ("warning" as const),
      icon: isSubscriptionBetter ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <AlertTriangle className="h-4 w-4" />
      ),
      metric: `${formatPercentage(Math.abs(profitGrowthRate), 1)} diferencia`,
      recommendation: isSubscriptionBetter
        ? "Procede con el modelo de suscripción. Asegúrate de optimizar la retención para maximizar el LTV."
        : "Evalúa extender el análisis a 36-48 meses o reducir la tasa de churn para mejorar el modelo de suscripción.",
    },

    // Break-even Analysis
    {
      title: breakEvenReached
        ? "Punto de equilibrio alcanzado"
        : "Equilibrio no alcanzado",
      description: breakEvenReached
        ? `La suscripción supera al modelo único en el mes ${
            results.breakEvenPoint
          }. Esto representa un ${formatPercentage(
            (results.breakEvenPoint / timeHorizon) * 100,
            1
          )} del período analizado.`
        : results.breakEvenPoint === -1
        ? `La suscripción no supera al modelo único en ${timeHorizon} meses. Necesitas ${formatTimePeriod(
            results.breakEvenPoint
          )} para alcanzar el equilibrio.`
        : `El equilibrio se alcanzaría en el mes ${results.breakEvenPoint}, fuera del período de análisis actual.`,
      type: breakEvenReached ? ("success" as const) : ("warning" as const),
      icon: <Target className="h-5 w-5" />,
      metric: breakEvenReached
        ? `Mes ${results.breakEvenPoint}`
        : "No alcanzado",
      progress: breakEvenProgress,
      recommendation: breakEvenReached
        ? "El modelo de suscripción es viable. Enfócate en estrategias de retención post-equilibrio."
        : "Considera reducir costos operativos, aumentar precios, o mejorar la retención para acelerar el equilibrio.",
    },

    // LTV Analysis
    {
      title: "Análisis del valor de vida",
      description:
        ltv > 0
          ? `Cada cliente de suscripción genera ${formatCurrency(
              ltv
            )} a lo largo de su ciclo de vida. Con una relación LTV:CAC de ${ltvToCacRatio.toFixed(
              1
            )}:1.`
          : "El LTV calculado indica problemas en el modelo. Revisa los costos y la retención.",
      type:
        ltv > 100
          ? ("success" as const)
          : ltv > 50
          ? ("info" as const)
          : ("danger" as const),
      icon: <DollarSign className="h-5 w-5" />,
      metric: formatCurrency(ltv),
      recommendation:
        ltv > 100
          ? "Excelente LTV. Considera invertir más en adquisición de clientes para escalar."
          : ltv > 50
          ? "LTV moderado. Optimiza la retención y considera aumentos de precios graduales."
          : "LTV bajo. Urgente revisar costos operativos y estrategias de retención.",
    },

    // Payback Period
    {
      title: "Período de recuperación",
      description: paybackQuick
        ? `Recuperas la inversión en ${formatTimePeriod(
            results.paybackPeriod
          )}. Esto es excelente para la liquidez del negocio.`
        : `La recuperación toma ${formatTimePeriod(
            results.paybackPeriod
          )}. Considera estrategias para acelerar el retorno.`,
      type: paybackQuick
        ? ("success" as const)
        : results.paybackPeriod < 24
        ? ("info" as const)
        : ("warning" as const),
      icon: <Clock className="h-5 w-5" />,
      metric: formatTimePeriod(results.paybackPeriod),
      recommendation: paybackQuick
        ? "Período de recuperación óptimo. Puedes invertir agresivamente en crecimiento."
        : "Mejora el onboarding y la activación temprana para reducir el tiempo de recuperación.",
    },

    // Margin Analysis
    {
      title: "Análisis de márgenes",
      description:
        margin > 50
          ? `Excelente margen del ${formatPercentage(
              margin
            )} en el modelo único. Esto da flexibilidad para experimentar con precios en suscripción.`
          : margin > 20
          ? `Margen saludable del ${formatPercentage(
              margin
            )}. Tienes espacio para optimizar costos en el modelo de suscripción.`
          : `Margen bajo del ${formatPercentage(
              margin
            )}. Es crítico optimizar costos antes de implementar suscripciones.`,
      type:
        margin > 50
          ? ("success" as const)
          : margin > 20
          ? ("info" as const)
          : ("warning" as const),
      icon: <TrendingUp className="h-5 w-5" />,
      metric: formatPercentage(margin),
      recommendation:
        margin > 50
          ? "Considera reinvertir parte del margen en mejorar la propuesta de valor de la suscripción."
          : margin > 20
          ? "Optimiza costos operativos para mejorar márgenes antes de escalar."
          : "Urgente revisar estructura de costos. Considera aumentar precios o reducir costos.",
    },
  ];

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold font-mono flex items-center justify-center space-x-2 text-white">
          <Lightbulb className="h-6 w-6 text-[#64E365]" />
          <span>Insights Inteligentes</span>
        </h2>
        <p className="text-white/70 text-sm max-w-xl mx-auto">
          Análisis automático y recomendaciones personalizadas para tu decisión
        </p>
      </div>

      {/* Key Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <InsightCard
            key={index}
            title={insight.title}
            description={insight.description}
            type={insight.type}
            icon={insight.icon}
            metric={insight.metric}
            progress={insight.progress}
            recommendation={insight.recommendation}
          />
        ))}
      </div>

      {/* Strategic Recommendations */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 font-mono text-white">
            <Zap className="h-5 w-5 text-[#64E365]" />
            <span>Recomendaciones Estratégicas</span>
          </CardTitle>
          <CardDescription className="text-white/70">
            Próximos pasos basados en tu análisis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSubscriptionBetter ? (
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <ArrowRight className="h-5 w-5 text-[#64E365] mt-0.5" />
                <div>
                  <h4 className="font-medium text-white/90 font-mono">
                    Implementa el modelo de suscripción
                  </h4>
                  <p className="text-sm text-white/70">
                    Los números favorecen la suscripción. Desarrolla un MVP con
                    las funcionalidades core.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <ArrowRight className="h-5 w-5 text-[#FFD100] mt-0.5" />
                <div>
                  <h4 className="font-medium text-white/90 font-mono">
                    Optimiza la retención
                  </h4>
                  <p className="text-sm text-white/70">
                    Reduce el churn del {formatPercentage(churnRate)}{" "}
                    implementando onboarding efectivo y soporte proactivo.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <ArrowRight className="h-5 w-5 text-white/60 mt-0.5" />
                <div>
                  <h4 className="font-medium text-white/90 font-mono">
                    Considera precios escalonados
                  </h4>
                  <p className="text-sm text-white/70">
                    Con un LTV de {formatCurrency(ltv)}, tienes margen para
                    crear planes premium.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <ArrowRight className="h-5 w-5 text-[#FFD100] mt-0.5" />
                <div>
                  <h4 className="font-medium text-white/90 font-mono">
                    Mantén el modelo único a corto plazo
                  </h4>
                  <p className="text-sm text-white/70">
                    Es más rentable en {timeHorizon} meses. Úsalo para generar
                    capital inicial.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <ArrowRight className="h-5 w-5 text-white/60 mt-0.5" />
                <div>
                  <h4 className="font-medium text-white/90 font-mono">
                    Prepara la transición a suscripción
                  </h4>
                  <p className="text-sm text-white/70">
                    Desarrolla funcionalidades recurrentes y mejora la propuesta
                    de valor.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <ArrowRight className="h-5 w-5 text-[#64E365] mt-0.5" />
                <div>
                  <h4 className="font-medium text-white/90 font-mono">
                    Extiende el análisis
                  </h4>
                  <p className="text-sm text-white/70">
                    Evalúa el modelo a 36-48 meses para ver el potencial real de
                    la suscripción.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 font-mono text-white">
            <AlertTriangle className="h-5 w-5 text-[#FFD100]" />
            <span>Consideraciones de Riesgo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-white/90 font-mono">
                Modelo Único
              </h4>
              <ul className="space-y-1 text-white/60 mt-2">
                <li>• Ingresos no recurrentes</li>
                <li>• Necesidad constante de nuevos clientes</li>
                <li>• Menor valor a largo plazo</li>
                <li>• Dependencia de lanzamientos</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-white/90 font-mono">
                Suscripción
              </h4>
              <ul className="space-y-1 text-white/60 mt-2">
                <li>• Riesgo de churn elevado</li>
                <li>• Necesidad de soporte continuo</li>
                <li>• Inversión inicial mayor</li>
                <li>• Complejidad técnica adicional</li>
              </ul>
            </div>
          </div>

          <div className="text-xs bg-[#FFD100]/10 border border-[#FFD100]/30 rounded p-3 flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-[#FFD100] shrink-0" />
            <p className="text-white/70">
              <span className="font-semibold text-white/80">
                Recomendación:{" "}
              </span>
              Considera un modelo híbrido: producto inicial único para generar
              capital, seguido de características premium por suscripción.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
