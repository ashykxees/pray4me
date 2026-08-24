"use client"

import { signOut } from "next-auth/react"

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-full border border-brand-sand px-3 py-1.5 text-sm text-brand-cream hover:bg-brand-sand hover:text-brand-brown-dark"
    >
      Sign out
    </button>
  )
}
