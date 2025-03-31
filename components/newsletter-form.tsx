"use client"

import type React from "react"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface NewsletterFormProps {
  minimal?: boolean
}

export function NewsletterForm({ minimal = false }: NewsletterFormProps) {
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
          <div className="rounded bg-white/10 p-3 text-white text-base">
            <p>¡Gracias por suscribirte!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white/5 border-white/10 focus:border-white h-12 text-base"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              size="sm"
              className="bg-[#FFD24C] text-[#0a0612] hover:bg-[#FFD24C]/90 h-12 w-12 p-0"
            >
              {isSubmitting ? "..." : <ArrowRight className="h-5 w-5" />}
            </Button>
          </form>
        )}
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {isSuccess ? (
        <div className="rounded bg-white/10 p-5 text-white">
          <p className="font-medium text-base">¡Gracias por suscribirte!</p>
          <p className="text-base text-white/70">Revisa tu email para confirmar tu suscripción.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex w-full flex-col gap-3">
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/5 border-white/10 focus:border-white h-12 text-base"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#FFD24C] text-[#0a0612] hover:bg-[#FFD24C]/90 h-12 text-base"
            >
              {isSubmitting ? "Enviando..." : "Empieza Ahora"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          {error && <p className="text-base text-red-500">{error}</p>}
            <p className="text-sm text-white/70 text-center">Curso intensivo por email de 14 días exclusivo para suscriptores.</p>
        </form>
      )}
    </div>
  )
}

