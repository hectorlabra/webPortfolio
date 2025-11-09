import * as React from "react";

export interface ToastProps {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
  variant?: "default" | "destructive";
}

export type ToastActionElement = React.ReactElement;

// Este archivo es un stub mínimo para satisfacer el tipado y permitir evolución futura.
// Puedes reemplazarlo por una implementación real de UI (shadcn/ui, radix, etc.).
export function Toast(_props: ToastProps) {
  return null;
}
