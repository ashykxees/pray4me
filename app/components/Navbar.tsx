"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { SignInButton } from "./SignInButton"
import { SignOutButton } from "./SignOutButton"
import { Lock, Menu } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isHome = pathname === "/"

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/prayer", label: "Prayer" },
    { href: "/stories", label: "Stories" },
    { href: "/live", label: "Live" },
    { href: "/store", label: "Store" },
  ]

  const baseLink = isHome
    ? "rounded-full px-4 py-2 text-white/80 transition hover:bg-white/10 hover:text-white"
    : "rounded-full px-4 py-2 text-brand-brown transition hover:bg-brand-beige hover:text-brand-brown-dark"

  const signInClass =
    "inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 active:scale-[0.98]"
  const signOutClass =
    "inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 active:scale-[0.98]"

  return (
    <header
      className={`sticky top-0 z-50 border-b ${
        isHome
          ? "border-white/10 bg-[#0a0415]/60 backdrop-blur-md"
          : "border-brand-tan/30 bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          {isHome ? (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
              <Lock className="h-5 w-5" />
            </div>
          ) : (
            <Image src="/logo.png" alt="Pray4Me logo" width={44} height={44} className="rounded-full shadow-sm" />
          )}
          <span className={`font-heading text-2xl ${isHome ? "text-white" : "text-brand-brown-dark"}`}>
            Pray4Me
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          {session?.user ? (
            <>
              {links.map((l) => (
                <Link key={l.href} href={l.href} className={baseLink}>
                  {l.label}
                </Link>
              ))}
              <Link href="/profile" className={baseLink}>
                Profile
              </Link>
              <SignOutButton className={isHome ? signOutClass : undefined} />
            </>
          ) : (
            <SignInButton className={isHome ? signInClass : undefined} />
          )}
        </nav>

        {/* Mobile nav toggle rendered as a simple link list for now */}
        <div className="flex items-center gap-2 md:hidden">
          {session?.user ? <SignOutButton className={isHome ? signOutClass : undefined} /> : <SignInButton className={isHome ? signInClass : undefined} />}
          <button
            aria-label="Menu"
            className={`rounded-full p-2 ${isHome ? "text-white hover:bg-white/10" : "text-brand-brown hover:bg-brand-beige"}`}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  )
}
