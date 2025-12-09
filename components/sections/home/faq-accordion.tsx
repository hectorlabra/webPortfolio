"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Importando framer-motion

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "¿SIRVE ESTO SI SOY JUNIOR O VENGO DE OTRO STACK?",
    answer:
      "Sí. No buscamos purismo académico. Buscamos pragmatismo. Si sabes lógica básica, puedes construir.",
  },
  {
    question: "¿POR QUÉ USAR NEXT.JS Y NO SOLUCIONES NO-CODE MÁS FÁCILES?",
    answer:
      "Por el Control y la Propiedad. El No-Code tiene techo. El Código es un activo sin límites que te pertenece al 100%.",
  },
  {
    question: "¿POR QUÉ COMPARTES TU 'COCINA' Y MÉTRICAS GRATIS?",
    answer:
      "Por reputación. En un mar de contenido generado por IA, lo único valioso es la experiencia real humana. Comparto para conectar con otros builders serios.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`border border-white/10 rounded overflow-hidden ${
            openIndex === index ? "bg-white/5" : ""
          }`}
        >
          <button
            className="flex w-full items-center justify-between p-5 text-left font-mono font-medium text-sm sm:text-base"
            onClick={() => toggleFaq(index)}
          >
            {faq.question}
            <motion.div
              initial={false}
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="p-5 pt-0 text-base text-white/70">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
