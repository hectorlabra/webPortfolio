import { Github, Linkedin, Twitter, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface AuthorCardProps {
  name: string;
  bio: string;
  avatar?: string;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export function AuthorCard({ name, bio, avatar, social }: AuthorCardProps) {
  return (
    <div className="bg-white/5 border border-white/15 rounded-lg p-6 hover:bg-white/[0.07] transition-all duration-200">
      <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
        Sobre el Autor
      </h3>
      
      <div className="flex items-start gap-4">
        {avatar && (
          <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-accent-green/30">
            <Image
              src={avatar}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-bold text-white mb-2">{name}</h4>
          <p className="text-sm text-white/70 leading-relaxed mb-4">
            {bio}
          </p>
          
          {social && (
            <div className="flex items-center gap-3">
              {social.github && (
                <Link
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-accent-green transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </Link>
              )}
              {social.linkedin && (
                <Link
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-accent-green transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </Link>
              )}
              {social.twitter && (
                <Link
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-accent-green transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
              )}
              {social.website && (
                <Link
                  href={social.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-accent-green transition-colors"
                  aria-label="Website"
                >
                  <Globe className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
