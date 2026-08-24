"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { SignOutButton } from "./SignOutButton"
import { Lock, Menu } from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/prayer", label: "Prayer" },
    { href: "/stories", label: "Stories" },
    { href: "/live", label: "Live" },
    { href: "/store", label: "Store" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-brand-warm-beige/30 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Pray4Me logo" width={44} height={44} className="rounded-full shadow-sm" />
          <span className="font-heading text-2xl text-brand-deep-brown">Pray4Me</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
          {session?.user ? (
            <>
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-full px-4 py-2 text-brand-deep-brown transition hover:bg-brand-warm-beige/40 hover:text-brand-deep-brown"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/profile"
                className="rounded-full px-4 py-2 text-brand-deep-brown transition hover:bg-brand-warm-beige/40 hover:text-brand-deep-brown"
              >
                Profile
              </Link>
              <SignOutButton />
            </>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-warm-tan/40 bg-brand-cream/60 px-3 py-1.5 text-xs font-semibold text-brand-deep-brown">
              <Lock className="h-3.5 w-3.5" />
              Locked
            </div>
          )}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          {session?.user ? <SignOutButton /> : (
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-warm-tan/40 bg-brand-cream/60 px-3 py-1.5 text-xs font-semibold text-brand-deep-brown">
              <Lock className="h-3.5 w-3.5" />
              Locked
            </div>
          )}
          <button
            aria-label="Menu"
            className="rounded-full p-2 text-brand-deep-brown hover:bg-brand-warm-beige/40"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  )
}
