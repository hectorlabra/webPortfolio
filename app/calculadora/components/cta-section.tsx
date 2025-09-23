"use client";

import { useState } from "react";
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
import {
  ArrowRight,
  Download,
  Share2,
  BookOpen,
  MessageCircle,
  Rocket,
  Users,
  Mail,
  ExternalLink,
  CheckCircle2,
  Star,
} from "lucide-react";
import { CalculationResults } from "@/lib/types/calculator";
import { formatCurrency } from "@/app/calculadora/lib/utils";

interface CTASectionProps {
  results: CalculationResults;
  timeHorizon: number;
  className?: string;
  onDownloadReport?: () => void;
  onShareResults?: () => void;
  onScheduleConsultation?: () => void;
}

interface ActionCardProps {
  title: string;
  description: string;
  primaryAction: {
    text: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
  };
  secondaryAction?: {
    text: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  badge?: string;
  features?: string[];
  isRecommended?: boolean;
}

function ActionCard({
  title,
  description,
  primaryAction,
  secondaryAction,
  icon,
  badge,
  features,
  isRecommended = false,
}: ActionCardProps) {
  return (
    <Card
      className={`relative bg-white/5 border-white/15 backdrop-blur-sm transition-colors ${
        isRecommended ? "ring-1 ring-[#64E365]/40 shadow-green-glow" : ""
      }`}
    >
      {isRecommended && (
        <span className="absolute -top-2 -right-2 bg-[#64E365]/20 text-[#64E365] border border-[#64E365]/30 text-[10px] font-semibold px-2 py-1 rounded-full flex items-center">
          <Star className="h-3 w-3 mr-1" /> Recomendado
        </span>
      )}

      <CardHeader>
        <CardTitle className="flex items-center space-x-2 font-mono text-white text-base">
          {icon && (
            <div
              className={`${
                isRecommended ? "text-[#64E365]" : "text-white/60"
              } shrink-0`}
            >
              {icon}
            </div>
          )}
          <span>{title}</span>
          {badge && (
            <span className="ml-2 text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/15 text-white/60">
              {badge}
            </span>
          )}
        </CardTitle>
        <CardDescription className="text-white/70 text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {features && features.length > 0 && (
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start space-x-2 text-sm text-white/70"
              >
                <CheckCircle2
                  className={`h-4 w-4 mt-0.5 ${
                    isRecommended ? "text-[#64E365]" : "text-white/50"
                  }`}
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="space-y-2">
          <Button
            onClick={primaryAction.onClick}
            className={`w-full font-bold ${
              primaryAction.variant === "outline"
                ? "border-white/30 text-white hover:bg-white/10"
                : "bg-[#FFD100] text-[#0a0612] hover:bg-[#FFD100]/90 shadow-yellow-glow"
            }`}
            variant={
              primaryAction.variant === "outline" ? "outline" : "default"
            }
          >
            {primaryAction.text}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              size="sm"
              className="w-full border-white/20 text-white/80 hover:bg-white/10"
            >
              {secondaryAction.text}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function CTASection({
  results,
  timeHorizon,
  className,
  onDownloadReport,
  onShareResults,
  onScheduleConsultation,
}: CTASectionProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const isSubscriptionBetter = results.profitDifference > 0;
  const breakEvenReached =
    results.breakEvenPoint > 0 && results.breakEvenPoint <= timeHorizon;

  // Determine recommended next steps based on results
  const getRecommendedAction = () => {
    if (isSubscriptionBetter && breakEvenReached) {
      return "subscription";
    } else if (!isSubscriptionBetter) {
      return "consultation";
    } else {
      return "learning";
    }
  };

  const recommendedAction = getRecommendedAction();

  // Handle sharing
  const handleShare = async () => {
    setIsSharing(true);

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Resultados de Calculadora de Ingresos",
          text: `Comparé modelo único vs suscripción: ${
            isSubscriptionBetter ? "Suscripción" : "Único"
          } es más rentable por ${formatCurrency(
            Math.abs(results.profitDifference)
          )} en ${timeHorizon} meses.`,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("Enlace copiado al portapapeles");
      }

      onShareResults?.();
    } catch (error) {
      console.error("Error sharing:", error);
    } finally {
      setIsSharing(false);
    }
  };

  // Handle download
  const handleDownload = () => {
    setIsDownloading(true);

    // Here you would implement PDF generation
    setTimeout(() => {
      setIsDownloading(false);
      onDownloadReport?.();
    }, 2000);
  };

  const actions = [
    {
      id: "subscription",
      title: "Implementa tu Suscripción",
      description:
        "Los números favorecen el modelo recurrente. Te ayudo a transformar tu producto.",
      primaryAction: {
        text: "Comenzar Transformación",
        onClick: () => window.open("/quien-soy#contacto", "_blank"),
      },
      secondaryAction: {
        text: "Ver Casos de Éxito",
        onClick: () => window.open("/blog", "_blank"),
      },
      icon: <Rocket className="h-5 w-5" />,
      badge: "Transformación",
      features: [
        "Auditoría completa de tu producto actual",
        "Estrategia de migración paso a paso",
        "Implementación técnica del modelo SaaS",
        "Plan de retención y crecimiento",
        "Seguimiento y optimización continua",
      ],
      isRecommended: recommendedAction === "subscription",
    },
    {
      id: "consultation",
      title: "Consulta Estratégica",
      description:
        "Necesitas una estrategia personalizada para optimizar tu modelo de negocio.",
      primaryAction: {
        text: "Agendar Consulta Gratuita",
        onClick: () =>
          onScheduleConsultation?.() ||
          window.open("/quien-soy#contacto", "_blank"),
      },
      secondaryAction: {
        text: "Conocer mi Metodología",
        onClick: () => window.open("/quien-soy", "_blank"),
      },
      icon: <MessageCircle className="h-5 w-5" />,
      badge: "30 min gratis",
      features: [
        "Análisis detallado de tu situación específica",
        "Identificación de oportunidades ocultas",
        "Hoja de ruta personalizada",
        "Recomendaciones de herramientas y tecnologías",
        "Plan de acción con métricas claras",
      ],
      isRecommended: recommendedAction === "consultation",
    },
    {
      id: "learning",
      title: "Aprende sobre Micro-SaaS",
      description:
        "Profundiza tus conocimientos antes de tomar la decisión final.",
      primaryAction: {
        text: "Leer Guías Completas",
        onClick: () => window.open("/blog", "_blank"),
      },
      secondaryAction: {
        text: "Seguir en LinkedIn",
        onClick: () =>
          window.open("https://linkedin.com/in/tu-perfil", "_blank"),
      },
      icon: <BookOpen className="h-5 w-5" />,
      badge: "Gratis",
      features: [
        "Guías paso a paso para crear micro-SaaS",
        "Casos de estudio reales y detallados",
        "Herramientas y recursos recomendados",
        "Newsletter semanal con tips prácticos",
        "Acceso a comunidad privada",
      ],
      isRecommended: recommendedAction === "learning",
    },
  ];

  return (
    <div className={`space-y-10 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold font-mono text-white flex items-center justify-center space-x-2">
          <Rocket className="h-6 w-6 text-[#64E365]" />
          <span>¿Qué sigue ahora?</span>
        </h2>
        <p className="text-white/70 text-sm max-w-2xl mx-auto leading-relaxed">
          Tienes los datos, ahora necesitas la ejecución. Te ayudo a convertir
          estos números en un negocio recurrente exitoso.
        </p>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 font-mono text-white">
            <Share2 className="h-5 w-5 text-[#64E365]" />
            <span>Acciones Rápidas</span>
          </CardTitle>
          <CardDescription className="text-white/70">
            Guarda y comparte tus resultados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleDownload}
              variant="outline"
              disabled={isDownloading}
              className="flex-1 min-w-[200px] border-white/30 text-white hover:bg-white/10"
            >
              <Download className="mr-2 h-4 w-4" />
              {isDownloading ? "Generando..." : "Descargar Reporte PDF"}
            </Button>

            <Button
              onClick={handleShare}
              variant="outline"
              disabled={isSharing}
              className="flex-1 min-w-[200px] border-white/30 text-white hover:bg-white/10"
            >
              <Share2 className="mr-2 h-4 w-4" />
              {isSharing ? "Compartiendo..." : "Compartir Resultados"}
            </Button>

            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex-1 min-w-[200px] border-white/30 text-white hover:bg-white/10"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Nueva Simulación
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-mono font-semibold text-center text-white">
          Próximos Pasos Recomendados
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {actions.map((action) => (
            <ActionCard
              key={action.id}
              title={action.title}
              description={action.description}
              primaryAction={action.primaryAction}
              secondaryAction={action.secondaryAction}
              icon={action.icon}
              badge={action.badge}
              features={action.features}
              isRecommended={action.isRecommended}
            />
          ))}
        </div>
      </div>

      {/* Results Summary for CTA context */}
      <Card className="bg-white/5 border-white/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-mono font-semibold text-white">
              Resumen de tu Análisis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <p className="font-medium text-white/80">Modelo Recomendado</p>
                <span
                  className={`inline-flex text-[10px] px-2 py-1 rounded-full font-medium border ${
                    isSubscriptionBetter
                      ? "bg-[#64E365]/15 text-[#64E365] border-[#64E365]/30"
                      : "bg-white/10 text-white/60 border-white/20"
                  }`}
                >
                  {isSubscriptionBetter ? "Suscripción" : "Producto Único"}
                </span>
              </div>

              <div className="space-y-1">
                <p className="font-medium text-white/80">Ventaja Financiera</p>
                <p className="text-white/60">
                  {formatCurrency(Math.abs(results.profitDifference))} en{" "}
                  {timeHorizon} meses
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-medium text-white/80">Punto de Equilibrio</p>
                <p className="text-white/60">
                  {breakEvenReached
                    ? `Mes ${results.breakEvenPoint}`
                    : "Fuera del período"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Proof */}
      <Card className="border border-white/15 bg-white/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Users className="h-5 w-5 text-white/50" />
              <p className="text-sm text-white/60">
                Más de{" "}
                <strong className="text-white/80">500 emprendedores</strong> han
                usado esta calculadora para tomar decisiones informadas
              </p>
            </div>

            <div className="flex items-center justify-center space-x-4 text-xs text-white/50">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-[#FFD100] text-[#FFD100]" />
                <span>200+ transformaciones exitosas</span>
              </div>
              <Separator orientation="vertical" className="h-4 bg-white/20" />
              <div className="flex items-center space-x-1">
                <Mail className="h-3 w-3" />
                <span>Newsletter con 2,500+ suscriptores</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="link"
                size="sm"
                className="text-[#64E365] hover:text-[#64E365]/80"
                onClick={() => window.open("/quien-soy", "_blank")}
              >
                Conocer mi experiencia
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
