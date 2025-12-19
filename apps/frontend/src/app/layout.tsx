import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { QueryProvider } from '@/providers/QueryProvider'
import { ToastProvider } from '@/providers/ToastProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <ThemeProvider>
            <QueryProvider>
              <Header />
              {children}
              <ToastProvider />
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}