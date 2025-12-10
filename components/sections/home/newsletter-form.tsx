"use client";

import type React from "react";

import { useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewsletterFormProps {
  minimal?: boolean;
  compact?: boolean;
  tagline?: React.ReactNode;
  taglineClassName?: string;
}

export function NewsletterForm({
  minimal = false,
  compact = false,
  tagline,
  taglineClassName,
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Optimized with useCallback to prevent re-renders
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription failed:", error);
      setError("Algo salió mal. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  if (minimal) {
    return (
      <div className="w-full space-y-2">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className={`rounded bg-white/10 ${
                compact ? "p-2 text-xs" : "p-2 sm:p-3 text-sm sm:text-base"
              } text-white`}
            >
              <p>¡Gracias por suscribirte!</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-2"
            >
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`flex-1 bg-white/5 border-white/10 focus:border-white ${
                  compact ? "h-9 text-xs" : "h-10 sm:h-12 text-sm sm:text-base"
                }`}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                size="sm"
                className={`bg-[#FFD24C] text-[#0a0612] hover:bg-[#FFD24C]/90 ${
                  compact ? "h-9 w-full sm:w-9" : "h-10 sm:h-12 w-full sm:w-12"
                } p-0 shadow-[0_0_8px_rgba(255,220,100,0.4)] hover:shadow-[0_0_12px_rgba(255,220,100,0.6)] transition-shadow mt-2 sm:mt-0`}
                style={{ willChange: isSubmitting ? "auto" : "box-shadow" }}
              >
                {isSubmitting ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    ...
                  </motion.span>
                ) : (
                  <ArrowRight className={compact ? "h-4 w-4" : "h-5 w-5"} />
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="rounded bg-white/10 p-3 sm:p-5 text-white"
          >
            <p className="font-medium text-sm sm:text-base">
              ¡Gracias por suscribirte!
            </p>
            <p className="text-sm sm:text-base text-white/70">
              Revisa tu email para confirmar tu suscripción.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-3 sm:space-y-4"
          >
            <div className="flex w-full flex-col gap-3">
              <Input
                type="email"
                placeholder="tu@email.com — quiero unirme"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 focus:border-white h-11 sm:h-12 text-base rounded-md"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#FFD24C] text-[#0a0612] hover:bg-[#FFD24C]/90 h-11 sm:h-12 text-base w-full rounded-md font-medium transition-all shadow-[0_0_8px_rgba(255,210,76,0.3)] hover:shadow-[0_0_12px_rgba(255,210,76,0.5)]"
                style={{ willChange: isSubmitting ? "auto" : "box-shadow" }}
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.span
                      key="submitting"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      Enviando...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="submit"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center"
                    >
                      Entrar al círculo
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm sm:text-base text-red-500"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="pt-2 sm:pt-0">
              <p
                className={
                  taglineClassName ??
                  "text-white/70 text-[0.65rem] sm:text-sm tracking-[0.04em] whitespace-nowrap text-center"
                }
              >
                {tagline ?? "Lives · insights · SEO práctico"}
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
