import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond } from "next/font/google"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-cormorant",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://sadyoshi.vercel.app"),
  title: "sadyoshi",
  description: "an experiment in nothing",
  openGraph: {
    title: "sadyoshi",
    description: "an experiment in nothing",
    siteName: "sadyoshi",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "sadyoshi",
    description: "an experiment in nothing",
  },
}

export const viewport: Viewport = {
  themeColor: "#030303",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cormorant.variable} suppressHydrationWarning>
      <body className="antialiased">
        {children}
        <div className="noise-overlay" />
      </body>
    </html>
  )
}
