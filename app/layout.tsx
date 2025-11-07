import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { QueryProvider } from '@/lib/providers/query-provider'
import { Navbar } from '@/components/navbar'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Full Stack Boilerplate',
  description:
    'Production-ready Next.js boilerplate with authentication, database, and payments',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <QueryProvider>
            <Navbar />
            {children}
            <Toaster />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
