'use client';

import { useState } from 'react';
import { Twitter, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
  };

  const handleShare = (platform: 'twitter' | 'linkedin') => {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-white/70 font-medium mr-2">Compartir:</span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('twitter')}
        className="h-10 w-10 p-0 border border-white/20 hover:border-accent-green hover:bg-accent-green/10 transition-all duration-200"
        aria-label="Compartir en Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('linkedin')}
        className="h-10 w-10 p-0 border border-white/20 hover:border-accent-green hover:bg-accent-green/10 transition-all duration-200"
        aria-label="Compartir en LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopyLink}
        className="h-10 w-10 p-0 border border-white/20 hover:border-accent-green hover:bg-accent-green/10 transition-all duration-200"
        aria-label="Copiar enlace"
      >
        {copied ? (
          <Check className="h-4 w-4 text-accent-green" />
        ) : (
          <LinkIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
