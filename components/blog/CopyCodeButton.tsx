"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyCodeButtonProps {
  code: string;
}

export function CopyCodeButton({ code }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error al copiar:", error);
    }
  };

  return (
    <Button
      onClick={copyToClipboard}
      size="sm"
      variant="ghost"
      className={`copy-button absolute top-2 right-2 h-8 w-8 p-0 opacity-0 hover:opacity-100 focus:opacity-100 transition-all duration-300 ${
        copied ? "shadow-green-glow scale-105" : ""
      }`}
      aria-label="Copiar código"
    >
      {copied ? (
        <Check className="h-4 w-4 text-accent-green" />
      ) : (
        <Copy className="h-4 w-4 text-white/60 hover:text-white" />
      )}
    </Button>
  );
}
