import { MetadataRoute } from "next";

// Nota: /calculadora se ha archivado y ya no forma parte de la navegación pública.
// Si se restaura, actualizar esta regla según convenga.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/private/",
          "/admin/",
          "/api/", // bloquear endpoints internos
          "/_next/",
          "*.json",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "anthropic-ai",
        disallow: "/",
      },
      {
        userAgent: "Claude-Web",
        disallow: "/",
      },
    ],
    sitemap: "https://hectorlabra.dev/sitemap.xml",
    host: "https://hectorlabra.dev",
  };
}
