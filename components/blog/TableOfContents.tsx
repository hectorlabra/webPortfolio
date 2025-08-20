'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TableOfContentsItem } from '@/lib/types/blog';

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
      }
    );

    // Observar todos los headings
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  if (items.length === 0) {
    return null;
  }

  const renderItems = (items: TableOfContentsItem[], level = 0) => {
    return items.map((item) => (
      <li key={item.id} className={cn('', level > 0 && 'ml-4')}>
        <button
          onClick={() => handleClick(item.id)}
          className={cn(
            'block w-full text-left py-1 px-2 text-sm rounded transition-colors hover:bg-muted',
            'border-l-2 border-transparent hover:border-muted-foreground/30',
            activeId === item.id && 'bg-muted border-primary text-primary font-medium',
            level === 0 && 'font-medium',
            level > 0 && 'text-muted-foreground'
          )}
        >
          {item.text}
        </button>
        {item.children && item.children.length > 0 && (
          <ul className="mt-1">
            {renderItems(item.children, level + 1)}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <nav className="space-y-2">
      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
        Tabla de contenidos
      </h3>
      <ul className="space-y-1">
        {renderItems(items)}
      </ul>
    </nav>
  );
}
