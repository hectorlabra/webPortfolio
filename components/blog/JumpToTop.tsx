'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function JumpToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility(); // Check initial position

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className={cn(
        'fixed bottom-6 left-6 h-12 w-12 rounded-full shadow-lg',
        'bg-accent-green text-[#0a0612] hover:bg-accent-green/90',
        'shadow-[0_0_20px_rgba(100,227,101,0.4)]',
        'transition-all duration-300 z-50',
        'hidden lg:flex', // Solo en desktop, mobile tiene el TOC button
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}
      aria-label="Volver arriba"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
