import type { Metadata } from "next"
import { Montserrat, Playfair_Display, Caveat } from "next/font/google"
import "./globals.css"
import { auth } from "@/auth"
import { Navbar } from "./components/Navbar"
import { ClickSound } from "./components/ClickSound"
import { SessionProvider } from "./components/SessionProvider"

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const playfairDisplay = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const caveat = Caveat({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Pray4Me — Pray, Connect, Lift, Together",
  description: "A calm place to worship, share struggles, ask for prayer, and find help with God.",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${playfairDisplay.variable} ${caveat.variable} h-full antialiased`}
    >
      <SessionProvider session={session}>
        <body className="flex min-h-screen flex-col text-foreground">
          <ClickSound />
          <Navbar />
          <main className="flex-1">{children}</main>
        </body>
      </SessionProvider>
    </html>
  )
}
