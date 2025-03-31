import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'hectorlabra.dev',
  description: 'Created by Héctor Laba',
  generator: 'hectorlabra.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
