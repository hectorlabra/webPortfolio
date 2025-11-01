"use client";

import { Component, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface CalculatorErrorBoundaryProps {
  children: ReactNode;
  onRetry?: () => void;
}

interface CalculatorErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class CalculatorErrorBoundary extends Component<
  CalculatorErrorBoundaryProps,
  CalculatorErrorBoundaryState
> {
  state: CalculatorErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Calculator rendering error:", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-red-400/40 bg-red-400/10" role="alert">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-300">
              <AlertTriangle className="h-5 w-5" />
              <span>Ha ocurrido un error inesperado</span>
            </CardTitle>
            <CardDescription className="text-red-200/80">
              No pudimos renderizar los resultados. Puedes intentar refrescar
              los datos o volver a cargar la página.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={this.handleRetry}
              className="bg-[#FFD100] text-[#0a0612] hover:bg-[#FFD100]/90 font-bold"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Reintentar cálculo
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Recargar página
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
