import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layouts/footer";
import { Navbar } from "@/components/layouts/navbar";

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
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <div className="flex min-h-screen flex-col bg-[#0a0612] text-white">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
