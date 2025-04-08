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
        // Colores personalizados centralizados
        'dark': '#0a0612',
        'dark-lighter': '#130c24',
        'accent-green': '#64E365',
        'accent-yellow': '#FFD100',
        // Variantes con transparencias
        'white': {
          DEFAULT: '#ffffff',
          5: 'rgba(255, 255, 255, 0.05)',
          10: 'rgba(255, 255, 255, 0.10)', 
          15: 'rgba(255, 255, 255, 0.15)',
          20: 'rgba(255, 255, 255, 0.20)',
          70: 'rgba(255, 255, 255, 0.70)',
          80: 'rgba(255, 255, 255, 0.80)',
          90: 'rgba(255, 255, 255, 0.90)',
        },
        'green': {
          light: 'rgba(140, 255, 140, 0.20)',
          DEFAULT: '#64E365',
          20: 'rgba(100, 227, 101, 0.20)',
          30: 'rgba(100, 227, 101, 0.30)',
          40: 'rgba(100, 227, 101, 0.40)',
        },
        'yellow': {
          light: 'rgba(255, 210, 0, 0.3)',
          DEFAULT: '#FFD100',
          30: 'rgba(255, 210, 0, 0.3)',
          50: 'rgba(255, 210, 0, 0.5)',
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'green-glow': '0 0 10px rgba(100,227,101,0.25), 0 0 15px rgba(100,227,101,0.15)',
        'green-glow-strong': '0 0 14px rgba(100,227,101,0.5)',
        'yellow-glow': '0 0 10px rgba(255,210,0,0.5), 0 0 15px rgba(255,210,0,0.3)',
        'white-subtle': '0 0 8px rgba(255,255,255,0.1)',
        'card': 'rgba(140, 68, 255, 0.05) 0px 10px 20px',
      },
      spacing: {
        'hero-height': '55vh',
        'hero-height-sm': '70vh',
        'hero-height-lg': '80vh',
        'content-max': '700px',
      },
      maxWidth: {
        'container': '1000px',
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

