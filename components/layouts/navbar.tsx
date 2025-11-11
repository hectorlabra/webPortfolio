"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Header Section - Optimizado backdrop-blur */}
      <header
        id="site-header"
        className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0a0612]/95 backdrop-blur-sm supports-[backdrop-filter]:bg-[#0a0612]/60"
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
            >
              Trabaja Conmigo
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
              onClick={() => setMenuOpen(false)}
            >
              Trabaja Conmigo
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
