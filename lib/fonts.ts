import { Inconsolata } from "next/font/google";

// Inconsolata - fuente monoespaciada optimizada para legibilidad
// Usada globalmente para títulos y párrafos (estilo TrustMRR)
export const inconsolata = Inconsolata({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inconsolata",
});
