"use client";

import Image from "next/image";
import { ArrowRight, Check, Github, Twitter, Linkedin } from "lucide-react";
import { useState } from "react";

// UI Components imports
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GeometricPattern } from "@/components/shared/geometric-pattern";
import { SocialProof } from "@/components/sections/home/social-proof";
import { TypewriterText } from "@/components/shared/typewriter-text";
import { GitHubContributionGraph } from "@/components/quien-soy/GitHubContributionGraph";

export default function QuienSoyPage() {
  return (
    <div className="mx-auto w-full max-w-[700px]">
      <main className="flex-1">
        {/* Encabezado impactante */}
        <section className="w-full min-h-[55vh] sm:min-h-[70vh] lg:min-h-[80vh] flex items-center py-12 sm:py-6 md:py-4 lg:pt-0 lg:pb-0 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0612] via-[#0a0612] to-[#0a0612]/90 pointer-events-none"></div>
          <div className="container flex-1 flex flex-col justify-center px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 max-w-[700px] mx-auto">
              <div className="rounded-full overflow-hidden border-4 border-[#64E365] shadow-[0_0_14px_rgba(100,227,101,0.5)] w-24 h-24 sm:w-32 sm:h-32">
                <Image
                  src="/placeholder-user.jpg"
                  alt="Héctor Labra"
                  width={144}
                  height={144}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="space-y-2 sm:space-y-3 mb-2">
                <h1 className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tighter whitespace-nowrap overflow-hidden">
                  Hola, soy <TypewriterText text="Héctor Labra" />
                </h1>
                <p className="text-base sm:text-lg text-white/70 max-w-[550px] mx-auto">
                  Software developer y polímata digital.
                  <br />
                  Podemos conectar en las siguientes plataformas:
                </p>
              </div>

              {/* GitHub Contribution Graph - contenedor responsivo */}
              <div className="flex justify-center w-full my-2 sm:my-3">
                <div className="w-full max-w-[650px] mx-auto overflow-hidden">
                  <GitHubContributionGraph />
                </div>
              </div>

              {/* Social icons - tamaño reducido */}
              <div className="flex space-x-4 mt-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full h-9 w-9 border border-white/20 bg-white/5"
                >
                  <Twitter className="h-4.5 w-4.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full h-9 w-9 border border-white/20 bg-white/5"
                >
                  <Github className="h-4.5 w-4.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full h-9 w-9 border border-white/20 bg-white/5"
                >
                  <Linkedin className="h-4.5 w-4.5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* GeometricPattern ahora va fuera de la sección */}
        <GeometricPattern />

        {/* Historia personal y profesional */}
        <section className="w-full py-16 sm:py-24">
          <div className="container flex-1 flex flex-col px-4 md:px-6">
            <div className="max-w-[700px] mx-auto space-y-8">
              <h2 className="font-mono text-2xl sm:text-3xl font-bold tracking-tighter">
                Mi historia
              </h2>

              <div className="prose prose-invert max-w-none space-y-6">
                <p className="text-base sm:text-lg text-white-80 font-light leading-relaxed mb-6">
                  Soy un software developer y emprendedor digital de Santiago,
                  Chile.
                </p>

                <p className="text-base sm:text-lg text-white-80 font-light leading-relaxed mb-6">
                  Hace siete años, comencé vendiendo webs básicas en WordPress a
                  negocios locales.
                </p>

                <p className="text-base sm:text-lg text-white-80 font-light leading-relaxed mb-6">
                  Cobraba menos de 300 USD y usaba plantillas porque no sabía
                  programar aún.
                </p>

                <div className="my-10">
                  <Image
                    src="/placeholder.jpg"
                    alt="Trabajando en mi oficina"
                    width={700}
                    height={400}
                    className="rounded-lg object-cover w-full shadow-lg shadow-green-20"
                  />
                  <p className="text-sm text-white-50 font-light text-center mt-2">
                    Trabajando en mi oficina en casa, donde nacen las ideas.
                  </p>
                </div>

                <p className="text-base sm:text-lg text-white-80 font-light leading-relaxed mb-6">
                  Luego, mis clientes empezaron a pedir más que diseño: querían
                  resultados en marketing.
                </p>

                <p className="text-base sm:text-lg text-white-80 font-light leading-relaxed mb-6">
                  Aprendí Google Ads, Meta Ads, SEO, Analítica web y Copywriting
                  para ayudarlos a crecer, pero las herramientas pre-hechas me
                  limitaban mucho.
                </p>

                <p className="text-base sm:text-lg text-white-80 font-light leading-relaxed mb-6">
                  Así que creé "hectorlabra.com" para compartir todo lo que
                  había aprendido.
                </p>

                <p className="text-base sm:text-lg text-white-80 font-light leading-relaxed mb-6">
                  Monetizaba mi web con afiliación y coaching, y funcionó bien,
                  aunque los plugins y licencias me agotaban.
                </p>

                <div className="my-10">
                  <Image
                    src="/placeholder.jpg"
                    alt="Trabajando en mi oficina"
                    width={700}
                    height={400}
                    className="rounded-lg object-cover w-full shadow-lg shadow-green-20"
                  />
                  <p className="text-sm text-white-50 font-light text-center mt-2">
                    Trabajando en mi oficina en casa, donde nacen las ideas.
                  </p>
                </div>

                <p className="text-base sm:text-lg text-white-80 font-light leading-relaxed mb-6">
                  Tenía que pagar por casi todo: themes, constructores, plugins;
                  algunos mensuales, otros anuales.
                </p>

                <p className="text-base sm:text-lg text-white-80 font-light leading-relaxed mb-6">
                  Además, tenía que conectar mi web a apps de terceros solo para
                  hacerla funcionar y llegar a mi audiencia era un lío.
                </p>

                <p className="text-base sm:text-lg text-white-80 font-light leading-relaxed mb-6">
                  Todo se volvió un "espagueti" enredado y bastante caro de
                  mantener.
                </p>

                <p className="text-base sm:text-lg text-white-80 font-light leading-relaxed mb-6">
                  Ese fue mi punto de inflexión.
                </p>

                <p className="text-base sm:text-lg text-white-80 font-light leading-relaxed mb-6">
                  Asi que hace tres años, decidí aprender a programar de verdad.
                </p>

                <p className="text-base sm:text-lg text-white-80 font-light leading-relaxed mb-6">
                  Me sumergí en el desarrollo web moderno y empecé a construir
                  aplicativos escalables.
                </p>

                <p className="text-base sm:text-lg text-white-80 font-light leading-relaxed mb-6">
                  Ese cambio marcó un antes y un después en mi carrera como
                  developer.
                </p>

                <p className="text-base sm:text-lg text-white-80 font-light leading-relaxed mb-6">
                  Me permitió sentir la "magia" de crear en internet, libre de
                  soluciones genéricas, más barato, más rápido y más escalable.
                </p>

                <p className="text-base sm:text-lg text-white-80 font-light leading-relaxed mb-6">
                  Hoy lidero <strong>Innovare Academia</strong> como Director
                  Académico, enseñando a 300+ alumnos a programar y monetizar su
                  carrera.
                </p>

                <p className="text-base sm:text-lg text-white-80 font-light leading-relaxed mb-6">
                  También trabajo en <strong>Innovare Software & Apps</strong>{" "}
                  como líder técnico y mantengo <strong>HectorLabra.dev</strong>
                  , mi marca personal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Valores y filosofía */}
        <section className="w-full py-16 sm:py-24 bg-gradient-to-b from-[#0a0612] to-[#0a0612]/90">
          <div className="container flex-1 flex flex-col px-4 md:px-6">
            <div className="max-w-[800px] mx-auto space-y-8">
              <h2 className="font-mono text-2xl sm:text-3xl font-bold tracking-tighter text-center">
                Valores y filosofía
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                <Card className="bg-[#FFD100] text-[#0a0612] border-none p-6 shadow-[0_0_15px_rgba(255,209,0,0.3)] transition-all hover:translate-y-[-4px]">
                  <h3 className="text-xl font-bold mb-3 font-mono">
                    Simplicidad
                  </h3>
                  <p className="text-[#0a0612]/80">
                    Creo en reducir la complejidad y enfocarme en soluciones
                    elegantes que resuelvan problemas reales.
                  </p>
                </Card>

                <Card className="bg-[#4CD964] text-[#0a0612] border-none p-6 shadow-[0_0_15px_rgba(76,217,100,0.3)] transition-all hover:translate-y-[-4px]">
                  <h3 className="text-xl font-bold mb-3 font-mono">
                    Aprendizaje continuo
                  </h3>
                  <p className="text-[#0a0612]/80">
                    La tecnología evoluciona constantemente, y mantenerse al día
                    es tanto un desafío como una oportunidad.
                  </p>
                </Card>

                <Card className="bg-[#007AFF] text-white border-none p-6 shadow-[0_0_15px_rgba(0,122,255,0.3)] transition-all hover:translate-y-[-4px]">
                  <h3 className="text-xl font-bold mb-3 font-mono">
                    Innovación pragmática
                  </h3>
                  <p className="text-white/90">
                    Uso nuevas herramientas y metodologías cuando aportan valor
                    real, no por seguir tendencias.
                  </p>
                </Card>

                <Card className="bg-[#FF3B30] text-white border-none p-6 shadow-[0_0_15px_rgba(255,59,48,0.3)] transition-all hover:translate-y-[-4px]">
                  <h3 className="text-xl font-bold mb-3 font-mono">
                    Comunidad
                  </h3>
                  <p className="text-white/90">
                    Creo en construir y aportar a comunidades de desarrolladores
                    que crecen juntos.
                  </p>
                </Card>
              </div>

              <p className="text-base sm:text-lg text-white/80 leading-relaxed mt-8 text-center bg-white/5 p-6 rounded-lg border border-white/10">
                En la era de la IA, mi enfoque es combinar las nuevas
                tecnologías con una sólida comprensión de los fundamentos. La IA
                es una herramienta poderosa, pero el criterio y la experiencia
                humana siguen siendo insustituibles.
              </p>
            </div>
          </div>
        </section>

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

        {/* Lado personal */}
        <section className="w-full py-16 sm:py-24">
          <div className="container flex-1 flex flex-col px-4 md:px-6">
            <div className="max-w-[700px] mx-auto space-y-8">
              <h2 className="font-mono text-2xl sm:text-3xl font-bold tracking-tighter">
                Más allá del código
              </h2>

              <p className="text-base sm:text-lg text-white/80 font-light leading-relaxed">
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
                  <p className="text-white/70 font-light mt-1">
                    Siempre estoy leyendo algo nuevo, desde filosofía hasta
                    ciencia ficción especulativa.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold">🏃‍♂️ Deporte y bienestar</h3>
                  <p className="text-white/70 font-light mt-1">
                    El ejercicio físico es fundamental para mantener la mente
                    clara. Disfruto especialmente del running y el entrenamiento
                    funcional.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold">✈️ Viajar y explorar</h3>
                  <p className="text-white/70 font-light mt-1">
                    Conocer nuevas culturas y lugares me inspira y amplia mi
                    perspectiva sobre el mundo y los problemas que podemos
                    resolver con tecnología.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

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
