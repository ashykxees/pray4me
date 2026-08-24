import Link from "next/link"
import Image from "next/image"
import { auth } from "@/auth"
import { SignInButton } from "./SignInButton"
import { SignOutButton } from "./SignOutButton"

export async function Navbar() {
  const session = await auth()

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/prayer", label: "Prayer Requests" },
    { href: "/stories", label: "Your Stories" },
    { href: "/live", label: "Live Sermons" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-brand-brown text-brand-cream shadow-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Pray4Me logo" width={40} height={40} className="rounded-full" />
          <span className="text-xl font-semibold tracking-wide">Pray4Me</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium">
          {session?.user ? (
            <>
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-brand-sand hidden sm:inline">
                  {l.label}
                </Link>
              ))}
              <Link href="/profile" className="hover:text-brand-sand hidden sm:inline">
                Profile
              </Link>
              <SignOutButton />
            </>
          ) : (
            <SignInButton />
          )}
        </nav>
      </div>
    </header>
  )
}
