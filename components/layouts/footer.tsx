"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";
import { NewsletterForm } from "@/components/sections/home/newsletter-form";
import { Logo } from "@/components/shared/logo";

export function Footer() {
  return (
    <footer className="w-full py-12 sm:py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_2fr]">
          {/* Footer Brand */}
          <div className="mb-8 md:mb-0 pr-0 md:pr-4">
            <Logo size="default" />
            <p className="mt-4 sm:mt-6 text-sm text-white/70">
              Aprende a construir tu carrera como software developer. Dividirás
              tu carrera en bloques de construcción (como Lego) y sabrás cómo
              ensamblarlos para lograr el éxito.
            </p>
          </div>
          {/* Footer Links */}
          <div className="mb-8 md:mb-0">
            <h3 className="font-mono text-base font-bold">Enlaces</h3>
            <nav className="mt-4 sm:mt-6 flex flex-col gap-2 sm:gap-3">
              <Link href="/" className="text-sm text-white/70 hover:text-white">
                Home
              </Link>
              <Link
                href="/blog"
                className="text-sm text-white/70 hover:text-white"
              >
                Blog
              </Link>

              <Link
                href="/about"
                className="text-sm text-white/70 hover:text-white"
              >
                Sobre mí
              </Link>
            </nav>
          </div>
          {/* Legal Links */}
          <div className="mb-8 md:mb-0">
            <h3 className="font-mono text-base font-bold">Legal</h3>
            <nav className="mt-4 sm:mt-6 flex flex-col gap-2 sm:gap-3">
              <Link
                href="/privacy"
                className="text-sm text-white/70 hover:text-white"
              >
                Privacidad
              </Link>
              <Link
                href="/terms"
                className="text-sm text-white/70 hover:text-white"
              >
                Términos
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-white/70 hover:text-white"
              >
                Cookies
              </Link>
            </nav>
          </div>
          {/* Social and Newsletter */}
          <div className="pl-0 md:pl-4">
            <h3 className="font-mono text-base font-bold">Conecta</h3>
            <div className="mt-4 sm:mt-6 flex gap-3">
              <Link
                href="https://github.com"
                className="text-white/70 hover:text-white"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://twitter.com"
                className="text-white/70 hover:text-white"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://linkedin.com"
                className="text-white/70 hover:text-white"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
            <div className="mt-4 sm:mt-6">
              <p className="text-sm font-medium">Únete al Círculo de Builders</p>
              <div className="mt-3 w-full max-w-full sm:max-w-xs">
                <NewsletterForm minimal={true} compact={false} />
              </div>
            </div>
          </div>
        </div>
        {/* Copyright */}
        <div className="mt-8 sm:mt-12 border-t border-white/10 pt-6 sm:pt-8 text-center">
          <p className="text-xs text-white/70">
            © {new Date().getFullYear()} Hector Labra. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
