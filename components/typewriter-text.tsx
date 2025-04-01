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
  const [typingSpeed, setTypingSpeed] = useState(70); // Velocidad inicial más rápida
  
  useEffect(() => {
    const handleTyping = () => {
      const current = displayText;
      
      if (!isDeleting && current === text) {
        // Pausa antes de empezar a borrar
        setTypingSpeed(2000); // Reducida de 3000 a 2000ms
        setIsDeleting(true);
        return;
      } else if (isDeleting && current === '') {
        // Pausa antes de empezar a escribir de nuevo
        setTypingSpeed(300); // Reducida de 500 a 300ms
        setIsDeleting(false);
        return;
      }
      
      // Velocidad de escritura/borrado más rápida
      setTypingSpeed(isDeleting ? 30 : 70); // Velocidades más rápidas
      
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