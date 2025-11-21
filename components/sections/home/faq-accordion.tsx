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
    question: "¿QUÉ ES HECTORLABRA.DEV?",
    answer:
      "Un sistema para developers que quieren actualizar su stack, construir proyectos reales y usar contenido estratégico para atraer oportunidades. No es una escuela: es un enfoque práctico con resultados concretos.",
  },
  {
    question: "¿POR QUÉ DESARROLLO WEB EN LA ERA DE LA IA?",
    answer:
      "Porque la IA acelera, pero no reemplaza: alguien debe diseñar, integrar, validar, optimizar y publicar. El dev que entiende sistemas, producto y contenido sigue siendo clave y la IA multiplica ese valor.",
  },
  {
    question: "¿CÓMO ME PUEDES AYUDAR?",
    answer:
      "Con un marco claro: Construir proyectos con stack moderno → Publicar tu proceso con intención → Atraer oportunidades usando SEO, contenido y autoridad técnica.",
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
