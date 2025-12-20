import type { Metadata, Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { QueryProvider } from '@/providers/QueryProvider'
import { ToastProvider } from '@/providers/ToastProvider'
import { WebVitalsProvider } from '@/providers/WebVitalsProvider'
import ErrorBoundary from '@/components/ErrorBoundary'
import Footer from '@/components/layout/Footer'
import Analytics from '@/providers/AnalyticsProvider'
import OfflineIndicator from '@/components/ui/OfflineIndicator'
import { SITE_CONFIG, generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo.config'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

// Viewport configuration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

// Comprehensive metadata configuration
export const metadata: Metadata = {
  // Base URL for resolving relative URLs
  metadataBase: new URL(SITE_CONFIG.url),
  
  // Title configuration with template
  title: {
    default: `${SITE_CONFIG.name} - Discover the Right AI Tools for You`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  
  // Description (150-160 characters optimal)
  description: SITE_CONFIG.shortDescription,
  
  // Keywords
  keywords: SITE_CONFIG.keywords,
  
  // Author
  authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.author,
  
  // Favicon and icons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  
  // Manifest for PWA
  manifest: '/manifest.json',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} - Discover the Right AI Tools for You`,
    description: SITE_CONFIG.shortDescription,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - AI Tool Discovery Platform`,
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} - Discover the Right AI Tools for You`,
    description: SITE_CONFIG.shortDescription,
    creator: SITE_CONFIG.twitterHandle,
    images: ['/og-image.png'],
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification (add your verification codes here)
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  // },
  
  // Category
  category: 'technology',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Generate JSON-LD structured data
  const organizationSchema = generateOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema();

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(webSiteSchema),
            }}
          />
        </head>
        <body className={`${inter.variable} ${playfair.variable}`}>
          <ThemeProvider>
            <QueryProvider>
              <ErrorBoundary>
                <WebVitalsProvider>
                  <Analytics />
                  <Header />
                  {children}
                  <Footer />
                  <ToastProvider />
                  <OfflineIndicator />
                </WebVitalsProvider>
              </ErrorBoundary>
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}