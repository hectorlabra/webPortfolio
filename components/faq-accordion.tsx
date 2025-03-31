"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FaqItem {
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  {
    question: "¿QUÉ ES HECTORLABRA.DEV?",
    answer:
      "Hectorlabra.dev es una plataforma donde comparto mi experiencia en desarrollo web, arquitectura de sistemas y estrategia digital. Ofrezco recursos, tutoriales y servicios para ayudarte a construir soluciones digitales escalables y mantenibles.",
  },
  {
    question: "¿POR QUÉ UN NEGOCIO WEB?",
    answer:
      "Un negocio web te permite alcanzar audiencias globales, operar con bajos costos fijos y escalar rápidamente. Mi enfoque se centra en ayudarte a construir sistemas modulares que puedan crecer con tu negocio, utilizando las mejores prácticas de ingeniería y desarrollo.",
  },
  {
    question: "¿CÓMO ME PUEDEN AYUDAR?",
    answer:
      "Puedo ayudarte a través de consultoría personalizada, desarrollo de soluciones a medida, o mediante los recursos gratuitos y cursos que ofrezco. Mi metodología se basa en dividir los problemas complejos en componentes más pequeños y manejables, como piezas de Lego, que luego se ensamblan para crear soluciones robustas.",
  },
  {
    question: "¿CÓMO PUEDO CONTACTARTE PARA UN PROYECTO?",
    answer:
      "Puedes contactarme a través del formulario en esta web, por email a hector@hectorlabra.dev o programando una llamada inicial a través de mi calendario. Respondo a todas las consultas en un plazo de 24-48 horas.",
  },
]

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`border border-white/10 rounded overflow-hidden ${openIndex === index ? "bg-white/5" : ""}`}
        >
          <button
            className="flex w-full items-center justify-between p-5 text-left font-mono font-medium text-base"
            onClick={() => toggleFaq(index)}
          >
            {faq.question}
            <ChevronDown className={`h-5 w-5 transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
          </button>
          {openIndex === index && <div className="p-5 pt-0 text-base text-white/70">{faq.answer}</div>}
        </div>
      ))}
    </div>
  )
}

