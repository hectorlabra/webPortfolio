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
      "Hectorlabra.dev es una plataforma donde comparto estrategias, recursos y conocimientos para desarrolladores que buscan evolucionar sus carreras en la era de la IA. Mi objetivo es ayudarte a convertir los desafíos de la automatización en oportunidades, enseñándote a colaborar eficientemente con herramientas de IA mientras desarrollas las habilidades técnicas y creativas que las máquinas no pueden reemplazar.",
  },
  {
    question: "¿POR QUÉ DESARROLLO WEB EN LA ERA DE LA IA?",
    answer:
      "A pesar del auge de la IA generativa, el desarrollo web sigue siendo un campo fundamental donde los humanos marcan la diferencia. La creatividad, el pensamiento sistémico y la capacidad de traducir necesidades de usuario en soluciones técnicas son habilidades irremplazables. Te muestro cómo combinar estas capacidades humanas con las herramientas de IA para multiplicar tu productividad y valor como desarrollador, manteniendo tu relevancia en un ecosistema tecnológico en constante evolución.",
  },
  {
    question: "¿CÓMO ME PUEDEN AYUDAR?",
    answer:
      "Te ofrezco recursos para navegar tu carrera técnica en la era de la IA: desde tutoriales sobre cómo aprovechar herramientas de IA en tu flujo de trabajo, hasta estrategias para identificar y desarrollar las habilidades que te mantendrán relevante. Mi enfoque se basa en el aprendizaje continuo, la adaptabilidad y el desarrollo de un 'stack personal' que combine dominio técnico con competencias que trascienden la automatización.",
  },
  {
    question: "¿CÓMO PUEDO CONTACTARTE PARA UN PROYECTO?",
    answer:
      "Si buscas mentoría personalizada, colaboración en proyectos o tienes dudas sobre tu trayectoria profesional en tecnología, puedes contactarme a través del formulario en esta web, por email a hector@hectorlabra.dev o agendar una sesión de 30 minutos en mi calendario. Me especializo en ayudar a desarrolladores a potenciar sus carreras aprovechando (no temiendo) la revolución de la IA.",
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
