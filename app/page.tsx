import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check, Github, Twitter, Linkedin } from "lucide-react"

// UI Components imports
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NewsletterForm } from "@/components/newsletter-form"
import { FaqAccordion } from "@/components/faq-accordion"
import { LegoBlocks } from "@/components/lego-blocks"
import { GeometricPattern } from "@/components/geometric-pattern"
import { SocialProof } from "@/components/social-proof"
import { Logo } from "@/components/logo"

export default function HomePage() {
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
                Proyectos
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

        <main className="flex-1">
          {/* Hero Section - Mantener como referencia */}
          <section className="w-full min-h-[82vh] flex items-center pt-0 pb-0">
            <div className="container flex-1 flex flex-col justify-center px-4 md:px-6">
              {/* Social Proof Component */}
              <SocialProof />
              <div className="grid gap-10 lg:grid-cols-[60fr_40fr] lg:gap-16 mt-6">
                {/* Hero Content */}
                <div className="flex flex-col justify-center space-y-6">
                  <div className="space-y-4">
                    <h1 className="font-mono text-4xl font-bold tracking-tighter sm:text-4xl">
                    Aprende a codificar en semanas, no meses.
                    </h1>
                    <p className="text-lg text-white/70">
                    Todo lo que necesitas para construir tu carrera de software developer, incluso si eres un principiante absoluto.
                    </p>
                  </div>
                  {/* Highlight Banner */}
                  <div className="inline-flex w-fit rounded bg-[#64E365]/20 px-4 py-1.5 text-base text-[#64E365]">
                  Codifica tu idea rápidamente, construye tu libertad.
                  </div>
                  {/* Features List */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Check className="h-6 w-6 text-[#64E365]" />
                      <span className="text-base">Aprende solo los fundamentos</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-6 w-6 text-[#64E365]" />
                      <span className="text-base">Usa IA para que codifique por ti</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-6 w-6 text-[#64E365]" />
                      <span className="text-base">Sigue aprendiendo sobre la marcha</span>
                    </div>
                  </div>
                  
                </div>
                {/* Newsletter Signup */}
                <div className="flex items-center justify-center lg:justify-end">
                    <div className="rounded border border-white/10 bg-white/5 p-8 backdrop-blur w-full shadow-[0_0_10px_rgba(100,227,101,0.3)]">
                    <div className="space-y-4">
                      <h2 className="font-mono text-2xl font-bold">¡Únete con un click!</h2>
                      
                    </div>
                    <div className="mt-6">
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

          {/* Features Section - Igualada con Hero */}
          <section className="w-full py-48">
            <div className="container flex-1 flex flex-col px-4 md:px-6">
              <div className="flex flex-col items-start space-y-5">
                <div className="space-y-3">
                  <h2 className="font-mono text-3xl font-bold tracking-tighter">Enseñamos el enfoque completo.</h2>
                  <p className="text-lg text-white/70">Construye, automatiza y escala. Desde cero, paso a paso. ✨</p>
                </div>
              </div>
              <div className="py-12">
                {/* LegoBlocks Component */}
                <LegoBlocks />
              </div>
              <div className="flex justify-start">
                <div className="flex items-center justify-between w-full">
                  <Button className="bg-[#FFD100] text-[#0a0612] hover:bg-[#FFD100]/90 text-sm h-10 px-4 font-bold">
                    EMPIEZA AHORA
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  {/* Social Proof Component */}
                  <SocialProof />
                </div>
              </div>
            </div>
          </section>

          {/* Geometric Pattern Component */}
          <GeometricPattern />

          {/* Blog Section - Estructura igualada con Features */}
          <section className="w-full py-24">
            <div className="container flex-1 flex flex-col px-4 md:px-6">
              <div className="flex flex-col items-start space-y-5">
                <div className="space-y-3">
                  <h2 className="font-mono text-3xl font-bold tracking-tighter">Últimos artículos</h2>
                  <p className="text-lg text-white/70">
                    Ideas y reflexiones sobre desarrollo, ingeniería y negocios digitales.
                  </p>
                </div>
              </div>
              <div className="py-12"> {/* Contenedor con el mismo py-12 que Features */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden bg-white/5 border-white/10">
                      <div className="aspect-video w-full overflow-hidden">
                        <Image
                          src={`/placeholder.svg?height=200&width=400&text=Article+${i}`}
                          alt={`Article ${i}`}
                          width={400}
                          height={200}
                          className="object-cover transition-all hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <div className="inline-block rounded-full bg-white/10 px-3 py-1 text-sm">Categoría</div>
                        <h3 className="mt-4 font-mono text-lg font-bold">Título del artículo</h3>
                        <p className="mt-2 text-base text-white/70">
                          Una breve descripción del artículo y lo que los lectores pueden esperar aprender.
                        </p>
                        <div className="mt-5 flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-white/10">
                            <Image
                              src="/placeholder.svg?height=40&width=40"
                              alt="Avatar"
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          </div>
                          <div className="text-sm">
                            <p className="font-medium">Hector Labra</p>
                            <p className="text-sm text-white/70">28 Mar, 2025</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="flex items-center justify-between w-full">
                  <Button className="bg-[#FFD100] text-[#0a0612] hover:bg-[#FFD100]/90 text-sm h-10 px-4 font-bold">
                    EMPIEZA AHORA
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  {/* Social Proof Component */}
                  <SocialProof />
                </div>
              </div>
            </div>
          </section>

          {/* Geometric Pattern Component */}
          <GeometricPattern />

          {/* FAQ Section - Estructura igualada con Features */}
          <section className="w-full py-24">
            <div className="container flex-1 flex flex-col px-4 md:px-6">
              <div className="flex flex-col items-start space-y-5">
                <div className="space-y-3">
                  <h2 className="font-mono text-3xl font-bold tracking-tighter">Preguntas frecuentes.</h2>
                  <p className="text-lg text-white/70">
                    Piensa en nosotros como constructores de negocios web. ¡Hacemos que el proceso de crear y vender
                    webs sea divertido y colaborativo! 🌎
                  </p>
                </div>
              </div>
              <div className="py-12"> {/* Mismo espaciado que Features */}
                <FaqAccordion />
              </div>
              <div className="flex justify-start">
                <div className="flex items-center justify-between w-full">
                  <Button className="bg-[#FFD100] text-[#0a0612] hover:bg-[#FFD100]/90 text-sm h-10 px-4 font-bold">
                    EMPIEZA AHORA
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  {/* Social Proof Component */}
                  <SocialProof />
                </div>
              </div>
            </div>
          </section>

          {/* Geometric Pattern Component */}
          <GeometricPattern />
        </main>

        {/* Footer Section */}
        <footer className="w-full py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              {/* Footer Brand */}
              <div>
                <Logo />
                <p className="mt-4 text-base text-white/70">
                  Aprende a construir un negocio web, profesional y escalable. Dividirás tu negocio en bloques de
                  construcción (como Lego) y sabrás cómo ensamblarlos para lograr el éxito.
                </p>
              </div>
              {/* Footer Links */}
              <div>
                <h3 className="font-mono text-lg font-bold">Enlaces</h3>
                <nav className="mt-4 flex flex-col gap-3">
                  <Link href="/" className="text-base text-white/70 hover:text-white">
                    Home
                  </Link>
                  <Link href="/blog" className="text-base text-white/70 hover:text-white">
                    Blog
                  </Link>
                  <Link href="/projects" className="text-base text-white/70 hover:text-white">
                    Proyectos
                  </Link>
                  <Link href="/about" className="text-base text-white/70 hover:text-white">
                    Sobre mí
                  </Link>
                </nav>
              </div>
              {/* Legal Links */}
              <div>
                <h3 className="font-mono text-lg font-bold">Legal</h3>
                <nav className="mt-4 flex flex-col gap-3">
                  <Link href="/privacy" className="text-base text-white/70 hover:text-white">
                    Privacidad
                  </Link>
                  <Link href="/terms" className="text-base text-white/70 hover:text-white">
                    Términos
                  </Link>
                  <Link href="/cookies" className="text-base text-white/70 hover:text-white">
                    Cookies
                  </Link>
                </nav>
              </div>
              {/* Social and Newsletter */}
              <div>
                <h3 className="font-mono text-lg font-bold">Conecta</h3>
                <div className="mt-4 flex gap-4">
                  <Link href="https://github.com" className="text-white/70 hover:text-white">
                    <Github className="h-6 w-6" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                  <Link href="https://twitter.com" className="text-white/70 hover:text-white">
                    <Twitter className="h-6 w-6" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                  <Link href="https://linkedin.com" className="text-white/70 hover:text-white">
                    <Linkedin className="h-6 w-6" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                </div>
                <div className="mt-5">
                  <p className="text-base font-medium">Suscríbete al newsletter</p>
                  <div className="mt-3 w-full max-w-sm">
                    {/* Newsletter Form Component with minimal prop */}
                    <NewsletterForm minimal={true} />
                  </div>
                </div>
              </div>
            </div>
            {/* Copyright */}
            <div className="mt-10 border-t border-white/10 pt-10 text-center">
              <p className="text-base text-white/70">
                © {new Date().getFullYear()} Hector Labra. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
