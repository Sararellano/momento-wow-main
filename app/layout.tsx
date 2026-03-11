import React from "react"
import type { Metadata, Viewport } from 'next'
import { Montserrat, Pacifico } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: '--font-montserrat',
})

const pacifico = Pacifico({ 
  weight: "400",
  subsets: ["latin"],
  variable: '--font-pacifico',
})

export const metadata: Metadata = {
  title: 'Momento Wow | Invitaciones Web Interactivas',
  description: 'Diseñamos experiencias web interactivas para eventos que no se olvidan. Juegos, música y emoción en un solo link. Bodas, Cumpleaños, Eventos de Empresa.',
  generator: 'v0.app',
  keywords: ['invitaciones digitales', 'invitaciones web', 'bodas', 'cumpleaños', 'eventos', 'invitaciones interactivas'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#a855f7',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${pacifico.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  )
}
