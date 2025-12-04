import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer } from "@/components/layouts/footer";
import { Navbar } from "@/components/layouts/navbar";
import { inconsolata } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "hectorlabra.dev",
  description: "Created by Héctor Labra",
  generator: "hectorlabra.dev",
};

// Explicit viewport for consistent mobile scaling
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={inconsolata.variable}
    >
      <body className="font-sans font-normal leading-relaxed">
        <div className="flex min-h-screen flex-col bg-[#0a0612] text-white">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
