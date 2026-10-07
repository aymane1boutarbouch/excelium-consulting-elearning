import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from 'sonner'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF8F3' },
    { media: '(prefers-color-scheme: dark)', color: '#0A1F44' },
  ],
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
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
