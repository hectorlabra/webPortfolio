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
          cardClass: "border-green-200 bg-green-50",
          iconColor: "text-green-600",
          titleColor: "text-green-800",
          badgeVariant: "default" as const,
        };
      case "warning":
        return {
          cardClass: "border-yellow-200 bg-yellow-50",
          iconColor: "text-yellow-600",
          titleColor: "text-yellow-800",
          badgeVariant: "secondary" as const,
        };
      case "danger":
        return {
          cardClass: "border-red-200 bg-red-50",
          iconColor: "text-red-600",
          titleColor: "text-red-800",
          badgeVariant: "destructive" as const,
        };
      default:
        return {
          cardClass: "border-blue-200 bg-blue-50",
          iconColor: "text-blue-600",
          titleColor: "text-blue-800",
          badgeVariant: "outline" as const,
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <Card className={styles.cardClass}>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              {icon && <div className={styles.iconColor}>{icon}</div>}
              <h3 className={`font-semibold ${styles.titleColor}`}>{title}</h3>
            </div>
            {metric && (
              <Badge variant={styles.badgeVariant} className="text-xs">
                {metric}
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground">{description}</p>

          {progress !== undefined && (
            <div className="space-y-1">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-right text-muted-foreground">
                {Math.round(progress)}%
              </p>
            </div>
          )}

          {recommendation && (
            <Alert className="mt-3">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Recomendación:</strong> {recommendation}
              </AlertDescription>
            </Alert>
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
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center space-x-2">
          <Lightbulb className="h-6 w-6 text-yellow-500" />
          <span>Insights Inteligentes</span>
        </h2>
        <p className="text-muted-foreground">
          Análisis automático y recomendaciones para tu decisión
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-purple-600" />
            <span>Recomendaciones Estratégicas</span>
          </CardTitle>
          <CardDescription>
            Próximos pasos basados en tu análisis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSubscriptionBetter ? (
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <ArrowRight className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">
                    Implementa el modelo de suscripción
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Los números favorecen la suscripción. Desarrolla un MVP con
                    las funcionalidades core.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <ArrowRight className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Optimiza la retención</h4>
                  <p className="text-sm text-muted-foreground">
                    Reduce el churn del {formatPercentage(churnRate)}{" "}
                    implementando onboarding efectivo y soporte proactivo.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <ArrowRight className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Considera precios escalonados</h4>
                  <p className="text-sm text-muted-foreground">
                    Con un LTV de {formatCurrency(ltv)}, tienes margen para
                    crear planes premium.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <ArrowRight className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">
                    Mantén el modelo único a corto plazo
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Es más rentable en {timeHorizon} meses. Úsalo para generar
                    capital inicial.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <ArrowRight className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">
                    Prepara la transición a suscripción
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Desarrolla funcionalidades recurrentes y mejora la propuesta
                    de valor.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <ArrowRight className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium">Extiende el análisis</h4>
                  <p className="text-sm text-muted-foreground">
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
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-amber-800">
            <AlertTriangle className="h-5 w-5" />
            <span>Consideraciones de Riesgo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-amber-800">Modelo Único</h4>
              <ul className="space-y-1 text-amber-700 mt-2">
                <li>• Ingresos no recurrentes</li>
                <li>• Necesidad constante de nuevos clientes</li>
                <li>• Menor valor a largo plazo</li>
                <li>• Dependencia de lanzamientos</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-amber-800">Suscripción</h4>
              <ul className="space-y-1 text-amber-700 mt-2">
                <li>• Riesgo de churn elevado</li>
                <li>• Necesidad de soporte continuo</li>
                <li>• Inversión inicial mayor</li>
                <li>• Complejidad técnica adicional</li>
              </ul>
            </div>
          </div>

          <Alert>
            <AlertDescription className="text-amber-800">
              <strong>Recomendación:</strong> Considera un modelo híbrido:
              producto inicial único para generar capital, seguido de
              características premium por suscripción.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
