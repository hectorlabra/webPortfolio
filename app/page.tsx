"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check, Github, Twitter, Linkedin } from "lucide-react"
import { useState } from "react"

// UI Components imports
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { NewsletterForm } from "@/components/newsletter-form"
import { FaqAccordion } from "@/components/faq-accordion"
import { LegoBlocks } from "@/components/lego-blocks"
import { GeometricPattern } from "@/components/geometric-pattern"
import { SocialProof } from "@/components/social-proof"
import { Logo } from "@/components/logo"
import { TypewriterText } from "@/components/typewriter-text" // Nueva importación

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0612] text-white">
      <div className="mx-auto w-full max-w-[1000px]">
        {/* Header Section */}
        <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0a0612]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0612]/60">
          <div className="container flex h-16 items-center justify-between">
            {/* Logo Component */}
            <Logo />
            {/* Navigation Component */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium transition-colors hover:text-white/70">
                Inicio
              </Link>
              <Link href="/quien-soy" className="text-sm font-medium transition-colors hover:text-white/70">
                Quien Soy
              </Link>
              <Link href="/proyectos" className="text-sm font-medium transition-colors hover:text-white/70">
                Blog
              </Link>
            </nav>
            {/* Contact Button */}
            <Button
              size="sm"
              className="hidden md:flex bg-[#64E365] text-[#0a0612] hover:bg-[#64E365]/90 text-sm h-10 px-4"
            >
              Trabaja Conmigo
            </Button>
            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden border-white text-white hover:bg-white/10 h-10 w-10"
              onClick={() => setMenuOpen(true)}
            >
              <span className="sr-only">Toggle menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </header>
        
        {/* Mobile Menu Sheet */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetContent className="bg-[#0a0612] border-white/10">
            <div className="flex flex-col gap-6 py-6">
              <Link href="/" className="text-lg font-medium" onClick={() => setMenuOpen(false)}>Inicio</Link>
              <Link href="/quien-soy" className="text-lg font-medium" onClick={() => setMenuOpen(false)}>Quien Soy</Link>
              <Link href="/proyectos" className="text-lg font-medium" onClick={() => setMenuOpen(false)}>Blog</Link>
              <Button 
                className="bg-[#64E365] text-[#0a0612] hover:bg-[#64E365]/90 w-full mt-4"
                onClick={() => setMenuOpen(false)}
              >
                Trabaja Conmigo
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <main className="flex-1">
          {/* Hero Section - Mantener como referencia */}
          <section className="w-full min-h-[55vh] sm:min-h-[70vh] lg:min-h-[80vh] flex items-center pt-0 pb-0">
            <div className="container flex-1 flex flex-col justify-center px-4 md:px-6">
              {/* Social Proof Component */}
              <SocialProof />
              <div className="grid gap-6 sm:gap-8 lg:grid-cols-[60fr_40fr] lg:gap-16 mt-6 lg:mt-6">
                {/* Hero Content */}
                <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
                  <div className="space-y-3 sm:space-y-4">
                    <h1 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter">
                      Aprende a <TypewriterText text="codificar en semanas, no meses." />
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-white/70">
                    Todo lo que necesitas para construir tu carrera de software developer, incluso si eres un principiante absoluto.
                    </p>
                  </div>
                  {/* Highlight Banner */}
                  <div className="inline-flex w-fit rounded bg-[#64E365]/20 px-3 sm:px-4 py-1.5 text-sm sm:text-base text-[#64E365]">
                  Codifica tu idea rápidamente, construye tu libertad.
                  </div>
                  {/* Features List */}
                  <div className="space-y-2 sm:space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Check className="h-5 w-5 sm:h-6 sm:w-6 text-[#64E365]" />
                      <span className="text-sm sm:text-base">Aprende solo los fundamentos</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Check className="h-5 w-5 sm:h-6 sm:w-6 text-[#64E365]" />
                      <span className="text-sm sm:text-base">Usa la IA para que codifique por ti</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Check className="h-5 w-5 sm:h-6 sm:w-6 text-[#64E365]" />
                      <span className="text-sm sm:text-base">Sigue aprendiendo sobre la marcha</span>
                    </div>
                  </div>
                  
                </div>
                {/* Newsletter Signup */}
                <div className="flex items-center justify-center lg:justify-end mt-6 lg:mt-0">
                    <div className="rounded-lg border-2 border-white/20 bg-white/5 p-5 sm:p-6 md:p-8 backdrop-blur w-full animate-circular-glow shadow-sm shadow-white/5">
                    <div className="space-y-3 sm:space-y-4">
                      <h2 className="font-mono text-xl sm:text-2xl font-bold">¡Únete con un click!</h2>
                      
                    </div>
                    <div className="mt-4 sm:mt-6">
                      {/* Newsletter Form Component */}
                      <NewsletterForm />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Geometric Pattern Component */}
          <GeometricPattern />

          {/* Features Section - Con espaciado responsive */}
          <section className="w-full py-16 sm:py-24 md:py-36 lg:py-48">
            <div className="container flex-1 flex flex-col px-4 md:px-6">
              <div className="flex flex-col items-start space-y-5">
                <div className="space-y-3">
                  <h2 className="font-mono text-3xl font-bold tracking-tighter">Enseñamos el enfoque completo.</h2>
                  <p className="text-lg text-white/70">Construye, automatiza y escala. Desde cero, paso a paso. ✨</p>
                </div>
              </div>
              <div className="py-12">
                {/* LegoBlocks Component */}
                <LegoBlocks fullWidth={true} />
              </div>
              <div className="flex justify-start">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                    <Button className="w-full sm:w-auto bg-[#FFD100] text-[#0a0612] hover:bg-[#FFD100]/90 text-sm h-10 px-4 font-bold shadow-[0_0_10px_rgba(255,210,0,0.5),0_0_15px_rgba(255,210,0,0.3)]">
                      EMPIEZA AHORA
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  {/* Social Proof Component */}
                  <div className="self-center sm:self-auto">
                    <SocialProof />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Geometric Pattern Component */}
          <GeometricPattern />

          {/* Blog Section - Con espaciado responsive */}
          <section className="w-full py-16 sm:py-24 md:py-36 lg:py-52">
            <div className="container flex-1 flex flex-col px-4 md:px-6">
              <div className="flex flex-col items-start space-y-5">
                <div className="space-y-3">
                  <h2 className="font-mono text-3xl font-bold tracking-tighter">Últimos artículos</h2>
                  <p className="text-lg text-white/70">
                    Ideas y reflexiones sobre desarrollo, ingeniería y negocios digitales. 💻
                  </p>
                </div>
              </div>
              <div className="py-12"> {/* Contenedor con el mismo py-12 que Features */}
                <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden bg-white/5 border-white/10 transition-all hover:bg-white/10">
                      <div className="aspect-[4/3] w-full overflow-hidden bg-white/5">
                        <Image
                          src={`/placeholder.svg?height=200&width=400&text=Article+${i}`}
                          alt={`Article ${i}`}
                          width={400}
                          height={300}
                          className="object-cover transition-all hover:scale-105"
                        />
                      </div>
                      <div className="p-3 sm:p-4">
                        <div className="flex justify-between items-center">
                          <div className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs">Categoría</div>
                          <p className="text-xs text-white/70">28 Mar</p>
                        </div>
                        <h3 className="mt-2 font-mono text-lg font-bold line-clamp-1 text-balance-mobile">Título del artículo</h3>
                        <p className="mt-1 text-xs sm:text-sm text-white/70 line-clamp-2">
                          Una breve descripción del artículo y lo que los lectores pueden esperar aprender.
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-white/10">
                            <Image
                              src="/placeholder.svg?height=24&width=24"
                              alt="Avatar"
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          </div>
                          <p className="text-xs font-medium">Hector Labra</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                  <Button className="w-full sm:w-auto bg-[#FFD100] text-[#0a0612] hover:bg-[#FFD100]/90 text-sm h-10 px-4 font-bold shadow-[0_0_10px_rgba(255,210,0,0.5),0_0_15px_rgba(255,210,0,0.3)]">
                    EMPIEZA AHORA
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  {/* Social Proof Component */}
                  <div className="self-center sm:self-auto">
                    <SocialProof />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Geometric Pattern Component */}
          <GeometricPattern />

          {/* FAQ Section - Con espaciado responsive */}
          <section className="w-full py-16 sm:py-24 md:py-36 lg:py-48">
            <div className="container flex-1 flex flex-col px-4 md:px-6">
              <div className="flex flex-col items-start space-y-5">
                <div className="space-y-3">
                  <h2 className="font-mono text-3xl font-bold tracking-tighter">Preguntas frecuentes.</h2>
                  <p className="text-lg text-white/70">
                    Despeja tus dudas sobre carreras tech en tiempos de IA. 🚀
                  </p>
                </div>
              </div>
              <div className="py-12"> {/* Mismo espaciado que Features */}
                <FaqAccordion />
              </div>
              <div className="flex justify-start">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4">
                  <Button className="w-full sm:w-auto bg-[#FFD100] text-[#0a0612] hover:bg-[#FFD100]/90 text-sm h-10 px-4 font-bold shadow-[0_0_10px_rgba(255,210,0,0.5),0_0_15px_rgba(255,210,0,0.3)]">
                    EMPIEZA AHORA
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  {/* Social Proof Component */}
                  <div className="self-center sm:self-auto">
                    <SocialProof />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Geometric Pattern Component */}
          <GeometricPattern />
        </main>

        {/* Footer Section - Con espaciado responsive */}
        <footer className="w-full py-12 sm:py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_2fr]">
              {/* Footer Brand */}
              <div className="mb-8 md:mb-0 pr-0 md:pr-4">
                <Logo size="default" />
                <p className="mt-4 sm:mt-6 text-sm text-white/70">
                  Aprende a construir tu carrera como software developer. Dividirás tu carrera en bloques de
                  construcción (como Lego) y sabrás cómo ensamblarlos para lograr el éxito.
                </p>
              </div>
              {/* Footer Links */}
              <div className="mb-8 md:mb-0">
                <h3 className="font-mono text-base font-bold">Enlaces</h3>
                <nav className="mt-4 sm:mt-6 flex flex-col gap-2 sm:gap-3">
                  <Link href="/" className="text-sm text-white/70 hover:text-white">
                    Home
                  </Link>
                  <Link href="/blog" className="text-sm text-white/70 hover:text-white">
                    Blog
                  </Link>
                  <Link href="/projects" className="text-sm text-white/70 hover:text-white">
                    Proyectos
                  </Link>
                  <Link href="/about" className="text-sm text-white/70 hover:text-white">
                    Sobre mí
                  </Link>
                </nav>
              </div>
              {/* Legal Links */}
              <div className="mb-8 md:mb-0">
                <h3 className="font-mono text-base font-bold">Legal</h3>
                <nav className="mt-4 sm:mt-6 flex flex-col gap-2 sm:gap-3">
                  <Link href="/privacy" className="text-sm text-white/70 hover:text-white">
                    Privacidad
                  </Link>
                  <Link href="/terms" className="text-sm text-white/70 hover:text-white">
                    Términos
                  </Link>
                  <Link href="/cookies" className="text-sm text-white/70 hover:text-white">
                    Cookies
                  </Link>
                </nav>
              </div>
              {/* Social and Newsletter */}
              <div className="pl-0 md:pl-4">
                <h3 className="font-mono text-base font-bold">Conecta</h3>
                <div className="mt-4 sm:mt-6 flex gap-3">
                  <Link href="https://github.com" className="text-white/70 hover:text-white">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                  <Link href="https://twitter.com" className="text-white/70 hover:text-white">
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                  <Link href="https://linkedin.com" className="text-white/70 hover:text-white">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                </div>
                <div className="mt-4 sm:mt-6">
                  <p className="text-sm font-medium">Suscríbete al newsletter</p>
                  <div className="mt-3 w-full max-w-full sm:max-w-xs">
                    {/* Newsletter Form Component with minimal prop */}
                    <NewsletterForm minimal={true} compact={false} />
                  </div>
                </div>
              </div>
            </div>
            {/* Copyright */}
            <div className="mt-8 sm:mt-12 border-t border-white/10 pt-6 sm:pt-8 text-center">
              <p className="text-xs text-white/70">
                © {new Date().getFullYear()} Hector Labra. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
