import type { Metadata } from "next"
import { Inter, DM_Serif_Display } from "next/font/google"
import "./globals.css"
import { Navbar } from "./components/Navbar"
import { ClickSound } from "./components/ClickSound"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
})

export const metadata: Metadata = {
  title: "Pray4Me — Pray, Connect, Lift, Together",
  description: "A calm place to worship, share struggles, ask for prayer, and find help with God.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmSerifDisplay.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col text-foreground">
        <ClickSound />
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  )
}
