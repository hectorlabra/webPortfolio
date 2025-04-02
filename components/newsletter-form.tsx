"use client"

import type React from "react"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NewsletterFormProps {
  minimal?: boolean
  compact?: boolean
}

export function NewsletterForm({ minimal = false, compact = false }: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSuccess(true)
      setEmail("")
    } catch (err) {
      setError("Algo salió mal. Por favor intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (minimal) {
    return (
      <div className="w-full space-y-2">
        {isSuccess ? (
          <div className={`rounded bg-white/10 ${compact ? 'p-2 text-xs' : 'p-2 sm:p-3 text-sm sm:text-base'} text-white`}>
            <p>¡Gracias por suscribirte!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`flex-1 bg-white/5 border-white/10 focus:border-white ${compact ? 'h-9 text-xs' : 'h-10 sm:h-12 text-sm sm:text-base'}`}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              size="sm"
              className={`bg-[#FFD24C] text-[#0a0612] hover:bg-[#FFD24C]/90 ${compact ? 'h-9 w-full sm:w-9' : 'h-10 sm:h-12 w-full sm:w-12'} p-0 shadow-[0_0_15px_rgba(255,220,100,0.8),0_0_25px_rgba(255,220,100,0.4)] mt-2 sm:mt-0`}
            >
              {isSubmitting ? "..." : <ArrowRight className={compact ? "h-4 w-4" : "h-5 w-5"} />}
            </Button>
          </form>
        )}
      </div>
    )
  }

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      {isSuccess ? (
        <div className="rounded bg-white/10 p-3 sm:p-5 text-white">
          <p className="font-medium text-sm sm:text-base">¡Gracias por suscribirte!</p>
          <p className="text-sm sm:text-base text-white/70">Revisa tu email para confirmar tu suscripción.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="flex w-full flex-col gap-3">
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/5 border-white/10 focus:border-white h-10 sm:h-12 text-sm sm:text-base"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#FFD24C] text-[#0a0612] hover:bg-[#FFD24C]/90 h-10 sm:h-12 text-sm sm:text-base w-full"
            >
              {isSubmitting ? "Enviando..." : "Empieza Ahora"}
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          {error && <p className="text-sm sm:text-base text-red-500">{error}</p>}
            <p className="text-xs sm:text-sm text-white/70 text-center">Curso intensivo por email de 14 días exclusivo para suscriptores.</p>
        </form>
      )}
    </div>
  )
}

