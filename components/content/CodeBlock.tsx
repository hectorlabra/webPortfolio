"use client";

import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

// Simple code block without external syntax highlighting
// Can be upgraded to use prism-react-renderer later
export function CodeBlock({
  code,
  language = "text",
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const lines = code.split("\n");

  return (
    <div className={cn("my-8 rounded-lg overflow-hidden", className)}>
      {/* Language badge */}
      {language !== "text" && (
        <div className="bg-white/10 px-4 py-2 text-xs text-white/60 font-mono uppercase tracking-wider">
          {language}
        </div>
      )}

      {/* Code content */}
      <pre className="bg-[#1a1a2e] p-4 overflow-x-auto">
        <code className="text-sm font-mono text-[#e2e2e2] leading-relaxed">
          {showLineNumbers
            ? lines.map((line, i) => (
                <div key={i} className="table-row">
                  <span className="table-cell pr-4 text-white/30 select-none text-right w-8">
                    {i + 1}
                  </span>
                  <span className="table-cell">{line}</span>
                </div>
              ))
            : code}
        </code>
      </pre>
    </div>
  );
}

// Inline code for use within paragraphs
interface InlineCodeProps {
  children: string;
  className?: string;
}

export function InlineCode({ children, className }: InlineCodeProps) {
  return (
    <code
      className={cn(
        "bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-[#64E365]",
        className
      )}
    >
      {children}
    </code>
  );
}
