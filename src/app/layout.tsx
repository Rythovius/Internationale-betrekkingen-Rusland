import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rusland op het wereldtoneel',
  description: 'Een interactieve leeromgeving over Ruslands buitenlandbeleid vanuit verschillende theoretische perspectieven',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className="bg-gray-100 min-h-screen" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}