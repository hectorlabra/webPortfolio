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
                Home
              </Link>
              <Link href="/blog" className="text-sm font-medium transition-colors hover:text-white/70">
                Blog
              </Link>
              <Link href="/projects" className="text-sm font-medium transition-colors hover:text-white/70">
                Projects
              </Link>
              <Link href="/about" className="text-sm font-medium transition-colors hover:text-white/70">
                About
              </Link>
            </nav>
            {/* Contact Button */}
            <Button
              size="sm"
              className="hidden md:flex bg-[#64E365] text-[#0a0612] hover:bg-[#64E365]/90 text-sm h-10 px-4"
            >
              Contact
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
          {/* Hero Section */}
          <section className="w-full min-h-[calc(100vh-4rem)] flex items-center pt-16 pb-16">
            <div className="container flex-1 flex flex-col justify-center px-4 md:px-6">
              {/* Social Proof Component */}
              <SocialProof />
              <div className="grid gap-10 lg:grid-cols-[60fr_40fr] lg:gap-16 mt-6">
                {/* Hero Content */}
                <div className="flex flex-col justify-center space-y-6">
                  <div className="space-y-4">
                    <h1 className="font-mono text-4xl font-bold tracking-tighter sm:text-4xl">
                      Construye soluciones digitales con enfoque en ingeniería.
                    </h1>
                    <p className="text-lg text-white/70">
                      Transformando ideas en productos digitales con un enfoque estructurado y modular.
                    </p>
                  </div>
                  {/* Highlight Banner */}
                  <div className="inline-flex w-fit rounded bg-[#64E365]/20 px-4 py-1.5 text-base text-[#64E365]">
                    Gana 500-5000 USD al mes con solo 2 horas diarias
                  </div>
                  {/* Features List */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Check className="h-6 w-6 text-[#64E365]" />
                      <span className="text-base">Desarrollo de aplicaciones web y móviles</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-6 w-6 text-[#64E365]" />
                      <span className="text-base">Arquitectura de sistemas escalables</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-6 w-6 text-[#64E365]" />
                      <span className="text-base">Consultoría en tecnología y negocios digitales</span>
                    </div>
                  </div>
                  {/* CTA Buttons */}
                  <div className="flex flex-col gap-3 min-[400px]:flex-row">
                    <Button className="bg-[#FFD24C] text-[#0a0612] hover:bg-[#FFD24C]/90 text-base h-12 px-6">
                      Empieza Ahora
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button className="bg-white/10 text-white hover:bg-white/20 text-base h-12 px-6 border-0">
                      Ver Proyectos
                    </Button>
                  </div>
                </div>
                {/* Newsletter Signup */}
                <div className="flex items-center justify-center lg:justify-end">
                  <div className="rounded border border-white/10 bg-white/5 p-8 backdrop-blur w-full">
                    <div className="space-y-4">
                      <h2 className="font-mono text-2xl font-bold">¡Únete con un click!</h2>
                      <p className="text-base text-white/70">
                        Recibe consejos prácticos sobre desarrollo y arquitectura de software.
                      </p>
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

          {/* Features Section */}
          <section className="w-full min-h-screen flex items-center py-16">
            <div className="container flex-1 flex flex-col justify-center px-4 md:px-6">
              <div className="flex flex-col items-start space-y-5 max-w-3xl mx-auto w-full">
                <div className="space-y-3">
                  <h2 className="font-mono text-3xl font-bold tracking-tighter">Enseñamos el enfoque completo.</h2>
                  <p className="text-lg text-white/70">Construye, automatiza y escala. Desde cero, paso a paso. ✨</p>
                </div>
              </div>
              <div className="py-12 max-w-3xl mx-auto w-full">
                {/* LegoBlocks Component */}
                <LegoBlocks />
              </div>
              <div className="flex justify-start max-w-3xl mx-auto w-full">
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

          {/* Blog Section */}
          <section className="w-full min-h-screen flex items-center py-16">
            <div className="container flex-1 flex flex-col justify-center px-4 md:px-6">
              <div className="flex flex-col items-start space-y-5">
                <div className="space-y-3">
                  <h2 className="font-mono text-3xl font-bold tracking-tighter">Últimos artículos</h2>
                  <p className="text-lg text-white/70">
                    Ideas y reflexiones sobre desarrollo, ingeniería y negocios digitales.
                  </p>
                </div>
              </div>
              {/* Blog Cards Grid */}
              <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
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
              <div className="flex items-center justify-between">
                <Button className="bg-[#FFD100] text-[#0a0612] hover:bg-[#FFD100]/90 text-sm h-10 px-4 font-bold">
                  EMPIEZA AHORA
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                {/* Social Proof Component */}
                <SocialProof />
              </div>
            </div>
          </section>

          {/* Geometric Pattern Component */}
          <GeometricPattern />

          {/* FAQ Section */}
          <section className="w-full min-h-screen flex items-center py-16">
            <div className="container flex-1 flex flex-col justify-center px-4 md:px-6">
              <div className="flex flex-col items-start space-y-5">
                <div className="space-y-3">
                  <h2 className="font-mono text-3xl font-bold tracking-tighter">Preguntas frecuentes.</h2>
                  <p className="text-lg text-white/70">
                    Piensa en nosotros como constructores de negocios web. ¡Hacemos que el proceso de crear y vender
                    webs sea divertido y colaborativo! 🌎
                  </p>
                </div>
              </div>
              <div className="py-12">
                {/* FAQ Accordion Component */}
                <FaqAccordion />
              </div>
              <div className="flex items-center justify-between">
                <Button className="bg-[#FFD100] text-[#0a0612] hover:bg-[#FFD100]/90 text-sm h-10 px-4 font-bold">
                  EMPIEZA AHORA
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                {/* Social Proof Component */}
                <SocialProof />
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

