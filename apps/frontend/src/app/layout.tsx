import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { QueryProvider } from '@/providers/QueryProvider'
import { ToastProvider } from '@/providers/ToastProvider'
import Footer from '@/components/layout/Footer'
import Analytics from '@/providers/AnalyticsProvider'

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

export const metadata: Metadata = {
  title: 'DecidrAI - Discover the Right AI Tools for You',
  description: 'The Google for AI Decisions - an intelligent, curated discovery platform that helps you choose the right AI tools quickly and confidently.',
  keywords: ['AI tools', 'AI discovery', 'AI recommendations', 'productivity', 'automation'],
  openGraph: {
    title: 'DecidrAI - Discover the Right AI Tools for You',
    description: 'Stop endless searching. Get personalized AI tool recommendations based on your unique needs.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${playfair.variable}`}>
          <ThemeProvider>
            <QueryProvider>
              <Analytics />
              <Header />
              {children}
              <Footer />
              <ToastProvider />
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}