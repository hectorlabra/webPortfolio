import { JetBrains_Mono, Inter } from 'next/font/google';

// Configuración de JetBrains Mono desde Google Fonts con optimización
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

// Inter como fuente principal para texto, optimizada para interfaces digitales
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'], // Varios pesos para flexibilidad
  variable: '--font-inter',
});

// Nota: Inter es una tipografía moderna diseñada específicamente para pantallas
// con excelente legibilidad y un estilo tech-friendly que complementa la identidad developer
