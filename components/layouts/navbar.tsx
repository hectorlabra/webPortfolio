"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollDirection, isAtTop } = useScrollDirection();

  // Hide on scroll down, show on scroll up (or at top)
  // Default to visible on initial load or if at top
  const isVisible = isAtTop || scrollDirection === "up";

  return (
    <>
      {/* Header Section - Optimizado backdrop-blur */}
      {/* 
        Changing from sticky to fixed to allow hide/show behavior.
        z-40 ensures it's above most content but below modals/progress bar (if z-50+).
      */}
      <header
        id="site-header"
        className={cn(
          "fixed top-0 left-0 right-0 z-40 w-full border-b transition-all duration-300 ease-in-out",
          // Base styles
          "bg-[#0a0612]/95 backdrop-blur-sm supports-[backdrop-filter]:bg-[#0a0612]/60",
          // Visibility toggle
          isVisible ? "translate-y-0" : "-translate-y-full",
          // Border visibility - nicer if border fades or is always there?
          // Keeping consistent with existing design
          "border-white/10"
        )}
      >
        <div className="mx-auto w-full max-w-[1000px]">
          <div className="container flex h-16 items-center justify-between">
            {/* Logo Component */}
            <Logo />
            {/* Navigation Component */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium transition-colors hover:text-white/70"
              >
                Inicio
              </Link>
              <Link
                href="/quien-soy"
                className="text-sm font-medium transition-colors hover:text-white/70"
              >
                Quien Soy
              </Link>
              <Link
                href="/blog"
                className="text-sm font-medium transition-colors hover:text-white/70"
              >
                Blog
              </Link>
            </nav>
            {/* Contact Button */}
            <Button
              size="sm"
              className="hidden md:flex bg-[#64E365] text-[#0a0612] hover:bg-[#64E365]/90 text-sm h-10 px-4"
              asChild
            >
              <Link href="/hoja-de-ruta">Ver Hoja de Ruta</Link>
            </Button>
            {/* Mobile Menu Button - Simplificado shadow */}
            <Button
              variant="default"
              size="icon"
              className="md:hidden bg-[#FFD100] text-[#0a0612] hover:bg-[#FFD100]/90 h-10 w-10 shadow-[0_0_15px_rgba(255,210,0,0.4)]"
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
        </div>
      </header>

      {/* 
        Spacer to prevent content from jumping when switching to fixed.
        Since existing layout expected 'sticky', content was in flow. 
        'Fixed' removes it from flow, so we need a placeholder if we want to preserve initial offset.
        However, usually smart menus overlay content.
        Let's add a placeholder div if we want to keep the "sticky" feel for initial layout
        OR rely on padding-top from calling pages. 
        Looking at layouts, usually it's nice to have content start after header.
      */}
      <div className="h-16 w-full" aria-hidden="true" />

      {/* Mobile Menu Sheet */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent className="bg-[#0a0612] border-white/10">
          <div className="flex flex-col gap-6 py-6">
            <Link
              href="/"
              className="text-lg font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/quien-soy"
              className="text-lg font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Quien Soy
            </Link>
            <Link
              href="/blog"
              className="text-lg font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Blog
            </Link>
            <Button
              className="bg-[#64E365] text-[#0a0612] hover:bg-[#64E365]/90 w-full mt-4"
              asChild
            >
              <Link href="/hoja-de-ruta" onClick={() => setMenuOpen(false)}>
                Ver Hoja de Ruta
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
