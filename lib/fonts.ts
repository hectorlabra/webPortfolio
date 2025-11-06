import { JetBrains_Mono, Inter } from "next/font/google";

// Configuración de JetBrains Mono - optimizado para menor FOUT
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "optional", // Cambiado de 'swap' a 'optional' para evitar FOUT
  variable: "--font-jetbrains-mono",
});

// Inter como fuente principal - solo pesos necesarios
export const inter = Inter({
  subsets: ["latin"],
  display: "optional", // Cambiado de 'swap' a 'optional' para evitar FOUT
  weight: ["400", "500", "700"], // Reducido de 7 pesos a 3 (eliminados 100,200,300,600)
  variable: "--font-inter",
});
