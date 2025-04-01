"use client";

import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  className
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  
  useEffect(() => {
    const handleTyping = () => {
      const current = displayText;
      
      if (!isDeleting && current === text) {
        // Pausa antes de empezar a borrar
        setTypingSpeed(3000); // Pausa de 3 segundos antes de borrar
        setIsDeleting(true);
        return;
      } else if (isDeleting && current === '') {
        // Pausa antes de empezar a escribir de nuevo
        setTypingSpeed(500);
        setIsDeleting(false);
        return;
      }
      
      // Velocidad de escritura/borrado
      setTypingSpeed(isDeleting ? 50 : 100);
      
      // Lógica para escribir o borrar
      const updatedText = isDeleting
        ? current.substring(0, current.length - 1)
        : text.substring(0, current.length + 1);
        
      setDisplayText(updatedText);
    };
    
    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, text, typingSpeed]);
  
  return (
    <span className={`typewriter-container ${className || ''}`}>
      {displayText}
      <span className="typewriter-cursor"></span>
    </span>
  );
};