import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
import { CustomCursor } from '@/components/layout/CustomCursor'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700'],
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: {
    default: 'Excelium Consulting Compta — Formation en Comptabilité & Gestion',
    template: '%s | Excelium Consulting Compta',
  },
  description:
    'Plateforme e-learning professionnelle spécialisée en comptabilité, fiscalité, gestion et bureautique au Maroc. Formations certifiantes avec accompagnement personnalisé.',
  keywords: [
    'formation comptabilité Maroc',
    'e-learning fiscalité',
    'formation gestion entreprise',
    'cours Excel avancé',
    'formation bureautique',
    'Excelium Consulting',
    'comptabilité marocaine',
    'certification comptable',
  ],
  authors: [{ name: 'Excelium Consulting Compta' }],
  creator: 'Excelium Consulting Compta',
  publisher: 'Excelium Consulting Compta',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://excelium-lms.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'fr_MA',
    url: '/',
    siteName: 'Excelium Consulting Compta',
    title: 'Excelium Consulting Compta — Formation en Comptabilité & Gestion',
    description:
      'Plateforme e-learning professionnelle spécialisée en comptabilité, fiscalité, gestion et bureautique au Maroc.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Excelium Consulting Compta',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Excelium Consulting Compta',
    description: 'Formation en comptabilité, fiscalité et gestion au Maroc',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#FAF8F3',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="fr"
      dir="ltr"
      className={`${playfair.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[#FAF8F3] antialiased overflow-x-hidden">
        <SmoothScrollProvider>
          <CustomCursor />
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'white',
                color: '#1E293B',
                border: '1px solid #E7E2D6',
                borderRadius: '0.75rem',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '14px',
              },
            }}
          />
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
