import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import ServiceWorker from '@/components/ServiceWorker'
import PushPrompt from '@/components/PushPrompt'
import { ToastProvider } from '@/components/ui/Toast'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'Bloom — Coffee Community',
  description: 'Share your coffee moments',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Bloom',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0a0b10" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${playfair.variable} ${jakarta.variable} antialiased`}>
        <ToastProvider>
          <main className="pb-28 md:pb-0 md:pt-14 page-in" style={{ paddingBottom: 'calc(7rem + env(safe-area-inset-bottom))' }}>{children}</main>
          <Navbar />
        </ToastProvider>
        <ServiceWorker />
        <PushPrompt />
      </body>
    </html>
  )
}
