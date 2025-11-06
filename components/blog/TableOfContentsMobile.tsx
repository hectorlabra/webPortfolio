'use client';

import { useState } from 'react';
import { List, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { TableOfContentsItem } from '@/lib/types/blog';
import { cn } from '@/lib/utils';

interface TableOfContentsMobileProps {
  items: TableOfContentsItem[];
}

export function TableOfContentsMobile({ items }: TableOfContentsMobileProps) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  if (items.length === 0) {
    return null;
  }

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setOpen(false); // Cerrar el sheet después de navegar
    }
  };

  const renderItems = (items: TableOfContentsItem[], level = 0) => {
    return items.map((item) => (
      <li key={item.id} className={cn('', level > 0 && 'ml-4')}>
        <button
          onClick={() => handleClick(item.id)}
          className={cn(
            'block w-full text-left py-2 px-3 text-sm rounded-lg transition-all',
            'border-l-2 border-transparent hover:border-accent-green hover:bg-white/5',
            activeId === item.id && 'bg-white/5 border-accent-green text-accent-green font-medium',
            level === 0 && 'font-medium text-white/90',
            level > 0 && 'text-white/70'
          )}
        >
          {item.text}
        </button>
        {item.children && item.children.length > 0 && (
          <ul className="mt-1 space-y-1">
            {renderItems(item.children, level + 1)}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg border-accent-green/40 bg-[#0a0612] hover:bg-accent-green/20 hover:border-accent-green z-50 lg:hidden"
          aria-label="Abrir tabla de contenidos"
        >
          <List className="h-6 w-6 text-accent-green" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[300px] sm:w-[400px] bg-[#0a0612] border-l border-white/10 text-white overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-bold font-mono text-accent-green">
            Tabla de Contenidos
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-6">
          <ul className="space-y-1">
            {renderItems(items)}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
