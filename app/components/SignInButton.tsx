"use client"

import { signIn } from "next-auth/react"

export function SignInButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
      className="rounded-full bg-brand-sand px-4 py-2 text-sm font-semibold text-brand-brown-dark hover:bg-brand-tan"
    >
      Sign in with Google
    </button>
  )
}
