"use client";

import Image from "next/image";
import { ArrowRight, Check, Github, Twitter, Linkedin } from "lucide-react";
import { useState } from "react";

// UI Components imports
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GeometricPattern } from "@/components/geometric-pattern";
import { SocialProof } from "@/components/social-proof";
import { TypewriterText } from "@/components/typewriter-text";

export default function QuienSoyPage() {
  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <main className="flex-1">
        {/* Encabezado impactante */}
        <section className="w-full py-16 sm:py-24 relative">
          <div className="container flex-1 flex flex-col px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-6 max-w-[800px] mx-auto">
              <div className="rounded-full overflow-hidden border-4 border-[#64E365] shadow-[0_0_15px_rgba(100,227,101,0.5)] w-32 h-32 sm:w-40 sm:h-40">
                <Image
                  src="/placeholder-user.jpg"
                  alt="Héctor Labra"
                  width={160}
                  height={160}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="space-y-3">
                <h1 className="font-mono text-3xl sm:text-4xl font-bold tracking-tighter">
                  Hola, soy <TypewriterText text="Héctor Labra" />
                </h1>
                <p className="text-lg sm:text-xl text-white/70 max-w-[600px] mx-auto">
                  Desarrollador web, emprendedor digital y apasionado por
                  enseñar tecnología de forma simple y accesible.
                </p>
              </div>
              <div className="flex space-x-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full h-10 w-10 border border-white/20 bg-white/5"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full h-10 w-10 border border-white/20 bg-white/5"
                >
                  <Github className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full h-10 w-10 border border-white/20 bg-white/5"
                >
                  <Linkedin className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Divisor */}
        <GeometricPattern />

        {/* Historia personal y profesional */}
        <section className="w-full py-16 sm:py-24">
          <div className="container flex-1 flex flex-col px-4 md:px-6">
            <div className="max-w-[700px] mx-auto space-y-8">
              <h2 className="font-mono text-2xl sm:text-3xl font-bold tracking-tighter">
                Mi historia
              </h2>

              <div className="prose prose-invert max-w-none">
                <p className="text-base sm:text-lg text-white/80 leading-relaxed">
                  Mi camino en el mundo del desarrollo comenzó hace más de 8
                  años, cuando decidí dar un giro a mi carrera profesional.
                  Desde entonces, me he especializado en tecnologías web
                  modernas y he trabajado con startups y empresas para crear
                  soluciones digitales efectivas.
                </p>

                <div className="my-8">
                  <Image
                    src="/placeholder.jpg"
                    alt="Trabajando en mi oficina"
                    width={700}
                    height={400}
                    className="rounded-lg object-cover w-full shadow-lg shadow-[#64E365]/10"
                  />
                  <p className="text-sm text-white/50 text-center mt-2">
                    Trabajando en mi oficina en casa, donde nacen las ideas.
                  </p>
                </div>

                <p className="text-base sm:text-lg text-white/80 leading-relaxed">
                  A lo largo de mi trayectoria, he descubierto que mi verdadera
                  pasión está en compartir conocimiento y ayudar a otros a
                  navegar el complejo mundo de la programación. En la era de la
                  IA y la automatización, creo firmemente que entender los
                  fundamentos de la tecnología es más importante que nunca.
                </p>

                <blockquote className="border-l-4 border-[#FFD100] pl-4 my-6 italic text-white/90">
                  "La tecnología debe ser una herramienta de libertad, no una
                  barrera. Mi misión es desmitificar el código y hacerlo
                  accesible para todos."
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* Divisor */}
        <GeometricPattern />

        {/* Valores y filosofía */}
        <section className="w-full py-16 sm:py-24 bg-white/5">
          <div className="container flex-1 flex flex-col px-4 md:px-6">
            <div className="max-w-[700px] mx-auto space-y-8">
              <h2 className="font-mono text-2xl sm:text-3xl font-bold tracking-tighter">
                Valores y filosofía
              </h2>

              <div className="grid gap-8 sm:grid-cols-2">
                <Card className="bg-white/5 border-white/10 p-6">
                  <h3 className="text-xl font-bold mb-3 font-mono">
                    Simplicidad
                  </h3>
                  <p className="text-white/70">
                    Creo en reducir la complejidad y enfocarme en soluciones
                    elegantes que resuelvan problemas reales.
                  </p>
                </Card>

                <Card className="bg-white/5 border-white/10 p-6">
                  <h3 className="text-xl font-bold mb-3 font-mono">
                    Aprendizaje continuo
                  </h3>
                  <p className="text-white/70">
                    La tecnología evoluciona constantemente, y mantenerse al día
                    es tanto un desafío como una oportunidad.
                  </p>
                </Card>

                <Card className="bg-white/5 border-white/10 p-6">
                  <h3 className="text-xl font-bold mb-3 font-mono">
                    Innovación pragmática
                  </h3>
                  <p className="text-white/70">
                    Uso nuevas herramientas y metodologías cuando aportan valor
                    real, no por seguir tendencias.
                  </p>
                </Card>

                <Card className="bg-white/5 border-white/10 p-6">
                  <h3 className="text-xl font-bold mb-3 font-mono">
                    Comunidad
                  </h3>
                  <p className="text-white/70">
                    Creo en construir y aportar a comunidades de desarrolladores
                    que crecen juntos.
                  </p>
                </Card>
              </div>

              <p className="text-base sm:text-lg text-white/80 leading-relaxed mt-6">
                En la era de la IA, mi enfoque es combinar las nuevas
                tecnologías con una sólida comprensión de los fundamentos. La IA
                es una herramienta poderosa, pero el criterio y la experiencia
                humana siguen siendo insustituibles.
              </p>
            </div>
          </div>
        </section>

        {/* Divisor */}
        <GeometricPattern />

        {/* Experiencia y habilidades */}
        <section className="w-full py-16 sm:py-24">
          <div className="container flex-1 flex flex-col px-4 md:px-6">
            <div className="max-w-[700px] mx-auto space-y-8">
              <h2 className="font-mono text-2xl sm:text-3xl font-bold tracking-tighter">
                Experiencia y habilidades
              </h2>

              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold">Desarrollo Web</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[
                      "React",
                      "Next.js",
                      "TypeScript",
                      "Tailwind CSS",
                      "Node.js",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-[#64E365]/20 text-[#64E365] rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold">Herramientas y Métodos</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["Git", "GitHub", "CI/CD", "Agile", "Design Thinking"].map(
                      (skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-[#FFD100]/20 text-[#FFD100] rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold">IA y Automatización</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[
                      "Prompt Engineering",
                      "LLMs",
                      "ChatGPT",
                      "GitHub Copilot",
                      "Automatización",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-bold mb-4">Proyectos destacados</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="overflow-hidden bg-white/5 border-white/15">
                    <div className="aspect-video w-full overflow-hidden">
                      <Image
                        src="/placeholder.jpg"
                        alt="Proyecto 1"
                        width={400}
                        height={225}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-lg">
                        Plataforma E-learning
                      </h4>
                      <p className="text-sm text-white/70 mt-2">
                        Desarrollo de una plataforma completa de cursos online
                        con sistema de suscripción.
                      </p>
                    </div>
                  </Card>

                  <Card className="overflow-hidden bg-white/5 border-white/15">
                    <div className="aspect-video w-full overflow-hidden">
                      <Image
                        src="/placeholder.jpg"
                        alt="Proyecto 2"
                        width={400}
                        height={225}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-lg">Dashboard Analítico</h4>
                      <p className="text-sm text-white/70 mt-2">
                        Visualización de datos en tiempo real para una startup
                        de marketing digital.
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divisor */}
        <GeometricPattern />

        {/* Lado personal */}
        <section className="w-full py-16 sm:py-24">
          <div className="container flex-1 flex flex-col px-4 md:px-6">
            <div className="max-w-[700px] mx-auto space-y-8">
              <h2 className="font-mono text-2xl sm:text-3xl font-bold tracking-tighter">
                Más allá del código
              </h2>

              <p className="text-base sm:text-lg text-white/80 leading-relaxed">
                No todo en la vida es programación. Cuando no estoy frente a la
                computadora, me gusta explorar otras pasiones que mantienen el
                equilibrio en mi vida.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.jpg"
                    alt="Hobby 1"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.jpg"
                    alt="Hobby 2"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.jpg"
                    alt="Hobby 3"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">📚 Aprendizaje continuo</h3>
                  <p className="text-white/70 mt-1">
                    Siempre estoy leyendo algo nuevo, desde filosofía hasta
                    ciencia ficción especulativa.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold">🏃‍♂️ Deporte y bienestar</h3>
                  <p className="text-white/70 mt-1">
                    El ejercicio físico es fundamental para mantener la mente
                    clara. Disfruto especialmente del running y el entrenamiento
                    funcional.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold">✈️ Viajar y explorar</h3>
                  <p className="text-white/70 mt-1">
                    Conocer nuevas culturas y lugares me inspira y amplia mi
                    perspectiva sobre el mundo y los problemas que podemos
                    resolver con tecnología.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divisor */}
        <GeometricPattern />

        {/* Llamada a la acción */}
        <section className="w-full py-16 sm:py-24">
          <div className="container flex-1 flex flex-col px-4 md:px-6">
            <div className="max-w-[700px] mx-auto">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur">
                <h2 className="font-mono text-2xl sm:text-3xl font-bold tracking-tighter mb-4">
                  ¿Trabajamos juntos?
                </h2>
                <p className="text-base sm:text-lg text-white/80 mb-6">
                  Si tienes un proyecto en mente o simplemente quieres conectar,
                  no dudes en contactarme. Siempre estoy abierto a nuevas
                  oportunidades y colaboraciones.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-[#64E365] text-[#0a0612] hover:bg-[#64E365]/90 font-bold shadow-[0_0_10px_rgba(100,227,101,0.5)]">
                    Contáctame
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/20 hover:bg-white/10"
                  >
                    Ver portfolio
                  </Button>
                </div>

                {/* Social Proof abajo del CTA */}
                <div className="mt-8">
                  <SocialProof />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
