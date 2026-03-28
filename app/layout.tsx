import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Sad Yoshi Labs | Pioneering Melancholic Research",
  description: "We are Sad Yoshi Labs. A mythical research organization dedicated to understanding the profound depths of digital melancholy and existential contemplation.",
  keywords: ["Sad Yoshi", "AI Research", "Mythical", "Melancholy", "Digital Philosophy"],
  openGraph: {
    title: "Sad Yoshi Labs",
    description: "Pioneering research in digital melancholy",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
