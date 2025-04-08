import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layouts/footer";
import { Navbar } from "@/components/layouts/navbar";
import { jetbrainsMono, inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "hectorlabra.dev",
  description: "Created by Héctor Laba",
  generator: "hectorlabra.dev",
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
      className={`${jetbrainsMono.variable} ${inter.variable}`}
    >
      <body className="font-sans font-light leading-relaxed">
        <div className="flex min-h-screen flex-col bg-[#0a0612] text-white">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
