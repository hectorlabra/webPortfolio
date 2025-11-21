"use client";

import React, { useState, useEffect, useMemo } from "react";

interface TypewriterTextProps {
  // accept a single string or multiple variations
  text: string | string[];
  className?: string;
  prefix?: string; // optional prefix rendered before the typed text
  typingSpeed?: number; // ms per char when typing
  deletingSpeed?: number; // ms per char when deleting
  pauseBeforeDelete?: number; // ms pause after completing a phrase
  pauseBetween?: number; // ms pause after fully deleted before next variant
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  className,
  prefix = "",
  typingSpeed = 70,
  deletingSpeed = 30,
  pauseBeforeDelete = 2000,
  pauseBetween = 300,
}) => {
  const variants = useMemo(
    () => (Array.isArray(text) ? text : [text]),
    [typeof text === "string" ? text : JSON.stringify(text)]
  );

  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // reset state when the provided text(s) change
  useEffect(() => {
    setIndex(0);
    setDisplayText("");
    setIsDeleting(false);
  }, [typeof text === "string" ? text : JSON.stringify(text)]);

  useEffect(() => {
    const fullText = variants[index] || "";
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText === fullText) {
      timeout = setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
    } else if (isDeleting && displayText === "") {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setIndex((i) => (i + 1) % variants.length);
      }, pauseBetween);
    } else {
      const delta = isDeleting ? deletingSpeed : typingSpeed;
      timeout = setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting ? prev.slice(0, -1) : fullText.slice(0, prev.length + 1)
        );
      }, delta);
    }

    return () => clearTimeout(timeout);
  }, [
    displayText,
    isDeleting,
    index,
    variants,
    typingSpeed,
    deletingSpeed,
    pauseBeforeDelete,
    pauseBetween,
  ]);

  return (
    <span className={`typewriter-container ${className || ""}`}>
      {prefix}
      {displayText}
      <span className="typewriter-cursor"></span>
    </span>
  );
};
