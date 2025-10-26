import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flow Atlas — The world\'s hidden systems, live.',
  description: 'A live, ambient globe visualizing global fragility across hazards, infrastructure, and connectivity in real time.',
  keywords: ['geospatial', 'visualization', 'real-time', 'fragility', 'infrastructure', 'hazards'],
  authors: [{ name: 'Flow Atlas' }],
  openGraph: {
    title: 'Flow Atlas',
    description: 'Watch Earth\'s flows in real time',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="flow-atlas-dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
