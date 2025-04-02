import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1100px", // Ajustado para mejor visualización en escritorio
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "subtle-glow": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(100,227,101,0.25)" },
          "50%": { boxShadow: "0 0 15px rgba(100,227,101,0.4)" },
        },
        "circular-glow": {
          "0%": { boxShadow: "0 8px 18px rgba(140,255,140,0.20), -8px 0 10px rgba(100,227,101,0.04), 0 -8px 10px rgba(100,227,101,0.04), 8px 0 10px rgba(100,227,101,0.04)" },
          "12.5%": { boxShadow: "5px 5px 18px rgba(140,255,140,0.20), -5px 5px 10px rgba(100,227,101,0.04), -5px -5px 10px rgba(100,227,101,0.04), 5px -5px 10px rgba(100,227,101,0.04)" },
          "25%": { boxShadow: "8px 0 18px rgba(140,255,140,0.20), 0 8px 10px rgba(100,227,101,0.04), -8px 0 10px rgba(100,227,101,0.04), 0 -8px 10px rgba(100,227,101,0.04)" },
          "37.5%": { boxShadow: "5px -5px 18px rgba(140,255,140,0.20), 5px 5px 10px rgba(100,227,101,0.04), -5px -5px 10px rgba(100,227,101,0.04), -5px 5px 10px rgba(100,227,101,0.04)" },
          "50%": { boxShadow: "0 -8px 18px rgba(140,255,140,0.20), 8px 0 10px rgba(100,227,101,0.04), 0 8px 10px rgba(100,227,101,0.04), -8px 0 10px rgba(100,227,101,0.04)" },
          "62.5%": { boxShadow: "-5px -5px 18px rgba(140,255,140,0.20), 5px -5px 10px rgba(100,227,101,0.04), 5px 5px 10px rgba(100,227,101,0.04), -5px 5px 10px rgba(100,227,101,0.04)" },
          "75%": { boxShadow: "-8px 0 18px rgba(140,255,140,0.20), 0 -8px 10px rgba(100,227,101,0.04), 8px 0 10px rgba(100,227,101,0.04), 0 8px 10px rgba(100,227,101,0.04)" },
          "87.5%": { boxShadow: "-5px 5px 18px rgba(140,255,140,0.20), -5px -5px 10px rgba(100,227,101,0.04), 5px 5px 10px rgba(100,227,101,0.04), 5px -5px 10px rgba(100,227,101,0.04)" },
          "100%": { boxShadow: "0 8px 18px rgba(140,255,140,0.20), -8px 0 10px rgba(100,227,101,0.04), 0 -8px 10px rgba(100,227,101,0.04), 8px 0 10px rgba(100,227,101,0.04)" }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "subtle-glow": "subtle-glow 4s ease-in-out infinite",
        "circular-glow": "circular-glow 3s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

